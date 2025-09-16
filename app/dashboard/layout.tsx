import type { Metadata } from "next"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Dashboard",
  description: "Your personalized dashboard.",
  path: "/dashboard",
  noindex: true,
})

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
