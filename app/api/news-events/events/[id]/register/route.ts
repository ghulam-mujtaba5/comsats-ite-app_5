import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { id } = await context.params
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { student_name, student_id } = body

    // Check if event exists and registration is open
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('capacity, registration_open')
      .eq('id', id)
      .single()

    if (eventError) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (!event.registration_open) {
      return NextResponse.json({ error: 'Registration is closed for this event' }, { status: 400 })
    }

    // Check current registrations if capacity is limited
    if (event.capacity) {
      const { count } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id)

      if (count && count >= event.capacity) {
        return NextResponse.json({ error: 'Event is full' }, { status: 400 })
      }
    }

    // Register user for event
    const { data, error } = await supabase
      .from('event_registrations')
      .insert({
        event_id: id,
        user_id: user.id,
        student_name,
        student_id
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json({ error: 'You are already registered for this event' }, { status: 400 })
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
