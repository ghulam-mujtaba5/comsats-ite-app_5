import { CumulativeGPACalculator } from "@/components/gpa/cumulative-gpa-calculator"
import type { Metadata } from "next"
import { createMetadata, jsonLdBreadcrumb } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Cumulative GPA Calculator for COMSATS - Calculate Your CGPA | CampusAxis",
  description: "Free cumulative GPA (CGPA) calculator for COMSATS University students. Track your overall academic performance across all semesters with our accurate CGPA calculator.",
  path: "/gpa-calculator/cumulative",
  keywords: ["cumulative GPA calculator", "CGPA calculator COMSATS", "COMSATS CGPA tool", "overall GPA calculator", "CUI CGPA calculator"],
})

export default function CumulativeGpaCalculatorPage() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Cumulative GPA Calculator for COMSATS Students</h1>
          <p className="text-muted-foreground">
            Calculate your cumulative GPA (CGPA) across all semesters using the official COMSATS grading system. 
            Track your overall academic performance and monitor your progress toward graduation requirements.
          </p>
        </div>
        <CumulativeGPACalculator />
      </div>
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