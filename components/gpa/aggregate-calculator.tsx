"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Target } from "lucide-react"
import { type AggregateData, calculateAggregate } from "@/lib/gpa-utils"

export function AggregateCalculator() {
  const [data, setData] = useState<AggregateData>({
    matricMarks: 0,
    matricTotal: 1100,
    interMarks: 0,
    interTotal: 1100,
    entryTestMarks: 0,
    entryTestTotal: 400,
  })
  const [result, setResult] = useState<number | null>(null)

  const updateData = (field: keyof AggregateData, value: number) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const calculateAgg = () => {
    if (data.matricMarks > 0 && data.interMarks > 0 && data.entryTestMarks > 0) {
      const aggregate = calculateAggregate(data)
      setResult(aggregate)
    } else {
      setResult(null)
    }
  }

  const resetCalculator = () => {
    setData({
      matricMarks: 0,
      matricTotal: 1100,
      interMarks: 0,
      interTotal: 1100,
      entryTestMarks: 0,
      entryTestTotal: 400,
    })
    setResult(null)
  }

  const getAggregateGrade = (aggregate: number): string => {
    if (aggregate >= 85) return "Excellent"
    if (aggregate >= 75) return "Very Good"
    if (aggregate >= 65) return "Good"
    if (aggregate >= 55) return "Satisfactory"
    if (aggregate >= 45) return "Pass"
    return "Below Average"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Aggregate Calculator
        </CardTitle>
        <CardDescription>Calculate your admission aggregate using Matric, Inter, and Entry Test marks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold mb-3 text-foreground">Matriculation (10%)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="matric-marks">Obtained Marks</Label>
                  <Input
                    id="matric-marks"
                    type="number"
                    min="0"
                    value={data.matricMarks || ""}
                    onChange={(e) => updateData("matricMarks", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="matric-total">Total Marks</Label>
                  <Input
                    id="matric-total"
                    type="number"
                    min="1"
                    value={data.matricTotal}
                    onChange={(e) => updateData("matricTotal", Number.parseInt(e.target.value) || 1100)}
                  />
                </div>
              </div>
              {data.matricMarks > 0 && data.matricTotal > 0 && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Percentage: {((data.matricMarks / data.matricTotal) * 100).toFixed(2)}%
                </div>
              )}
            </div>

            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold mb-3 text-foreground">Intermediate (40%)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="inter-marks">Obtained Marks</Label>
                  <Input
                    id="inter-marks"
                    type="number"
                    min="0"
                    value={data.interMarks || ""}
                    onChange={(e) => updateData("interMarks", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="inter-total">Total Marks</Label>
                  <Input
                    id="inter-total"
                    type="number"
                    min="1"
                    value={data.interTotal}
                    onChange={(e) => updateData("interTotal", Number.parseInt(e.target.value) || 1100)}
                  />
                </div>
              </div>
              {data.interMarks > 0 && data.interTotal > 0 && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Percentage: {((data.interMarks / data.interTotal) * 100).toFixed(2)}%
                </div>
              )}
            </div>

            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold mb-3 text-foreground">Entry Test (50%)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="test-marks">Obtained Marks</Label>
                  <Input
                    id="test-marks"
                    type="number"
                    min="0"
                    value={data.entryTestMarks || ""}
                    onChange={(e) => updateData("entryTestMarks", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="test-total">Total Marks</Label>
                  <Input
                    id="test-total"
                    type="number"
                    min="1"
                    value={data.entryTestTotal}
                    onChange={(e) => updateData("entryTestTotal", Number.parseInt(e.target.value) || 400)}
                  />
                </div>
              </div>
              {data.entryTestMarks > 0 && data.entryTestTotal > 0 && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Percentage: {((data.entryTestMarks / data.entryTestTotal) * 100).toFixed(2)}%
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-3 text-foreground">Aggregate Formula</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Matriculation: 10% weightage</div>
                <div>• Intermediate: 40% weightage</div>
                <div>• Entry Test: 50% weightage</div>
              </div>
            </div>

            {result && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div>
                      <div className="text-4xl font-bold text-primary">{result.toFixed(2)}%</div>
                      <div className="text-sm text-muted-foreground">Aggregate Score</div>
                    </div>
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      {getAggregateGrade(result)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={calculateAgg} className="flex-1">
            Calculate Aggregate
          </Button>
          <Button variant="outline" onClick={resetCalculator} className="flex-1 bg-transparent">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
