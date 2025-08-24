import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const cookieStore = await (cookies() as any)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options)
        },
        remove(name: string, options: any) {
          cookieStore.set(name, '', { ...(options || {}), maxAge: 0 })
        },
      },
    }
  )
  const isProd = ((process.env as any).NODE_ENV as string) === 'production'
  
  try {
    // Dev hardcoded admin session via cookie (support both cookies for consistency)
    const devCookie = req.cookies.get('dev_admin')?.value
    const iteCookie = req.cookies.get('ite_admin')?.value
    if (!isProd && (devCookie === '1' || iteCookie === '1')) {
      return NextResponse.json({ ok: true, role: 'super_admin', dev: true })
    }

    // If dedicated admin elevation cookie is present, consider ok
    if (iteCookie === '1') {
      return NextResponse.json({ ok: true })
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ ok: false }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('user_id', user.id)
      .single()

    if (adminUser) {
      return NextResponse.json({ ok: true, role: adminUser.role })
    }

    return NextResponse.json({ ok: false }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const forwardedProto = req.headers.get('x-forwarded-proto')
    const isHttps = forwardedProto === 'https' || req.nextUrl.protocol === 'https:'
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Hardcoded super admin credentials for development (non-production only)
    const isProd = ((process.env as any).NODE_ENV as string) === 'production'
    if (!isProd && username === 'admin@cuilahore.edu.pk' && password === 'admin123') {
      const res = NextResponse.json({ 
        ok: true, 
        role: 'super_admin',
        user: {
          id: 'hardcoded-admin-id',
          email: 'admin@cuilahore.edu.pk'
        }
      })
      // Set dev admin cookies to persist session for AdminGuard and admin API checks
      res.cookies.set('dev_admin', '1', {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isHttps,
        // session cookie (clears on browser close)
      })
      // Align with other admin API routes that check `ite_admin`
      res.cookies.set('ite_admin', '1', {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isHttps,
      })
      return res
    }

    return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 })

  } catch (error: any) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const cookieStore = await (cookies() as any)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options)
        },
        remove(name: string, options: any) {
          cookieStore.set(name, '', { ...(options || {}), maxAge: 0 })
        },
      },
    }
  )
  const isProd = ((process.env as any).NODE_ENV as string) === 'production'
  try {
    // Best-effort sign out of Supabase auth (if a session exists)
    try {
      await supabase.auth.signOut()
    } catch {}

    const res = NextResponse.json({ ok: true })
    // Clear dev admin cookies
    res.cookies.set('dev_admin', '', { path: '/', maxAge: 0, httpOnly: true, sameSite: 'lax', secure: isProd })
    res.cookies.set('ite_admin', '', { path: '/', maxAge: 0, httpOnly: true, sameSite: 'lax', secure: isProd })
    return res
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
