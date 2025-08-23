import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

/**
 * Secure one-time super admin seeder for production.
 *
 * How to use (PROD):
 * - Set envs: SEED_SUPER_ADMIN_TOKEN, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD
 * - Send POST /api/admin/seed-super-admin with header: X-Seed-Token: <SEED_SUPER_ADMIN_TOKEN>
 * - The route will:
 *   1) Abort if an admin already exists
 *   2) Create/ensure the Supabase Auth user with the given email/password
 *   3) Insert a row into admin_users with role 'super_admin'
 * - Subsequent calls will be blocked (409) once an admin exists
 */
export async function POST(req: NextRequest) {
  const token = req.headers.get('x-seed-token') || ''
  const envToken = process.env.SEED_SUPER_ADMIN_TOKEN || ''
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@cuilahore.edu.pk'
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123'

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !service) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  if (!envToken || token !== envToken) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    // 1) Abort if an admin already exists
    const { count, error: countErr } = await supabaseAdmin
      .from('admin_users')
      .select('id', { count: 'exact', head: true })

    if (countErr) {
      console.error('admin count error', countErr)
      return NextResponse.json({ error: 'Failed to check existing admins' }, { status: 500 })
    }
    if ((count ?? 0) > 0) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 409 })
    }

    // 2) Create or fetch Supabase Auth user
    // Try to find by email first (Supabase Admin API has no direct search; list first page fallback)
    // Prefer: createUser with upsert-like behavior by catching duplicate
    const createRes = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    } as any)

    let userId: string | undefined = createRes.data?.user?.id

    if (!userId && createRes.error && /duplicate|already/i.test(createRes.error.message)) {
      // If user already exists, try to retrieve via listUsers and match email
      const list = await supabaseAdmin.auth.admin.listUsers()
      const found = list.data?.users?.find((u: any) => u.email?.toLowerCase() === email.toLowerCase())
      userId = found?.id
    }

    if (!userId) {
      console.error('create user error', createRes.error)
      return NextResponse.json({ error: 'Failed to create or find user' }, { status: 500 })
    }

    // 3) Insert admin_users row
    const { data: inserted, error: insertErr } = await supabaseAdmin
      .from('admin_users')
      .insert([{ user_id: userId, role: 'super_admin', permissions: ['all'] }])
      .select()

    if (insertErr) {
      console.error('insert admin error', insertErr)
      return NextResponse.json({ error: 'Failed to insert admin record' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, user_id: userId, admin: inserted?.[0] || null })
  } catch (e) {
    console.error('seed error', e)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
