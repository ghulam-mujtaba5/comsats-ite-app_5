import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// GET /api/community/replies?post_id=<uuid>
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const postId = searchParams.get('post_id')
  if (!postId) {
    return NextResponse.json({ error: 'post_id is required' }, { status: 400 })
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

  const { data, error } = await supabase
    .from('community_replies')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

// POST /api/community/replies
// body: { post_id: uuid, content: string, author_name?: string, avatar_url?: string }
export async function POST(req: NextRequest) {
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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const schema = z.object({
    post_id: z.string().uuid(),
    content: z.string().min(1),
    author_name: z.string().optional(),
    avatar_url: z.string().url().optional(),
  })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
  }

  const payload = {
    post_id: parsed.data.post_id,
    content: parsed.data.content,
    author_name: parsed.data.author_name ?? null,
    avatar_url: parsed.data.avatar_url ?? null,
    // likes default 0, created_at default now
  }

  const { data, error } = await supabase
    .from('community_replies')
    .insert(payload)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Best-effort: recompute replies count and update community_posts.comments_count
  // Non-fatal if fails
  try {
    const { count } = await supabase
      .from('community_replies')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', parsed.data.post_id)

    if (typeof count === 'number') {
      await supabase
        .from('community_posts')
        .update({ comments_count: count })
        .eq('id', parsed.data.post_id)
    }
  } catch {}

  return NextResponse.json({ data }, { status: 201 })
}
