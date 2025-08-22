import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Stable health-check style setup endpoint.
// Your schema is created via Supabase SQL Editor; this simply verifies the app is running.
export async function GET() {
  return NextResponse.json({ ok: true, message: 'Setup not required. Schema managed via Supabase SQL.' })
}
