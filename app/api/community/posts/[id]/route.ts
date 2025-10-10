import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function getClient() {
  return (async () => {
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
    return supabase
  })()
}

// GET /api/community/posts/[id] -> Post detail transformed for UI
export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const supabase = await getClient()

  try {
    const { data: post, error } = await supabase
      .from('community_posts_enhanced')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // determine if current user liked this post
    let liked = false
    try {
      const { data: auth } = await supabase.auth.getUser()
      const userId = auth?.user?.id
      if (userId) {
        const { data: likeRow } = await supabase
          .from('post_reactions')
          .select('post_id')
          .eq('post_id', id)
          .eq('user_id', userId)
          .eq('reaction_type', 'like')
          .maybeSingle()
        liked = !!likeRow
      }
    } catch {}

    const transformedPost = {
      id: post.id.toString(),
      author: post.author_name || 'Anonymous',
      avatar: post.avatar_url || '/student-avatar.png',
      department: post.department || '',
      semester: post.semester || '',
      time: post.created_at ? new Date(post.created_at).toLocaleString() : '',
      content: post.content || '',
      likes: Number(post.likes_count || 0),
      comments: Number(post.comments_count || 0),
      shares: Number(post.shares_count || 0),
      tags: Array.isArray(post.tags) ? post.tags : [],
      liked,
      type: post.type || 'general',
    }

    return NextResponse.json({ data: transformedPost })
  } catch (e) {
    console.error('Error fetching post by id:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}