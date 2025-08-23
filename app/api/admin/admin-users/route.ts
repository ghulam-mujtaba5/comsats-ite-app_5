import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

async function checkAdminAccess(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { isAdmin: false, user: null }
  }

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, role, permissions')
    .eq('user_id', user.id)
    .single()

  return { isAdmin: !!adminUser, user, adminUser }
}

export async function GET(request: NextRequest) {
  // Dev fallback: return mock admin users without Supabase env
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !anon || !service) {
    const now = new Date().toISOString()
    return NextResponse.json([
      {
        id: 'mock-admin-1',
        user_id: 'mock-user-1',
        role: 'admin',
        permissions: ['manage_content', 'moderate_community', 'manage_events', 'view_analytics'],
        created_at: now,
        user: {
          id: 'mock-user-1',
          email: 'student1@cuilahore.edu.pk',
          created_at: now,
          last_sign_in_at: now,
          email_confirmed_at: now,
          banned_until: null,
          user_metadata: { full_name: 'Student One' },
          app_metadata: { provider: 'email', providers: ['email'] }
        }
      }
    ])
  }

  const supabase = createRouteHandlerClient({ cookies })
  const { isAdmin } = await checkAdminAccess(supabase)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  try {
    const { data: adminUsers, error } = await supabase
      .from('admin_users')
      .select(`
        id,
        user_id,
        role,
        permissions,
        created_at
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Get user details for each admin user
    const adminUsersWithDetails = await Promise.all(
      adminUsers.map(async (adminUser) => {
        try {
          const { data: userData } = await supabaseAdmin.auth.admin.getUserById(adminUser.user_id)
          return {
            ...adminUser,
            user: userData.user
          }
        } catch (error) {
          return {
            ...adminUser,
            user: null
          }
        }
      })
    )

    return NextResponse.json(adminUsersWithDetails)
  } catch (error: any) {
    console.error('Error fetching admin users:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Dev fallback: accept and echo a mock admin user
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !anon || !service) {
    const { userId, role, permissions } = await request.json()
    if (!userId || !role) {
      return NextResponse.json({ error: 'User ID and role are required' }, { status: 400 })
    }
    const now = new Date().toISOString()
    return NextResponse.json({
      id: `mock-admin-${Math.random().toString(36).slice(2, 9)}`,
      user_id: userId,
      role,
      permissions: permissions || [],
      created_at: now,
    })
  }

  const supabase = createRouteHandlerClient({ cookies })
  const { isAdmin } = await checkAdminAccess(supabase)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  try {
    const { userId, role, permissions } = await request.json()

    if (!userId || !role) {
      return NextResponse.json({ error: 'User ID and role are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        user_id: userId,
        role,
        permissions: permissions || []
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error creating admin user:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
