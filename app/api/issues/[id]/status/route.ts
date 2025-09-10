import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { requireAdmin } from "@/lib/admin-access"

// PATCH /api/issues/[id]/status  { status: 'open' | 'in_progress' | 'resolved' }
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const body = await req.json()
    const status = String(body?.status || '').trim()
    const allowed = ['open', 'in_progress', 'resolved']
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const auth = await requireAdmin(req)
    if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const url = process.env['NEXT_PUBLIC_SUPABASE_URL']
    const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']

    if (!url || !serviceKey) {
      // Dev fallback
      return NextResponse.json({ message: 'Updated (dev mode)', id, status }, { status: 200 })
    }

    const supabase = createClient(url, serviceKey)
    const { data, error } = await supabase
      .from('issue_reports')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })

    return NextResponse.json({ message: 'Status updated', issue: data }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
