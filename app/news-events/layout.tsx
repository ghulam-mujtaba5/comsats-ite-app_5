import type { Metadata } from "next"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "News & Events — COMSATS ITE",
  description: "Stay updated with the latest campus news, announcements, and upcoming events.",
  path: "/news-events",
  keywords: ["news", "events", "announcements", "COMSATS"],
})

export default function NewsEventsLayout({ children }: { children: React.ReactNode }) {
  return children
}
