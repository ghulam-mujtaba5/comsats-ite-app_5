import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getCourseByCode } from '@/lib/past-papers-data'

export async function GET(req: NextRequest, { params }: { params: { courseCode: string } }) {
  const courseCode = params.courseCode
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If env not configured (dev), fallback to mock data so UI works
  if (!url || !anon) {
    const mock = getCourseByCode(courseCode)
    if (!mock) return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    return NextResponse.json({ data: mock })
  }

  const supabase = createClient(url, anon)

  // Fetch papers and course details in parallel
  const [papersRes, courseRes] = await Promise.all([
    supabase.from('past_papers').select('*').eq('course_code', courseCode),
    supabase.from('courses').select('id, name, code, credit_hours, department').eq('code', courseCode).single(),
  ])

  const { data: papersData, error: papersError } = papersRes
  const { data: courseData, error: courseError } = courseRes

  if (papersError) {
    return NextResponse.json({ error: papersError.message }, { status: 500 })
  }

  // If no papers and no course info exists, then it's a 404
  if (!papersData || papersData.length === 0) {
    if (courseError || !courseData) {
      // Try mock fallback
      const mock = getCourseByCode(courseCode)
      if (mock) return NextResponse.json({ data: mock })
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
  }

  // If course details don't exist but papers do, create a fallback course object
  const finalCourseData = courseData || {
    name: `Course ${courseCode}`,
    code: courseCode,
    credit_hours: '3',
    department: 'Unknown',
  }

  // Organize papers by type
  const courseWithPapers = {
    ...finalCourseData,
    assignments: papersData?.filter((p) => p.exam_type === 'Assignment') || [],
    quizzes: papersData?.filter((p) => p.exam_type === 'Quiz') || [],
    midterms: papersData?.filter((p) => p.exam_type === 'Mid-Term') || [],
    finals: papersData?.filter((p) => p.exam_type === 'Final') || [],
    totalPapers: papersData?.length || 0,
    lastUpdated: papersData?.[0]?.created_at || new Date().toISOString(),
  }

  return NextResponse.json({ data: courseWithPapers })
}
