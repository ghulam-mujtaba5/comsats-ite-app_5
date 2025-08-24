import type { Metadata } from "next"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "News — COMSATS ITE",
  description: "Latest news and updates: announcements, schedules, and important updates.",
  path: "/news",
  keywords: ["news", "announcements", "updates", "COMSATS"],
})

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children
}
