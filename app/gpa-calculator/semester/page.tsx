import { SemesterGPACalculator } from "@/components/gpa/semester-gpa-calculator"
import type { Metadata } from "next"
import { createMetadata, jsonLdBreadcrumb } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Semester GPA Calculator — COMSATS ITE",
  description: "Calculate your GPA for the current semester using the COMSATS grading scale.",
  path: "/gpa-calculator/semester",
  keywords: ["semester GPA", "COMSATS GPA", "calculator", "CampusAxis"],
})

export default function SemesterGpaCalculatorPage() {
  return (
    <>
      <SemesterGPACalculator />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([
          { name: "Home", path: "/" },
          { name: "GPA Calculator", path: "/gpa-calculator" },
          { name: "Semester", path: "/gpa-calculator/semester" },
        ])) }}
      />
    </>
  )
}
