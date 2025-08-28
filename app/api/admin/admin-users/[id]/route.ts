import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-access'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const access = await requireAdmin(request)
  if (!access.allow) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  try {
    const { error } = await supabaseAdmin
      .from('admin_users')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Admin privileges revoked successfully' })
  } catch (error: any) {
    console.error('Error revoking admin privileges:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const access = await requireAdmin(request)
  if (!access.allow) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const { role, permissions } = body as { role?: string; permissions?: string[] }

    if (!role && !permissions) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const update: any = {}
    if (role) update.role = role
    if (permissions) update.permissions = permissions

    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .update(update)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error updating admin user:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
