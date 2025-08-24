import type { Metadata } from "next"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Report an Issue — CampusAxis",
  description: "Report bugs or suggest improvements to help us improve CampusAxis.",
  path: "/report-issue",
  keywords: ["report issue", "bug report", "suggestion", "support", "CampusAxis"],
})

export default function ReportIssueLayout({ children }: { children: React.ReactNode }) {
  return children
}
