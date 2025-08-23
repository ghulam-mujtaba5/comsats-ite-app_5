import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { supabaseAdmin } from '@/lib/supabase-admin'
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
  // Dev fallback (non-production only): if Supabase env is missing, return mock users for local testing
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (process.env.NODE_ENV !== 'production' && (!url || !anon || !service)) {
    const now = new Date().toISOString()
    return NextResponse.json({ users: [
      {
        id: 'mock-user-1',
        email: 'student1@cuilahore.edu.pk',
        created_at: now,
        last_sign_in_at: now,
        email_confirmed_at: now,
        banned_until: null,
        user_metadata: { full_name: 'Student One' },
        app_metadata: { provider: 'email', providers: ['email'] }
      },
      {
        id: 'mock-user-2',
        email: 'student2@cuilahore.edu.pk',
        created_at: now,
        last_sign_in_at: now,
        email_confirmed_at: null,
        banned_until: null,
        user_metadata: { full_name: 'Student Two' },
        app_metadata: { provider: 'email', providers: ['email'] }
      }
    ] })
  }
  if (!url || !anon || !service) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const supabase = createRouteHandlerClient({ cookies })
  const { isAdmin } = await checkAdminAccess(supabase)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  try {
    // Get all users from Supabase Auth using service role client
    const { data, error } = await supabaseAdmin.auth.admin.listUsers()
    if (error) throw error
    return NextResponse.json({ users: data?.users || [] })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
