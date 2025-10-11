import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const dynamic = 'force-dynamic'

// GET - Fetch support tickets
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const assignedToMe = searchParams.get('assigned_to_me') === 'true'

    let query = supabase
      .from('support_tickets')
      .select(`
        *,
        user:user_id(id, full_name, email, avatar_url),
        assigned:assigned_to(id, full_name, email),
        responses:support_ticket_responses(
          id,
          message,
          is_staff,
          created_at,
          user:user_id(id, full_name, avatar_url)
        )
      `)
      .order('created_at', { ascending: false })

    // Check if user is admin/moderator
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role_id, roles:role_id(name)')
      .eq('user_id', user.id)

    const isStaff = userRoles?.some((ur: any) => 
      ['super_admin', 'admin', 'moderator'].includes(ur.roles?.name)
    )

    if (!isStaff) {
      // Regular users can only see their own tickets
      query = query.eq('user_id', user.id)
    } else if (assignedToMe) {
      query = query.eq('assigned_to', user.id)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (category) {
      query = query.eq('category', category)
    }

    const { data: tickets, error } = await query

    if (error) throw error

    return NextResponse.json({ tickets })

  } catch (error: any) {
    console.error('Fetch support tickets error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch support tickets' },
      { status: 500 }
    )
  }
}

// POST - Create new support ticket
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { category, priority, subject, description, attachments } = body

    if (!category || !subject || !description) {
      return NextResponse.json(
        { error: 'Category, subject, and description are required' },
        { status: 400 }
      )
    }

    // Create support ticket
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: user.id,
        category,
        priority: priority || 'medium',
        subject,
        description,
        attachments: attachments || []
      })
      .select(`
        *,
        user:user_id(id, full_name, email, avatar_url)
      `)
      .single()

    if (error) throw error

    // Create notification for admins
    const { data: adminUsers } = await supabase
      .from('user_roles')
      .select('user_id, roles:role_id(name)')
      .in('roles.name', ['super_admin', 'admin'])

    if (adminUsers) {
      const notifications = adminUsers.map((admin: any) => ({
        user_id: admin.user_id,
        actor_id: user.id,
        type: 'admin_message',
        title: 'New Support Ticket',
        message: `New ${category} support ticket: ${subject}`,
        link: `/admin/support?ticket=${ticket.id}`,
        related_id: ticket.id,
        related_type: 'support_ticket'
      }))

      await supabase.from('notifications').insert(notifications)
    }

    // Log activity
    await supabase.rpc('log_activity', {
      p_user_id: user.id,
      p_action: 'support_ticket_created',
      p_resource_type: 'support_ticket',
      p_resource_id: ticket.id,
      p_details: { category, priority, subject }
    })

    return NextResponse.json({ ticket }, { status: 201 })

  } catch (error: any) {
    console.error('Create support ticket error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create support ticket' },
      { status: 500 }
    )
  }
}

// PATCH - Update support ticket
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { ticketId, status, assignedTo, resolutionNotes } = body

    if (!ticketId) {
      return NextResponse.json(
        { error: 'Ticket ID is required' },
        { status: 400 }
      )
    }

    const updates: any = {}
    
    if (status) {
      updates.status = status
      if (status === 'resolved') {
        updates.resolved_at = new Date().toISOString()
      } else if (status === 'closed') {
        updates.closed_at = new Date().toISOString()
      }
    }

    if (assignedTo !== undefined) {
      updates.assigned_to = assignedTo
    }

    if (resolutionNotes) {
      updates.resolution_notes = resolutionNotes
    }

    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .update(updates)
      .eq('id', ticketId)
      .select(`
        *,
        user:user_id(id, full_name, email)
      `)
      .single()

    if (error) throw error

    // Notify ticket owner
    if (status && ticket.user_id !== user.id) {
      await supabase.from('notifications').insert({
        user_id: ticket.user_id,
        actor_id: user.id,
        type: status === 'resolved' ? 'support_ticket_closed' : 'admin_message',
        title: 'Support Ticket Updated',
        message: `Your support ticket "${ticket.subject}" status: ${status}`,
        link: `/support?ticket=${ticketId}`,
        related_id: ticketId,
        related_type: 'support_ticket'
      })
    }

    // Log activity
    await supabase.rpc('log_activity', {
      p_user_id: user.id,
      p_action: 'support_ticket_updated',
      p_resource_type: 'support_ticket',
      p_resource_id: ticketId,
      p_details: updates
    })

    return NextResponse.json({ ticket })

  } catch (error: any) {
    console.error('Update support ticket error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update support ticket' },
      { status: 500 }
    )
  }
}
