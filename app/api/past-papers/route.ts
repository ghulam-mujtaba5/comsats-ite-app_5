import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { searchQuerySchema, validateData, escapeSQL } from '@/lib/validation'
import { formatErrorResponse, logError } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=900', // Cache for 30 minutes, stale for 15 min
    'CDN-Cache-Control': 'public, s-maxage=1800',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=1800'
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!url || !anon) {
      return NextResponse.json({ data: [] }, { headers })
    }

    const { searchParams } = new URL(req.url)
    
    // Validate and sanitize query parameters
    const course = searchParams.get('course')?.trim().slice(0, 50) || undefined
    const semester = searchParams.get('semester')?.trim().slice(0, 20) || undefined
    const yearParam = searchParams.get('year')
    const year = yearParam ? Number(yearParam) : undefined
    const q = searchParams.get('q')?.trim().slice(0, 200) || undefined
    const limitParam = Number(searchParams.get('limit') || '50')
    const limit = Math.min(Math.max(limitParam, 1), 100) // Clamp between 1-100
    const campusId = searchParams.get('campus_id')?.trim() || undefined
    const departmentId = searchParams.get('department_id')?.trim() || undefined

    const supabase = serviceKey
      ? createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
      : createClient(url, anon)

    let query = supabase
      .from('past_papers')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(limit)

    // Apply filters safely
    if (campusId) query = query.eq('campus_id', campusId)
    if (departmentId) query = query.eq('department_id', departmentId)
    if (course) query = query.ilike('course_code', `%${escapeSQL(course)}%`)
    if (semester) query = query.ilike('semester', `%${escapeSQL(semester)}%`)
    if (typeof year === 'number' && !Number.isNaN(year) && year >= 2000 && year <= 2100) {
      query = query.eq('year', year)
    }
    if (q) {
      const escaped = escapeSQL(q)
      query = query.or(`title.ilike.%${escaped}%,course_code.ilike.%${escaped}%`)
    }

    const { data, error } = await query
    
    if (error) {
      logError(error, { endpoint: '/api/past-papers', method: 'GET' })
      throw error
    }

    return NextResponse.json({ data: data || [], count: data?.length || 0 }, { headers })
  } catch (e: any) {
    logError(e, { endpoint: '/api/past-papers', method: 'GET' })
    const errorResponse = formatErrorResponse(e)
    return NextResponse.json(
      { data: [], ...errorResponse },
      { status: 500, headers: { ...headers, "Content-Type": "application/json" } }
    )
  }
}

// Allowed file types and size
const ALLOWED_EXTS = ['pdf', 'doc', 'docx']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(req: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // Dev fallback: if envs missing, accept and echo back
    if (!url || !anon) {
      const formData = await req.formData()
      const title = (formData.get('title') as string) || 'Untitled'
      const department = (formData.get('department') as string) || 'Other'
      const course_code = (formData.get('course_code') as string) || (formData.get('course_other') as string) || 'OTHER'
      const type = (formData.get('type') as string) || 'Other'
      const semester = (formData.get('semester') as string) || 'Unknown'
      const year = Number(formData.get('year') || new Date().getFullYear())
      const link_url = (formData.get('link_url') as string) || null
      return NextResponse.json({
        data: {
          id: `mock-${Math.random().toString(36).slice(2, 9)}`,
          title,
          department,
          course_code,
          type,
          semester,
          year,
          file_url: link_url,
          link_url,
          status: 'approved',
          created_at: new Date().toISOString(),
        },
        message: 'Past paper submitted (dev mock)'
      }, { status: 201, headers })
    }

    const formData = await req.formData()
    const title = (formData.get('title') as string) || 'Untitled'
    const department = (formData.get('department') as string) || 'Other'
    const course_code = (formData.get('course_code') as string) || (formData.get('course_other') as string) || 'OTHER'
    const type = (formData.get('type') as string) || 'Other'
    const semester = (formData.get('semester') as string) || 'Unknown'
    const year = Number(formData.get('year') || new Date().getFullYear())
    const link_url = (formData.get('link_url') as string) || null
    const file = formData.get('file') as File | null

    if (!link_url && !file) {
      return NextResponse.json({ error: 'Provide a file or a public link' }, { status: 400, headers })
    }
    if (file) {
      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: 'File exceeds 10MB limit' }, { status: 400, headers })
      }
      const name = file.name || 'upload'
      const ext = name.split('.').pop()?.toLowerCase()
      if (!ext || !ALLOWED_EXTS.includes(ext)) {
        return NextResponse.json({ error: 'Only PDF, DOC, DOCX are allowed' }, { status: 400, headers })
      }
    }

    // Use service role for server-side storage if available, else anon (public bucket required)
    const supabase = createClient(url, (serviceKey || anon) as string, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    let file_url: string | null = null
    if (file) {
      // Ensure bucket name
      const bucket = 'past-papers'
      const arrayBuf = await file.arrayBuffer()
      const filePath = `${department}/${course_code}/${type}-${semester}-${year}-${Date.now()}-${file.name}`
      const { data: upRes, error: upErr } = await (supabase as any)
        .storage
        .from(bucket)
        .upload(filePath, Buffer.from(arrayBuf), { upsert: false, contentType: file.type || 'application/octet-stream' })
      if (upErr) {
        return NextResponse.json({ error: `Upload failed: ${upErr.message}` }, { status: 400, headers })
      }
      // Get public URL (bucket should be public or have a public policy)
      const { data: pub } = (supabase as any).storage.from(bucket).getPublicUrl(upRes.path)
      file_url = pub.publicUrl
    }

    const insertPayload: Record<string, any> = {
      title,
      department,
      course_code,
      type,
      semester,
      year,
      file_url,
      link_url,
      status: 'approved', // or 'pending' if moderation needed
    }

    const { data, error } = await supabase
      .from('past_papers')
      .insert(insertPayload)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400, headers })
    }

    return NextResponse.json({ data, message: 'Past paper submitted' }, { status: 201, headers })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to submit past paper' }, { status: 500, headers })
  }
}