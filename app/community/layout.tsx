import type { Metadata } from "next"
import { createMetadata } from "@/lib/seo"

export const dynamic = 'force-dynamic'

// Section-level theming for community
import './community.light.module.css'
import './community.dark.module.css'

export const metadata: Metadata = createMetadata({
  title: "Community — CampusAxis",
  description: "Join COMSATS students sharing knowledge, opportunities, and campus life updates.",
  path: "/community",
  keywords: ["community", "COMSATS", "students", "discussion", "groups"],
})

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return children
}
