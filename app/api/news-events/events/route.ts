import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  const devFallback = () => {
    const today = new Date()
    const day = (offset: number) => new Date(today.getTime() + offset * 86400000).toISOString().split('T')[0]
    const sample = [
      {
        id: 'evt-mock-1',
        title: 'Career Fair 2025',
        description: 'Meet top companies and explore internship opportunities.',
        date: day(3),
        time: '10:00 AM - 4:00 PM',
        location: 'Main Auditorium',
        category: 'seminar',
        organizer: 'Placement Office',
        capacity: 300,
        registered: 120,
        registrationOpen: true,
        imageUrl: null,
      },
      {
        id: 'evt-mock-2',
        title: 'AI Workshop',
        description: 'Hands-on session on building LLM apps.',
        date: day(7),
        time: '11:00 AM - 2:00 PM',
        location: 'Lab 2, CS Block',
        category: 'workshop',
        organizer: 'CS Department',
        capacity: 60,
        registered: 58,
        registrationOpen: false,
        imageUrl: null,
      },
    ]
    return NextResponse.json(sample)
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anon) return devFallback()

    const supabase = createRouteHandlerClient({ cookies })
    let query = supabase
      .from('events')
      .select(`
        id,title,description,event_date,event_time,location,category,organizer,capacity,registration_open,image_url,
        event_registrations(count)
      `)
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: true })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error } = await query
    if (error || !data) return devFallback()

    const mapped = (data as any[]).map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      date: e.event_date,
      time: e.event_time,
      location: e.location,
      category: e.category,
      organizer: e.organizer,
      capacity: e.capacity ?? undefined,
      registered: e.event_registrations?.[0]?.count ?? 0,
      registrationOpen: !!e.registration_open,
      imageUrl: e.image_url ?? undefined,
    }))

    return NextResponse.json(mapped)
  } catch {
    return devFallback()
  }
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    // Support dev-admin cookie bypass to align with AdminGuard during local/dev
    const devCookie = request.cookies.get('dev_admin')?.value
    const iteCookie = request.cookies.get('ite_admin')?.value
    const devAdminOk = devCookie === '1' || iteCookie === '1'

    const { data: { user } } = await supabase.auth.getUser()

    let allow = false
    if (devAdminOk) {
      allow = true
    } else if (user) {
      // Check if user is admin in DB
      const { data: isAdmin } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .single()
      allow = !!isAdmin
    }

    if (!allow) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, event_date, event_time, location, category, organizer, capacity, registration_open, image_url } = body

    const { data, error } = await supabase
      .from('events')
      .insert({
        title,
        description,
        event_date,
        event_time,
        location,
        category,
        organizer,
        capacity,
        registration_open,
        image_url,
        created_by: user?.id ?? 'hardcoded-admin-id'
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
