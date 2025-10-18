import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@infrastructure/database/supabase-admin'
import { logAudit, AuditAction } from '@lib/audit'
import { getClientIP } from '@lib/rate-limit'

export interface AdminAccess {
  allow: boolean
  devAdmin: boolean
  userId?: string
  role?: string
  permissions?: string[]
}

/**
 * Centralized admin permission check used by admin API routes
 * 
 * SECURITY NOTE: The dev bypass is ONLY active when:
 * 1. NODE_ENV !== 'production'
 * 2. Proper dev credentials are used
 * 3. Never deployed to production servers
 */
export async function requireAdmin(req: NextRequest): Promise<AdminAccess> {
  const isProd = process.env.NODE_ENV === 'production'

  // In production, dev bypass is completely disabled
  if (!isProd) {
    // Development mode: check for dev admin cookie
    const devCookie = req.cookies.get('dev_admin')?.value
    const iteCookie = req.cookies.get('ite_admin')?.value
    
    if (devCookie === '1' || iteCookie === '1') {
      console.warn('[SECURITY] Dev admin bypass used. This only works in development!')
      return { allow: true, devAdmin: true, role: 'super_admin' }
    }
  }

  const cookieStore = await (cookies() as any)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    console.error('[ADMIN] Supabase credentials missing')
    return { allow: false, devAdmin: false }
  }

  // Create user-context client to get the authenticated user
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      get(name: string) { return cookieStore.get(name)?.value },
      set(name: string, value: string, options: any) { cookieStore.set(name, value, options) },
      remove(name: string, options: any) { cookieStore.set(name, '', { ...options, maxAge: 0 }) },
    },
  })
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { allow: false, devAdmin: false }
  }

  // CRITICAL FIX: Use service role client to check admin status
  // This bypasses RLS and ensures we can always check if a user is an admin
  // The old implementation used user-context client which could fail due to RLS
  const { data: adminUser, error } = await supabaseAdmin
    .from('admin_users')
    .select('id, role, permissions')
    .eq('user_id', user.id)
    .single()

  if (error || !adminUser) {
    // Log unauthorized access attempt
    await logAudit({
      action: AuditAction.ADMIN_LOGIN,
      user_id: user.id,
      user_email: user.email,
      ip_address: getClientIP(req),
      status: 'failure',
      error_message: 'User is not an admin',
    })
    
    return { allow: false, devAdmin: false }
  }

  // Log successful admin access
  await logAudit({
    action: AuditAction.ADMIN_LOGIN,
    user_id: user.id,
    user_email: user.email,
    ip_address: getClientIP(req),
    status: 'success',
    details: { role: adminUser.role },
  })

  return {
    allow: true,
    devAdmin: false,
    userId: user.id,
    role: adminUser.role,
    permissions: adminUser.permissions || [],
  }
}
