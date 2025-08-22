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
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Hardcoded super admin credentials for development
    if (username === 'admin@cuilahore.edu.pk' && password === 'admin123') {
      return NextResponse.json({ 
        ok: true, 
        role: 'super_admin',
        user: {
          id: 'hardcoded-admin-id',
          email: 'admin@cuilahore.edu.pk'
        }
      })
    }

    return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 })

  } catch (error: any) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
