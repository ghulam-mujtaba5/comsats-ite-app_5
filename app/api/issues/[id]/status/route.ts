import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { requireAdmin } from "@/lib/admin-access"
import { notifyIssueResolved } from "@/lib/notification-helpers"

// PATCH /api/issues/[id]/status  { status: 'open' | 'in_progress' | 'resolved' }
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await req.json()
    const status = String(body?.status || '').trim()
    const allowed = ['open', 'in_progress', 'resolved']
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const auth = await requireAdmin(req)
    if (!auth.allow) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceKey) {
      // Dev fallback
      return NextResponse.json({ message: 'Updated (dev mode)', id, status }, { status: 200 })
    }

    // Get the current issue details before updating
    const supabase = createClient(url, serviceKey)
    const { data: currentIssue, error: fetchError } = await supabase
      .from('issue_reports')
      .select('title')
      .eq('id', id)
      .single()

    if (fetchError) return NextResponse.json({ error: 'Failed to fetch issue' }, { status: 500 })

    const { data, error } = await supabase
      .from('issue_reports')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })

    // Send notification when issue is resolved
    if (status === 'resolved' && data) {
      const { data: { user } } = await supabase.auth.getUser()
      const resolverName = user?.email ? user.email.split('@')[0] : 'Admin'
      await notifyIssueResolved(id, currentIssue.title, resolverName)
    }

    return NextResponse.json({ message: 'Status updated', issue: data }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}