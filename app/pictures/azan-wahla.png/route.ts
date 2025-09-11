import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function GET(request: NextRequest) {
  const origin = new URL(request.url).origin
  const target = new URL('/pictures/azan1.png', origin)
  return NextResponse.redirect(target)
}
