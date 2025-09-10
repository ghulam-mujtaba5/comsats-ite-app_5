import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { requireAdmin } from '@/lib/admin-access'

// GET /api/news-events/events/[id]/registrations (admin only)
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const access = await requireAdmin(req)
  if (!access.allow) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await context.params
  const cookieStore = await (cookies() as any)
  const supabase = createServerClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL']!,
  process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  const { data, error } = await supabase
    .from('event_registrations')
    .select('id, user_id, student_name, student_id, registered_at')
    .eq('event_id', id)
    .order('registered_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}
