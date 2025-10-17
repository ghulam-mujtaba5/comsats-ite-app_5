import { GPAPlanningCalculator } from "@/components/gpa/gpa-planning-calculator"
import "./planning.light.module.css"
import "./planning.dark.module.css"
import type { Metadata } from "next"
import { createMetadata, jsonLdBreadcrumb } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "GPA Planning Calculator for COMSATS - Plan Your Academic Goals | CampusAxis",
  description: "Plan your future GPA at COMSATS University with our GPA planning calculator. Set targets and estimate your performance for upcoming semesters.",
  path: "/gpa-calculator/planning",
  keywords: ["GPA planning calculator", "target GPA calculator", "COMSATS GPA planner", "academic planning tool", "future GPA calculator"],
})

export default function GpaPlanningCalculatorPage() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">GPA Planning Calculator for COMSATS Students</h1>
          <p className="text-muted-foreground">
            Plan your future semesters and set academic goals with our GPA planning calculator. 
            Determine what grades you need to achieve your target cumulative GPA.
          </p>
        </div>
        <GPAPlanningCalculator />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([
          { name: "Home", path: "/" },
          { name: "GPA Calculator", path: "/gpa-calculator" },
          { name: "Planning", path: "/gpa-calculator/planning" },
        ])) }}
      />
    </>
  )
}