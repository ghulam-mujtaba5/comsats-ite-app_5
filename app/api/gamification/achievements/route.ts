import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const headers = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150',
  'CDN-Cache-Control': 'public, s-maxage=300',
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
    const category = searchParams.get('category')
    const rarity = searchParams.get('rarity')
    const limit = parseInt(searchParams.get('limit') || '100')

    // Build query
    let query = supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .order('points', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    if (rarity) {
      query = query.eq('rarity', rarity)
    }

    if (limit > 0) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching achievements:', error)
      return NextResponse.json(
        { error: 'Failed to fetch achievements' },
        { status: 500, headers }
      )
    }

    return NextResponse.json({ achievements: data || [] }, { headers })
  } catch (error: any) {
    console.error('Achievements API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers }
    )
  }
}
