import { createServerClient } from '@supabase/ssr'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-access'

export async function GET(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30', // Cache for 1 minute, stale for 30 sec (optimized for free tier)
    'CDN-Cache-Control': 'public, s-maxage=60',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=60'
  }

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  // Dev/mock fallback helper (non-production only)
  const devFallback = () => {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503, headers })
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
    return NextResponse.json(sample, { headers: { ...headers, 'X-Mock-Data': '1' } })
  }

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    // In dev, only fallback if we truly cannot talk to Supabase (no URL or neither anon nor service key)
    if (process.env.NODE_ENV !== 'production' && (!url || (!anon && !serviceKey))) {
      return devFallback()
    }

    const cookieStore = await (cookies() as any)
    // Prefer service role for server-side read if available; else use anon server client
    const supabase = serviceKey
      ? createServiceClient(url || '', serviceKey)
      : createServerClient(url || '', anon || '', {
          cookies: {
            get(name: string) { return cookieStore.get(name)?.value },
            set(name: string, value: string, options: any) { cookieStore.set(name, value, options) },
            remove(name: string, options: any) { cookieStore.set(name, '', { ...options, maxAge: 0 }) },
          },
        })

    // Attempt with author_name first; if column missing, we'll retry without it
    let selectColumns = 'id,title,content,category,is_important,image_url,published_at,author_name'
    let query = supabase
      .from('news_items')
      .select(selectColumns)
      .order('published_at', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }

    let { data, error } = await query
    if (error) {
      const msg = (error as any)?.message || ''
      const missingColumn = typeof msg === 'string' && msg.toLowerCase().includes('author_name')
      if (missingColumn) {
        // Retry without author_name
        const retry = await supabase
          .from('news_items')
          .select('id,title,content,category,is_important,image_url,published_at')
          .order('published_at', { ascending: false })
        data = retry.data as any
        error = retry.error as any
      }
    }
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
      // No rows found: return empty list rather than mock fallback
      return NextResponse.json([], { headers })
    }

    return NextResponse.json(mapped, { headers })
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
    // Dev fallback (non-production only): if public env is not configured AND no service key, echo back a mock created item
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (process.env.NODE_ENV !== 'production' && (!url || !anon) && !serviceKey) {
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

    const payload: any = {
      title,
      content,
      category,
      is_important,
      image_url,
    }
    if (access.userId) payload.author_id = access.userId

    // Use service-role for writes if available to bypass RLS safely (endpoint still gated by requireAdmin)
    const writeClient = serviceKey
      ? createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', serviceKey)
      : supabase

    const { data, error } = await writeClient
      .from('news_items')
      .insert(payload)
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