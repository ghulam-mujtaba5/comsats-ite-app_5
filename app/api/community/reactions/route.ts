import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/community/reactions - Add or remove a reaction
export async function POST(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60', // Cache for 2 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }

  const cookieStore = await (cookies() as any)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options?: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options?: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    const body = await request.json()
    const { postId, reactionType } = body

    if (!postId || !reactionType) {
      return NextResponse.json({ error: 'Post ID and reaction type are required' }, { status: 400, headers })
    }

    // Valid reaction types
    const validReactions = ['like', 'love', 'haha', 'wow', 'sad', 'angry']
    if (!validReactions.includes(reactionType)) {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400, headers })
    }

    // Check if user already reacted with this type
    const { data: existingReaction, error: checkError } = await supabase
      .from('community_post_reactions')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .eq('reaction_type', reactionType)
      .maybeSingle()

    if (checkError) {
      console.error('Error checking existing reaction:', checkError)
      return NextResponse.json({ error: 'Failed to check reaction' }, { status: 500, headers })
    }

    let updatedReactionCounts = {}

    if (existingReaction) {
      // Remove reaction
      const { error: deleteError } = await supabase
        .from('community_post_reactions')
        .delete()
        .eq('id', existingReaction.id)

      if (deleteError) {
        console.error('Error removing reaction:', deleteError)
        return NextResponse.json({ error: 'Failed to remove reaction' }, { status: 500, headers })
      }

      // Update reaction counts in community_posts
      const { data: post, error: postError } = await supabase
        .from('community_posts')
        .select('reaction_counts')
        .eq('id', postId)
        .single()

      if (postError) {
        console.error('Error fetching post:', postError)
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500, headers })
      }

      // Decrement the reaction count
      const currentCounts = post.reaction_counts || {}
      const currentCount = currentCounts[reactionType] || 0
      updatedReactionCounts = {
        ...currentCounts,
        [reactionType]: Math.max(0, currentCount - 1)
      }

      const { error: updateError } = await supabase
        .from('community_posts')
        .update({ reaction_counts: updatedReactionCounts })
        .eq('id', postId)

      if (updateError) {
        console.error('Error updating reaction counts:', updateError)
        return NextResponse.json({ error: 'Failed to update reaction counts' }, { status: 500, headers })
      }
    } else {
      // Add reaction
      const { error: insertError } = await supabase
        .from('community_post_reactions')
        .insert({
          post_id: postId,
          user_id: user.id,
          reaction_type: reactionType
        })

      if (insertError) {
        console.error('Error adding reaction:', insertError)
        return NextResponse.json({ error: 'Failed to add reaction' }, { status: 500, headers })
      }

      // Update reaction counts in community_posts
      const { data: post, error: postError } = await supabase
        .from('community_posts')
        .select('reaction_counts')
        .eq('id', postId)
        .single()

      if (postError) {
        console.error('Error fetching post:', postError)
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500, headers })
      }

      // Increment the reaction count
      const currentCounts = post.reaction_counts || {}
      const currentCount = currentCounts[reactionType] || 0
      updatedReactionCounts = {
        ...currentCounts,
        [reactionType]: currentCount + 1
      }

      const { error: updateError } = await supabase
        .from('community_posts')
        .update({ reaction_counts: updatedReactionCounts })
        .eq('id', postId)

      if (updateError) {
        console.error('Error updating reaction counts:', updateError)
        return NextResponse.json({ error: 'Failed to update reaction counts' }, { status: 500, headers })
      }
    }

    return NextResponse.json({ 
      message: existingReaction ? 'Reaction removed' : 'Reaction added',
      reactionCounts: updatedReactionCounts
    }, { headers })
  } catch (error) {
    console.error('Error in POST /api/community/reactions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

// GET /api/community/reactions?post_id=... - Get reactions for a post
export async function GET(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60', // Cache for 2 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }

  const cookieStore = await (cookies() as any)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options?: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options?: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('post_id')

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400, headers })
    }

    // Get all reactions for the post
    const { data: reactions, error } = await supabase
      .from('community_post_reactions')
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching reactions:', error)
      return NextResponse.json({ error: 'Failed to fetch reactions' }, { status: 500, headers })
    }

    // Transform data for frontend
    const transformedReactions = (reactions || []).map((reaction: any) => ({
      id: reaction.id,
      postId: reaction.post_id,
      userId: reaction.user_id,
      reactionType: reaction.reaction_type,
      createdAt: reaction.created_at,
      user: {
        id: reaction.user?.id,
        name: reaction.user?.email?.split('@')[0] || 'Anonymous',
        avatar: reaction.user?.user_metadata?.avatar_url || '/student-avatar.png'
      }
    }))

    return NextResponse.json(transformedReactions)
  } catch (error) {
    console.error('Error in GET /api/community/reactions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}