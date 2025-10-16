import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60', // Cache for 2 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }

  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400, headers })
    }

    // Prefer request origin for local/dev, fallback to production
  const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
    const resetUrl = `${origin}/auth/reset-password`

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anon) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500, headers })
    }
    const supabase = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } })

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetUrl,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400, headers })
    }

    return NextResponse.json({ message: 'Password reset link sent to your email!' }, { headers })

  } catch (error: any) {
    console.error('Password reset error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}
