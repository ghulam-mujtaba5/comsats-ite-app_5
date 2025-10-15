import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-access'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireAdmin(request)
  if (!access.allow) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  // Resolve the params promise
  const { id: emailId } = await params

  try {
    // Since user_emails table may not exist, we'll work with auth users
    // For primary emails, we can't really "verify" them as they're already verified by auth
    // For now, we'll just return a success message
    return NextResponse.json({ message: 'Email verification not applicable for primary emails' })
  } catch (error: any) {
    console.error('Error verifying email:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}