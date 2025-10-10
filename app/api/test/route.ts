import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }

  const { data, error } = await supabase.from('test').select('*')
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers })
  }
  return NextResponse.json({ data, source: 'postgrest' }, { headers })
}