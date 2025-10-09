import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  // Use Next 15 dynamic cookies API correctly
  const cookieStore = await (cookies() as any)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  // user-context client (reads session from cookies)
  const userSupabase = createServerClient(
    supabaseUrl,
    anonKey,
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

  // admin/service client (bypasses RLS) - does not rely on request cookies
  const adminSupabase = createServerClient(
    supabaseUrl,
    serviceRoleKey || anonKey,
    {
      cookies: {
        get(_name: string) {
          return undefined
        },
        set(_name: string, _value: string, _opts?: any) {
          return undefined
        },
        remove(_name: string, _opts?: any) {
          return undefined
        },
      },
    }
  )

  const forwardedProto = req.headers.get('x-forwarded-proto')
  const isHttps = forwardedProto === 'https' || req.nextUrl.protocol === 'https:'

  try {
    // 1) Authenticate user from request cookies
    const { data: { user }, error: authError } = await userSupabase.auth.getUser()
    if (authError) {
      console.error('[Admin Elevate] auth.getUser error:', authError)
      return NextResponse.json({
        error: 'Auth error',
        details: authError.message,
        fix: 'Ensure auth session cookie is present and not expired',
      }, { status: 401 })
    }
    if (!user) {
      console.log('[Admin Elevate] No authenticated user in request')
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    }

    // 2) Use service-role client to check admin_users (bypass RLS to avoid recursion)
    if (!serviceRoleKey) {
      // Fallback: still try with anon key, but warn
      console.warn('[Admin Elevate] SUPABASE_SERVICE_ROLE_KEY not set; using ANON key for admin check (may fail if RLS strict)')
    }

    const { data: adminUser, error: adminErr } = await adminSupabase
      .from('admin_users')
      .select('id, role, permissions')
      .eq('user_id', user.id)
      .maybeSingle()

    if (adminErr) {
      console.error('[Admin Elevate] admin_users lookup error:', adminErr)
      // Provide more actionable messages depending on error code
      const code = (adminErr as any).code || null
      if (code === '42P17' || (adminErr.message || '').includes('infinite recursion')) {
        return NextResponse.json({
          error: 'RLS Policy Error',
          details: 'Infinite recursion detected in admin_users RLS policies',
          fix: 'Temporarily disable or simplify RLS on admin_users and re-run migrations',
          hint: 'Use SUPABASE_SERVICE_ROLE_KEY in server env or run disable-rls migration',
        }, { status: 500 })
      }

      return NextResponse.json({
        error: 'Database error checking admin status',
        details: adminErr.message,
        code,
        fix: serviceRoleKey ? 'Investigate DB logs and policies' : 'Set SUPABASE_SERVICE_ROLE_KEY in env',
      }, { status: 500 })
    }

    if (!adminUser) {
      console.log(`[Admin Elevate] User ${user.email} (${user.id}) not found in admin_users`)
      return NextResponse.json({
        error: 'Forbidden',
        details: `User ${user.email} is not registered as an admin`,
        fix: 'Add the user to admin_users or use the auto-fix diagnostic tool',
        userEmail: user.email,
        userId: user.id,
      }, { status: 403 })
    }

    // 3) Success: issue admin cookie
    console.log(`[Admin Elevate] ✅ Admin access granted for ${user.email} (role: ${adminUser.role})`)
    const res = NextResponse.json({ ok: true, role: (adminUser as any).role })
    res.cookies.set('ite_admin', '1', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: isHttps,
      maxAge: 60 * 60 * 2, // 2 hours
    })
    return res
  } catch (e: any) {
    console.error('[Admin Elevate] Unexpected error:', e)
    return NextResponse.json({
      error: 'Internal server error',
      details: e?.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? e.stack : undefined,
    }, { status: 500 })
  }
}
