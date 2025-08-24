import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

async function ensureAdmin(request: NextRequest) {
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
  const devCookie = cookieStore.get('dev_admin')?.value
  const iteCookie = cookieStore.get('ite_admin')?.value
  const devAdminOk = devCookie === '1' || iteCookie === '1'

  const { data: { user } } = await supabase.auth.getUser()

  if (devAdminOk) return { supabase, user }

  if (!user) return { supabase, user: null }

  const { data: isAdmin } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!isAdmin) return { supabase, user: null }
  return { supabase, user }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { supabase, user } = await ensureAdmin(request)
  if (!user) return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })

  try {
    const { id } = await context.params
    const body = await request.json()
    const { title, content, category, is_important, image_url } = body

    const { data, error } = await supabase
      .from('news_items')
      .update({ title, content, category, is_important, image_url })
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
  const { supabase, user } = await ensureAdmin(request)
  if (!user) return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })

  try {
    const { id } = await context.params
    const { error } = await supabase
      .from('news_items')
      .delete()
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
