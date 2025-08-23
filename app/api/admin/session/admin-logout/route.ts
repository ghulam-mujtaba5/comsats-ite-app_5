import { NextRequest, NextResponse } from 'next/server'

export async function POST(_req: NextRequest) {
  const isProd = ((process.env as any).NODE_ENV as string) === 'production'
  const res = NextResponse.json({ ok: true })
  // Clear only the admin elevation cookie, keep user auth session intact
  res.cookies.set('ite_admin', '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
  })
  return res
}
