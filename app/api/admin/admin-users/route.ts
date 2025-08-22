import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
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
          const { data: userData } = await supabase.auth.admin.getUserById(adminUser.user_id)
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
