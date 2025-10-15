import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// GET /api/faculty/reviews
export async function GET(req: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=900', // Cache for 30 min, stale for 15 min
    'CDN-Cache-Control': 'public, s-maxage=1800',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=1800'
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

  // Get query parameters
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')
  const department = searchParams.get('department')
  const sortBy = searchParams.get('sortBy') || 'rating'
  const order = searchParams.get('order') || 'desc'
  const minRating = parseFloat(searchParams.get('minRating') || '0')
  const search = searchParams.get('search')

  try {
    // Build faculty query
    let facultyQuery = supabase
      .from('faculty')
      .select(`
        id,
        name,
        title,
        department,
        specialization,
        rating_avg,
        rating_count,
        created_at
      `)
      .eq('status', 'approved')
      .gte('rating_avg', minRating)

    // Apply department filter if provided
    if (department && department !== 'all') {
      facultyQuery = facultyQuery.eq('department', department)
    }

    // Apply search filter if provided
    if (search) {
      facultyQuery = facultyQuery.or(`name.ilike.%${search}%,department.ilike.%${search}%`)
    }

    // Apply sorting
    if (sortBy === 'rating') {
      facultyQuery = facultyQuery.order('rating_avg', { ascending: order === 'asc' })
    } else if (sortBy === 'reviews') {
      facultyQuery = facultyQuery.order('rating_count', { ascending: order === 'asc' })
    } else {
      facultyQuery = facultyQuery.order('name', { ascending: order === 'asc' })
    }

    // Apply pagination
    facultyQuery = facultyQuery.range(offset, offset + limit - 1)

    const { data: facultyData, error: facultyError } = await facultyQuery

    if (facultyError) {
      console.error('Faculty query error:', facultyError)
      return NextResponse.json({ error: 'Failed to fetch faculty data' }, { status: 500, headers })
    }

    // Get faculty IDs for reviews query
    const facultyIds = facultyData?.map(f => f.id) || []

    // Build reviews query
    let reviewsQuery = supabase
      .from('reviews')
      .select(`
        id,
        faculty_id,
        student_name,
        is_anonymous,
        course,
        semester,
        rating,
        teaching_quality,
        accessibility,
        course_material,
        grading,
        comment,
        pros,
        cons,
        would_recommend,
        created_at,
        helpful
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(50) // Limit recent reviews

    // Filter by faculty IDs if we have them
    if (facultyIds.length > 0) {
      reviewsQuery = reviewsQuery.in('faculty_id', facultyIds)
    }

    const { data: reviewsData, error: reviewsError } = await reviewsQuery

    if (reviewsError) {
      console.error('Reviews query error:', reviewsError)
      return NextResponse.json({ error: 'Failed to fetch reviews data' }, { status: 500, headers })
    }

    // Combine faculty and reviews data
    const facultyWithReviews = (facultyData || []).map(faculty => {
      const facultyReviews = (reviewsData || []).filter(review => review.faculty_id === faculty.id)
      return {
        ...faculty,
        averageRating: Number(faculty.rating_avg ?? 0),
        totalReviews: Number(faculty.rating_count ?? 0),
        recentReviews: facultyReviews.slice(0, 3) // Top 3 recent reviews
      }
    })

    // Get overall stats
    const { data: statsData, error: statsError } = await supabase
      .from('faculty')
      .select('rating_avg, rating_count')
      .eq('status', 'approved')

    let overallStats = {
      totalFaculty: 0,
      totalReviews: 0,
      averageRating: 0
    }

    if (!statsError && statsData) {
      const validStats = statsData.filter(s => s.rating_count > 0)
      overallStats = {
        totalFaculty: validStats.length,
        totalReviews: validStats.reduce((sum, s) => sum + (s.rating_count || 0), 0),
        averageRating: validStats.length > 0 
          ? validStats.reduce((sum, s) => sum + (s.rating_avg || 0), 0) / validStats.length
          : 0
      }
    }

    return NextResponse.json({
      faculty: facultyWithReviews,
      recentReviews: reviewsData || [],
      stats: overallStats,
      total: facultyWithReviews.length
    }, { headers })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}