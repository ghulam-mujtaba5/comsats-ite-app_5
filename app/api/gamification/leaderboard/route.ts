import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const headers = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60',
  'CDN-Cache-Control': 'public, s-maxage=120',
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    })

    // Parse query params
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const campus_id = searchParams.get('campus_id')
    const department_id = searchParams.get('department_id')

    // Query leaderboard materialized view
    let query = supabase
      .from('leaderboard')
      .select('*')
      .order('rank', { ascending: true })

    if (campus_id) {
      query = query.eq('campus_id', campus_id)
    }

    if (department_id) {
      query = query.eq('department_id', department_id)
    }

    if (limit > 0) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching leaderboard:', error)
      return NextResponse.json(
        { error: 'Failed to fetch leaderboard' },
        { status: 500, headers }
      )
    }

    return NextResponse.json({ leaderboard: data || [] }, { headers })
  } catch (error: any) {
    console.error('Leaderboard API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers }
    )
  }
}
