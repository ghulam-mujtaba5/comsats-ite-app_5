import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-access'

export async function GET(request: NextRequest) {
  const access = await requireAdmin(request)
  if (!access.allow) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  try {
    // Use the same approach as admin users API to get user data
    const { data, error } = await (supabaseAdmin as any).auth.admin.listUsers({ page: 1, perPage: 100 })
    
    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json([])
    }

    // Transform user data to match the expected email format
    const userEmails = (data?.users || []).map((user: any) => ({
      id: user.id,
      user_id: user.id,
      email: user.email,
      email_type: 'primary',
      is_verified: !!user.email_confirmed_at,
      created_at: user.created_at,
      updated_at: user.updated_at || user.created_at,
      user: {
        email: user.email,
        user_metadata: user.user_metadata
      }
    }))

    return NextResponse.json(userEmails)
  } catch (error: any) {
    console.error('Error fetching user emails:', error)
    // Return empty array as fallback instead of error
    return NextResponse.json([])
  }
}