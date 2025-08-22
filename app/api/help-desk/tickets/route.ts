import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(request.url)
  
  const status = searchParams.get('status')
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const myTickets = searchParams.get('my_tickets') === 'true'

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    let query = supabase
      .from('help_desk_tickets')
      .select('*, help_desk_responses(count)')
      .order('created_at', { ascending: false })

    if (myTickets && user) {
      query = query.eq('user_id', user.id)
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category, priority, student_name, student_id } = body

    const { data, error } = await supabase
      .from('help_desk_tickets')
      .insert({
        title,
        description,
        category,
        priority,
        student_name,
        student_id,
        user_id: user.id
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
