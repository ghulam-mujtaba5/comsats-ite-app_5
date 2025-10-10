import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// GET /api/faculty
export async function GET(req: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800', // Cache for 1 hour, stale for 30 min
    'CDN-Cache-Control': 'public, s-maxage=3600',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=3600'
  }

  const cookieStore = await (cookies() as any)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  // Get campus and department filters from query params
  const { searchParams } = new URL(req.url)
  const campusId = searchParams.get('campus_id')
  const departmentId = searchParams.get('department_id')

  // Select only necessary fields to reduce data transfer and CPU usage
  let query = supabase
    .from('faculty')
    .select(`
      id,
      name,
      title,
      department,
      email,
      office,
      phone,
      specialization,
      courses,
      education,
      experience,
      profile_image,
      rating_avg,
      rating_count,
      created_at
    `)
    .eq('status', 'approved') // Only show approved faculty
    .order('name', { ascending: true })

  // Filter by campus if provided
  if (campusId) {
    query = query.eq('campus_id', campusId)
  }

  // Filter by department if provided
  if (departmentId) {
    query = query.eq('department_id', departmentId)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 400, headers })

  return NextResponse.json((data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    title: row.title || '',
    department: row.department || '',
    email: row.email || '',
    office: row.office || '',
    phone: row.phone || undefined,
    specialization: row.specialization || [],
    courses: row.courses || [],
    education: row.education || [],
    experience: row.experience || '',
    profileImage: row.profile_image || undefined,
    averageRating: Number(row.rating_avg ?? 0),
    totalReviews: Number(row.rating_count ?? 0),
    joinDate: row.created_at || new Date().toISOString(),
  })), { headers })
}