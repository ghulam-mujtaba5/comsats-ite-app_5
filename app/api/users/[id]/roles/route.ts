import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const dynamic = 'force-dynamic'

// GET - Get user's roles and permissions
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = params.id

    // Get user roles
    const { data: userRoles, error } = await supabase
      .from('user_roles')
      .select(`
        id,
        assigned_at,
        expires_at,
        role:role_id(
          id,
          name,
          display_name,
          description,
          permissions,
          is_system_role
        ),
        assigned_by_user:assigned_by(id, full_name)
      `)
      .eq('user_id', userId)

    if (error) throw error

    // Aggregate all permissions from all roles
    const allPermissions = new Set<string>()
    userRoles?.forEach((ur: any) => {
      if (ur.role?.permissions) {
        Object.keys(ur.role.permissions).forEach(perm => {
          if (ur.role.permissions[perm]) {
            allPermissions.add(perm)
          }
        })
      }
    })

    return NextResponse.json({ 
      roles: userRoles,
      permissions: Array.from(allPermissions)
    })

  } catch (error: any) {
    console.error('Get user roles error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get user roles' },
      { status: 500 }
    )
  }
}

// POST - Assign role to user (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role_id, roles:role_id(name)')
      .eq('user_id', user.id)

    const isAdmin = userRoles?.some((ur: any) => 
      ['super_admin', 'admin'].includes(ur.roles?.name)
    )

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const userId = params.id
    const body = await request.json()
    const { roleId, expiresAt } = body

    if (!roleId) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      )
    }

    // Check if role exists
    const { data: role, error: roleError } = await supabase
      .from('custom_roles')
      .select('id, name, display_name')
      .eq('id', roleId)
      .single()

    if (roleError || !role) {
      return NextResponse.json(
        { error: 'Invalid role ID' },
        { status: 404 }
      )
    }

    // Check if user already has this role
    const { data: existingAssignment } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .eq('role_id', roleId)
      .single()

    if (existingAssignment) {
      return NextResponse.json(
        { error: 'User already has this role' },
        { status: 409 }
      )
    }

    // Assign role
    const { data: assignment, error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role_id: roleId,
        assigned_by: user.id,
        expires_at: expiresAt || null
      })
      .select(`
        *,
        role:role_id(id, name, display_name),
        user:user_id(id, full_name, email)
      `)
      .single()

    if (error) throw error

    // Create notification for user
    await supabase.from('notifications').insert({
      user_id: userId,
      actor_id: user.id,
      type: 'role_assigned',
      title: 'New Role Assigned',
      message: `You have been assigned the role: ${role.display_name}`,
      link: '/profile',
      related_id: roleId,
      related_type: 'role'
    })

    // Log activity
    await supabase.rpc('log_activity', {
      p_user_id: user.id,
      p_action: 'role_assigned',
      p_resource_type: 'user_role',
      p_resource_id: assignment.id,
      p_details: { user_id: userId, role_name: role.name }
    })

    return NextResponse.json({ assignment }, { status: 201 })

  } catch (error: any) {
    console.error('Assign role error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to assign role' },
      { status: 500 }
    )
  }
}

// DELETE - Remove role from user (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role_id, roles:role_id(name)')
      .eq('user_id', user.id)

    const isAdmin = userRoles?.some((ur: any) => 
      ['super_admin', 'admin'].includes(ur.roles?.name)
    )

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const userId = params.id
    const { searchParams } = new URL(request.url)
    const roleId = searchParams.get('roleId')

    if (!roleId) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      )
    }

    // Get role info before deleting
    const { data: assignment } = await supabase
      .from('user_roles')
      .select('id, role:role_id!inner(name, display_name)')
      .eq('user_id', userId)
      .eq('role_id', roleId)
      .single()

    if (!assignment) {
      return NextResponse.json(
        { error: 'User does not have this role' },
        { status: 404 }
      )
    }

    const role = assignment.role as any

    // Remove role
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role_id', roleId)

    if (error) throw error

    // Create notification for user
    await supabase.from('notifications').insert({
      user_id: userId,
      actor_id: user.id,
      type: 'role_removed',
      title: 'Role Removed',
      message: `Your role "${role.display_name}" has been removed`,
      link: '/profile',
      related_id: roleId,
      related_type: 'role'
    })

    // Log activity
    await supabase.rpc('log_activity', {
      p_user_id: user.id,
      p_action: 'role_removed',
      p_resource_type: 'user_role',
      p_resource_id: assignment.id,
      p_details: { user_id: userId, role_name: role.name }
    })

    return NextResponse.json({ message: 'Role removed successfully' })

  } catch (error: any) {
    console.error('Remove role error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to remove role' },
      { status: 500 }
    )
  }
}
