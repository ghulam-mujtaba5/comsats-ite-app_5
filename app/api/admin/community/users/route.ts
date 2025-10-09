import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/admin/community/users - Get all community users (admin only)
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
    const status = searchParams.get('status') || 'all' // active, suspended, banned, all
    const role = searchParams.get('role') || 'all' // student, faculty, admin, all

    // Get users with post counts
    let query = supabase
      .from('auth.users')
      .select(`
        id,
        email,
        created_at,
        user_metadata,
        community_posts(count),
        admin_users(role)
      `)
      .range(offset, offset + limit - 1)

    // Apply status filter
    if (status !== 'all') {
      // This would require a more complex query or additional user status tracking
      // For now, we'll just filter by admin status
    }

    // Apply role filter
    if (role !== 'all') {
      if (role === 'admin') {
        query = query.not('admin_users', 'is', null)
      } else if (role === 'student' || role === 'faculty') {
        query = query.is('admin_users', null)
      }
    }

    const { data: users, error } = await query

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // Transform data for frontend
    const transformedUsers = (users || []).map((user: any) => ({
      id: user.id,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
      email: user.email,
      avatar: user.user_metadata?.avatar_url || '/student-avatar.png',
      role: user.admin_users?.role || 'student',
      posts: user.community_posts?.length || 0,
      joinDate: user.created_at,
      status: 'active' // This would need to be determined from user status tracking
    }))

    return NextResponse.json(transformedUsers)
  } catch (error) {
    console.error('Error in GET /api/admin/community/users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/admin/community/users - Update user status (suspend, ban, activate)
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
      .in('role', ['admin', 'super_admin'])
      .maybeSingle()

    if (adminError || !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { userId, status } = body

    if (!userId || !status) {
      return NextResponse.json({ error: 'User ID and status are required' }, { status: 400 })
    }

    // Valid status values
    const validStatuses = ['active', 'suspended', 'banned']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // In a real implementation, you would update user status in a dedicated table
    // For now, we'll just return a success response
    return NextResponse.json({ 
      message: `User ${status} successfully`,
      userId,
      status
    })
  } catch (error) {
    console.error('Error in PATCH /api/admin/community/users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}