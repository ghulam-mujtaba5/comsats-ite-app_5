import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// GET /api/faculty
export async function GET(req: NextRequest) {
  // Set cache headers to prevent caching issues
  const headers = {
    'Cache-Control': 'no-store',
    'CDN-Cache-Control': 'no-store',
    'Vercel-CDN-Cache-Control': 'no-store'
  }

  // Use service role key for server-side API route to bypass RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
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
    .order('name', { ascending: true })

  // Filter by campus if provided
  if (campusId) {
    query = query.eq('campus_id', campusId)
  }

  // Filter by department if provided
  if (departmentId) {
    query = query.eq('department_id', departmentId)
  }

  try {
    const { data, error } = await query

    if (error) {
      console.error('Faculty fetch error:', error)
      return NextResponse.json({ error: error.message || 'Failed to fetch faculty' }, { status: 400, headers })
    }

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
  } catch (error) {
    console.error('Unexpected error in faculty API:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching faculty data' },
      { status: 500, headers }
    )
  }
}