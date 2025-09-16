import type { Metadata } from "next"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Contribute",
  description: "Contribute notes, past papers, and resources to help other students.",
  path: "/contribute",
})

export default function ContributeLayout({ children }: { children: React.ReactNode }) {
  return children
}
