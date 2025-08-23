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
