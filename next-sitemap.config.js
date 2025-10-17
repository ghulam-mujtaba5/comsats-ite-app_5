/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site',
  generateRobotsTxt: true,
  exclude: [
    '/admin/*',
    '/api/admin/*',
    '/profile/*',
    '/settings/*',
    '/search/*',
    '/*?*',
    '/auth/*',
    '/auth/reset-password/*',
    '/admin/*',
    '/api/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: '/admin/',
      },
      {
        userAgent: '*',
        disallow: '/api/admin/',
      },
      {
        userAgent: '*',
        disallow: '/profile/',
      },
      {
        userAgent: '*',
        disallow: '/settings/',
      },
      {
        userAgent: '*',
        disallow: '/search/',
      },
      {
        userAgent: '*',
        disallow: '/*?*',
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'}/sitemap.xml`,
    ],
  },
}