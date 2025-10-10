import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/community/shares - Share a post
export async function POST(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
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
    const { postId, sharedTo } = body

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400, headers })
    }

    // Valid share destinations
    const validDestinations = ['profile', 'group', 'event']
    if (sharedTo && !validDestinations.includes(sharedTo)) {
      return NextResponse.json({ error: 'Invalid share destination' }, { status: 400, headers })
    }

    // Record the share
    const { error: insertError } = await supabase
      .from('community_post_shares')
      .insert({
        post_id: postId,
        user_id: user.id,
        shared_to: sharedTo || 'profile'
      })

    if (insertError) {
      console.error('Error recording share:', insertError)
      return NextResponse.json({ error: 'Failed to record share' }, { status: 500, headers })
    }

    // Increment shares count in community_posts
    const { error: updateError } = await supabase
      .rpc('increment_shares_count', { post_id: postId })

    if (updateError) {
      console.error('Error updating shares count:', updateError)
      // Continue without error as this is not critical
    }

    return NextResponse.json({ 
      message: 'Post shared successfully'
    }, { headers })
  } catch (error) {
    console.error('Error in POST /api/community/shares:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

// GET /api/community/shares?post_id=... - Get shares for a post
export async function GET(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
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

    // Get all shares for the post
    const { data: shares, error } = await supabase
      .from('community_post_shares')
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching shares:', error)
      return NextResponse.json({ error: 'Failed to fetch shares' }, { status: 500, headers })
    }

    // Transform data for frontend
    const transformedShares = (shares || []).map((share: any) => ({
      id: share.id,
      postId: share.post_id,
      userId: share.user_id,
      sharedTo: share.shared_to,
      createdAt: share.created_at,
      user: {
        id: share.user?.id,
        name: share.user?.email?.split('@')[0] || 'Anonymous',
        avatar: share.user?.user_metadata?.avatar_url || '/student-avatar.png'
      }
    }))

    return NextResponse.json(transformedShares, { headers })
  } catch (error) {
    console.error('Error in GET /api/community/shares:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}