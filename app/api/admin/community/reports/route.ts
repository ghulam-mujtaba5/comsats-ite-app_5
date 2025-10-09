import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/admin/community/reports - Get all community reports (admin only)
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
    const status = searchParams.get('status') || 'all' // pending, reviewed, resolved, dismissed, all

    // Get reports with related content
    let query = supabase
      .from('community_reports')
      .select(`
        *,
        reporter:user_id (
          id,
          email,
          user_metadata
        ),
        post:post_id (
          id,
          content
        ),
        comment:comment_id (
          id,
          content
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply status filter
    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: reports, error } = await query

    if (error) {
      console.error('Error fetching reports:', error)
      return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
    }

    // Transform data for frontend
    const transformedReports = (reports || []).map((report: any) => {
      let content = ''
      let targetType = ''
      
      if (report.post_id && report.post) {
        content = report.post.content
        targetType = 'post'
      } else if (report.comment_id && report.comment) {
        content = report.comment.content
        targetType = 'comment'
      } else if (report.user_id) {
        content = `User: ${report.reported_user_email || 'Unknown'}`
        targetType = 'user'
      } else if (report.group_id) {
        content = `Group: ${report.group_name || 'Unknown'}`
        targetType = 'group'
      } else if (report.event_id) {
        content = `Event: ${report.event_name || 'Unknown'}`
        targetType = 'event'
      } else if (report.poll_id) {
        content = `Poll: ${report.poll_title || 'Unknown'}`
        targetType = 'poll'
      }

      return {
        id: report.id,
        type: targetType,
        content: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        reason: report.reason,
        reporter: {
          id: report.reporter?.id,
          name: report.reporter?.email?.split('@')[0] || 'Anonymous',
          avatar: report.reporter?.user_metadata?.avatar_url || '/student-avatar.png'
        },
        status: report.status,
        createdAt: report.created_at,
        targetId: report.post_id || report.comment_id || report.user_id || report.group_id || report.event_id || report.poll_id
      }
    })

    return NextResponse.json(transformedReports)
  } catch (error) {
    console.error('Error in GET /api/admin/community/reports:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/admin/community/reports - Update report status (resolve, dismiss)
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
    const { reportId, status, notes } = body

    if (!reportId || !status) {
      return NextResponse.json({ error: 'Report ID and status are required' }, { status: 400 })
    }

    // Valid status values
    const validStatuses = ['reviewed', 'resolved', 'dismissed']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update report status
    const { error } = await supabase
      .from('community_reports')
      .update({ 
        status,
        moderator_notes: notes || null,
        resolved_at: new Date().toISOString(),
        resolved_by: user.id
      })
      .eq('id', reportId)

    if (error) {
      console.error('Error updating report status:', error)
      return NextResponse.json({ error: 'Failed to update report status' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: `Report ${status} successfully`,
      reportId,
      status
    })
  } catch (error) {
    console.error('Error in PATCH /api/admin/community/reports:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}