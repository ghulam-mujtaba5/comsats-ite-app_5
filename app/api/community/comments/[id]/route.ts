import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60', // Cache for 2 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }

  const { id } = await context.params
  const cookieStore = await cookies()
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

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    const body = await request.json()
    const { content } = body

    // Verify ownership
    const { data: comment } = await supabase
      .from('post_comments_enhanced')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!comment || comment.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers })
    }

    const { data, error } = await supabase
      .from('post_comments_enhanced')
      .update({ content })
      .eq('id', id)
      .select(`
        *,
        user:user_id (
          id,
          email
        )
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400, headers })
    }

    return NextResponse.json(data, { headers })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60', // Cache for 2 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }

  const { id } = await context.params
  const cookieStore = await cookies()
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

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    // Verify ownership
    const { data: comment } = await supabase
      .from('post_comments_enhanced')
      .select('user_id, post_id')
      .eq('id', id)
      .single()

    if (!comment || comment.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers })
    }

    const { error } = await supabase
      .from('post_comments_enhanced')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400, headers })
    }

    // Update comment count
    const { count } = await supabase
      .from('post_comments_enhanced')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', comment.post_id)

    if (typeof count === 'number') {
      await supabase
        .from('community_posts')
        .update({ comments_count: count })
        .eq('id', comment.post_id)
    }

    return NextResponse.json({ message: 'Comment deleted' }, { headers })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}