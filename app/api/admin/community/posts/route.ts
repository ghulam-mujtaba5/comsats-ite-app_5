import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/admin/community/posts - Get all community posts (admin only)
export async function GET(request: NextRequest) {
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
    // Check if user is authenticated and is an admin
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is an admin
    const { data: isAdmin, error: adminError } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'super_admin', 'moderator'])
      .maybeSingle()

    if (adminError || !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10), 1), 100)
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0)
    const status = searchParams.get('status') || 'all' // active, hidden, deleted, all
    const sortBy = searchParams.get('sort') || 'created_at'
    const sortOrder = searchParams.get('order') || 'desc'

    // Get posts with user and campus/department info
    let query = supabase
      .from('community_posts')
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        ),
        campuses(name, code),
        departments(name, code)
      `)
      .range(offset, offset + limit - 1)

    // Apply status filter
    if (status !== 'all') {
      if (status === 'active') {
        query = query.eq('status', 'active')
      } else if (status === 'hidden') {
        query = query.eq('status', 'hidden')
      } else if (status === 'deleted') {
        query = query.eq('status', 'deleted')
      }
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    const { data: posts, error } = await query

    if (error) {
      console.error('Error fetching posts:', error)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    // Transform data for frontend
    const transformedPosts = (posts || []).map((post: any) => ({
      id: post.id,
      content: post.content,
      author: {
        id: post.user?.id,
        name: post.user?.email?.split('@')[0] || 'Anonymous',
        avatar: post.user?.user_metadata?.avatar_url || '/student-avatar.png'
      },
      createdAt: post.created_at,
      likes: post.likes || 0,
      comments: post.comments_count || 0,
      visibility: post.visibility || 'public',
      status: post.status || 'active',
      campus: post.campuses ? post.campuses.name : '',
      department: post.departments ? post.departments.name : '',
      tags: Array.isArray(post.tags) ? post.tags : []
    }))

    return NextResponse.json(transformedPosts)
  } catch (error) {
    console.error('Error in GET /api/admin/community/posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/admin/community/posts - Update post status (hide, delete, restore)
export async function PATCH(request: NextRequest) {
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is an admin
    const { data: isAdmin, error: adminError } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'super_admin', 'moderator'])
      .maybeSingle()

    if (adminError || !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { postId, status } = body

    if (!postId || !status) {
      return NextResponse.json({ error: 'Post ID and status are required' }, { status: 400 })
    }

    // Valid status values
    const validStatuses = ['active', 'hidden', 'deleted']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update post status
    const { error } = await supabase
      .from('community_posts')
      .update({ status })
      .eq('id', postId)

    if (error) {
      console.error('Error updating post status:', error)
      return NextResponse.json({ error: 'Failed to update post status' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: `Post ${status} successfully`,
      postId,
      status
    })
  } catch (error) {
    console.error('Error in PATCH /api/admin/community/posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}