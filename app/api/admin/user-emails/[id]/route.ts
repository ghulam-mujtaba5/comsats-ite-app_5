import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-access'

// Use Next.js built-in type for route parameters
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireAdmin(request)
  if (!access.allow) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  // Resolve the params promise
  const { id: emailId } = await params

  try {
    // Verify the email address
    const { error } = await supabaseAdmin
      .from('user_emails')
      .update({ 
        is_verified: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', emailId)

    if (error) throw error

    return NextResponse.json({ message: 'Email verified successfully' })
  } catch (error: any) {
    console.error('Error verifying email:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const access = await requireAdmin(request)
  if (!access.allow) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  // Resolve the params promise
  const { id: emailId } = await params

  try {
    // Delete the email address
    const { error } = await supabaseAdmin
      .from('user_emails')
      .delete()
      .eq('id', emailId)

    if (error) throw error

    return NextResponse.json({ message: 'Email removed successfully' })
  } catch (error: any) {
    console.error('Error removing email:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}