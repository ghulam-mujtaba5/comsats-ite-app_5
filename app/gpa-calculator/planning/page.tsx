import { GPAPlanningCalculator } from "@/components/gpa/gpa-planning-calculator"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "GPA Planning Calculator - COMSATS ITE App",
  description: "Plan your future GPA by setting targets and estimating your performance.",
}

export default function GpaPlanningCalculatorPage() {
  return <GPAPlanningCalculator />
}
