import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-access'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const access = await requireAdmin(request)
  if (!access.allow) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  try {
    const { id } = await context.params
    // Delete user from Supabase Auth using service role
    const { error } = await (supabaseAdmin as any).auth.admin.deleteUser(id)
    if (error) throw error

    // Also cleanup from admin_users table if present
    const { error: adminUsersError } = await supabaseAdmin
      .from('admin_users')
      .delete()
      .eq('user_id', id)

    if (adminUsersError) {
      // Log but don't fail the whole request
      console.warn('Cleanup admin_users failed for deleted user', id, adminUsersError)
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
