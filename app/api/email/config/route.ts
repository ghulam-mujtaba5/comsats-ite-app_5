import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const dynamic = 'force-dynamic'

// GET - Get email configurations
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

    const { data: configs, error } = await supabase
      .from('email_config')
      .select('*')
      .order('email_type', { ascending: true })

    if (error) throw error

    // Get usage statistics for current month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data: monthlyStats } = await supabase
      .from('email_queue')
      .select('email_type, status')
      .gte('created_at', startOfMonth.toISOString())
      .eq('status', 'sent')

    // Get usage for today
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const { data: dailyStats } = await supabase
      .from('email_queue')
      .select('email_type, status')
      .gte('created_at', startOfDay.toISOString())
      .eq('status', 'sent')

    // Aggregate usage per email type
    const usage = configs?.map(config => {
      const monthlyCount = monthlyStats?.filter(s => s.email_type === config.email_type).length || 0
      const dailyCount = dailyStats?.filter(s => s.email_type === config.email_type).length || 0
      
      return {
        ...config,
        monthly_usage: monthlyCount,
        daily_usage: dailyCount,
        monthly_remaining: config.monthly_limit - monthlyCount,
        daily_remaining: config.daily_limit - dailyCount
      }
    })

    return NextResponse.json({ configs: usage })

  } catch (error: any) {
    console.error('Get email config error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get email configurations' },
      { status: 500 }
    )
  }
}

// PATCH - Update email configuration (super admin only)
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

    const body = await request.json()
    const { email_type, enabled, requires_approval, daily_limit, monthly_limit, priority } = body

    if (!email_type) {
      return NextResponse.json(
        { error: 'Email type is required' },
        { status: 400 }
      )
    }

    const updates: any = {}
    
    if (typeof enabled === 'boolean') updates.enabled = enabled
    if (typeof requires_approval === 'boolean') updates.requires_approval = requires_approval
    if (daily_limit) updates.daily_limit = daily_limit
    if (monthly_limit) updates.monthly_limit = monthly_limit
    if (priority) updates.priority = priority

    const { data: config, error } = await supabase
      .from('email_config')
      .update(updates)
      .eq('email_type', email_type)
      .select()
      .single()

    if (error) throw error

    // Log activity
    await supabase.rpc('log_activity', {
      p_user_id: user.id,
      p_action: 'email_config_updated',
      p_resource_type: 'email_config',
      p_resource_id: config.id,
      p_details: updates
    })

    return NextResponse.json({ 
      message: 'Email configuration updated successfully',
      config 
    })

  } catch (error: any) {
    console.error('Update email config error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update email configuration' },
      { status: 500 }
    )
  }
}
