import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware to canonicalize host (www -> non-www) and enforce HTTPS in production.
// This helps search engines avoid duplicate-content issues when multiple domains point to the same site.
export function middleware(req: NextRequest) {
  const isProd = process.env.NODE_ENV === 'production'

  // Compute canonical host from env var; fall back to localhost:3000 for dev.
  let canonicalHost = 'localhost:3000'
  try {
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      canonicalHost = new URL(process.env.NEXT_PUBLIC_SITE_URL).host
    }
  } catch (_) {
    // ignore and use default
  }

  const host = req.headers.get('host') || ''
  const forwardedProto = req.headers.get('x-forwarded-proto') || ''

  // If host already matches canonical, and protocol is https (in prod), continue.
  const wantsHttps = isProd
  const isHttps = forwardedProto === 'https' || req.nextUrl.protocol === 'https'

  // If host differs from canonical, or HTTP in production, redirect to canonical HTTPS URL.
  if (host && (host !== canonicalHost || (wantsHttps && !isHttps))) {
    const url = req.nextUrl.clone()
    url.hostname = canonicalHost
    url.protocol = 'https'

    const res = NextResponse.redirect(url)
    // Strong HSTS to tell browsers to prefer HTTPS for this domain (only in production)
    if (isProd) {
      res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    }
    return res
  }

  return NextResponse.next()
}

// Keep middleware matching wide but exclude next internals and static files
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
