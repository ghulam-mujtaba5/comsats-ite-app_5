import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireAdmin } from '@/lib/admin-access'

export async function GET(req: NextRequest) {
  const access = await requireAdmin(req)
  if (!access.allow) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const status = (searchParams.get('status') || 'pending').toLowerCase()
    const allowed = ['pending', 'approved', 'rejected']
    const statusFilter = allowed.includes(status) ? status : 'pending'
    // Supabase only
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('status', statusFilter)
      .order('created_at', { ascending: false })
      .limit(200)
    if (error) throw error
    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unknown error' }, { status: 400 })
  }
}

export async function POST(req: NextRequest) {
  const access = await requireAdmin(req)
  if (!access.allow) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  try {
    const { id, status } = await req.json()
    if (!id || !status || !['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    const { error } = await supabaseAdmin.from('reviews').update({ status }).eq('id', id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unknown error' }, { status: 400 })
  }
}
