import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
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
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    })

    if (error) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (!data.user) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('user_id', data.user.id)
      .single()

    if (!adminUser) {
      // Sign out the user since they're not an admin
      await supabase.auth.signOut()
      return NextResponse.json({ error: 'Access denied - Admin privileges required' }, { status: 403 })
    }

    return NextResponse.json({ 
      ok: true, 
      role: adminUser.role,
      user: {
        id: data.user.id,
        email: data.user.email
      }
    })

  } catch (error: any) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
