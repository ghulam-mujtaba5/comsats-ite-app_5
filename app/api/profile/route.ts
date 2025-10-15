import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// Helper function to create Supabase client
function createClient() {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `remove` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user profile from user_preferences table
    const { data: profile, error: profileError } = await supabase
      .from('user_preferences')
      .select(`
        full_name,
        phone,
        address,
        company,
        position,
        graduation_year,
        degree,
        campus_id,
        department_id,
        program_id,
        semester,
        batch,
        campuses (name),
        departments (name),
        programs (name, code)
      `)
      .eq('user_id', user.id)
      .single()
    
    if (profileError) {
      // If no profile exists, return default empty profile
      return NextResponse.json({
        user_id: user.id,
        full_name: user.user_metadata?.full_name || '',
        email: user.email,
        phone: '',
        address: '',
        company: '',
        position: '',
        graduation_year: '',
        degree: '',
        campus: null,
        department: null,
        program: null,
        semester: null,
        batch: user.user_metadata?.batch || ''
      })
    }
    
    // Return the profile data
    return NextResponse.json({
      user_id: user.id,
      full_name: profile.full_name || user.user_metadata?.full_name || '',
      email: user.email,
      phone: profile.phone || '',
      address: profile.address || '',
      company: profile.company || '',
      position: profile.position || '',
      graduation_year: profile.graduation_year || '',
      degree: profile.degree || '',
      campus: profile.campuses || null,
      department: profile.departments || null,
      program: profile.programs || null,
      semester: profile.semester || null,
      batch: profile.batch || user.user_metadata?.batch || ''
    })
    
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get the request body
    const body = await request.json()
    
    // Update user profile in user_preferences table
    const { data: profile, error: profileError } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        full_name: body.full_name,
        phone: body.phone,
        address: body.address,
        company: body.company,
        position: body.position,
        graduation_year: body.graduation_year,
        degree: body.degree,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select(`
        full_name,
        phone,
        address,
        company,
        position,
        graduation_year,
        degree,
        campus_id,
        department_id,
        program_id,
        semester,
        batch,
        campuses (name),
        departments (name),
        programs (name, code)
      `)
      .single()
    
    if (profileError) {
      console.error('Profile update error:', profileError)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 400 })
    }
    
    // Update user metadata
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        full_name: body.full_name,
        phone: body.phone,
        address: body.address,
        company: body.company,
        position: body.position,
        graduation_year: body.graduation_year,
        degree: body.degree
      }
    })
    
    if (metadataError) {
      console.error('Metadata update error:', metadataError)
    }
    
    // Return updated profile
    return NextResponse.json({
      user_id: user.id,
      full_name: profile.full_name || body.full_name,
      email: user.email,
      phone: profile.phone || body.phone,
      address: profile.address || body.address,
      company: profile.company || body.company,
      position: profile.position || body.position,
      graduation_year: profile.graduation_year || body.graduation_year,
      degree: profile.degree || body.degree,
      campus: profile.campuses || null,
      department: profile.departments || null,
      program: profile.programs || null,
      semester: profile.semester || null,
      batch: profile.batch || ''
    })
    
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}