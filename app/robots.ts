import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
  // Use just the hostname for the Host directive per robots.txt spec
  let hostName: string | undefined
  try {
    hostName = new URL(siteUrl).host
  } catch {
    hostName = undefined
  }
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
          "/profile/",
          "/dashboard/",
        ],
      },
    ],
    sitemap: isProd ? `${siteUrl}/sitemap.xml` : undefined,
    host: isProd ? hostName : undefined,
  }
}
