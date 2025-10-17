import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { requireAdmin } from '@/lib/admin-access'
import { notifyIssueStatusChange, notifyUserIssueStatusChange } from '@/lib/notification-helpers'

function getClient() {
  return (async () => {
    const cookieStore = await (cookies() as any)
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
          remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
        },
      }
    )
  })()
}

// PATCH /api/issues/[id]/status
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await getClient()
  
  // Check if user is authenticated and is admin
  const isAdmin = await requireAdmin(req)
  if (!isAdmin.allow) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Validate input
  const schema = z.object({
    status: z.enum(['open', 'in_progress', 'resolved']),
  })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
  }

  // Update issue status
  const { data, error } = await supabase
    .from('issue_reports')
    .update({ status: parsed.data.status })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  
  // Send notification about status change
  if (data) {
    // Notify admins about the status change
    await notifyIssueStatusChange(data.id, data.title, data.status, data.email || undefined)
    
    // Notify the user who reported the issue
    if (data.user_id) {
      await notifyUserIssueStatusChange(data.id, data.title, data.status, data.user_id)
    }
  }
  
  return NextResponse.json({ data })
}