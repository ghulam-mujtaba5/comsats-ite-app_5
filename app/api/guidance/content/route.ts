import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-access'

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


export async function POST(req: NextRequest) {
  try {
    // Dev fallback (non-production only): allow creating mock item when Supabase env is missing
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (process.env.NODE_ENV !== 'production' && (!url || !anon)) {
      const body = await req.json()
      const {
        title = '',
        description = '',
        category = 'academic',
        content = '',
        is_important = false,
        is_published = true,
      } = body || {}
      const now = new Date().toISOString()
      return NextResponse.json({
        id: `mock-${Math.random().toString(36).slice(2, 9)}`,
        title,
        description,
        category,
        content,
        is_important,
        is_published,
        created_at: now,
        updated_at: now,
      }, { status: 201 })
    }
    const auth = await requireAdmin(req)
    if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const {
      title = '',
      description = '',
      category = 'academic',
      content = '',
      is_important = false,
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
