import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
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

  return staticPaths.map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
