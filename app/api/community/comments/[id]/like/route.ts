import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase-utils'

/**
 * POST /api/community/comments/[id]/like
 * Toggles the like status for a comment
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
      .from('comment_reactions')
      .select('id, reaction_type')
      .eq('comment_id', id)
      .eq('user_id', userId)
      .maybeSingle()

    if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 400, headers })

    if (existing) {
      // If same reaction type, remove it (toggle off)
      if (existing.reaction_type === reactionType) {
        const { error: delErr } = await supabase
          .from('comment_reactions')
          .delete()
          .eq('id', existing.id)
        if (delErr) return NextResponse.json({ error: delErr.message }, { status: 400, headers })
      } else {
        // Change reaction type
        const { error: updateErr } = await supabase
          .from('comment_reactions')
          .update({ reaction_type: reactionType })
          .eq('id', existing.id)
        if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 400, headers })
      }
    } else {
      // Add new reaction
      const { error: insErr } = await supabase
        .from('comment_reactions')
        .insert({ 
          comment_id: id, 
          user_id: userId, 
          reaction_type: reactionType 
        })
      if (insErr) return NextResponse.json({ error: insErr.message }, { status: 400, headers })
    }

    // Recompute like count and update comment likes
    const likeCount = await updateLikeCount(supabase, id)

    // Respond with new state
    const liked = !existing || existing.reaction_type !== reactionType
    return NextResponse.json({ 
      likes: likeCount, 
      liked,
      reaction_type: reactionType
    }, { headers })
  } catch (error) {
    console.error('Error toggling comment like:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

/**
 * GET /api/community/comments/[id]/reactions
 * Gets all reactions for a comment with counts
 */
export async function GET_ALL_REACTIONS(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const supabase = await createSupabaseClient()

  try {
    // Get reaction counts by type
    const { data: reactions, error } = await supabase
      .from('comment_reactions')
      .select('reaction_type')
      .eq('comment_id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // Count reactions by type
    const reactionCounts: Record<string, number> = {}
    reactions.forEach(reaction => {
      reactionCounts[reaction.reaction_type] = (reactionCounts[reaction.reaction_type] || 0) + 1
    })

    // Get current user's reaction
    const { data: auth } = await supabase.auth.getUser()
    let currentUserReaction = null
    if (auth.user?.id) {
      const { data: userReaction } = await supabase
        .from('comment_reactions')
        .select('reaction_type')
        .eq('comment_id', id)
        .eq('user_id', auth.user.id)
        .maybeSingle()
      
      currentUserReaction = userReaction?.reaction_type || null
    }

    return NextResponse.json({ 
      counts: reactionCounts,
      currentUserReaction
    })
  } catch (error) {
    console.error('Error fetching comment reactions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// === Helper Functions ===

/**
 * Updates the like count for a comment and returns the new count
 */
async function updateLikeCount(supabase: any, commentId: string): Promise<number> {
  try {
    const { count } = await supabase
      .from('comment_reactions')
      .select('*', { count: 'exact', head: true })
      .eq('comment_id', commentId)
      .eq('reaction_type', 'like')

    // Update the comment's like count
    if (typeof count === 'number') {
      await supabase
        .from('post_comments_enhanced')
        .update({ likes_count: count })
        .eq('id', commentId)
      return count
    }
    
    return 0
  } catch (error) {
    console.error('Error updating comment like count:', error)
    return 0
  }
}