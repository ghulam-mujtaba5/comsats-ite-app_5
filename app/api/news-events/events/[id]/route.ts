import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-access'

// Authorization centralized via requireAdmin

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request)
  if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await context.params
    const body = await request.json()
    const { title, description, event_date, event_time, location, category, organizer, capacity, registration_open, image_url } = body

    const cookieStore = await (cookies() as any)
    const supabase = createServerClient(
      process.env['NEXT_PUBLIC_SUPABASE_URL']!,
      process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
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

    const { data, error } = await supabase
      .from('events')
      .update({ title, description, event_date, event_time, location, category, organizer, capacity, registration_open, image_url })
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request)
  if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await context.params
    const cookieStore = await (cookies() as any)
    const supabase = createServerClient(
      process.env['NEXT_PUBLIC_SUPABASE_URL']!,
      process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
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
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Public GET for single event (no admin requirement) to enable SSR detail pages & metadata generation
export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const url = process.env['NEXT_PUBLIC_SUPABASE_URL']
    const anon = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']
    // Fail soft in development if env missing
    if (!url || !anon) {
      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json({
          data: {
            id,
            title: `Mock Event ${id}`,
            description: 'Development mock event (Supabase env missing).',
            event_date: new Date().toISOString().split('T')[0],
            event_time: '10:00',
            location: 'TBD',
            category: 'academic',
            organizer: 'CampusAxis',
            capacity: 0,
            registration_open: true,
            image_url: null,
          }
        })
      }
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const cookieStore = await (cookies() as any)
    const supabase = createServerClient(url, anon, {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    })

    const { data, error } = await supabase
      .from('events')
      .select('id,title,description,event_date,event_time,location,category,organizer,capacity,registration_open,image_url,updated_at')
      .eq('id', id)
      .single()

    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
