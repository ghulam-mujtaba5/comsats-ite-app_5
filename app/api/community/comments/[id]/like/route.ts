import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
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

    // Check if already liked
    const { data: existing, error: fetchErr } = await supabase
      .from('comment_reactions')
      .select('comment_id,user_id')
      .eq('comment_id', id)
      .eq('user_id', user.id)
      .eq('reaction_type', 'like')
      .maybeSingle()

    if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 400, headers })

    if (existing) {
      // unlike
      const { error: delErr } = await supabase
        .from('comment_reactions')
        .delete()
        .eq('comment_id', id)
        .eq('user_id', user.id)
        .eq('reaction_type', 'like')
      if (delErr) return NextResponse.json({ error: delErr.message }, { status: 400, headers })
    } else {
      // like
      const { error: insErr } = await supabase
        .from('comment_reactions')
        .insert({ comment_id: id, user_id: user.id, reaction_type: 'like' })
      if (insErr) return NextResponse.json({ error: insErr.message }, { status: 400, headers })
    }

    // recompute like count and update post_comments_enhanced.likes_count best-effort
    const { count } = await supabase
      .from('comment_reactions')
      .select('*', { count: 'exact', head: true })
      .eq('comment_id', id)
      .eq('reaction_type', 'like')

    try {
      if (typeof count === 'number') {
        await supabase
          .from('post_comments_enhanced')
          .update({ likes_count: count })
          .eq('id', id)
      }
    } catch {}

    return NextResponse.json({ count: count || 0 }, { headers })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}