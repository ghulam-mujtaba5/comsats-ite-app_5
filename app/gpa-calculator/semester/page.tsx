import { SemesterGPACalculator } from "@/components/gpa/semester-gpa-calculator"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Semester GPA Calculator - COMSATS ITE App",
  description: "Calculate your GPA for the current semester.",
}

export default function SemesterGpaCalculatorPage() {
  return <SemesterGPACalculator />
}
