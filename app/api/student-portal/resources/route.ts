import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
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
  const { searchParams } = new URL(request.url)
  const isAdmin = searchParams.get('admin') === 'true'
  const campusId = searchParams.get('campus_id')

  try {
    let query = supabase
      .from('student_portal_resources')
      .select('*')
      .order('sort_order', { ascending: true })

    // For admin requests, show all resources; for public, only active ones
    if (!isAdmin) {
      query = query.eq('status', 'active')
    }

    // Filter by campus if provided
    if (campusId) {
      query = query.eq('campus_id', campusId)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  try {
    // Check if user is admin (you can add your own admin check here)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, url, category, icon_name, sort_order, requires_vpn, is_external, status, campus_id } = body

    const { data, error } = await supabase
      .from('student_portal_resources')
      .insert({
        title,
        description,
        url,
        category,
        icon_name: icon_name || 'Globe',
        sort_order: sort_order || 0,
        requires_vpn: requires_vpn || false,
        is_external: is_external !== false,
        status: status || 'active',
        campus_id: campus_id || null
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
