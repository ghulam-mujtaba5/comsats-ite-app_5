import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const dynamic = 'force-dynamic'

// GET - Fetch activity logs (super admin only)
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

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const resourceType = searchParams.get('resource_type')
    const userId = searchParams.get('user_id')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    let query = supabase
      .from('activity_logs')
      .select(`
        *,
        user:user_id(id, full_name, email, avatar_url)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (action) {
      query = query.eq('action', action)
    }

    if (resourceType) {
      query = query.eq('resource_type', resourceType)
    }

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (startDate) {
      query = query.gte('created_at', startDate)
    }

    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    const { data: logs, error, count } = await query

    if (error) throw error

    // Get activity statistics
    const { data: stats } = await supabase
      .from('activity_logs')
      .select('action, resource_type')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    const statistics = {
      total_today: stats?.length || 0,
      by_action: stats?.reduce((acc: any, log: any) => {
        acc[log.action] = (acc[log.action] || 0) + 1
        return acc
      }, {}),
      by_resource: stats?.reduce((acc: any, log: any) => {
        acc[log.resource_type] = (acc[log.resource_type] || 0) + 1
        return acc
      }, {})
    }

    return NextResponse.json({ 
      logs,
      total: count,
      limit,
      offset,
      statistics 
    })

  } catch (error: any) {
    console.error('Fetch activity logs error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch activity logs' },
      { status: 500 }
    )
  }
}

// GET - Get activity analytics (super admin only)
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
    const { period = 'week' } = body // day, week, month, year

    const now = new Date()
    let startDate: Date

    switch (period) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0))
        break
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7))
        break
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1))
        break
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1))
        break
      default:
        startDate = new Date(now.setDate(now.getDate() - 7))
    }

    // Get all logs for the period
    const { data: logs, error } = await supabase
      .from('activity_logs')
      .select('*')
      .gte('created_at', startDate.toISOString())

    if (error) throw error

    // Get unique active users
    const { data: activeUsers, error: usersError } = await supabase
      .from('activity_logs')
      .select('user_id')
      .gte('created_at', startDate.toISOString())

    const uniqueUsers = new Set(activeUsers?.map(log => log.user_id))

    // Get most active users
    const userActivity = activeUsers?.reduce((acc: any, log: any) => {
      acc[log.user_id] = (acc[log.user_id] || 0) + 1
      return acc
    }, {})

    const topUsers = Object.entries(userActivity || {})
      .sort(([, a]: any, [, b]: any) => b - a)
      .slice(0, 10)
      .map(([userId, count]) => ({ user_id: userId, activity_count: count }))

    // Get user details for top users
    const topUserIds = topUsers.map(u => u.user_id)
    const { data: userDetails } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url')
      .in('id', topUserIds)

    const topUsersWithDetails = topUsers.map(tu => ({
      ...tu,
      user: userDetails?.find(ud => ud.id === tu.user_id)
    }))

    const analytics = {
      period,
      total_activities: logs?.length || 0,
      unique_users: uniqueUsers.size,
      activities_by_action: logs?.reduce((acc: any, log: any) => {
        acc[log.action] = (acc[log.action] || 0) + 1
        return acc
      }, {}),
      activities_by_resource: logs?.reduce((acc: any, log: any) => {
        acc[log.resource_type] = (acc[log.resource_type] || 0) + 1
        return acc
      }, {}),
      top_users: topUsersWithDetails,
      timeline: logs?.reduce((acc: any, log: any) => {
        const date = new Date(log.created_at).toISOString().split('T')[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      }, {})
    }

    return NextResponse.json({ analytics })

  } catch (error: any) {
    console.error('Get activity analytics error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get activity analytics' },
      { status: 500 }
    )
  }
}
