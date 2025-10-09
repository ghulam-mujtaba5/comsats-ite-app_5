import { SemesterGPACalculator } from "@/components/gpa/semester-gpa-calculator"
import type { Metadata } from "next"
import { createMetadata, jsonLdBreadcrumb } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Semester GPA Calculator for COMSATS - Calculate Your Term GPA | CampusAxis",
  description: "Free semester GPA calculator for COMSATS University students. Calculate your term GPA accurately using the official COMSATS grading scale and formulas.",
  path: "/gpa-calculator/semester",
  keywords: ["semester GPA calculator", "COMSATS GPA calculator", "term GPA", "COMSATS semester calculator", "CUI GPA tool"],
})

export default function SemesterGpaCalculatorPage() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Semester GPA Calculator for COMSATS Students</h1>
          <p className="text-muted-foreground">
            Calculate your semester GPA accurately using the official COMSATS grading system. 
            Enter your course grades and credit hours to get your precise semester GPA.
          </p>
        </div>
        <SemesterGPACalculator />
      </div>
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