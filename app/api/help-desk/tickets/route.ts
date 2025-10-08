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



// GET /api/help-desk/tickets
// - Default: return current user's tickets
// - If admin=1: admin-only listing with optional status/category filters
export async function GET(req: NextRequest) {
  const supabase = await getClient()
  const url = new URL(req.url)
  const adminFlag = url.searchParams.get('admin') === '1'

  if (adminFlag) {
    const access = await requireAdmin(req)
    if (!access.allow) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    let query = supabase
      .from('help_desk_tickets')
      .select('*, help_desk_responses(count)')
      .order('created_at', { ascending: false })

    const status = url.searchParams.get('status')
    const category = url.searchParams.get('category')
    const campusId = url.searchParams.get('campus_id')

    if (status) query = query.eq('status', status)
    if (category) query = query.eq('category', category)
    if (campusId) query = query.eq('campus_id', campusId)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ data })
  }

  // user own tickets
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('help_desk_tickets')
    .select('*, help_desk_responses(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

// POST /api/help-desk/tickets
export async function POST(req: NextRequest) {
  const supabase = await getClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const schema = z.object({
    title: z.string().min(3),
    description: z.string().min(3),
    category: z.string().min(2),
    priority: z.enum(['low','medium','high']).optional(),
    student_name: z.string(),
    student_id: z.string(),
  })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
  }

  const payload: any = {
    title: parsed.data.title,
    description: parsed.data.description,
    category: parsed.data.category,
    priority: parsed.data.priority ?? 'medium',
    student_name: parsed.data.student_name,
    student_id: parsed.data.student_id,
    user_id: user.id,
    status: 'open',
  }

  const { data, error } = await supabase
    .from('help_desk_tickets')
    .insert(payload)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data }, { status: 201 })
}
