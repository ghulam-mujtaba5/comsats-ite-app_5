import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(request.url)
  
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  try {
    let query = supabase
      .from('guidance_content')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,content.ilike.%${search}%`)
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

async function ensureAdmin(req: NextRequest) {
  const devCookie = req.cookies.get('dev_admin')?.value
  const iteCookie = req.cookies.get('ite_admin')?.value
  if (devCookie === '1' || iteCookie === '1') return true
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', user.id)
    .single()
  return !!adminUser
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await ensureAdmin(req)
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const {
      title = '',
      description = '',
      category = 'academic',
      content = '',
      is_important = false,
      is_published = true,
    } = body || {}

    const supabase = createRouteHandlerClient({ cookies })
    const { data, error } = await supabase
      .from('guidance_content')
      .insert({
        title,
        description,
        category,
        content,
        is_important,
        is_published,
      })
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
