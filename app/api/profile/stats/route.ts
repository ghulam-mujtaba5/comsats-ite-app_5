import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
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

  try {
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user profile data from user_preferences
    const { data: userPrefs } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Count community posts created by user
    const { count: postsCount } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Count faculty reviews written by user
    const { count: reviewsCount } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Count help desk tickets created
    const { count: ticketsCount } = await supabase
      .from('help_desk_tickets')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Count past papers uploaded
    const { count: papersCount } = await supabase
      .from('past_papers')
      .select('*', { count: 'exact', head: true })
      .eq('uploaded_by', user.email)

    // Get total likes received on posts
    const { data: userPosts } = await supabase
      .from('community_posts')
      .select('id, likes')
      .eq('user_id', user.id)
    
    const totalLikes = userPosts?.reduce((sum, post) => sum + (post.likes || 0), 0) || 0

    // Get user's campus and department info
    let campusName = 'COMSATS Lahore'
    let departmentName = 'Computer Science'
    
    if (userPrefs?.campus_id) {
      const { data: campus } = await supabase
        .from('campuses')
        .select('name')
        .eq('id', userPrefs.campus_id)
        .single()
      if (campus) campusName = campus.name
    }

    if (userPrefs?.department_id) {
      const { data: department } = await supabase
        .from('departments')
        .select('name')
        .eq('id', userPrefs.department_id)
        .single()
      if (department) departmentName = department.name
    }

    // Extract user metadata
    const metadata = user.user_metadata || {}
    
    const stats = {
      // Real counts from database
      postsCreated: postsCount || 0,
      reviewsWritten: reviewsCount || 0,
      ticketsCreated: ticketsCount || 0,
      papersUploaded: papersCount || 0,
      totalLikes: totalLikes,
      helpfulVotes: totalLikes, // Same as likes for now
      
      // User profile data
      campusName,
      departmentName,
      semester: userPrefs?.semester || null,
      studentId: metadata.student_id || null,
      fullName: metadata.full_name || user.email?.split('@')[0] || 'Student',
      
      // Dates
      joinDate: user.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      lastActive: user.last_sign_in_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      
      // Profile completion
      profileComplete: !!(metadata.full_name && metadata.student_id && userPrefs?.campus_id && userPrefs?.department_id),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching profile stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}