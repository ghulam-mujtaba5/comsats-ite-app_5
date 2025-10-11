import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const dynamic = 'force-dynamic'

// GET - Fetch all roles
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const includeSystemRoles = searchParams.get('system') === 'true'

    let query = supabase
      .from('custom_roles')
      .select('*')
      .order('name', { ascending: true })

    if (!includeSystemRoles) {
      query = query.eq('is_system_role', false)
    }

    const { data: roles, error } = await query

    if (error) throw error

    return NextResponse.json({ roles })

  } catch (error: any) {
    console.error('Fetch roles error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch roles' },
      { status: 500 }
    )
  }
}

// POST - Create custom role (super admin only)
export async function POST(request: NextRequest) {
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

    // Check if user is super admin
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role_id, roles:role_id(name)')
      .eq('user_id', user.id)

    const isSuperAdmin = userRoles?.some((ur: any) => 
      ur.roles?.name === 'super_admin'
    )

    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Forbidden - Super admin only' }, { status: 403 })
    }

    const body = await request.json()
    const { name, display_name, description, permissions } = body

    if (!name || !display_name) {
      return NextResponse.json(
        { error: 'Name and display name are required' },
        { status: 400 }
      )
    }

    // Check if role name already exists
    const { data: existingRole } = await supabase
      .from('custom_roles')
      .select('id')
      .eq('name', name)
      .single()

    if (existingRole) {
      return NextResponse.json(
        { error: 'Role name already exists' },
        { status: 409 }
      )
    }

    // Create role
    const { data: role, error } = await supabase
      .from('custom_roles')
      .insert({
        name: name.toLowerCase().replace(/\s+/g, '_'),
        display_name,
        description: description || '',
        permissions: permissions || {},
        is_system_role: false
      })
      .select()
      .single()

    if (error) throw error

    // Log activity
    await supabase.rpc('log_activity', {
      p_user_id: user.id,
      p_action: 'role_created',
      p_resource_type: 'custom_role',
      p_resource_id: role.id,
      p_details: { name, display_name, permissions }
    })

    return NextResponse.json({ role }, { status: 201 })

  } catch (error: any) {
    console.error('Create role error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create role' },
      { status: 500 }
    )
  }
}

// PATCH - Update role (super admin only)
export async function PATCH(request: NextRequest) {
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

    // Check if user is super admin
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role_id, roles:role_id(name)')
      .eq('user_id', user.id)

    const isSuperAdmin = userRoles?.some((ur: any) => 
      ur.roles?.name === 'super_admin'
    )

    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Forbidden - Super admin only' }, { status: 403 })
    }

    const body = await request.json()
    const { roleId, display_name, description, permissions } = body

    if (!roleId) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      )
    }

    // Check if role is system role
    const { data: roleCheck } = await supabase
      .from('custom_roles')
      .select('is_system_role')
      .eq('id', roleId)
      .single()

    if (roleCheck?.is_system_role) {
      return NextResponse.json(
        { error: 'Cannot modify system roles' },
        { status: 403 }
      )
    }

    const updates: any = {}
    
    if (display_name) updates.display_name = display_name
    if (description !== undefined) updates.description = description
    if (permissions) updates.permissions = permissions

    const { data: role, error } = await supabase
      .from('custom_roles')
      .update(updates)
      .eq('id', roleId)
      .select()
      .single()

    if (error) throw error

    // Log activity
    await supabase.rpc('log_activity', {
      p_user_id: user.id,
      p_action: 'role_updated',
      p_resource_type: 'custom_role',
      p_resource_id: roleId,
      p_details: updates
    })

    return NextResponse.json({ role })

  } catch (error: any) {
    console.error('Update role error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update role' },
      { status: 500 }
    )
  }
}

// DELETE - Delete custom role (super admin only)
export async function DELETE(request: NextRequest) {
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

    // Check if user is super admin
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role_id, roles:role_id(name)')
      .eq('user_id', user.id)

    const isSuperAdmin = userRoles?.some((ur: any) => 
      ur.roles?.name === 'super_admin'
    )

    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Forbidden - Super admin only' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const roleId = searchParams.get('roleId')

    if (!roleId) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      )
    }

    // Check if role is system role
    const { data: roleCheck } = await supabase
      .from('custom_roles')
      .select('is_system_role, name')
      .eq('id', roleId)
      .single()

    if (roleCheck?.is_system_role) {
      return NextResponse.json(
        { error: 'Cannot delete system roles' },
        { status: 403 }
      )
    }

    // Check if role is assigned to users
    const { count: assignmentCount } = await supabase
      .from('user_roles')
      .select('id', { count: 'exact', head: true })
      .eq('role_id', roleId)

    if (assignmentCount && assignmentCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete role. It is assigned to ${assignmentCount} user(s)` },
        { status: 409 }
      )
    }

    const { error } = await supabase
      .from('custom_roles')
      .delete()
      .eq('id', roleId)

    if (error) throw error

    // Log activity
    await supabase.rpc('log_activity', {
      p_user_id: user.id,
      p_action: 'role_deleted',
      p_resource_type: 'custom_role',
      p_resource_id: roleId,
      p_details: { role_name: roleCheck?.name }
    })

    return NextResponse.json({ message: 'Role deleted successfully' })

  } catch (error: any) {
    console.error('Delete role error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete role' },
      { status: 500 }
    )
  }
}
