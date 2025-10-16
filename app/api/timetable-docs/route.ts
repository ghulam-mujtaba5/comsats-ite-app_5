import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Public read-only endpoint for timetable documents
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const campusId = searchParams.get('campus_id')
  const departmentId = searchParams.get('department_id')
  
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300', // Cache for 10 minutes, stale for 5 min (optimized for free tier)
    'CDN-Cache-Control': 'public, s-maxage=600',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=600'
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) {
    // Dev fallback: return mock items to allow page to render without Supabase
    const now = new Date().toISOString()
    const data = [
      {
        id: 'mock-1',
        title: 'Fall 2024 - CS Timetable',
        department: 'Computer Science',
        term: 'Fall 2024',
        size_bytes: 2.4 * 1024 * 1024,
        mime_type: 'application/pdf',
        public_url: '/placeholder-timetable.pdf',
        uploaded_at: now,
        campus_id: 'mock-campus-1',
        department_id: 'mock-dept-1',
      },
      {
        id: 'mock-2',
        title: 'Spring 2024 - EE Timetable',
        department: 'Electrical Engineering',
        term: 'Spring 2024',
        size_bytes: 1.8 * 1024 * 1024,
        mime_type: 'application/pdf',
        public_url: '/placeholder-timetable.pdf',
        uploaded_at: now,
        campus_id: 'mock-campus-1',
        department_id: 'mock-dept-2',
      },
    ]
    return NextResponse.json({ data }, { headers })
  }
  
  const supabase = createClient(url, anon)
  let query = supabase
    .from('timetable_docs')
    .select('id,title,department,term,size_bytes,mime_type,public_url,uploaded_at,campus_id,department_id')
  
  // Apply campus filter if provided
  if (campusId && campusId !== 'all') {
    query = query.eq('campus_id', campusId)
  }
  
  // Apply department filter if provided
  if (departmentId && departmentId !== 'all') {
    query = query.eq('department_id', departmentId)
  }
  
  query = query.order('uploaded_at', { ascending: false })
  
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers })
  return NextResponse.json({ data }, { headers })
}