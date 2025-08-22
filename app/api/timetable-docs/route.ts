import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Public read-only endpoint for timetable documents
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return NextResponse.json({ error: 'Supabase env missing' }, { status: 500 })
  const supabase = createClient(url, anon)
  const { data, error } = await supabase
    .from('timetable_docs')
    .select('id,title,department,term,size_bytes,mime_type,public_url,uploaded_at')
    .order('uploaded_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
