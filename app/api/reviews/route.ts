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

    // Validate incoming payload with Zod - Minimal validation, no constraints
    const ReviewCreateSchema = z.object({
      user_id: z.string().uuid().nullable().optional(),
      student_id: z.string().uuid().nullable().optional(),
      uid: z.string().uuid().nullable().optional(),
      faculty_id: z.string().uuid(),
      student_name: z.string().nullable().optional(),
      course: z.string().min(1, "Course is required"),
      semester: z.string().min(1, "Semester is required"),
      rating: z.number().int().min(1, "Overall rating is required (1-5)").max(5, "Rating cannot exceed 5"),
      teaching_quality: z.number().int().min(0, "Teaching quality rating must be 0-5").max(5, "Teaching quality rating cannot exceed 5").optional().default(0),
      accessibility: z.number().int().min(0, "Accessibility rating must be 0-5").max(5, "Accessibility rating cannot exceed 5").optional().default(0),
      course_material: z.number().int().min(0, "Course material rating must be 0-5").max(5, "Course material rating cannot exceed 5").optional().default(0),
      grading: z.number().int().min(0, "Grading rating must be 0-5").max(5, "Grading rating cannot exceed 5").optional().default(0),
      comment: z.string().min(1, "Comment is required"),
      pros: z.array(z.string()).default([]),
      cons: z.array(z.string()).default([]),
      would_recommend: z.boolean().default(false),
      is_anonymous: z.boolean().default(false),
      status: z.enum(['approved', 'pending', 'rejected']).optional(),
    })

    const parsed = ReviewCreateSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
      return NextResponse.json({ 
        error: 'Validation failed', 
        message: `Please fix the following: ${errors}`,
        details: parsed.error.flatten()
      }, { status: 400 })
    }
    const b = parsed.data
    const payload = {
      user_id: b.user_id || b.student_id || b.uid || null,
      faculty_id: b.faculty_id,
      student_name: b.student_name ?? null,
      course: b.course,
      semester: b.semester,
      rating: b.rating,
      teaching_quality: b.teaching_quality ?? 0,
      accessibility: b.accessibility ?? 0,
      course_material: b.course_material ?? 0,
      grading: b.grading ?? 0,
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
    
    if (error) {
      console.error('Database error:', error)
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to submit review'
      
      if (error.code === '23505') {
        errorMessage = 'A review with these details already exists, but you can submit another one if needed'
      } else if (error.code === '23503') {
        errorMessage = 'Invalid faculty or user reference'
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again'
      } else if (error.message?.includes('connection')) {
        errorMessage = 'Connection error. Please check your internet and try again'
      }
      
      return NextResponse.json({ 
        error: errorMessage,
        details: error.message,
        code: error.code 
      }, { status: 500 })
    }

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
    console.error('API error:', error)
    
    let errorMessage = 'An unexpected error occurred'
    let statusCode = 500
    
    if (error.name === 'ValidationError') {
      errorMessage = 'Invalid data provided'
      statusCode = 400
    } else if (error.message?.includes('JSON')) {
      errorMessage = 'Invalid request format'
      statusCode = 400
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      errorMessage = 'Network error. Please check your connection and try again'
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: error.message ?? 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: statusCode })
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

    if (error) {
      console.error('Failed to fetch reviews:', error)
      let errorMessage = 'Failed to load reviews'
      
      if (error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again'
      } else if (error.message?.includes('connection')) {
        errorMessage = 'Connection error. Please check your internet and try again'
      }
      
      return NextResponse.json({ 
        error: errorMessage,
        details: error.message 
      }, { status: 500 })
    }
    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('GET reviews API error:', error)
    return NextResponse.json({ 
      error: 'Failed to retrieve reviews',
      details: error.message ?? 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
