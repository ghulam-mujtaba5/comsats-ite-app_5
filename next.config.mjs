/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        // Apply HSTS in production to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
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
            key: 'Permissions-Policy',
            // Disallow unnecessary APIs; allow geolocation & camera explicitly if needed later
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
          },
          {
            key: 'X-Robots-Tag',
            // Let per-page meta robots override (admin pages specify noindex). This is a broad allow.
            value: 'index, follow'
          },
        ],
      },
    ]
  },
}

export default nextConfig
