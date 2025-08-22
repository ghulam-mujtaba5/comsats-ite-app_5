import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Public read-only endpoint for timetable documents
export async function GET() {
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
      },
    ]
    return NextResponse.json({ data })
  }
  const supabase = createClient(url, anon)
  const { data, error } = await supabase
    .from('timetable_docs')
    .select('id,title,department,term,size_bytes,mime_type,public_url,uploaded_at')
    .order('uploaded_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
