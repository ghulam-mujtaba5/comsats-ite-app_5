import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-access'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const includePast = searchParams.get('includePast')

  const devFallback = () => {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }
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
    return NextResponse.json(sample, { headers: { 'X-Mock-Data': '1' } })
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (process.env.NODE_ENV !== 'production' && (!url || !anon)) return devFallback()

    const cookieStore = await (cookies() as any)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options?: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options?: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    let query = supabase
      .from('events')
      .select(`
        id,title,description,event_date,event_time,location,category,organizer,capacity,registration_open,image_url,
        event_registrations(count)
      `)
      .order('event_date', { ascending: true })

    // Only filter out past events if includePast is not requested
    if (!includePast) {
      query = query.gte('event_date', new Date().toISOString().split('T')[0])
    }

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
  const cookieStore = await (cookies() as any)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options?: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options?: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  try {
    // Dev fallback (non-production only): allow creating mock event when Supabase env is missing
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (process.env.NODE_ENV !== 'production' && (!url || !anon)) {
      const body = await request.json()
      const { title, description, event_date, event_time, location, category, organizer, capacity, registration_open, image_url } = body
      return NextResponse.json({
        id: `evt-mock-${Math.random().toString(36).slice(2, 9)}`,
        title,
        description,
        event_date,
        event_time,
        location,
        category,
        organizer: organizer ?? 'Admin',
        capacity: capacity ?? 0,
        registration_open: !!registration_open,
        image_url: image_url ?? null,
      }, { status: 201 })
    }
    // Centralized admin access check
    const access = await requireAdmin(request)
    if (!access.allow) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // Validate input
    const schema = z.object({
      title: z.string().min(3),
      description: z.string().min(3),
      event_date: z.string().min(4),
      event_time: z.string().min(2),
      location: z.string().min(2),
      category: z.string().min(2),
      organizer: z.string().min(2).optional(),
      capacity: z.number().int().nonnegative().optional(),
      registration_open: z.boolean().optional(),
      image_url: z.string().url().nullable().optional(),
    })
    const parsed = schema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
    }
    const { title, description, event_date, event_time, location, category, organizer, capacity, registration_open, image_url } = parsed.data as any

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
        created_by: access.userId ?? 'hardcoded-admin-id'
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
