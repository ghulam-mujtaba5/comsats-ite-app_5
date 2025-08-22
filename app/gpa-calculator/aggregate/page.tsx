import { AggregateCalculator } from "@/components/gpa/aggregate-calculator"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Aggregate Calculator - COMSATS ITE App",
  description: "Calculate your aggregate score for university admissions.",
}

export default function AggregateCalculatorPage() {
  return <AggregateCalculator />
}
