import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const dynamic = 'force-dynamic'

// PATCH - Approve/Reject email (super admin only)
export async function PATCH(
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

    // Check if user is super admin
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role_id, roles:role_id(name)')
      .eq('user_id', user.id)

    const isSuperAdmin = userRoles?.some((ur: any) => 
      ur.roles?.name === 'super_admin'
    )

    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Forbidden - Super admin only' }, { status: 403 })
    }

    const { id: emailId } = await params
    const body = await request.json()
    const { approved } = body

    if (typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: 'Approval status (approved) is required' },
        { status: 400 }
      )
    }

    // Update email queue entry
    const { data: emailEntry, error } = await supabase
      .from('email_queue')
      .update({
        status: approved ? 'approved' : 'cancelled',
        approved_by: user.id,
        approved_at: new Date().toISOString()
      })
      .eq('id', emailId)
      .select(`
        *,
        user:user_id(id, full_name, email)
      `)
      .single()

    if (error) throw error

    // Notify the user who queued the email
    if (emailEntry.user_id !== user.id) {
      await supabase.from('notifications').insert({
        user_id: emailEntry.user_id,
        actor_id: user.id,
        type: 'admin_message',
        title: approved ? 'Email Approved' : 'Email Rejected',
        message: approved 
          ? `Your ${emailEntry.email_type} email has been approved and will be sent soon`
          : `Your ${emailEntry.email_type} email was not approved`,
        link: `/admin/emails?id=${emailId}`,
        related_id: emailId,
        related_type: 'email_queue'
      })
    }

    // Log activity
    await supabase.rpc('log_activity', {
      p_user_id: user.id,
      p_action: approved ? 'email_approved' : 'email_rejected',
      p_resource_type: 'email_queue',
      p_resource_id: emailId,
      p_details: { email_type: emailEntry.email_type, recipient: emailEntry.recipient_email }
    })

    return NextResponse.json({ 
      message: approved ? 'Email approved successfully' : 'Email rejected',
      emailEntry 
    })

  } catch (error: any) {
    console.error('Approve email error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process email approval' },
      { status: 500 }
    )
  }
}
