import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

// GET - Fetch alumni directory
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const search = searchParams.get('search') || ''
    const campus = searchParams.get('campus') || ''
    const department = searchParams.get('department') || ''
    const company = searchParams.get('company') || ''
    const graduationYear = searchParams.get('graduation_year') || ''
    
    // Build query for alumni directory
    let query = supabase
      .from('user_preferences')
      .select(`
        user_id,
        full_name,
        company,
        position,
        graduation_year,
        degree,
        campus_id,
        department_id,
        campuses (name, code),
        departments (name, code)
      `)
      .not('graduation_year', 'is', null)
      .order('graduation_year', { ascending: false })
    
    // Apply search filter
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,company.ilike.%${search}%`)
    }
    
    // Apply campus filter
    if (campus) {
      query = query.eq('campus_id', campus)
    }
    
    // Apply department filter
    if (department) {
      query = query.eq('department_id', department)
    }
    
    // Apply company filter
    if (company) {
      query = query.ilike('company', `%${company}%`)
    }
    
    // Apply graduation year filter
    if (graduationYear) {
      query = query.eq('graduation_year', graduationYear)
    }
    
    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)
    
    // Execute query
    const { data: alumni, error, count } = await query
    
    if (error) {
      console.error('Error fetching alumni directory:', error)
      return NextResponse.json({ error: 'Failed to fetch alumni directory' }, { status: 500 })
    }
    
    // Format the response
    const formattedAlumni = alumni.map((profile: any) => ({
      user_id: profile.user_id,
      full_name: profile.full_name || 'Alumni',
      company: profile.company || 'Not specified',
      position: profile.position || 'Not specified',
      graduation_year: profile.graduation_year || 'Unknown',
      degree: profile.degree || 'Unknown',
      campus: profile.campuses && profile.campuses.length > 0 && profile.campuses[0] ? {
        name: profile.campuses[0].name,
        code: profile.campuses[0].code
      } : null,
      department: profile.departments && profile.departments.length > 0 && profile.departments[0] ? {
        name: profile.departments[0].name,
        code: profile.departments[0].code
      } : null
    }))
    
    return NextResponse.json({
      alumni: formattedAlumni,
      pagination: {
        page,
        limit,
        total: count || 0,
        hasMore: (page * limit) < (count || 0)
      }
    })
    
  } catch (error) {
    console.error('Error fetching alumni directory:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}