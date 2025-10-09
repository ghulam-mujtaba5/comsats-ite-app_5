import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  // Use Next 15 dynamic cookies API correctly
  const cookieStore = await (cookies() as any)
  
  // Use service role key to bypass RLS for admin checks
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  
  // Check for missing environment variables
  if (!supabaseUrl) {
    console.error('[Admin Elevate] Missing NEXT_PUBLIC_SUPABASE_URL')
    return NextResponse.json({ 
      error: 'Configuration error', 
      details: 'NEXT_PUBLIC_SUPABASE_URL is not set',
      fix: 'Add NEXT_PUBLIC_SUPABASE_URL to .env.local' 
    }, { status: 500 })
  }
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[Admin Elevate] Missing SUPABASE_SERVICE_ROLE_KEY - falling back to ANON_KEY')
    console.warn('[Admin Elevate] This may cause RLS policy issues. Add SUPABASE_SERVICE_ROLE_KEY to .env.local')
  }
  
  const supabase = createServerClient(
    supabaseUrl,
    serviceKey,
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
      console.error('[Admin Elevate] Auth error:', error.message)
      return NextResponse.json({ 
        error: 'Authentication error', 
        details: error.message,
        fix: 'Please sign out and sign in again' 
      }, { status: 401 })
    }
    if (!user) {
      console.log('[Admin Elevate] No user in session')
      return NextResponse.json({ 
        error: 'Not signed in',
        details: 'No authenticated session found',
        fix: 'Please sign in first at /auth' 
      }, { status: 401 })
    }

    console.log(`[Admin Elevate] Checking admin status for user: ${user.email} (${user.id})`)

    // Use raw SQL query to completely bypass RLS policies (even broken ones)
    // Service role key should bypass RLS, but we'll use rpc() for absolute certainty
    let adminUser: any = null
    let adminErr: any = null
    
    try {
      // Try direct query first (should work with service role)
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, role')
        .eq('user_id', user.id)
        .maybeSingle()
      
      if (error) {
        // If RLS is blocking, try raw SQL via rpc
        console.warn('[Admin Elevate] Direct query failed, trying raw SQL...')
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_admin_user', { 
          p_user_id: user.id 
        })
        
        if (rpcError) {
          // If rpc also fails, it's a real error
          adminErr = rpcError
        } else {
          adminUser = rpcData
        }
      } else {
        adminUser = data
      }
    } catch (e: any) {
      console.error('[Admin Elevate] Query error:', e)
      adminErr = e
    }

    if (adminErr) {
      console.error('[Admin Elevate] Database error:', adminErr.message, adminErr.code)
      
      if (adminErr.code === 'PGRST116') {
        // No rows returned - user is not an admin
        return NextResponse.json({ 
          error: 'Access denied - Not an admin',
          details: `User ${user.email} is not in the admin_users table`,
          fix: 'Go to /admin/diagnostic and click Auto-Fix (Dev Only)',
          userEmail: user.email,
          userId: user.id
        }, { status: 403 })
      }
      
      // Check if it's the infinite recursion error
      if (adminErr.code === '42P17' || adminErr.message?.includes('infinite recursion')) {
        return NextResponse.json({ 
          error: 'RLS Policy Error',
          details: 'Infinite recursion in admin_users RLS policies',
          fix: 'Run the SQL fix in Supabase Dashboard (see fix-rls-browser.html)',
          hint: 'Or go to /admin/diagnostic for Auto-Fix',
          sqlFix: 'Open fix-rls-browser.html in your project folder',
          userEmail: user.email,
          userId: user.id
        }, { status: 500 })
      }
      
      return NextResponse.json({ 
        error: 'Database error checking admin status',
        details: `${adminErr.message} (Code: ${adminErr.code})`,
        fix: 'Check database connection and RLS policies',
        hint: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Using service role key' : 'Using anon key - may have RLS issues'
      }, { status: 500 })
    }
    
    if (!adminUser) {
      console.log(`[Admin Elevate] User ${user.email} not found in admin_users table`)
      return NextResponse.json({ 
        error: 'Access denied - Not an admin',
        details: `User ${user.email} is not registered as an admin`,
        fix: 'Go to /admin/diagnostic and click Auto-Fix (Dev Only)',
        userEmail: user.email,
        userId: user.id
      }, { status: 403 })
    }
    
    console.log(`[Admin Elevate] ✅ Admin access granted for ${user.email} (role: ${adminUser.role})`)

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
  } catch (e: any) {
    console.error('[Admin Elevate] Unexpected error:', e)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: e.message || 'Unknown error occurred',
      stack: process.env.NODE_ENV === 'development' ? e.stack : undefined,
      fix: 'Check server logs for more details'
    }, { status: 500 })
  }
}
