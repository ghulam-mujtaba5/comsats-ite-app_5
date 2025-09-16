import type { Metadata } from "next"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Profile",
  description: "Your personal profile and dashboard area.",
  path: "/profile",
  noindex: true,
})

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children
}
