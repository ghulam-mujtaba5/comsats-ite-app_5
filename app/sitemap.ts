import type { MetadataRoute } from "next"

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const now = new Date()

  const staticPaths: Array<{ path: string; changeFrequency?: MetadataRoute.Sitemap[0]["changeFrequency"]; priority?: number }> = [
    { path: "/", changeFrequency: "daily", priority: 1 },
    { path: "/about", changeFrequency: "yearly", priority: 0.5 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
    { path: "/support", changeFrequency: "monthly", priority: 0.6 },
    { path: "/contribute", changeFrequency: "yearly", priority: 0.5 },
    { path: "/guidance", changeFrequency: "monthly", priority: 0.6 },
    { path: "/help", changeFrequency: "yearly", priority: 0.4 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.5 },
    { path: "/news", changeFrequency: "weekly", priority: 0.6 },
    { path: "/news-events", changeFrequency: "weekly", priority: 0.6 },
    { path: "/past-papers", changeFrequency: "monthly", priority: 0.7 },
    { path: "/gpa-calculator", changeFrequency: "yearly", priority: 0.7 },
    { path: "/gpa-calculator/semester", changeFrequency: "yearly", priority: 0.65 },
    { path: "/gpa-calculator/cumulative", changeFrequency: "yearly", priority: 0.65 },
    { path: "/gpa-calculator/aggregate", changeFrequency: "yearly", priority: 0.65 },
    { path: "/gpa-calculator/planning", changeFrequency: "yearly", priority: 0.65 },
    { path: "/resources", changeFrequency: "monthly", priority: 0.6 },
    { path: "/student-support", changeFrequency: "monthly", priority: 0.5 },
    { path: "/timetable", changeFrequency: "weekly", priority: 0.7 },
    { path: "/timetables", changeFrequency: "weekly", priority: 0.7 },
    { path: "/community", changeFrequency: "weekly", priority: 0.6 },
    { path: "/faculty", changeFrequency: "monthly", priority: 0.6 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal", changeFrequency: "yearly", priority: 0.3 },
    { path: "/report-issue", changeFrequency: "yearly", priority: 0.3 },
    { path: "/lost-found", changeFrequency: "monthly", priority: 0.4 },
  ]

  // Helper that resolves a route object for sitemap
  const toEntry = (path: string, lastModified = now, freq?: MetadataRoute.Sitemap[0]['changeFrequency'], priority?: number, images?: string[]) => ({
    url: `${siteUrl}${path}`,
    lastModified: (lastModified instanceof Date) ? lastModified.toISOString() : lastModified,
    changeFrequency: freq,
    priority,
    images,
  })

  // Start with static entries
  const entries: MetadataRoute.Sitemap = staticPaths.map((r) => toEntry(r.path, now, r.changeFrequency, r.priority))

  // Try to include dynamic content (news & past papers)
  const fetchDynamic = async () => {
    try {
      // Fetch published news
      const newsRes = await fetch(`${siteUrl}/api/news`, { cache: 'no-store' })
      if (newsRes.ok) {
        const newsJson = await newsRes.json()
        const newsItems = Array.isArray(newsJson.data) ? newsJson.data : newsJson.data || []
        newsItems.forEach((n: any) => {
          // news page expected at /news/[id]
          if (n?.id) {
            const img = n.image_url ? [new URL(n.image_url, siteUrl).toString()] : undefined
            entries.push(toEntry(`/news/${n.id}`, new Date(n.published_at || n.updated_at || n.created_at || now), 'weekly', 0.6, img))
          }
        })
      }
    } catch (e) {
      // ignore dynamic fetch errors — sitemap will contain static entries
      console.warn('sitemap: failed to fetch news', e)
    }

    try {
      // Fetch community posts for /community/post/[id]
      const postsRes = await fetch(`${siteUrl}/api/community/posts?limit=500&offset=0`, { cache: 'no-store' })
      if (postsRes.ok) {
        const postsJson = await postsRes.json().catch(() => [])
        const posts = Array.isArray(postsJson) ? postsJson : Array.isArray(postsJson.data) ? postsJson.data : []
        posts.forEach((p: any) => {
          if (!p?.id) return
            entries.push(toEntry(`/community/post/${p.id}`, new Date(p.updated_at || p.created_at || now), 'weekly', 0.5))
        })
      }
    } catch (e) {
      console.warn('sitemap: failed to fetch community posts', e)
    }

    try {
      // Fetch past papers; include course pages at /past-papers/[courseCode]
      const papersRes = await fetch(`${siteUrl}/api/past-papers?limit=1000`, { cache: 'no-store' })
      if (papersRes.ok) {
        const papersJson = await papersRes.json()
        const papers = Array.isArray(papersJson.data) ? papersJson.data : papersJson.data || []
        // Group by course_code and pick latest created_at for sitemap
        const byCourse: Record<string, any> = {}
        papers.forEach((p: any) => {
          const course = (p.course_code || p.course || 'unknown').toString()
          const existing = byCourse[course]
          const updated = new Date(p.updated_at || p.created_at || now)
          if (!existing || updated > new Date(existing.updated_at || existing.created_at || now)) {
            byCourse[course] = p
          }
        })
        Object.keys(byCourse).forEach((course) => {
          const p = byCourse[course]
          const coursePath = `/past-papers/${encodeURIComponent(course)}`
          const img = p.image_url ? [new URL(p.image_url, siteUrl).toString()] : undefined
          entries.push(toEntry(coursePath, new Date(p.updated_at || p.created_at || now), 'monthly', 0.6, img))
        })
      }
    } catch (e) {
      console.warn('sitemap: failed to fetch past-papers', e)
    }
  }

  // Note: sitemap() can be async in Next.js metadata routes — return a Promise
  return (async () => {
    await fetchDynamic()
    return entries
  })()
}
