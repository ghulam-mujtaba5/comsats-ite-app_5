import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  // Use Next 15 dynamic cookies API correctly
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
  const forwardedProto = req.headers.get('x-forwarded-proto')
  const isHttps = forwardedProto === 'https' || req.nextUrl.protocol === 'https:'

  try {
    // Must be signed in already
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      return NextResponse.json({ error: 'Auth error' }, { status: 401 })
    }
    if (!user) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    }

    // Verify admin role in database
    const { data: adminUser, error: adminErr } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('user_id', user.id)
      .single()

    if (adminErr || !adminUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Issue short-lived dedicated admin cookie
    const res = NextResponse.json({ ok: true, role: (adminUser as any).role })
    res.cookies.set('ite_admin', '1', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: isHttps,
      maxAge: 60 * 60 * 2, // 2 hours
    })
    return res
  } catch (e) {
    console.error('admin elevate error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
