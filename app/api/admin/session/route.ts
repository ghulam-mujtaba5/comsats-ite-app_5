import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '@/lib/admin'

const COOKIE_NAME = 'ite_admin'

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)
  if (token?.value === '1') {
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ ok: false }, { status: 401 })
}

export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => ({}))
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true })
    res.cookies.set({
      name: COOKIE_NAME,
      value: '1',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    })
    return res
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set({ name: COOKIE_NAME, value: '', path: '/', httpOnly: true, maxAge: 0 })
  return res
}
