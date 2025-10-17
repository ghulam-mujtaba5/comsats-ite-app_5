import { AggregateCalculator } from "@/components/gpa/aggregate-calculator"
import "./aggregate.light.module.css"
import "./aggregate.dark.module.css"
import type { Metadata } from "next"
import { createMetadata, jsonLdBreadcrumb } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "COMSATS Admission Aggregate Calculator - Calculate Entry Score | CampusAxis",
  description: "Free admission aggregate calculator for COMSATS University. Calculate your entry test aggregate score using the official COMSATS formula: 10% Matric + 40% Inter + 50% Entry Test.",
  path: "/gpa-calculator/aggregate",
  keywords: ["COMSATS aggregate calculator", "admission aggregate calculator", "CUI entry test calculator", "COMSATS entry formula", "university admission calculator"],
})

export default function AggregateCalculatorPage() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">COMSATS Admission Aggregate Calculator</h1>
          <p className="text-muted-foreground">
            Calculate your admission aggregate score for COMSATS University using the official formula: 
            10% Matric + 40% Intermediate + 50% Entry Test. Determine your eligibility for various programs.
          </p>
        </div>
        <AggregateCalculator />
      </div>
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