import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { requireAdmin } from "@/lib/admin-access"
import { notifyQueryResponse, notifyUserQueryResponse } from "@/lib/notification-helpers"

// POST /api/issues/[id]/responses - Add a response to an issue
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: issueId } = await params
  try {
    const body = await req.json()
    const { message } = body

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const supabase = createClient(url, serviceKey)
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role_id, roles:role_id(name)')
      .eq('user_id', user.id)

    const isAdmin = userRoles?.some((ur: any) => 
      ['super_admin', 'admin', 'moderator'].includes(ur.roles?.name)
    )

    // Get issue details
    const { data: issue, error: issueError } = await supabase
      .from('issue_reports')
      .select('title, user_id, email')
      .eq('id', issueId)
      .single()

    if (issueError) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 })
    }

    // Create response
    const { data: response, error: responseError } = await supabase
      .from('issue_responses')
      .insert({
        issue_id: issueId,
        user_id: user.id,
        message: message.trim(),
        is_admin: isAdmin
      })
      .select()
      .single()

    if (responseError) {
      return NextResponse.json({ error: 'Failed to add response' }, { status: 500 })
    }

    // Send notifications
    // Notify admins when a user responds
    if (!isAdmin) {
      await notifyQueryResponse(issueId, issue.title, user.email || 'User')
    }
    
    // Notify user when an admin responds
    if (isAdmin && (issue.user_id || issue.email)) {
      await notifyUserQueryResponse(issueId, issue.title, user.email?.split('@')[0] || 'Admin')
    }

    return NextResponse.json({ response }, { status: 201 })
  } catch (e) {
    console.error('Error adding issue response:', e)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// GET /api/issues/[id]/responses - Get responses for an issue
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: issueId } = await params
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const supabase = createClient(url, serviceKey)
    
    // Get responses
    const { data: responses, error } = await supabase
      .from('issue_responses')
      .select(`
        *,
        user:user_id(id, email)
      `)
      .eq('issue_id', issueId)
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 })
    }

    return NextResponse.json({ responses }, { status: 200 })
  } catch (e) {
    console.error('Error fetching issue responses:', e)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}