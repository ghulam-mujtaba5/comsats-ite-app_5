import type { Metadata } from "next"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Community — CampusAxis",
  description: "Join COMSATS students sharing knowledge, opportunities, and campus life updates.",
  path: "/community",
  keywords: ["community", "COMSATS", "students", "discussion", "groups"],
})

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return children
}
