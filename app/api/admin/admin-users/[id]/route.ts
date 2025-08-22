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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { isAdmin } = await checkAdminAccess(supabase)
  
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  try {
    const { error } = await supabase
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
