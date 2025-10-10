import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }

  const { email } = await req.json().catch(() => ({})) as { email?: string }
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400, headers })
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) {
    return NextResponse.json({ error: 'Auth service unavailable' }, { status: 500, headers })
  }
  try {
    const resp = await fetch(`${url}/auth/v1/recover`, {
      method: 'POST',
      headers: {
        'apikey': anon,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, redirect_to: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'}/auth` })
    })
    if (!resp.ok) {
      const txt = await resp.text()
      return NextResponse.json({ error: 'Failed to send verification email', detail: txt }, { status: 500, headers })
    }
    return NextResponse.json({ message: 'Verification email sent' }, { headers })
  } catch (e: any) {
    return NextResponse.json({ error: 'Network error when sending email' }, { status: 500, headers })
  }
}
