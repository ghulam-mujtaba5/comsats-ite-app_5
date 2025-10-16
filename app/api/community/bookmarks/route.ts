import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/community/bookmarks - Add or remove a bookmark
export async function POST(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30', // Cache for 1 minute, stale for 30 sec (optimized for free tier)
    'CDN-Cache-Control': 'public, s-maxage=60',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=60'
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
    const { postId } = body

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400, headers })
    }

    // Check if user already bookmarked this post
    const { data: existingBookmark, error: checkError } = await supabase
      .from('community_post_bookmarks')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (checkError) {
      console.error('Error checking existing bookmark:', checkError)
      return NextResponse.json({ error: 'Failed to check bookmark' }, { status: 500, headers })
    }

    let isBookmarked = false

    if (existingBookmark) {
      // Remove bookmark
      const { error: deleteError } = await supabase
        .from('community_post_bookmarks')
        .delete()
        .eq('id', existingBookmark.id)

      if (deleteError) {
        console.error('Error removing bookmark:', deleteError)
        return NextResponse.json({ error: 'Failed to remove bookmark' }, { status: 500, headers })
      }

      // Decrement bookmarks count in community_posts
      const { error: updateError } = await supabase
        .rpc('decrement_bookmarks_count', { post_id: postId })

      if (updateError) {
        console.error('Error updating bookmarks count:', updateError)
        // Continue without error as this is not critical
      }

      isBookmarked = false
    } else {
      // Add bookmark
      const { error: insertError } = await supabase
        .from('community_post_bookmarks')
        .insert({
          post_id: postId,
          user_id: user.id
        })

      if (insertError) {
        console.error('Error adding bookmark:', insertError)
        return NextResponse.json({ error: 'Failed to add bookmark' }, { status: 500, headers })
      }

      // Increment bookmarks count in community_posts
      const { error: updateError } = await supabase
        .rpc('increment_bookmarks_count', { post_id: postId })

      if (updateError) {
        console.error('Error updating bookmarks count:', updateError)
        // Continue without error as this is not critical
      }

      isBookmarked = true
    }

    return NextResponse.json({ 
      message: isBookmarked ? 'Post bookmarked' : 'Bookmark removed',
      isBookmarked
    }, { headers })
  } catch (error) {
    console.error('Error in POST /api/community/bookmarks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

// GET /api/community/bookmarks - Get user's bookmarks
export async function GET(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30', // Cache for 1 minute, stale for 30 sec (optimized for free tier)
    'CDN-Cache-Control': 'public, s-maxage=60',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=60'
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

    const { searchParams } = new URL(request.url)
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10), 1), 100)
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0)

    // Get user's bookmarks with post details
    const { data: bookmarks, error } = await supabase
      .from('community_post_bookmarks')
      .select(`
        *,
        post:post_id (
          id,
          content,
          type,
          tags,
          likes,
          comments_count,
          shares_count,
          created_at,
          user:user_id (
            id,
            email,
            user_metadata
          ),
          campuses(name, code),
          departments(name, code)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching bookmarks:', error)
      return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500, headers })
    }

    // Transform data for frontend
    const transformedBookmarks = (bookmarks || []).map((bookmark: any) => {
      const post = bookmark.post
      return {
        id: bookmark.id,
        postId: post.id,
        createdAt: bookmark.created_at,
        post: {
          id: post.id,
          author: post.user?.email?.split('@')[0] || 'Anonymous',
          avatar: post.user?.user_metadata?.avatar_url || '/student-avatar.png',
          department: post.department || (post.departments ? post.departments.name : ''),
          departmentCode: post.departments ? post.departments.code : '',
          campus: post.campuses ? post.campuses.name : '',
          campusCode: post.campuses ? post.campuses.code : '',
          semester: post.semester || '',
          batch: post.batch || '',
          time: new Date(post.created_at).toLocaleString(),
          content: post.content,
          likes: post.likes || 0,
          comments: post.comments_count || 0,
          shares: post.shares_count || 0,
          tags: Array.isArray(post.tags) ? post.tags : [],
          liked: false, // Will be updated when we get user likes
          type: post.type || 'general'
        }
      }
    })

    return NextResponse.json(transformedBookmarks)
  } catch (error) {
    console.error('Error in GET /api/community/bookmarks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}