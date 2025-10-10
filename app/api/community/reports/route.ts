import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/community/reports - Get all reports (moderator only)
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
    // Check if user is authenticated and is a moderator
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    // Check if user is a moderator (in real app, this would check a moderators table or role)
    const { data: isAdmin } = await supabase.rpc('is_admin', { uid: user.id })
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10), 1), 100)
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0)

    // Get reports with related content
    let query = supabase
      .from('community_reports')
      .select(`
        *,
        reporter:user_id (
          id,
          email
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

    // Filter by status if provided
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: reports, error } = await query

    if (error) {
      console.error('Error fetching reports:', error)
      return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500, headers })
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
        reporter: report.reporter?.email?.split('@')[0] || 'Anonymous',
        status: report.status,
        createdAt: report.created_at,
        targetId: report.post_id || report.comment_id || report.user_id || report.group_id || report.event_id || report.poll_id
      }
    })

    return NextResponse.json(transformedReports, { headers })
  } catch (error) {
    console.error('Error in GET /api/community/reports:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

// POST /api/community/reports - Create a new report
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
    const {
      postId,
      commentId,
      userId,
      groupId,
      eventId,
      pollId,
      reason,
      description
    } = body

    // Validate required fields
    if (!reason) {
      return NextResponse.json({ error: 'Reason is required' }, { status: 400, headers })
    }

    // Check if user has already reported this content
    const { data: existingReports } = await supabase
      .from('community_reports')
      .select('id')
      .eq('user_id', user.id)
      .or(`post_id.eq.${postId},comment_id.eq.${commentId},reported_user_id.eq.${userId}`)

    if (existingReports && existingReports.length > 0) {
      return NextResponse.json({ error: 'You have already reported this content' }, { status: 400, headers })
    }

    // Create report
    const { data: report, error } = await supabase
      .from('community_reports')
      .insert({
        user_id: user.id,
        post_id: postId,
        comment_id: commentId,
        reported_user_id: userId,
        group_id: groupId,
        event_id: eventId,
        poll_id: pollId,
        reason,
        description: description || null,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating report:', error)
      return NextResponse.json({ error: 'Failed to create report' }, { status: 500, headers })
    }

    return NextResponse.json({ 
      id: report.id,
      message: 'Report submitted successfully' 
    })
  } catch (error) {
    console.error('Error in POST /api/community/reports:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}