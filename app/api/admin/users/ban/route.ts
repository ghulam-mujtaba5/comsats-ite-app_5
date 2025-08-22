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

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { isAdmin } = await checkAdminAccess(supabase)
  
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  try {
    const { userId, ban } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Ban or unban user using Supabase Auth Admin API
    const updateData: any = {}
    
    if (ban) {
      // Ban user for 30 days
      const banUntil = new Date()
      banUntil.setDate(banUntil.getDate() + 30)
      updateData.banned_until = banUntil.toISOString()
    } else {
      // Unban user
      updateData.banned_until = null
    }

    const { error } = await supabase.auth.admin.updateUserById(userId, updateData)
    
    if (error) {
      throw error
    }

    return NextResponse.json({ 
      success: true, 
      message: `User ${ban ? 'banned' : 'unbanned'} successfully` 
    })
  } catch (error: any) {
    console.error('Error updating user ban status:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
