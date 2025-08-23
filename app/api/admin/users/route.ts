import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireAdmin } from '@/lib/admin-access'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') || '').trim().toLowerCase()
  const status = (searchParams.get('status') || 'all').toLowerCase()
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get('perPage') || '20', 10)))
  const sort = (searchParams.get('sort') || 'created_at') as 'created_at' | 'email' | 'last_sign_in_at'
  const dir = ((searchParams.get('dir') || 'desc').toLowerCase() === 'asc') ? 'asc' : 'desc'
  // Dev fallback (non-production only): if Supabase env is missing, return mock users for local testing
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (process.env.NODE_ENV !== 'production' && (!url || !anon || !service)) {
    const now = new Date().toISOString()
    return NextResponse.json({ users: [
      {
        id: 'mock-user-1',
        email: 'student1@cuilahore.edu.pk',
        created_at: now,
        last_sign_in_at: now,
        email_confirmed_at: now,
        banned_until: null,
        user_metadata: { full_name: 'Student One' },
        app_metadata: { provider: 'email', providers: ['email'] }
      },
      {
        id: 'mock-user-2',
        email: 'student2@cuilahore.edu.pk',
        created_at: now,
        last_sign_in_at: now,
        email_confirmed_at: null,
        banned_until: null,
        user_metadata: { full_name: 'Student Two' },
        app_metadata: { provider: 'email', providers: ['email'] }
      }
    ] })
  }
  if (!url || !anon || !service) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const access = await requireAdmin(request)
  if (!access.allow) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  try {
    // Get users page from Supabase Auth using service role client
    const { data, error } = await (supabaseAdmin as any).auth.admin.listUsers({ page, perPage })
    if (error) throw error
    let users = (data?.users || []) as any[]

    // Filter by query
    if (q) {
      users = users.filter((u) => {
        const email = (u.email || '').toLowerCase()
        const name = (u.user_metadata?.full_name || '').toLowerCase()
        return email.includes(q) || name.includes(q)
      })
    }

    // Filter by status
    if (status !== 'all') {
      users = users.filter((u) => {
        const banned = !!u.banned_until
        const confirmed = !!u.email_confirmed_at
        if (status === 'active') return !banned && confirmed
        if (status === 'banned') return banned
        if (status === 'unconfirmed') return !confirmed
        return true
      })
    }

    // Sort
    users.sort((a, b) => {
      const getVal = (x: any) => {
        if (sort === 'email') return (x.email || '').toLowerCase()
        const v = x[sort]
        return v ? new Date(v).getTime() : 0
      }
      const av = getVal(a)
      const bv = getVal(b)
      if (av === bv) return 0
      const res = av < bv ? -1 : 1
      return dir === 'asc' ? res : -res
    })

    // hasMore heuristic: if returned users length == perPage, assume there may be more
    const hasMore = (data?.users?.length || 0) === perPage
    return NextResponse.json({ users, page, perPage, hasMore })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
