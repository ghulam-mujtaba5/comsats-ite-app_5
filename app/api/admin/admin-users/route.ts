import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-access'

export async function GET(request: NextRequest) {
  // Dev fallback: return mock admin users without Supabase env
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (process.env.NODE_ENV !== 'production' && (!url || !anon || !service)) {
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

  const access = await requireAdmin(request)
  if (!access.allow) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  try {
    // Use service role to read all admin users regardless of RLS
    const { data: adminUsers, error } = await supabaseAdmin
      .from('admin_users')
      .select(`
        id,
        user_id,
        role,
        permissions,
        gamification_role,
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
  if (process.env.NODE_ENV !== 'production' && (!url || !anon || !service)) {
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
  if (!url || !anon || !service) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const access = await requireAdmin(request)
  if (!access.allow) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  try {
    const { userId, role, permissions, gamification_role } = await request.json()

    if (!userId || !role) {
      return NextResponse.json({ error: 'User ID and role are required' }, { status: 400 })
    }

    // Validate role
    if (!['admin', 'super_admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role. Must be admin or super_admin' }, { status: 400 })
    }

    // First, check if user exists in auth.users
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
    
    if (userError || !userData.user) {
      console.error('User not found:', userError)
      return NextResponse.json({ error: 'User not found in authentication system' }, { status: 404 })
    }

    // Use service role to upsert regardless of RLS
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .upsert({
        user_id: userId,
        role,
        permissions: permissions || [],
        gamification_role: gamification_role || null
      }, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      })
      .select()
      .single()

    if (error) {
      console.error('Database error promoting user:', error)
      throw error
    }

    console.log('✅ Successfully promoted user:', {
      user_id: userId,
      email: userData.user.email,
      role,
      permissions
    })

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error creating admin user:', error)
    
    // Handle specific error types
    const msg = (error?.message || '').toLowerCase()
    const code = error?.code || ''
    
    if (msg.includes('duplicate') || msg.includes('unique') || code === '23505') {
      return NextResponse.json({ error: 'User is already an admin' }, { status: 409 })
    }
    
    if (msg.includes('foreign key') || code === '23503') {
      return NextResponse.json({ error: 'User does not exist in the system' }, { status: 404 })
    }
    
    if (msg.includes('permission denied') || msg.includes('rls') || code === '42501') {
      return NextResponse.json({ 
        error: 'Permission denied. Database RLS policy may be blocking this operation. Check Supabase RLS policies for admin_users table.' 
      }, { status: 403 })
    }
    
    return NextResponse.json({ 
      error: error.message || 'Internal server error',
      code: error.code || 'unknown'
    }, { status: 500 })
  }
}
