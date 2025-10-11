import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const dynamic = 'force-dynamic'

// POST - Track share
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const body = await request.json()
    const { resource_type, resource_id, platform } = body

    if (!resource_type || !resource_id || !platform) {
      return NextResponse.json(
        { error: 'Resource type, ID, and platform are required' },
        { status: 400 }
      )
    }

    let userId = null

    // Try to get user if authenticated
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      userId = user?.id || null
    }

    // Track share
    const { data: share, error } = await supabase
      .from('share_analytics')
      .insert({
        resource_type,
        resource_id,
        platform,
        user_id: userId
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ share }, { status: 201 })

  } catch (error: any) {
    console.error('Track share error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to track share' },
      { status: 500 }
    )
  }
}

// GET - Get share analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resourceType = searchParams.get('resource_type')
    const resourceId = searchParams.get('resource_id')

    let query = supabase
      .from('share_analytics')
      .select('*', { count: 'exact' })

    if (resourceType) {
      query = query.eq('resource_type', resourceType)
    }

    if (resourceId) {
      query = query.eq('resource_id', resourceId)
    }

    const { data: shares, error, count } = await query

    if (error) throw error

    // Group by platform
    const byPlatform = shares?.reduce((acc: any, share: any) => {
      acc[share.platform] = (acc[share.platform] || 0) + 1
      return acc
    }, {})

    // Group by date
    const byDate = shares?.reduce((acc: any, share: any) => {
      const date = new Date(share.shared_at).toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    return NextResponse.json({
      total_shares: count || 0,
      by_platform: byPlatform || {},
      by_date: byDate || {},
      shares
    })

  } catch (error: any) {
    console.error('Get share analytics error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get share analytics' },
      { status: 500 }
    )
  }
}
