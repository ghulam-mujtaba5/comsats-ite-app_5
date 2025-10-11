import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const dynamic = 'force-dynamic'

// POST - Add response to support ticket
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: ticketId } = await params
    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check if user is staff
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role_id, roles:role_id(name)')
      .eq('user_id', user.id)

    const isStaff = userRoles?.some((ur: any) => 
      ['super_admin', 'admin', 'moderator'].includes(ur.roles?.name)
    )

    // Get ticket details
    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .select('*, user:user_id(id, full_name, email)')
      .eq('id', ticketId)
      .single()

    if (ticketError) throw ticketError

    // Create response
    const { data: response, error } = await supabase
      .from('support_ticket_responses')
      .insert({
        ticket_id: ticketId,
        user_id: user.id,
        message,
        is_staff: isStaff
      })
      .select(`
        *,
        user:user_id(id, full_name, email, avatar_url)
      `)
      .single()

    if (error) throw error

    // Update ticket status if it was pending
    if (ticket.status === 'pending') {
      await supabase
        .from('support_tickets')
        .update({ status: 'in_progress' })
        .eq('id', ticketId)
    }

    // Send notification to ticket owner if response is from staff
    if (isStaff && ticket.user_id !== user.id) {
      await supabase.from('notifications').insert({
        user_id: ticket.user_id,
        actor_id: user.id,
        type: 'support_ticket_response',
        title: 'New Response to Your Support Ticket',
        message: `Support team responded to "${ticket.subject}"`,
        link: `/support?ticket=${ticketId}`,
        related_id: ticketId,
        related_type: 'support_ticket'
      })
    }

    // Send notification to assigned staff if response is from user
    if (!isStaff && ticket.assigned_to && ticket.assigned_to !== user.id) {
      await supabase.from('notifications').insert({
        user_id: ticket.assigned_to,
        actor_id: user.id,
        type: 'admin_message',
        title: 'New Response on Assigned Ticket',
        message: `User responded to "${ticket.subject}"`,
        link: `/admin/support?ticket=${ticketId}`,
        related_id: ticketId,
        related_type: 'support_ticket'
      })
    }

    // Log activity
    await supabase.rpc('log_activity', {
      p_user_id: user.id,
      p_action: 'support_ticket_response',
      p_resource_type: 'support_ticket',
      p_resource_id: ticketId,
      p_details: { is_staff: isStaff }
    })

    return NextResponse.json({ response }, { status: 201 })

  } catch (error: any) {
    console.error('Add support response error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add support response' },
      { status: 500 }
    )
  }
}
