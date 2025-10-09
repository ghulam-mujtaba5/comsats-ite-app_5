import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { validateCUIEmail } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    // Migrate to @supabase/ssr with cookie adapter
    const cookieStore = await (cookies() as any)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
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
      // After session is established, enforce institution email for Google OAuth
      const { data: userData } = await supabase.auth.getUser()
      const email = userData.user?.email || ''
      if (!validateCUIEmail(email)) {
        // Immediately sign out invalid emails and redirect back with error
        await supabase.auth.signOut()
        const err = 'invalid_domain'
        const nextSafe = next.startsWith('/') ? next : '/'
        return NextResponse.redirect(`${requestUrl.origin}/auth?error=${err}&next=${encodeURIComponent(nextSafe)}`)
      }

      // Update user avatar from Google OAuth
      const googleAvatarUrl = userData.user?.user_metadata?.avatar_url
      if (googleAvatarUrl && userData.user) {
        await supabase.auth.updateUser({
          data: {
            ...userData.user.user_metadata,
            avatar_url: googleAvatarUrl
          }
        })
      }
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
