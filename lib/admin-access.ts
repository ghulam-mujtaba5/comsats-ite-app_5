import type { NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export interface AdminAccess {
  allow: boolean
  devAdmin: boolean
  userId?: string
  role?: string
}

// Centralized admin permission check used by admin API routes
export async function requireAdmin(req: NextRequest): Promise<AdminAccess> {
  const isProd = (process.env.NODE_ENV as string) === 'production'

  // Dev cookie bypass only in non-production
  const devCookie = req.cookies.get('dev_admin')?.value
  const iteCookie = req.cookies.get('ite_admin')?.value
  const devAdmin = !isProd && (devCookie === '1' || iteCookie === '1')
  if (devAdmin) return { allow: true, devAdmin: true }

  const cookieStore = await (cookies() as any)
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore } as any)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { allow: false, devAdmin: false }

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, role')
    .eq('user_id', user.id)
    .single()

  if (adminUser) {
    return { allow: true, devAdmin: false, userId: user.id, role: (adminUser as any).role }
  }
  return { allow: false, devAdmin: false }
}
