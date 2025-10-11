import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const dynamic = 'force-dynamic'

// GET - Get email queue (admin only)
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

    // Check if user is admin
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role_id, roles:role_id(name)')
      .eq('user_id', user.id)

    const isAdmin = userRoles?.some((ur: any) => 
      ['super_admin', 'admin'].includes(ur.roles?.name)
    )

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const email_type = searchParams.get('email_type')

    let query = supabase
      .from('email_queue')
      .select(`
        *,
        user:user_id(id, full_name, email),
        approved_by_user:approved_by(id, full_name)
      `)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (email_type) {
      query = query.eq('email_type', email_type)
    }

    const { data: emailQueue, error } = await query

    if (error) throw error

    // Get email statistics
    const { data: stats } = await supabase
      .from('email_queue')
      .select('status, email_type')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    const statistics = {
      total_today: stats?.length || 0,
      pending: stats?.filter(e => e.status === 'pending').length || 0,
      approved: stats?.filter(e => e.status === 'approved').length || 0,
      sent: stats?.filter(e => e.status === 'sent').length || 0,
      failed: stats?.filter(e => e.status === 'failed').length || 0
    }

    return NextResponse.json({ emailQueue, statistics })

  } catch (error: any) {
    console.error('Get email queue error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get email queue' },
      { status: 500 }
    )
  }
}

// POST - Add email to queue
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
    const { email_type, recipient_email, subject, html_body, scheduled_for } = body

    if (!email_type || !recipient_email || !subject || !html_body) {
      return NextResponse.json(
        { error: 'Email type, recipient, subject, and content are required' },
        { status: 400 }
      )
    }

    // Get email configuration
    const { data: config, error: configError } = await supabase
      .from('email_config')
      .select('*')
      .eq('email_type', email_type)
      .single()

    if (configError || !config) {
      return NextResponse.json(
        { error: 'Invalid email type or not configured' },
        { status: 400 }
      )
    }

    if (!config.enabled) {
      return NextResponse.json(
        { error: 'This email type is currently disabled' },
        { status: 403 }
      )
    }

    // Check daily limit
    const { data: todayCount } = await supabase
      .from('email_queue')
      .select('id', { count: 'exact', head: true })
      .eq('email_type', email_type)
      .gte('created_at', new Date().toISOString().split('T')[0])

    if (todayCount && todayCount >= config.daily_limit) {
      return NextResponse.json(
        { error: `Daily limit reached for ${email_type} emails` },
        { status: 429 }
      )
    }

    // Create email queue entry
    const { data: queueEntry, error } = await supabase
      .from('email_queue')
      .insert({
        user_id: user.id,
        email_type,
        recipient_email,
        subject,
        html_body,
        status: config.requires_approval ? 'pending' : 'approved',
        priority: config.priority,
        scheduled_for: scheduled_for || new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    // Notify admins if approval is required
    if (config.requires_approval) {
      const { data: adminUsers } = await supabase
        .from('user_roles')
        .select('user_id, roles:role_id(name)')
        .eq('roles.name', 'super_admin')

      if (adminUsers) {
        const notifications = adminUsers.map((admin: any) => ({
          user_id: admin.user_id,
          actor_id: user.id,
          type: 'admin_message',
          title: 'Email Approval Required',
          message: `New ${email_type} email pending approval`,
          link: `/admin/emails?id=${queueEntry.id}`,
          related_id: queueEntry.id,
          related_type: 'email_queue'
        }))

        await supabase.from('notifications').insert(notifications)
      }
    }

    // Log activity
    await supabase.rpc('log_activity', {
      p_user_id: user.id,
      p_action: 'email_queued',
      p_resource_type: 'email_queue',
      p_resource_id: queueEntry.id,
      p_details: { email_type, recipient_email, requires_approval: config.requires_approval }
    })

    return NextResponse.json({ queueEntry }, { status: 201 })

  } catch (error: any) {
    console.error('Add to email queue error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add to email queue' },
      { status: 500 }
    )
  }
}
