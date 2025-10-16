import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=450', // Cache for 15 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=900',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=900'
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return NextResponse.json({ error: 'Supabase env missing' }, { status: 500, headers: { ...headers, "Content-Type": "application/json" } })
  const supabase = createClient(url, anon)
  
  // Get campus and department filters from query params
  const { searchParams } = new URL(req.url)
  const campusId = searchParams.get('campus_id')
  const departmentId = searchParams.get('department_id')
  
  let query = supabase
    .from('resources')
    .select('id,title,description,department,term,external_url,file_url,size_bytes,mime_type,uploaded_at')
    .order('uploaded_at', { ascending: false })
  
  // Filter by campus if provided
  if (campusId) {
    query = query.eq('campus_id', campusId)
  }
  
  // Filter by department if provided
  if (departmentId) {
    query = query.eq('department_id', departmentId)
  }
  
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: { ...headers, "Content-Type": "application/json" } })
  return NextResponse.json({ data }, { headers })
}