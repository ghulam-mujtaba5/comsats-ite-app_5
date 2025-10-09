import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function GET(request: NextRequest) {
  const origin = new URL(request.url).origin
  const target = new URL('/new-logo.svg', origin)
  return NextResponse.redirect(target)
}
