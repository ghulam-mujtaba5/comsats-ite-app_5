import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=450', // Cache for 15 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=900',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=900'
  }

  // Use service role key for server-side API route to bypass RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  try {
    const { data, error } = await supabase
      .from('campuses')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Campuses fetch error:', error)
      return NextResponse.json({ error: error.message || 'Failed to fetch campuses' }, { status: 400, headers })
    }

    return NextResponse.json(data || [], { headers })
  } catch (error) {
    console.error('Unexpected error in campuses API:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching campuses' },
      { status: 500, headers }
    )
  }
}