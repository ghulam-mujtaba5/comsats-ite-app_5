import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { mockReviews } from '@/lib/faculty-data'
import { getMongoDb } from '@/lib/mongodb'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const mongoUri = process.env.MONGODB_URI
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    // Force auto-approve regardless of env
    const hasModeration = false

    // Prefer MongoDB if configured
    if (mongoUri) {
      const db = await getMongoDb(process.env.MONGODB_DB || 'campusaxis0')
      const res = await db.collection('reviews').insertOne({
        ...body,
        user_id: body.user_id || body.student_id || body.uid || null,
        status: 'approved',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      return NextResponse.json({ ok: true, id: String(res.insertedId) }, { status: 201 })
    }

    // Dev fallback: pretend success without Supabase
    if (!url || !serviceKey) {
      return NextResponse.json({ ok: true, id: 'dev-mock-id' }, { status: 201 })
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

    const mongoUri = process.env.MONGODB_URI
    if (mongoUri) {
      const db = await getMongoDb(process.env.MONGODB_DB || 'campusaxis0')
      const docs = await db
        .collection('reviews')
        .find({ faculty_id: facultyId, status: 'approved' })
        .sort({ created_at: -1 })
        .toArray()
      const data = docs.map((row: any) => ({
        ...row,
        id: String(row._id),
      }))
      return NextResponse.json({ data })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !anon) {
      // Map mock reviews to DB-like snake_case shape expected by the UI mapper
      const data = mockReviews
        .filter((r) => r.facultyId === facultyId)
        .map((r) => ({
          id: r.id,
          faculty_id: r.facultyId,
          student_name: r.isAnonymous ? null : r.studentName,
          course: r.course,
          semester: r.semester,
          rating: r.rating,
          teaching_quality: r.teachingQuality,
          accessibility: r.accessibility,
          course_material: r.courseMaterial,
          grading: r.grading,
          comment: r.comment,
          pros: r.pros,
          cons: r.cons,
          would_recommend: r.wouldRecommend,
          is_anonymous: r.isAnonymous,
          helpful: r.helpful,
          reported: r.reported,
          status: 'approved',
          created_at: r.createdAt,
        }))
      return NextResponse.json({ data })
    }

    const supabase = serviceKey
      ? createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
      : createClient(url, anon)
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
