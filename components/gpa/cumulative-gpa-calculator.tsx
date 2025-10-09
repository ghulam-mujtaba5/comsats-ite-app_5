"use client"

import { useMemo, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, TrendingUp } from "lucide-react"
import { getGradeFromGPA } from "@/lib/gpa-utils"

interface SemesterInput {
  id: string
  name: string
  gpa: number
  creditHours: number
}

export function CumulativeGPACalculator() {
  const [semesters, setSemesters] = useState<SemesterInput[]>([{ id: "1", name: "Semester 1", gpa: 0, creditHours: 0 }])
  
  const validSemesters = useMemo(
    () => semesters.filter((sem) => sem.gpa > 0 && sem.creditHours > 0),
    [semesters],
  )

  const liveResult = useMemo(() => {
    if (validSemesters.length === 0) return null
    let totalPoints = 0
    let totalCredits = 0
    validSemesters.forEach((sem) => {
      totalPoints += sem.gpa * sem.creditHours
      totalCredits += sem.creditHours
    })
    if (totalCredits === 0) return null
    const cgpa = Math.round(((totalPoints / totalCredits) + Number.EPSILON) * 100) / 100
    return { cgpa, totalCredits }
  }, [validSemesters])

  const addSemester = useCallback(() => {
    const newSemester: SemesterInput = {
      id: Date.now().toString(),
      name: `Semester ${semesters.length + 1}`,
      gpa: 0,
      creditHours: 0,
    }
    setSemesters(prev => [...prev, newSemester])
  }, [semesters.length])

  const removeSemester = useCallback((id: string) => {
    if (semesters.length > 1) {
      setSemesters(prev => prev.filter((semester) => semester.id !== id))
    }
  }, [semesters.length])

  const updateSemester = useCallback((id: string, field: keyof SemesterInput, value: string | number) => {
    setSemesters(prev => prev.map((semester) => (semester.id === id ? { ...semester, [field]: value } : semester)))
  }, [])

  const resetCalculator = useCallback(() => {
    setSemesters([{ id: "1", name: "Semester 1", gpa: 0, creditHours: 0 }])
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Cumulative GPA Calculator
        </CardTitle>
        <CardDescription>Calculate your overall CGPA by entering your semester GPAs and credit hours</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {semesters.map((semester, index) => (
            <div
              key={semester.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 border border-border rounded-lg"
            >
              <div className="md:col-span-4">
                <Label htmlFor={`semester-${semester.id}`} className="text-sm">Semester Name</Label>
                <Input
                  id={`semester-${semester.id}`}
                  value={semester.name}
                  onChange={(e) => updateSemester(semester.id, "name", e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="md:col-span-3">
                <Label htmlFor={`gpa-${semester.id}`} className="text-sm">Semester GPA</Label>
                <Input
                  id={`gpa-${semester.id}`}
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  placeholder="0.00"
                  value={semester.gpa || ""}
                  onChange={(e) => updateSemester(semester.id, "gpa", Number.parseFloat(e.target.value) || 0)}
                  className="text-sm"
                />
              </div>

              <div className="md:col-span-3">
                <Label htmlFor={`credits-${semester.id}`} className="text-sm">Credit Hours</Label>
                <Input
                  id={`credits-${semester.id}`}
                  type="number"
                  min="1"
                  placeholder="0"
                  value={semester.creditHours || ""}
                  onChange={(e) => updateSemester(semester.id, "creditHours", Number.parseInt(e.target.value) || 0)}
                  className="text-sm"
                />
              </div>

              <div className="md:col-span-2 flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSemester(semester.id)}
                  disabled={semesters.length === 1}
                  className="w-full text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={addSemester} className="flex-1 bg-transparent text-sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Semester
          </Button>
          <Button variant="outline" onClick={resetCalculator} className="flex-1 bg-transparent text-sm">
            Reset
          </Button>
        </div>

        {liveResult && (
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="text-center space-y-3">
                <div>
                  <div className="text-2xl font-bold text-primary">{liveResult.cgpa.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Cumulative GPA</div>
                </div>
                <div className="flex justify-center gap-3">
                  <Badge variant="secondary" className="text-xs">Grade: {getGradeFromGPA(liveResult.cgpa)}</Badge>
                  <Badge variant="outline" className="text-xs">Total Credits: {liveResult.totalCredits}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}