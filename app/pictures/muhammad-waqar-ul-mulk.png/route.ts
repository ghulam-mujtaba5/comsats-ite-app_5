import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function GET(request: NextRequest) {
  const origin = new URL(request.url).origin
  const target = new URL('/pictures/waqar.png', origin)
  return NextResponse.redirect(target)
}
