import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase-utils'

/**
 * GET /api/community/posts/[id]/like
 * Gets the like count and whether the current user has liked a post
 * Also gets all reactions for a post with counts if detailed query param is provided
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
  
  // Check if detailed reactions are requested
  const url = new URL(_req.url)
  const detailed = url.searchParams.get('detailed') === 'true'

  try {
    // Get current user
    const { data: auth } = await supabase.auth.getUser()
    const userId = auth.user?.id

    if (detailed) {
      // Get reaction counts by type
      const { data: reactions, error } = await supabase
        .from('post_reactions')
        .select('reaction_type')
        .eq('post_id', id)

      if (error) return NextResponse.json({ error: error.message }, { status: 400, headers })

      // Count reactions by type
      const reactionCounts: Record<string, number> = {}
      reactions.forEach(reaction => {
        reactionCounts[reaction.reaction_type] = (reactionCounts[reaction.reaction_type] || 0) + 1
      })

      // Get current user's reaction
      let currentUserReaction = null
      if (userId) {
        const { data: userReaction } = await supabase
          .from('post_reactions')
          .select('reaction_type')
          .eq('post_id', id)
          .eq('user_id', userId)
          .maybeSingle()
        
        currentUserReaction = userReaction?.reaction_type || null
      }

      return NextResponse.json({ 
        counts: reactionCounts,
        currentUserReaction
      }, { headers })
    } else {
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
    }
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

    // Get reaction type from request body (default to 'like')
    const body = await _req.json().catch(() => ({}))
    const reactionType = body.reaction_type || 'like'

    // Check if already reacted with this type
    const { data: existing, error: fetchErr } = await supabase
      .from('post_reactions')
      .select('id, reaction_type')
      .eq('post_id', id)
      .eq('user_id', userId)
      .maybeSingle()

    if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 400, headers })

    if (existing) {
      // If same reaction type, remove it (toggle off)
      if (existing.reaction_type === reactionType) {
        const { error: delErr } = await supabase
          .from('post_reactions')
          .delete()
          .eq('id', existing.id)
        if (delErr) return NextResponse.json({ error: delErr.message }, { status: 400, headers })
      } else {
        // Change reaction type
        const { error: updateErr } = await supabase
          .from('post_reactions')
          .update({ reaction_type: reactionType })
          .eq('id', existing.id)
        if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 400, headers })
      }
    } else {
      // Add new reaction
      const { error: insErr } = await supabase
        .from('post_reactions')
        .insert({ 
          post_id: id, 
          user_id: userId, 
          reaction_type: reactionType 
        })
      if (insErr) return NextResponse.json({ error: insErr.message }, { status: 400, headers })
      
      // Send notification to post author (don't notify if user likes their own post)
      await sendLikeNotification(supabase, id, userId, auth.user, reactionType)
    }

    // Recompute like count and update community_posts.likes
    const likeCount = await updateLikeCount(supabase, id)

    // Respond with new state
    const liked = !existing || existing.reaction_type !== reactionType
    return NextResponse.json({ 
      count: likeCount, 
      liked,
      reaction_type: reactionType
    }, { headers })
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
        .from('community_posts_enhanced')
        .update({ likes_count: count })
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
 * Sends a notification to the post author when someone reacts to their post
 */
async function sendLikeNotification(
  supabase: any, 
  postId: string, 
  likerId: string, 
  likerUser: any,
  reactionType: string
): Promise<void> {
  try {
    // Get post details
    const { data: post } = await supabase
      .from('community_posts_enhanced')
      .select('user_id, content')
      .eq('id', postId)
      .single()

    if (!post || post.user_id === likerId) {
      // Don't notify if post not found or user reacts to their own post
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
        type: 'reaction',
        title: 'New Reaction on Your Post',
        message: `${likerName} reacted with ${reactionType} to your post`,
        entity_type: 'post',
        entity_id: postId,
        metadata: { 
          post_preview: post.content.substring(0, 100),
          reaction_type: reactionType
        }
      })
  } catch (error) {
    console.error('Error sending reaction notification:', error)
    // Don't throw - notification failure shouldn't block the reaction action
  }
}