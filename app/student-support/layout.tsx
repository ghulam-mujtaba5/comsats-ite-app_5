import type { Metadata } from "next"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Student Support — COMSATS ITE",
  description: "Find mental health, academic, financial, and career support resources for COMSATS Lahore students.",
  path: "/student-support",
  keywords: ["student support", "counseling", "financial aid", "tutoring", "COMSATS Lahore"],
})

export default function StudentSupportLayout({ children }: { children: React.ReactNode }) {
  return children
}
