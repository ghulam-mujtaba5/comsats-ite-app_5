import { CumulativeGPACalculator } from "@/components/gpa/cumulative-gpa-calculator"
import type { Metadata } from "next"
import { createMetadata, jsonLdBreadcrumb } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Cumulative GPA Calculator — COMSATS ITE",
  description: "Calculate your cumulative GPA based on your semester performance.",
  path: "/gpa-calculator/cumulative",
  keywords: ["CGPA", "cumulative GPA", "COMSATS GPA", "CampusAxis"],
})

export default function CumulativeGpaCalculatorPage() {
  return (
    <>
      <CumulativeGPACalculator />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([
          { name: "Home", path: "/" },
          { name: "GPA Calculator", path: "/gpa-calculator" },
          { name: "Cumulative", path: "/gpa-calculator/cumulative" },
        ])) }}
      />
    </>
  )
}
