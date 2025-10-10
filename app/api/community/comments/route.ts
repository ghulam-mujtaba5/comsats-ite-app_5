import { createSupabaseClient } from '@/lib/supabase-utils'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/community/comments
 * Fetches comments for a post
 */
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseClient()

  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('post_id')

    let query = supabase
      .from('post_comments_enhanced')
      .select(`
        *,
        user:user_id (
          id,
          email
        )
      `)
      .order('created_at', { ascending: true })

    if (postId) {
      query = query.eq('post_id', postId)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/community/comments
 * Creates a new comment
 */
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { post_id, parent_id, content } = body

    if (!post_id || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('post_comments_enhanced')
      .insert({
        post_id,
        parent_id,
        user_id: user.id,
        content
      })
      .select(`
        *,
        user:user_id (
          id,
          email
        )
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Update comment count on post
    await updateCommentCount(supabase, post_id)

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// === Helper Functions ===

/**
 * Updates the comment count for a post
 */
async function updateCommentCount(supabase: any, postId: string): Promise<void> {
  try {
    const { count } = await supabase
      .from('post_comments_enhanced')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)

    if (typeof count === 'number') {
      await supabase
        .from('community_posts_enhanced')
        .update({ comments_count: count })
        .eq('id', postId)
    }
  } catch (error) {
    console.error('Error updating comment count:', error)
  }
}