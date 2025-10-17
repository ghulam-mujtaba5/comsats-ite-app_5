import { createSupabaseClient } from '@/lib/supabase-utils'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/community/reports
 * Fetches community reports with optional filtering
 */
export async function GET(request: NextRequest) {
  const supabase = await createSupabaseClient()

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // In a real implementation, you would check if the user has admin privileges
    // For now, we'll allow access to all authenticated users

    let query = supabase
      .from('community_reports')
      .select(`
        *,
        reporter:user_profiles(full_name),
        post:community_posts_enhanced(content),
        comment:post_comments_enhanced(content)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/community/reports
 * Creates a new community report
 */
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { post_id, comment_id, reason, description } = body

    if (!post_id && !comment_id) {
      return NextResponse.json({ error: 'Either post_id or comment_id is required' }, { status: 400 })
    }

    if (!reason) {
      return NextResponse.json({ error: 'Reason is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('community_reports')
      .insert({
        post_id: post_id || null,
        comment_id: comment_id || null,
        reporter_id: user.id,
        reason,
        description: description || '',
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating report:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/community/reports/[id]
 * Updates a community report (admin only)
 */
// Note: PATCH handler for updating a specific report lives in app/api/community/reports/[id]/route.ts