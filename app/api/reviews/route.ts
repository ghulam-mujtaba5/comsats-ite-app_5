import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Supabase env vars missing (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)' }, { status: 500 })
    }
    const supabase = createClient(url, serviceKey)
    const payload = {
      user_id: body.user_id || body.student_id || body.uid || null,
      faculty_id: body.faculty_id,
      student_name: body.student_name ?? null,
      course: body.course,
      semester: body.semester,
      rating: body.rating,
      teaching_quality: body.teaching_quality,
      accessibility: body.accessibility,
      course_material: body.course_material,
      grading: body.grading,
      comment: body.comment,
      pros: body.pros,
      cons: body.cons,
      would_recommend: body.would_recommend,
      is_anonymous: body.is_anonymous,
      status: 'approved',
    } as const
    const { data, error } = await supabase.from('reviews').insert(payload).select('id').single()
    if (error) throw error

    return NextResponse.json({ ok: true, id: data.id }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unknown error' }, { status: 400 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const facultyId = searchParams.get('facultyId')
    if (!facultyId) return NextResponse.json({ error: 'facultyId is required' }, { status: 400 })
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || (!anon && !serviceKey)) {
      return NextResponse.json({ error: 'Supabase env vars missing (NEXT_PUBLIC_SUPABASE_URL and either NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY)' }, { status: 500 })
    }
    const supabase = serviceKey
      ? createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
      : createClient(url, anon as string)
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('faculty_id', facultyId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unknown error' }, { status: 400 })
  }
}
