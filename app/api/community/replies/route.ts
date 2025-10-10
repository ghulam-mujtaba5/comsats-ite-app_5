import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// GET /api/community/replies?post_id=<uuid>
export async function GET(req: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }

  const { searchParams } = new URL(req.url)
  const postId = searchParams.get('post_id')
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10), 1), 100)
  const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0)
  const withMeta = (searchParams.get('meta') || '') === '1'
  if (!postId) {
    return NextResponse.json({ error: 'post_id is required' }, { status: 400, headers })
  }

  const cookieStore = await (cookies() as any)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  // Get replies (comments with parent_comment_id) for a post
  const { data, error } = await supabase
    .from('post_comments_enhanced')
    .select('*')
    .eq('post_id', postId)
    .not('parent_comment_id', 'is', null)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 400, headers })

  if (withMeta) {
    const pageLen = Array.isArray(data) ? data.length : 0
    return NextResponse.json({
      data,
      meta: {
        limit,
        offset,
        nextOffset: offset + pageLen,
        hasMore: pageLen === limit,
      },
    }, { headers })
  }

  return NextResponse.json({ data }, { headers })
}

// POST /api/community/replies
// body: { post_id: uuid, parent_id: uuid, content: string }
export async function POST(req: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }

  const cookieStore = await (cookies() as any)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
  }

  const schema = z.object({
    post_id: z.string().uuid(),
    parent_id: z.string().uuid(),
    content: z.string().min(1),
  })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400, headers })
  }

  const payload = {
    post_id: parsed.data.post_id,
    parent_comment_id: parsed.data.parent_id,
    user_id: auth.user.id,
    content: parsed.data.content,
    // likes_count default 0, replies_count default 0, created_at default now
  }

  const { data, error } = await supabase
    .from('post_comments_enhanced')
    .insert(payload)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400, headers })

  // Update replies count on parent comment
  const { count: repliesCount } = await supabase
    .from('post_comments_enhanced')
    .select('*', { count: 'exact', head: true })
    .eq('parent_comment_id', parsed.data.parent_id)

  try {
    if (typeof repliesCount === 'number') {
      await supabase
        .from('post_comments_enhanced')
        .update({ replies_count: repliesCount })
        .eq('id', parsed.data.parent_id)
    }
  } catch {}

  // Update comment count on post
  const { count: commentsCount } = await supabase
    .from('post_comments_enhanced')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', parsed.data.post_id)

  try {
    if (typeof commentsCount === 'number') {
      await supabase
        .from('community_posts_enhanced')
        .update({ comments_count: commentsCount })
        .eq('id', parsed.data.post_id)
    }
  } catch {}

  return NextResponse.json({ data }, { status: 201, headers })
}