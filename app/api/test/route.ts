import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60', // Cache for 2 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }

  const { data, error } = await supabase.from('test').select('*')
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers })
  }
  return NextResponse.json({ data, source: 'postgrest' }, { headers })
}