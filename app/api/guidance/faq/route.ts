import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
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
  const { searchParams } = new URL(request.url)
  
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  try {
    let query = supabase
      .from('faq_items')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`question.ilike.%${search}%,answer.ilike.%${search}%`)
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
  if (process.env.NODE_ENV !== 'production' && (devCookie === '1' || iteCookie === '1')) return true
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
    // Dev fallback (non-production only): allow creating mock FAQ when Supabase env is missing
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (process.env.NODE_ENV !== 'production' && (!url || !anon)) {
      const body = await req.json()
      const {
        question = '',
        answer = '',
        category = 'academic',
        tags = [],
        is_published = true,
      } = body || {}
      const now = new Date().toISOString()
      return NextResponse.json({
        id: `mock-${Math.random().toString(36).slice(2, 9)}`,
        question,
        answer,
        category,
        tags,
        is_published,
        created_at: now,
        updated_at: now,
      }, { status: 201 })
    }
    const isAdmin = await ensureAdmin(req)
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const {
      question = '',
      answer = '',
      category = 'academic',
      tags = [],
      is_published = true,
    } = body || {}

    const cookieStorePost = await (cookies() as any)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStorePost.get(name)?.value
          },
          set(name: string, value: string, options?: any) {
            cookieStorePost.set({ name, value, ...options })
          },
          remove(name: string, options?: any) {
            cookieStorePost.set({ name, value: '', ...options })
          },
        },
      }
    )
    const { data, error } = await supabase
      .from('faq_items')
      .insert({
        question,
        answer,
        category,
        tags,
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
