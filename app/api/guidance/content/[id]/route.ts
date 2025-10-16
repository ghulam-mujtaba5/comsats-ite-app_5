import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-access'

// Admin authorization centralized via requireAdmin

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30', // Cache for 1 minute, stale for 30 sec (optimized for free tier)
    'CDN-Cache-Control': 'public, s-maxage=60',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=60'
  }
  
  try {
    const auth = await requireAdmin(req)
    if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })

    const { id } = await context.params
    const body = await req.json()

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
    const { data, error } = await supabase
      .from('guidance_content')
      .update({
        title: body.title,
        description: body.description,
        category: body.category,
        content: body.content,
        is_important: body.is_important,
        is_published: body.is_published,
      })
      .eq('id', id)
      .select('*')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400, headers })

    return NextResponse.json(data, { headers })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30', // Cache for 1 minute, stale for 30 sec (optimized for free tier)
    'CDN-Cache-Control': 'public, s-maxage=60',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=60'
  }
  
  try {
    const auth = await requireAdmin(req)
    if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })

    const { id } = await context.params
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
    const { error } = await supabase
      .from('guidance_content')
      .delete()
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 400, headers })

    return NextResponse.json({ ok: true }, { headers })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}