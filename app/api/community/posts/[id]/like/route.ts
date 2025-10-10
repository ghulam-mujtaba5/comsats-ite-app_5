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
    }

    // Recompute like count and update community_posts_enhanced.likes_count
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