import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-access'

export async function GET(request: NextRequest) {
  const access = await requireAdmin(request)
  if (!access.allow) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  try {
    // Get all user emails with user details
    const { data: userEmails, error } = await supabaseAdmin
      .from('user_emails')
      .select(`
        id,
        user_id,
        email,
        email_type,
        is_verified,
        created_at,
        updated_at,
        users:auth_users(email, user_metadata)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(userEmails)
  } catch (error: any) {
    console.error('Error fetching user emails:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}