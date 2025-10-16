import { createSupabaseClient } from '@/lib/supabase-utils'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/community/comments
 * Fetches comments for a post
 */
export async function GET(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60', // Cache for 2 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
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

    // Transform data to match frontend interface
    const transformedComments = data.map((comment: any) => ({
      id: comment.id,
      post_id: comment.post_id,
      parent_id: comment.parent_id,
      user_id: comment.user_id,
      author: comment.user?.email?.split('@')[0] || 'Anonymous',
      avatar: comment.avatar_url || '/student-avatar.png',
      content: comment.content,
      likes_count: comment.likes_count || 0,
      replies_count: comment.replies_count || 0,
      media: comment.media || [],
      mentions: comment.mentions || [],
      is_edited: comment.is_edited || false,
      edited_at: comment.edited_at || null,
      created_at: comment.created_at,
      updated_at: comment.updated_at || null,
      liked: false // This would be set based on user's reactions
    }))

    return NextResponse.json(transformedComments, { headers })
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
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60', // Cache for 2 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }

  const supabase = await createSupabaseClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    const body = await request.json()
    const { post_id, parent_id, content, media, mentions } = body

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
        content,
        media: media || [],
        mentions: mentions || []
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

    // Send notification to post author or parent comment author
    await sendCommentNotification(supabase, post_id, user.id, authorName, content, parent_id)

    // Transform data to match frontend interface
    const transformedComment = {
      id: data.id,
      post_id: data.post_id,
      parent_id: data.parent_id,
      user_id: data.user_id,
      author: data.user?.email?.split('@')[0] || 'Anonymous',
      avatar: data.avatar_url || '/student-avatar.png',
      content: data.content,
      likes_count: data.likes_count || 0,
      replies_count: data.replies_count || 0,
      media: data.media || [],
      mentions: data.mentions || [],
      is_edited: data.is_edited || false,
      edited_at: data.edited_at || null,
      created_at: data.created_at,
      updated_at: data.updated_at || null,
      liked: false
    }

    return NextResponse.json(transformedComment, { status: 201, headers })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

/**
 * PATCH /api/community/comments/[id]
 * Updates an existing comment
 */
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60',
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }

  const supabase = await createSupabaseClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    const body = await request.json()
    const { content, media, mentions } = body

    // Check if comment exists and user is the owner
    const { data: existingComment, error: fetchError } = await supabase
      .from('post_comments_enhanced')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404, headers })
    }

    if (existingComment.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers })
    }

    const { data, error } = await supabase
      .from('post_comments_enhanced')
      .update({
        content,
        media: media || [],
        mentions: mentions || [],
        is_edited: true,
        edited_at: new Date().toISOString()
      })
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

    // Transform data to match frontend interface
    const transformedComment = {
      id: data.id,
      post_id: data.post_id,
      parent_id: data.parent_id,
      user_id: data.user_id,
      author: data.user?.email?.split('@')[0] || 'Anonymous',
      avatar: data.avatar_url || '/student-avatar.png',
      content: data.content,
      likes_count: data.likes_count || 0,
      replies_count: data.replies_count || 0,
      media: data.media || [],
      mentions: data.mentions || [],
      is_edited: data.is_edited || false,
      edited_at: data.edited_at || null,
      created_at: data.created_at,
      updated_at: data.updated_at || null,
      liked: false
    }

    return NextResponse.json(transformedComment, { headers })
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

/**
 * DELETE /api/community/comments/[id]
 * Deletes a comment
 */
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60',
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }

  const supabase = await createSupabaseClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    // Check if comment exists and user is the owner
    const { data: existingComment, error: fetchError } = await supabase
      .from('post_comments_enhanced')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404, headers })
    }

    if (existingComment.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers })
    }

    const { error } = await supabase
      .from('post_comments_enhanced')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400, headers })
    }

    return NextResponse.json({ message: 'Comment deleted successfully' }, { headers })
  } catch (error) {
    console.error('Error deleting comment:', error)
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
            entity_type: 'comment',
            entity_id: parentId,
            metadata: { post_id: postId }
          })
      }
    } else {
      // This is a comment on a post
      const { data: post } = await supabase
        .from('community_posts_enhanced')
        .select('user_id, content')
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
            entity_type: 'post',
            entity_id: postId
          })
      }
    }
  } catch (error) {
    console.error('Error sending comment notification:', error)
  }
}