import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// PATCH /api/issues/[id]/status  { status: 'open' | 'in_progress' | 'resolved' }
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await req.json()
    const status = String(body?.status || '').trim()
    const allowed = ['open', 'in_progress', 'resolved']
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Admin check (same pattern as other admin routes)
    let isAdmin = false
    const devCookie = req.cookies.get('dev_admin')?.value
    const iteCookie = req.cookies.get('ite_admin')?.value
    isAdmin = devCookie === '1' || iteCookie === '1'

    if (!isAdmin) {
      const rhc = createRouteHandlerClient({ cookies })
      const { data: { user } } = await rhc.auth.getUser()
      if (user) {
        const { data: adminUser } = await rhc
          .from('admin_users')
          .select('id')
          .eq('user_id', user.id)
          .single()
        isAdmin = !!adminUser
      }
    }

    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

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
