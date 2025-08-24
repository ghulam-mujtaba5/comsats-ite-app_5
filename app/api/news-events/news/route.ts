import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-access'

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

    const cookieStore = await (cookies() as any)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: any) { cookieStore.set(name, value, options) },
          remove(name: string, options: any) { cookieStore.set(name, '', { ...options, maxAge: 0 }) },
        },
      }
    )
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
    if (error) {
      return devFallback()
    }

    let mapped = (data || []).map((n: any) => ({
      id: n.id,
      title: n.title,
      content: n.content,
      category: n.category,
      publishedAt: n.published_at,
      author: n.author_name ?? 'Admin',
      imageUrl: n.image_url ?? undefined,
      isImportant: !!n.is_important,
    }))

    // Compatibility fallback: if the newer 'news_items' table is empty,
    // read from legacy 'news' table (used by /api/news) so published items show up.
    if (!mapped.length) {
      const { data: legacy, error: legacyErr } = await supabase
        .from('news')
        .select('id,title,content,image_url,status,published_at,created_at,updated_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      if (!legacyErr && legacy && legacy.length) {
        mapped = legacy.map((n: any) => ({
          id: n.id,
          title: n.title,
          content: n.content,
          // default to 'announcement' if no category
          category: 'announcement',
          publishedAt: n.published_at,
          author: 'Admin',
          imageUrl: n.image_url ?? undefined,
          isImportant: false,
        }))
      }
    }

    if (!mapped.length) {
      return devFallback()
    }

    return NextResponse.json(mapped)
  } catch {
    return devFallback()
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await (cookies() as any)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: any) { cookieStore.set(name, value, options) },
        remove(name: string, options: any) { cookieStore.set(name, '', { ...options, maxAge: 0 }) },
      },
    }
  )
  
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
    // Centralized admin access check
    const access = await requireAdmin(request)
    if (!access.allow) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // Validate input
    const schema = z.object({
      title: z.string().min(3),
      content: z.string().min(3),
      category: z.string().min(2),
      is_important: z.boolean().optional(),
      image_url: z.string().url().nullable().optional(),
    })
    const parsed = schema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
    }
    const { title, content, category, is_important, image_url } = parsed.data as any

    const { data, error } = await supabase
      .from('news_items')
      .insert({
        title,
        content,
        category,
        is_important,
        image_url,
        author_id: access.userId ?? 'hardcoded-admin-id'
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
