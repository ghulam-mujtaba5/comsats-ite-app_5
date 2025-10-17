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

// GET /api/issues/[id]/responses
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60', // Cache for 2 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }

  const { id } = await context.params;
  const supabase = await getClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })

  // Check if user has access to this issue (either owns it or is admin)
  const { data: issue, error: issueError } = await supabase
    .from('issue_reports')
    .select('id, email')
    .eq('id', id)
    .single()

  if (issueError) return NextResponse.json({ error: issueError.message }, { status: 400, headers })
  
  // Check if user is admin or owns the issue
  const isAdmin = await requireAdmin(req)
  const isOwner = issue.email && user.email === issue.email
  
  if (!isAdmin.allow && !isOwner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers })
  }

  const { data, error } = await supabase
    .from('issue_responses')
    .select(`
      id,
      message,
      is_admin,
      created_at,
      user:auth_users(email)
    `)
    .eq('issue_id', id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400, headers })
  return NextResponse.json({ responses: data || [] }, { headers })
}

// POST /api/issues/[id]/responses
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await getClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Validate input
  const schema = z.object({
    message: z.string().min(1, 'Message is required'),
  })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
  }

  // Check if user has access to this issue (either owns it or is admin)
  const { data: issue, error: issueError } = await supabase
    .from('issue_reports')
    .select('id, email')
    .eq('id', id)
    .single()

  if (issueError) return NextResponse.json({ error: issueError.message }, { status: 400 })
  
  // Check if user is admin or owns the issue
  const isAdmin = await requireAdmin(req)
  const isOwner = issue.email && user.email === issue.email
  
  if (!isAdmin.allow && !isOwner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Insert response
  const payload = {
    issue_id: id,
    user_id: user.id,
    message: parsed.data.message,
    is_admin: isAdmin.allow,
  }

  const { data, error } = await supabase
    .from('issue_responses')
    .insert(payload)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data }, { status: 201 })
}