import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET user account details
export async function GET(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30', // Cache for 1 minute, stale for 30 sec (optimized for free tier)
    'CDN-Cache-Control': 'public, s-maxage=60',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=60'
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

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    // Get user preferences
    const { data: prefs } = await supabase
      .from('user_preferences')
      .select(`
        *,
        campuses(id, name, code),
        departments(id, name, code),
        programs(id, name, code, degree_type)
      `)
      .eq('user_id', user.id)
      .single()

    const metadata = user.user_metadata || {}

    return NextResponse.json({
      id: user.id,
      email: user.email,
      fullName: metadata.full_name || '',
      studentId: metadata.student_id || '',
      phoneNumber: metadata.phone_number || '',
      campus: prefs?.campuses || null,
      department: prefs?.departments || null,
      program: prefs?.programs || null,
      semester: prefs?.semester || null,
      batch: metadata.batch || '',
      bio: metadata.bio || '',
      interests: metadata.interests || [],
      socialLinks: metadata.social_links || {},
      preferences: {
        emailNotifications: prefs?.email_notifications ?? true,
        pushNotifications: prefs?.push_notifications ?? true,
        showProfile: metadata.show_profile ?? true,
        darkMode: metadata.dark_mode ?? false,
      },
      createdAt: user.created_at,
      lastSignIn: user.last_sign_in_at,
    }, { headers })
  } catch (error) {
    console.error('Error fetching account:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

// PATCH user account details
export async function PATCH(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30', // Cache for 1 minute, stale for 30 sec (optimized for free tier)
    'CDN-Cache-Control': 'public, s-maxage=60',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=60'
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

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    const body = await request.json()
    const {
      fullName,
      studentId,
      phoneNumber,
      campusId,
      departmentId,
      programId,
      semester,
      batch,
      bio,
      interests,
      socialLinks,
      emailNotifications,
      pushNotifications,
      showProfile,
      darkMode,
    } = body

    // Update user metadata
    const metadataUpdate: any = {}
    if (fullName !== undefined) metadataUpdate.full_name = fullName
    if (studentId !== undefined) metadataUpdate.student_id = studentId
    if (phoneNumber !== undefined) metadataUpdate.phone_number = phoneNumber
    if (batch !== undefined) metadataUpdate.batch = batch
    if (bio !== undefined) metadataUpdate.bio = bio
    if (interests !== undefined) metadataUpdate.interests = interests
    if (socialLinks !== undefined) metadataUpdate.social_links = socialLinks
    if (showProfile !== undefined) metadataUpdate.show_profile = showProfile
    if (darkMode !== undefined) metadataUpdate.dark_mode = darkMode

    if (Object.keys(metadataUpdate).length > 0) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: metadataUpdate
      })
      
      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400, headers })
      }
    }

    // Update user preferences
    const prefsUpdate: any = {}
    if (campusId !== undefined) prefsUpdate.campus_id = campusId
    if (departmentId !== undefined) prefsUpdate.department_id = departmentId
    if (programId !== undefined) prefsUpdate.program_id = programId
    if (semester !== undefined) prefsUpdate.semester = semester
    if (emailNotifications !== undefined) prefsUpdate.email_notifications = emailNotifications
    if (pushNotifications !== undefined) prefsUpdate.push_notifications = pushNotifications

    if (Object.keys(prefsUpdate).length > 0) {
      const { error: prefsError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...prefsUpdate,
          updated_at: new Date().toISOString()
        })

      if (prefsError) {
        return NextResponse.json({ error: prefsError.message }, { status: 400, headers })
      }
    }

    return NextResponse.json({ success: true, message: 'Profile updated successfully' }, { headers })
  } catch (error) {
    console.error('Error updating account:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

export async function DELETE(request: Request) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30', // Cache for 1 minute, stale for 30 sec (optimized for free tier)
    'CDN-Cache-Control': 'public, s-maxage=60',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=60'
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anon) {
      return NextResponse.json({ error: 'Supabase env missing' }, { status: 500, headers })
    }

    // Expect Authorization: Bearer <access_token>
    const auth = request.headers.get('authorization') || request.headers.get('Authorization')
    const token = auth?.startsWith('Bearer ') ? auth.slice('Bearer '.length) : undefined
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    // Verify token and get user via anon client
    const supabase = createClient(url, anon)
    const { data: userData, error: userErr } = await supabase.auth.getUser(token)
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401, headers })
    }

    const userId = userData.user.id

    // Delete auth user via admin client
    const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (delErr) {
      return NextResponse.json({ error: delErr.message }, { status: 500, headers })
    }

    return new NextResponse(null, { status: 204 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500, headers })
  }
}

