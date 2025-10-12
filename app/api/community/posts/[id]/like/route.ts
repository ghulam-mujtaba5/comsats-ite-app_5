import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase-utils'

/**
 * GET /api/community/posts/[id]/like
 * Gets the like count and whether the current user has liked a post
 */
export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }

  const { id } = await context.params
  const supabase = await createSupabaseClient()

  try {
    // Get current user
    const { data: auth } = await supabase.auth.getUser()
    const userId = auth.user?.id

    // Get like count
    const { count, error: countErr } = await supabase
      .from('post_reactions')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', id)
      .eq('reaction_type', 'like')

    if (countErr) return NextResponse.json({ error: countErr.message }, { status: 400, headers })

    // Check if current user has liked the post
    let liked = false
    if (userId) {
      const { data: row } = await supabase
        .from('post_reactions')
        .select('post_id')
        .eq('post_id', id)
        .eq('user_id', userId)
        .eq('reaction_type', 'like')
        .maybeSingle()
      liked = !!row
    }

    return NextResponse.json({ count: count || 0, liked }, { headers })
  } catch (error) {
    console.error('Error fetching like status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

/**
 * POST /api/community/posts/[id]/like
 * Toggles the like status for a post
 */
export async function POST(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }

  const { id } = await context.params
  const supabase = await createSupabaseClient()

  try {
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    
    const userId = auth.user.id

    // Check if already liked
    const { data: existing, error: fetchErr } = await supabase
      .from('post_reactions')
      .select('post_id,user_id')
      .eq('post_id', id)
      .eq('user_id', userId)
      .eq('reaction_type', 'like')
      .maybeSingle()

    if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 400, headers })

    if (existing) {
      // Unlike
      const { error: delErr } = await supabase
        .from('post_reactions')
        .delete()
        .eq('post_id', id)
        .eq('user_id', userId)
        .eq('reaction_type', 'like')
      if (delErr) return NextResponse.json({ error: delErr.message }, { status: 400, headers })
    } else {
      // Like
      const { error: insErr } = await supabase
        .from('post_reactions')
        .insert({ post_id: id, user_id: userId, reaction_type: 'like' })
      if (insErr) return NextResponse.json({ error: insErr.message }, { status: 400, headers })
      
      // Send notification to post author (don't notify if user likes their own post)
      await sendLikeNotification(supabase, id, userId, auth.user)
    }

    // Recompute like count and update community_posts.likes
    const likeCount = await updateLikeCount(supabase, id)

    // Respond with new state
    const liked = !existing
    return NextResponse.json({ count: likeCount, liked }, { headers })
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

// === Helper Functions ===

/**
 * Updates the like count for a post and returns the new count
 */
async function updateLikeCount(supabase: any, postId: string): Promise<number> {
  try {
    const { count } = await supabase
      .from('post_reactions')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
      .eq('reaction_type', 'like')

    // Update the post's like count
    if (typeof count === 'number') {
      await supabase
        .from('community_posts')
        .update({ likes: count })
        .eq('id', postId)
      return count
    }
    
    return 0
  } catch (error) {
    console.error('Error updating like count:', error)
    return 0
  }
}

/**
 * Sends a notification to the post author when someone likes their post
 */
async function sendLikeNotification(supabase: any, postId: string, likerId: string, likerUser: any): Promise<void> {
  try {
    // Get post details
    const { data: post } = await supabase
      .from('community_posts')
      .select('user_id, content')
      .eq('id', postId)
      .single()

    if (!post || post.user_id === likerId) {
      // Don't notify if post not found or user likes their own post
      return
    }

    // Get liker's name
    const { data: likerProfile } = await supabase
      .from('user_profiles')
      .select('full_name')
      .eq('user_id', likerId)
      .single()

    const likerName = likerProfile?.full_name || likerUser.user_metadata?.full_name || likerUser.email?.split('@')[0] || 'Someone'

    // Create notification
    await supabase
      .from('notifications_enhanced')
      .insert({
        user_id: post.user_id,
        actor_id: likerId,
        type: 'like',
        title: 'New Like on Your Post',
        message: `${likerName} liked your post`,
        related_id: postId,
        related_type: 'post',
        metadata: { post_preview: post.content.substring(0, 100) }
      })
  } catch (error) {
    console.error('Error sending like notification:', error)
    // Don't throw - notification failure shouldn't block the like action
  }
}