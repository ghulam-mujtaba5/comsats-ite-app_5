import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  // Dev/mock fallback helper (non-production only)
  const devFallback = () => {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }
    const sample = [
      {
        id: 'mock-1',
        title: 'Midterm Schedule Announced',
        content: 'Midterms will start from next Monday. Please check the portal for your course schedule.',
        category: 'announcement',
        publishedAt: new Date().toISOString(),
        author: 'Registrar Office',
        imageUrl: null,
        isImportant: true,
      },
      {
        id: 'mock-2',
        title: 'Programming Workshop',
        content: 'Join our hands-on workshop on modern TypeScript patterns this weekend.',
        category: 'academic',
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        author: 'CS Department',
        imageUrl: null,
        isImportant: false,
      },
    ]
    return NextResponse.json(sample)
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (process.env.NODE_ENV !== 'production' && (!url || !anon)) {
      return devFallback()
    }

    const supabase = createRouteHandlerClient({ cookies })
    let query = supabase
      .from('news_items')
      .select('id,title,content,category,is_important,image_url,published_at,author_name')
      .order('published_at', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }

    const { data, error } = await query
    if (error || !data) {
      return devFallback()
    }

    // Map DB fields -> UI expected shape
    const mapped = data.map((n: any) => ({
      id: n.id,
      title: n.title,
      content: n.content,
      category: n.category,
      publishedAt: n.published_at,
      author: n.author_name ?? 'Admin',
      imageUrl: n.image_url ?? undefined,
      isImportant: !!n.is_important,
    }))

    return NextResponse.json(mapped)
  } catch {
    return devFallback()
  }
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    // Dev fallback (non-production only): if Supabase env is not configured, echo back a mock created item
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (process.env.NODE_ENV !== 'production' && (!url || !anon)) {
      const body = await request.json()
      const { title, content, category, is_important, image_url } = body
      return NextResponse.json({
        id: `mock-${Math.random().toString(36).slice(2, 9)}`,
        title,
        content,
        category,
        is_important: !!is_important,
        image_url: image_url ?? null,
        published_at: new Date().toISOString(),
        author_name: 'Admin'
      }, { status: 201 })
    }
    // Support dev-admin cookie bypass only in non-production
    const devCookie = request.cookies.get('dev_admin')?.value
    const iteCookie = request.cookies.get('ite_admin')?.value
    const devAdminOk = process.env.NODE_ENV !== 'production' && (devCookie === '1' || iteCookie === '1')

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
    const { title, content, category, is_important, image_url } = body

    const { data, error } = await supabase
      .from('news_items')
      .insert({
        title,
        content,
        category,
        is_important,
        image_url,
        author_id: user?.id ?? 'hardcoded-admin-id'
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
