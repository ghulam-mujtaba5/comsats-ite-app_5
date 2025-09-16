import type { Metadata } from "next"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Guidance",
  description: "Academic guidance, tips, and resources for COMSATS students.",
  path: "/guidance",
})

export default function GuidanceLayout({ children }: { children: React.ReactNode }) {
  return children
}
