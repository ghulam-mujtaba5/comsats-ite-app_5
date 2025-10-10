import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { requireAdmin } from '@/lib/admin-access'

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

// GET /api/help-desk/responses?ticket_id=uuid
export async function GET(req: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }

  const supabase = await getClient()
  const url = new URL(req.url)
  const ticketId = url.searchParams.get('ticket_id')
  if (!ticketId) return NextResponse.json({ error: 'ticket_id is required' }, { status: 400, headers })

  const { data, error } = await supabase
    .from('help_desk_responses')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400, headers })
  return NextResponse.json({ data }, { headers })
}

// POST /api/help-desk/responses
// user can respond to their own ticket; admin can respond to any ticket
export async function POST(req: NextRequest) {
  const supabase = await getClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const schema = z.object({
    ticket_id: z.string().uuid(),
    message: z.string().min(1),
  })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
  }

  // check ticket ownership or admin
  const access = await requireAdmin(req)
  if (!access.allow) {
    const { data: ticket } = await supabase
      .from('help_desk_tickets')
      .select('id, user_id')
      .eq('id', parsed.data.ticket_id)
      .single()
    if (!ticket || (ticket as any).user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const payload: any = {
    ticket_id: parsed.data.ticket_id,
    message: parsed.data.message,
    author_name: access.allow ? 'admin' : 'student',
    author_role: access.allow ? 'admin' : 'student',
    user_id: user.id,
  }

  const { data, error } = await supabase
    .from('help_desk_responses')
    .insert(payload)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data }, { status: 201 })
}