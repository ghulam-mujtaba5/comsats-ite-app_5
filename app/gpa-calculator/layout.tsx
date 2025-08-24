import type { Metadata } from "next"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "GPA Calculator — COMSATS ITE",
  description: "COMSATS GPA calculators: semester GPA, CGPA, aggregate, and GPA planning with COMSATS grading scale.",
  path: "/gpa-calculator",
  keywords: ["COMSATS GPA", "GPA calculator", "CGPA", "aggregate", "grading scale", "CampusAxis"],
})

export default function GPALayout({ children }: { children: React.ReactNode }) {
  return children
}
