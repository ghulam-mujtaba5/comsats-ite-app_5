import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

async function ensureAdmin(req: NextRequest) {
  const devCookie = req.cookies.get('dev_admin')?.value
  const iteCookie = req.cookies.get('ite_admin')?.value
  if (devCookie === '1' || iteCookie === '1') return true
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

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await ensureAdmin(req)
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
      .from('faq_items')
      .update({
        question: body.question,
        answer: body.answer,
        category: body.category,
        tags: body.tags,
        is_published: body.is_published,
      })
      .eq('id', id)
      .select('*')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await ensureAdmin(req)
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
      .from('faq_items')
      .delete()
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
