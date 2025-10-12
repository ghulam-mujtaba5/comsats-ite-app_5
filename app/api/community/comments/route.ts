import { createSupabaseClient } from '@/lib/supabase-utils'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/community/comments
 * Fetches comments for a post
 */
export async function GET(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }

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

    return NextResponse.json(data, { headers })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

/**
 * POST /api/community/comments
 * Creates a new comment
 */
export async function POST(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }

  const supabase = await createSupabaseClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    const body = await request.json()
    const { post_id, parent_id, content } = body

    if (!post_id || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400, headers })
    }

    // Get user profile info
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('full_name, avatar_url')
      .eq('user_id', user.id)
      .single()

    const authorName = userProfile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous'
    const avatarUrl = userProfile?.avatar_url || user.user_metadata?.avatar_url || '/student-avatar.png'

    const { data, error } = await supabase
      .from('post_comments_enhanced')
      .insert({
        post_id,
        parent_id,
        user_id: user.id,
        author_name: authorName,
        avatar_url: avatarUrl,
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
      return NextResponse.json({ error: error.message }, { status: 400, headers })
    }

    // Update comment count on post
    await updateCommentCount(supabase, post_id)

    // Send notification to post author
    await sendCommentNotification(supabase, post_id, user.id, authorName, content, parent_id)

    return NextResponse.json(data, { status: 201, headers })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

// === Helper Functions ===

/**
 * Updates the comment count for a post
 */
async function updateCommentCount(supabase: any, postId: string): Promise<void> {
  try {
    const { count } = await supabase
      .from('post_comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)

    if (typeof count === 'number') {
      await supabase
        .from('community_posts')
        .update({ comments_count: count })
        .eq('id', postId)
    }
  } catch (error) {
    console.error('Error updating comment count:', error)
  }
}

/**
 * Sends notification when someone comments on a post or replies to a comment
 */
async function sendCommentNotification(
  supabase: any,
  postId: string,
  commenterId: string,
  commenterName: string,
  content: string,
  parentId?: string
): Promise<void> {
  try {
    if (parentId) {
      // This is a reply to a comment
      const { data: parentComment } = await supabase
        .from('post_comments_enhanced')
        .select('user_id, author_name')
        .eq('id', parentId)
        .single()

      if (parentComment && parentComment.user_id !== commenterId) {
        await supabase
          .from('notifications_enhanced')
          .insert({
            user_id: parentComment.user_id,
            actor_id: commenterId,
            type: 'reply',
            title: 'New Reply to Your Comment',
            message: `${commenterName} replied: "${content.substring(0, 100)}${content.length > 100 ? '...' : ''}"`,
            related_id: postId,
            related_type: 'post',
            metadata: { comment_id: parentId }
          })
      }
    } else {
      // This is a comment on a post
      const { data: post } = await supabase
        .from('community_posts')
        .select('user_id, author_name')
        .eq('id', postId)
        .single()

      if (post && post.user_id !== commenterId) {
        await supabase
          .from('notifications_enhanced')
          .insert({
            user_id: post.user_id,
            actor_id: commenterId,
            type: 'comment',
            title: 'New Comment on Your Post',
            message: `${commenterName} commented: "${content.substring(0, 100)}${content.length > 100 ? '...' : ''}"`,
            related_id: postId,
            related_type: 'post'
          })
      }
    }
  } catch (error) {
    console.error('Error sending comment notification:', error)
  }
}