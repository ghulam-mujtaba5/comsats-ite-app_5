import withPWA from 'next-pwa'

const nextPWA = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development' || process.env.NEXT_OUTPUT === 'export',
  register: true,
  skipWaiting: true,
  sw: '/sw.js',
})

const isExport = process.env.NEXT_OUTPUT === 'export'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export when requested via env (used by CI to deploy to OCI Object Storage)
  ...(isExport ? { output: 'export' } : {}),
  // Enable standalone output for Docker deployments
  output: isExport ? 'export' : 'standalone',
  eslint: {
    // Ignore during builds for deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during builds for deployment
    ignoreBuildErrors: true,
  },
  images: {
    // Enable optimization for better performance
    // For static export, images must be unoptimized
    unoptimized: isExport ? true : false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
    // Optimize image quality and format to reduce data transfer
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 30,
    // Limit maximum image size to reduce data transfer
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
  },
  // Enable experimental optimizations for better Core Web Vitals
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-*',
      'recharts'
    ],
    // Enable PWA support
    nextScriptWorkers: true,
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  async headers() {
    // Skip headers for static export as they're not supported
    if (isExport) return []
    
    const isProd = process.env.NODE_ENV === 'production'
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: isProd ? 'max-age=63072000; includeSubDomains; preload' : 'max-age=0',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://www.google-analytics.com",
              "frame-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
            ].join('; ')
          }
        ]
      },
      {
        // Additional headers for API routes - reduced caching for free tier
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=30, s-maxage=60',
          },
        ],
      },
      {
        // Performance headers for static assets - optimized for free tier
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, immutable',
          },
          {
            key: 'Timing-Allow-Origin',
            value: '*',
          },
        ],
      },
      {
        // PWA headers for service worker
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache',
          },
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
        ],
      },
      {
        // PWA headers for manifest
        source: '/manifest.webmanifest',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600', // 1 hour
          },
        ],
      },
    ]
  },
}

export default nextPWA(nextConfig)