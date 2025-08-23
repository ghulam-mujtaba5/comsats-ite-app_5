import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies: () => cookies() })
  
  try {
    // Dev hardcoded admin session via cookie (support both cookies for consistency)
    const devCookie = req.cookies.get('dev_admin')?.value
    const iteCookie = req.cookies.get('ite_admin')?.value
    if (process.env.NODE_ENV !== 'production' && (devCookie === '1' || iteCookie === '1')) {
      return NextResponse.json({ ok: true, role: 'super_admin', dev: true })
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
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Hardcoded super admin credentials for development (non-production only)
    if (process.env.NODE_ENV !== 'production' && username === 'admin@cuilahore.edu.pk' && password === 'admin123') {
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
        // secure in production environments
        secure: process.env.NODE_ENV === 'production',
        // session cookie (clears on browser close)
      })
      // Align with other admin API routes that check `ite_admin`
      res.cookies.set('ite_admin', '1', {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      })
      return res
    }

    return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 })

  } catch (error: any) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
