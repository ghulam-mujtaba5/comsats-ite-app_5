import { GPAPlanningCalculator } from "@/components/gpa/gpa-planning-calculator"
import type { Metadata } from "next"
import { createMetadata, jsonLdBreadcrumb } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "GPA Planning Calculator — CampusAxis",
  description: "Plan your future GPA by setting targets and estimating your performance.",
  path: "/gpa-calculator/planning",
  keywords: ["GPA planning", "target GPA", "COMSATS GPA", "CampusAxis"],
})

export default function GpaPlanningCalculatorPage() {
  return (
    <>
      <GPAPlanningCalculator />
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
