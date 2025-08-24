import { AggregateCalculator } from "@/components/gpa/aggregate-calculator"
import type { Metadata } from "next"
import { createMetadata, jsonLdBreadcrumb } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Aggregate Calculator — COMSATS ITE",
  description: "Calculate your aggregate score for university admissions.",
  path: "/gpa-calculator/aggregate",
  keywords: ["aggregate calculator", "admission aggregate", "COMSATS", "CampusAxis"],
})

export default function AggregateCalculatorPage() {
  return (
    <>
      <AggregateCalculator />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([
          { name: "Home", path: "/" },
          { name: "GPA Calculator", path: "/gpa-calculator" },
          { name: "Aggregate", path: "/gpa-calculator/aggregate" },
        ])) }}
      />
    </>
  )
}
