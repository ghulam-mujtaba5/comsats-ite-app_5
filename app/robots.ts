import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
  const isProd = process.env.NODE_ENV === "production"

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/admin/",
          "/api/",
          "/auth/reset-password/",
        ],
      },
    ],
    sitemap: isProd ? `${siteUrl}/sitemap.xml` : undefined,
    host: isProd ? siteUrl : undefined,
  }
}
