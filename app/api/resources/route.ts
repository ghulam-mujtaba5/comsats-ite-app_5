import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return NextResponse.json({ error: 'Supabase env missing' }, { status: 500 })
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
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}


