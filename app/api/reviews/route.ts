import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Supabase env vars missing (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)' }, { status: 500 })
    }
    const supabase = createClient(url, serviceKey)

    // Validate incoming payload with Zod
    const ReviewCreateSchema = z.object({
      user_id: z.string().uuid().nullable().optional(),
      student_id: z.string().uuid().nullable().optional(),
      uid: z.string().uuid().nullable().optional(),
      faculty_id: z.string().uuid(),
      student_name: z.string().nullable().optional(),
      course: z.string().min(1),
      semester: z.string().min(1),
      rating: z.number().int().min(1).max(5),
      teaching_quality: z.number().int().min(1).max(5),
      accessibility: z.number().int().min(1).max(5),
      course_material: z.number().int().min(1).max(5),
      grading: z.number().int().min(1).max(5),
      comment: z.string().min(1),
      pros: z.array(z.string()).default([]),
      cons: z.array(z.string()).default([]),
      would_recommend: z.boolean().default(false),
      is_anonymous: z.boolean().default(false),
      status: z.enum(['approved', 'pending', 'rejected']).optional(),
    })

    const parsed = ReviewCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten() }, { status: 400 })
    }
    const b = parsed.data
    const payload = {
      user_id: b.user_id || b.student_id || b.uid || null,
      faculty_id: b.faculty_id,
      student_name: b.student_name ?? null,
      course: b.course,
      semester: b.semester,
      rating: b.rating,
      teaching_quality: b.teaching_quality,
      accessibility: b.accessibility,
      course_material: b.course_material,
      grading: b.grading,
      comment: b.comment,
      pros: b.pros ?? [],
      cons: b.cons ?? [],
      would_recommend: b.would_recommend ?? false,
      is_anonymous: b.is_anonymous ?? false,
      status: b.status ?? 'approved',
    } as const

    const { data, error } = await supabase
      .from('reviews')
      .insert(payload)
      .select('id, faculty_id, status')
      .single()
    if (error) throw error

    // If review is approved, update faculty aggregates
    if (data.status === 'approved' && data.faculty_id) {
      const { data: ratings, error: aggError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('faculty_id', data.faculty_id)
        .eq('status', 'approved')
      if (!aggError) {
        const count = ratings?.length || 0
        const avg = count > 0 ? (ratings.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / count) : 0
        await supabase.from('faculty').update({ rating_avg: avg, rating_count: count }).eq('id', data.faculty_id)
      }
    }

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
