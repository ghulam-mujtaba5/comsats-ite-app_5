import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    // Migrate to @supabase/ssr with cookie adapter
    const cookieStore = await (cookies() as any)
    const supabase = createServerClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL'] || '',
  process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '',
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: any) { cookieStore.set(name, value, options) },
          remove(name: string, options: any) { cookieStore.set(name, '', { ...options, maxAge: 0 }) },
        },
      }
    )
    
    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=callback_error`)
    }
  }

  // Check if this is a password reset callback
  const type = requestUrl.searchParams.get('type')
  if (type === 'recovery') {
    return NextResponse.redirect(`${requestUrl.origin}/auth/reset-password`)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${requestUrl.origin}${next}`)
}
