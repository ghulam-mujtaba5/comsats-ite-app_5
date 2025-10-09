import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

/**
 * Super admin seeder - creates the first admin user
 *
 * DEVELOPMENT (GET):
 * - Just visit http://localhost:3000/api/admin/seed-super-admin
 * - Creates: admin@cuilahore.edu.pk / Admin123!@#
 * - Only works if no admins exist yet
 * - Only works in development mode
 *
 * PRODUCTION (POST):
 * - Set envs: SEED_SUPER_ADMIN_TOKEN, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD
 * - Send POST /api/admin/seed-super-admin with header: X-Seed-Token: <SEED_SUPER_ADMIN_TOKEN>
 * - Secured with token
 */

/**
 * GET handler for development - easy admin creation
 */
export async function GET(req: NextRequest) {
  // Only allow GET in development
  const isProd = process.env.NODE_ENV === 'production'
  if (isProd) {
    return NextResponse.json({ 
      error: 'GET method not allowed in production. Use POST with token instead.' 
    }, { status: 405 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !service) {
    return NextResponse.json({ 
      error: 'Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local' 
    }, { status: 500 })
  }

  const email = 'admin@cuilahore.edu.pk'
  const password = 'Admin123!@#'

  try {
    // 1) Check if an admin already exists
    const { data: existingAdmins, error: countErr } = await supabaseAdmin
      .from('admin_users')
      .select('id, user_id')
      .limit(1)

    if (countErr) {
      console.error('Error checking existing admins:', countErr)
      return NextResponse.json({ 
        success: false,
        error: 'Failed to check existing admins',
        details: countErr.message 
      }, { status: 500 })
    }

    if (existingAdmins && existingAdmins.length > 0) {
      return NextResponse.json({ 
        success: false,
        error: 'Admin already exists',
        message: 'An admin user has already been created. Login with existing credentials or reset password.'
      }, { status: 409 })
    }

    // 2) Create or fetch Supabase Auth user
    let userId: string | undefined

    // Try to create the user
    const createRes = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    } as any)

    userId = createRes.data?.user?.id

    // If user already exists in auth, find them
    if (!userId && createRes.error && /duplicate|already/i.test(createRes.error.message)) {
      const list = await supabaseAdmin.auth.admin.listUsers()
      const found = list.data?.users?.find((u: any) => u.email?.toLowerCase() === email.toLowerCase())
      userId = found?.id
    }

    if (!userId) {
      console.error('Failed to create user:', createRes.error)
      return NextResponse.json({ 
        success: false,
        error: 'Failed to create or find user',
        details: createRes.error?.message 
      }, { status: 500 })
    }

    // 3) Insert admin_users row
    const { data: inserted, error: insertErr } = await supabaseAdmin
      .from('admin_users')
      .insert([{ 
        user_id: userId, 
        role: 'super_admin', 
        permissions: ['all'] 
      }])
      .select()
      .single()

    if (insertErr) {
      console.error('Failed to insert admin record:', insertErr)
      return NextResponse.json({ 
        success: false,
        error: 'Failed to create admin record',
        details: insertErr.message 
      }, { status: 500 })
    }

    // Success!
    return NextResponse.json({ 
      success: true,
      message: 'Super admin created successfully!',
      admin: {
        userId: userId,
        adminId: inserted.id,
        email: email,
        role: 'super_admin',
        permissions: ['all']
      },
      credentials: {
        email: email,
        password: password,
        warning: '⚠️ CHANGE THIS PASSWORD IMMEDIATELY AFTER LOGIN!'
      }
    })
  } catch (e: any) {
    console.error('Unexpected error:', e)
    return NextResponse.json({ 
      success: false,
      error: 'Unexpected error occurred',
      details: e.message 
    }, { status: 500 })
  }
}

/**
 * POST handler for production - secure admin creation with token
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
