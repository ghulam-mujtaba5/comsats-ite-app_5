import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ ok: false }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('user_id', user.id)
      .single()

    if (adminUser) {
      return NextResponse.json({ ok: true, role: adminUser.role })
    }

    return NextResponse.json({ ok: false }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
}
