import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getCourseByCode } from '@/lib/past-papers-data'

export async function GET(req: NextRequest, context: { params: Promise<{ courseCode: string }> }) {
  const { courseCode } = await context.params
  const normalized = courseCode.toUpperCase()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If env not configured (dev), fallback to mock data so UI works
  if (!url || !anon) {
    const mock = getCourseByCode(normalized)
    if (!mock) return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    return NextResponse.json({ data: mock })
  }

  const supabase = createClient(url, anon)

  // Fetch papers and course details in parallel
  const [papersRes, courseRes] = await Promise.all([
    supabase
      .from('past_papers')
      .select('*')
      .ilike('course_code', normalized)
      .eq('status', 'approved'),
    supabase
      .from('courses')
      .select('id, name, code, credit_hours, department')
      .ilike('code', normalized)
      .single(),
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
      const mock = getCourseByCode(normalized)
      if (mock) return NextResponse.json({ data: mock })
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
  }

  // If course details don't exist but papers do, create a fallback course object
  const finalCourseData = courseData || {
    name: `Course ${normalized}`,
    code: normalized,
    credit_hours: '3',
    department: 'Unknown',
  }

  // Organize papers by type and map to PastPaper interface
  const mapPaperData = (papers: any[]) => {
    return papers.map((p) => ({
      id: p.id || `paper-${Math.random().toString(36).slice(2, 9)}`,
      title: p.title || 'Untitled Paper',
      course: p.course_name || finalCourseData.name,
      courseCode: (p.course_code || normalized).toUpperCase(),
      department: p.department || finalCourseData.department,
      semester: p.semester || 'Unknown Semester',
      year: Number(p.year) || new Date(p.created_at).getFullYear(),
      examType: (p.exam_type === 'Midterm' ? 'Mid-Term' : p.exam_type) || 'Mid-Term',
      uploadedBy: p.uploaded_by || 'Anonymous',
      uploadDate: p.created_at || new Date().toISOString(),
      downloadCount: p.download_count || 0,
      fileSize: p.file_size || 'Unknown',
      fileType: (p.file_type || 'PDF').toUpperCase(),
      downloadUrl: p.file_url || p.public_url || p.external_url || p.link_url || undefined,
      tags: Array.isArray(p.tags) ? p.tags : (p.tags ? [p.tags] : []),
    }));
  };

  const courseWithPapers = {
    id: (finalCourseData as any).id || normalized,
    name: finalCourseData.name,
    code: (finalCourseData.code || normalized).toUpperCase(),
    creditHours: Number(finalCourseData.credit_hours) || 3,
    department: finalCourseData.department,
    assignments: mapPaperData(papersData?.filter((p) => p.exam_type === 'Assignment') || []),
    quizzes: mapPaperData(papersData?.filter((p) => p.exam_type === 'Quiz') || []),
    midterms: mapPaperData(papersData?.filter((p) => p.exam_type === 'Mid-Term' || p.exam_type === 'Midterm') || []),
    finals: mapPaperData(papersData?.filter((p) => p.exam_type === 'Final') || []),
    totalPapers: papersData?.length || 0,
    lastUpdated: papersData?.[0]?.created_at || new Date().toISOString(),
  }

  return NextResponse.json({ data: courseWithPapers })
}
