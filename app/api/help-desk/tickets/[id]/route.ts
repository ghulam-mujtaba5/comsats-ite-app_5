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

// GET /api/help-desk/tickets/[id] -> ticket with responses
export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const supabase = await getClient()
  const { id } = await context.params

  const { data, error } = await supabase
    .from('help_desk_tickets')
    .select('*, help_desk_responses(*)')
    .eq('id', id)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ data })
}

// PATCH /api/help-desk/tickets/[id] (admin only)
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const access = await requireAdmin(req)
  if (!access.allow) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await context.params
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }
  
  const supabase = await getClient()

  const schema = z.object({
    status: z.enum(['open','in-progress','resolved','closed']).optional(),
    priority: z.enum(['low','medium','high']).optional(),
    assigned_to: z.string().uuid().nullable().optional(),
    title: z.string().min(3).optional(),
    description: z.string().min(3).optional(),
    category: z.string().min(2).optional(),
  })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400, headers })
  }

  const { data, error } = await supabase
    .from('help_desk_tickets')
    .update(parsed.data)
    .eq('id', id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400, headers })
  return NextResponse.json({ data }, { headers })
}

// DELETE /api/help-desk/tickets/[id] (admin only)
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }
  
  const access = await requireAdmin(req)
  if (!access.allow) return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers })

  const { id } = await context.params
  const supabase = await getClient()

  // delete responses then ticket (if RLS allows; otherwise rely on FK cascade if set)
  await supabase.from('help_desk_responses').delete().eq('ticket_id', id)
  const { error } = await supabase.from('help_desk_tickets').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400, headers })
  return NextResponse.json({ ok: true }, { headers })
}
