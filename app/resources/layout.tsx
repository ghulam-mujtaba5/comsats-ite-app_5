import type { Metadata } from "next"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Resources — CampusAxis",
  description: "Download study materials and useful documents shared by the department.",
  path: "/resources",
  keywords: ["resources", "study materials", "documents", "COMSATS"],
})

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return children
}
