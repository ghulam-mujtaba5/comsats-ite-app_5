import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function GET() {
  const cookieStore = await (cookies() as any)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const projectRef = (() => {
    try {
      const host = new URL(supabaseUrl).host // ctix...supabase.co
      return host.split('.')[0]
    } catch {
      return ''
    }
  })()

  const usingServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

  const supabase = createServerClient(
    supabaseUrl,
    serviceKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options?: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options?: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Try a minimal read on admin_users to detect RLS/policy errors
  const probe: any = { ok: false }
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .limit(1)
    if (error) {
      probe.ok = false
      probe.error = { message: error.message, code: (error as any).code }
    } else {
      probe.ok = true
      probe.sample = (data && data.length > 0) ? 'row-visible' : 'no-rows'
    }
  } catch (e: any) {
    probe.ok = false
    probe.error = { message: e?.message || 'unknown', code: e?.code }
  }

  return NextResponse.json({
    env: {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
      projectRef,
      usingServiceKey,
    },
    adminUsersProbe: probe,
    guidance: usingServiceKey
      ? 'If adminUsersProbe.error.code is 42P17 or policies-related, production DB still has RLS/policies. Run the disable-RLS SQL on the correct Supabase project.'
      : 'Set SUPABASE_SERVICE_ROLE_KEY in your environment to ensure backend can bypass RLS.'
  })
}
