import { NextRequest, NextResponse } from 'next/server'

// Lightweight no-op endpoint used by client notifyFetch calls
// Allows UI to trigger a server roundtrip and show toasts without backend side effects
export async function POST(req: NextRequest) {
  // Optionally parse and echo back payload for debugging
  // const body = await req.json().catch(() => null)
  return NextResponse.json({ ok: true })
}

export async function GET() {
  return NextResponse.json({ ok: true })
}
