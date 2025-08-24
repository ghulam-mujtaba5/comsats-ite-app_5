import type { Metadata } from "next"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Past Papers — COMSATS ITE",
  description: "Browse and download organized past papers: assignments, quizzes, midterms, and finals.",
  path: "/past-papers",
  keywords: ["past papers", "COMSATS", "quizzes", "midterm", "final", "CampusAxis"],
})

export default function PastPapersLayout({ children }: { children: React.ReactNode }) {
  return children
}
