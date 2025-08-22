import { CumulativeGPACalculator } from "@/components/gpa/cumulative-gpa-calculator"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cumulative GPA Calculator - COMSATS ITE App",
  description: "Calculate your cumulative GPA based on your semester performance.",
}

export default function CumulativeGpaCalculatorPage() {
  return <CumulativeGPACalculator />
}
