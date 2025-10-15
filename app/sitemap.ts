import type { MetadataRoute } from "next"

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
  const now = new Date()

  const staticPaths: Array<{ path: string; changeFrequency?: MetadataRoute.Sitemap[0]["changeFrequency"]; priority?: number }> = [
    { path: "/", changeFrequency: "daily", priority: 1 },
    { path: "/about", changeFrequency: "yearly", priority: 0.5 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
    { path: "/support", changeFrequency: "monthly", priority: 0.6 },
    { path: "/contribute", changeFrequency: "yearly", priority: 0.5 },
    { path: "/guidance", changeFrequency: "monthly", priority: 0.6 },
    { path: "/help", changeFrequency: "yearly", priority: 0.4 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
    // Known static blog article(s)
    { path: "/blog/comsats-grading-system", changeFrequency: "yearly", priority: 0.6 },
    { path: "/blog/comsats-gpa-calculator-guide", changeFrequency: "yearly", priority: 0.7 },
    { path: "/news", changeFrequency: "weekly", priority: 0.6 },
    { path: "/news-events", changeFrequency: "weekly", priority: 0.6 },
    { path: "/past-papers", changeFrequency: "monthly", priority: 0.7 },
    { path: "/fee-challan-reissuance", changeFrequency: "monthly", priority: 0.7 },
    { path: "/gpa-calculator", changeFrequency: "yearly", priority: 0.8 },
    { path: "/gpa-calculator/semester", changeFrequency: "yearly", priority: 0.7 },
    { path: "/gpa-calculator/cumulative", changeFrequency: "yearly", priority: 0.7 },
    { path: "/gpa-calculator/aggregate", changeFrequency: "yearly", priority: 0.7 },
    { path: "/gpa-calculator/planning", changeFrequency: "yearly", priority: 0.7 },
    { path: "/resources", changeFrequency: "monthly", priority: 0.6 },
    { path: "/student-support", changeFrequency: "monthly", priority: 0.5 },
    { path: "/help-desk", changeFrequency: "monthly", priority: 0.5 },
    { path: "/timetable", changeFrequency: "weekly", priority: 0.7 },
    { path: "/timetables", changeFrequency: "weekly", priority: 0.7 },
    { path: "/community", changeFrequency: "weekly", priority: 0.6 },
    { path: "/faculty", changeFrequency: "monthly", priority: 0.6 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/terms-of-service", changeFrequency: "yearly", priority: 0.3 },
    { path: "/report-issue", changeFrequency: "yearly", priority: 0.3 },
    { path: "/lost-found", changeFrequency: "monthly", priority: 0.4 },
  ]

  // Helper that resolves a route object for sitemap
  const toEntry = (path: string, lastModified = now, freq?: MetadataRoute.Sitemap[0]['changeFrequency'], priority?: number, images?: string[]) => ({
    url: `${siteUrl}${path}`,
    lastModified: (lastModified instanceof Date) ? lastModified.toISOString() : lastModified,
    changeFrequency: freq,
    priority,
    images: images?.filter(Boolean), // Filter out any undefined/null images
  })

  // Start with static entries
  const entries: MetadataRoute.Sitemap = staticPaths.map((r) => toEntry(r.path, now, r.changeFrequency, r.priority))

  // Include dynamic content by calling our public API endpoints.
  // This avoids hard dependency on service-role env vars and respects existing RLS and filters.
  const fetchDynamic = async () => {
    const safeFetch = async (label: string, url: string): Promise<any | undefined> => {
      try {
        const res = await fetch(url, { cache: 'no-store', next: { revalidate: 60 } })
        if (!res.ok) return undefined
        const ct = res.headers.get('content-type') || ''
        if (ct.includes('application/json')) return res.json()
        return undefined
      } catch (e) {
        console.warn(`[sitemap] fetch ${label} failed`, e)
        return undefined
      }
    }

    try {
      // NEWS (published)
      const newsJson = await safeFetch('news', `${siteUrl}/api/news`)
      if (newsJson?.data) {
        newsJson.data.slice(0, 500).forEach((n: any) => {
          if (!n?.id) return
          try {
            const img = n.image_url ? [new URL(n.image_url, siteUrl).toString()] : undefined
            const lm = n.published_at || n.updated_at || n.created_at || now
            entries.push(toEntry(`/news/${n.id}`, new Date(lm), 'weekly', 0.65, img))
          } catch (e) {
            console.warn(`[sitemap] Invalid news entry`, n)
          }
        })
      }

      // EVENTS (include past as well)
      const events = await safeFetch('events', `${siteUrl}/api/news-events/events?includePast=1`)
      if (events) {
        events.slice(0, 500).forEach((ev: any) => {
          if (!ev?.id) return
          try {
            entries.push(toEntry(`/news-events/${ev.id}`, new Date(ev.date || now), 'weekly', 0.55))
          } catch (e) {
            console.warn(`[sitemap] Invalid event entry`, ev)
          }
        })
      }

      // FACULTY
      const faculty = await safeFetch('faculty', `${siteUrl}/api/faculty`)
      if (faculty) {
        faculty.slice(0, 1000).forEach((f: any) => {
          if (!f?.id) return
          try {
            const img = f.profileImage ? [new URL(f.profileImage, siteUrl).toString()] : undefined
            const lm = f.joinDate || now
            entries.push(toEntry(`/faculty/${f.id}`, new Date(lm), 'monthly', 0.6, img))
          } catch (e) {
            console.warn(`[sitemap] Invalid faculty entry`, f)
          }
        })
      }

      // PAST PAPERS — group by course_code
      const papersJson = await safeFetch('past_papers', `${siteUrl}/api/past-papers?limit=2000`)
      if (papersJson?.data) {
        const byCourse: Record<string, any> = {}
        papersJson.data.forEach((p: any) => {
          if (!p?.course_code) return
          try {
            const course = p.course_code.toString()
            const updated = new Date(p.updated_at || p.created_at || now)
            if (!byCourse[course] || updated > new Date(byCourse[course].updated_at || byCourse[course].created_at || now)) {
              byCourse[course] = p
            }
          } catch (e) {
            console.warn(`[sitemap] Invalid paper entry`, p)
          }
        })
        Object.keys(byCourse).forEach((course) => {
          try {
            const p = byCourse[course]
            const img = p.image_url ? [new URL(p.image_url, siteUrl).toString()] : undefined
            entries.push(toEntry(`/past-papers/${encodeURIComponent(course)}`, new Date(p.updated_at || p.created_at || now), 'monthly', 0.62, img))
          } catch (e) {
            console.warn(`[sitemap] Invalid paper course entry`, course)
          }
        })
      }

      // COMMUNITY POSTS (latest 500) — API returns localized time; use now for lastmod
      const posts = await safeFetch('community_posts', `${siteUrl}/api/community/posts?limit=500`)
      if (posts) {
        posts.forEach((p: any) => {
          if (!p?.id) return
          try {
            entries.push(toEntry(`/community/post/${p.id}`, now, 'weekly', 0.5))
          } catch (e) {
            console.warn(`[sitemap] Invalid post entry`, p)
          }
        })
      }
    } catch (error) {
      console.error('[sitemap] Error fetching dynamic content:', error)
    }
  }

  // Note: sitemap() can be async in Next.js metadata routes — return a Promise
  await fetchDynamic()
  
  // Sort by priority (higher priority first) for better crawling
  entries.sort((a, b) => {
    const priorityA = a.priority || 0.5
    const priorityB = b.priority || 0.5
    return priorityB - priorityA
  })
  
  return entries
}

// Image sitemap endpoint - helps Google discover and index images
export async function imageMap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
  
  const images = [
    {
      url: `${siteUrl}/og-preview.png`,
      title: 'CampusAxis - COMSATS University Portal',
      caption: 'Official academic portal for COMSATS students',
    },
    {
      url: `${siteUrl}/og-preview.svg`,
      title: 'CampusAxis Logo',
      caption: 'CampusAxis brand logo',
    },
    {
      url: `${siteUrl}/Campus Axis 1.svg`,
      title: 'CampusAxis Square Logo',
      caption: 'Updated CampusAxis square logo design',
    },
  ]
  
  return images
}