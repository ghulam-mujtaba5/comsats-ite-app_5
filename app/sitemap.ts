import type { MetadataRoute } from "next"
import { supabaseAdmin } from "@/lib/supabase-admin"

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

  // Try to include dynamic content by querying Supabase directly (preferred over self-fetch)
  const fetchDynamic = async () => {
    const hasEnv = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)

    if (!hasEnv) {
      console.warn('sitemap: Supabase service env missing; dynamic sections skipped')
      return
    }

    // NEWS (published only)
    try {
      const { data: news } = await supabaseAdmin
        .from('news')
        .select('id,image_url,published_at,updated_at,created_at,status')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(500)
      ;(news || []).forEach((n: any) => {
        if (!n?.id) return
        const img = n.image_url ? [new URL(n.image_url, siteUrl).toString()] : undefined
        entries.push(toEntry(`/news/${n.id}`, new Date(n.published_at || n.updated_at || n.created_at || now), 'weekly', 0.65, img))
      })
    } catch (e) {
      console.warn('sitemap: news query failed', e)
    }

    // COMMUNITY POSTS (latest 500)
    try {
      const { data: posts } = await supabaseAdmin
        .from('community_posts')
        .select('id,updated_at,created_at')
        .order('created_at', { ascending: false })
        .limit(500)
      ;(posts || []).forEach((p: any) => {
        if (!p?.id) return
        entries.push(toEntry(`/community/post/${p.id}`, new Date(p.updated_at || p.created_at || now), 'weekly', 0.5))
      })
    } catch (e) {
      console.warn('sitemap: community_posts query failed', e)
    }

    // FACULTY (up to 1000)
    try {
      const { data: faculty } = await supabaseAdmin
        .from('faculty')
        .select('id,profile_image,updated_at,created_at')
        .order('name', { ascending: true })
        .limit(1000)
      ;(faculty || []).forEach((f: any) => {
        if (!f?.id) return
        const img = f.profile_image ? [new URL(f.profile_image, siteUrl).toString()] : undefined
        entries.push(toEntry(`/faculty/${f.id}`, new Date(f.updated_at || f.created_at || now), 'monthly', 0.6, img))
      })
    } catch (e) {
      console.warn('sitemap: faculty query failed', e)
    }

    // PAST PAPERS (group by course_code)
    try {
      const { data: papers } = await supabaseAdmin
        .from('past_papers')
        .select('course_code,image_url,updated_at,created_at,status')
        .eq('status', 'approved')
        .limit(2000)
      const byCourse: Record<string, any> = {}
      ;(papers || []).forEach((p: any) => {
        const course = (p.course_code || 'unknown').toString()
        const updated = new Date(p.updated_at || p.created_at || now)
        if (!byCourse[course] || updated > new Date(byCourse[course].updated_at || byCourse[course].created_at || now)) {
          byCourse[course] = p
        }
      })
      Object.keys(byCourse).forEach((course) => {
        const p = byCourse[course]
        const img = p.image_url ? [new URL(p.image_url, siteUrl).toString()] : undefined
        entries.push(toEntry(`/past-papers/${encodeURIComponent(course)}`, new Date(p.updated_at || p.created_at || now), 'monthly', 0.62, img))
      })
    } catch (e) {
      console.warn('sitemap: past_papers query failed', e)
    }

    // EVENTS (optional; ignore if table absent)
    try {
      const { data: events, error } = await supabaseAdmin
        .from('events')
        .select('id,updated_at,created_at,published_at')
        .limit(500)
      if (!error) {
        ;(events || []).forEach((ev: any) => {
          if (!ev?.id) return
            entries.push(toEntry(`/news-events/${ev.id}`, new Date(ev.published_at || ev.updated_at || ev.created_at || now), 'weekly', 0.55))
        })
      }
    } catch (e) {
      // Table may not exist yet; ignore
    }
  }

  // Note: sitemap() can be async in Next.js metadata routes — return a Promise
  return (async () => {
    await fetchDynamic()
    return entries
  })()
}
