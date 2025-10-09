import type { Metadata } from "next"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Admin Diagnostic Tool — CampusAxis",
  description: "Automated admin access testing and debugging tool.",
  path: "/admin/diagnostic",
  noindex: true,
})

export default function DiagnosticLayout({ children }: { children: React.ReactNode }) {
  return children
}
