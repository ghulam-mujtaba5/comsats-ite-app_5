import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const cookieStore = await (cookies() as any)
  
  // Use service role key to bypass RLS for admin checks
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    serviceKey,
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

    const isProd = process.env.NODE_ENV === 'production'
    
    // DEVELOPMENT ONLY: Allow test admin credentials
    // In production, this should use Supabase auth or another secure method
    if (!isProd) {
      const devAdminEmail = process.env.DEV_ADMIN_EMAIL || 'admin@cuilahore.edu.pk'
      const devAdminPassword = process.env.DEV_ADMIN_PASSWORD || 'admin123'
      
      if (username === devAdminEmail && password === devAdminPassword) {
        console.warn('[SECURITY] Dev admin login used - this only works in development!')
        
        const res = NextResponse.json({
          ok: true, 
          role: 'super_admin',
          user: {
            id: 'dev-admin-id',
            email: devAdminEmail
          },
          warning: 'Development admin session'
        })
        
        // Set dev admin cookies with proper security flags
        res.cookies.set('dev_admin', '1', {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: isHttps,
          maxAge: 60 * 60 * 8, // 8 hours
        })
        res.cookies.set('ite_admin', '1', {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: isHttps,
          maxAge: 60 * 60 * 8,
        })
        return res
      }
    }

    // In production or if dev credentials don't match, return error
    return NextResponse.json({ 
      error: isProd 
        ? 'Invalid credentials' 
        : 'Invalid credentials. Use Supabase authentication or set DEV_ADMIN_EMAIL/DEV_ADMIN_PASSWORD.' 
    }, { status: 401 })

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
