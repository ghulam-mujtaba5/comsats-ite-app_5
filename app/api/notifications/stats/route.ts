import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/notifications/stats - Get notification statistics for current user
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get total notifications
    const { count: totalCount, error: totalError } = await supabase
      .from('notifications_enhanced')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Get unread count
    const { count: unreadCount, error: unreadError } = await supabase
      .from('notifications_enhanced')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false)

    // Get notifications by type
    const { data: byType, error: typeError } = await supabase
      .from('notifications_enhanced')
      .select('type')
      .eq('user_id', user.id)

    if (totalError || unreadError || typeError) {
      throw totalError || unreadError || typeError
    }

    // Count by type
    const typeCounts = (byType || []).reduce((acc, { type }) => {
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      total: totalCount || 0,
      unread: unreadCount || 0,
      read: (totalCount || 0) - (unreadCount || 0),
      by_type: typeCounts
    })
  } catch (error) {
    console.error('Error in GET /api/notifications/stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
