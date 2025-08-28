"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Target, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { gradePoints } from "@/lib/gpa-utils"

interface PlannedCourse {
  id: string
  name: string
  creditHours: number
  expectedGrade: string
}

interface Semester {
  id: string
  name: string
  courses: PlannedCourse[]
}

export function GPAPlanningCalculator() {
  const [currentGPA, setCurrentGPA] = useState("")
  const [currentCreditHours, setCurrentCreditHours] = useState("")
  const [targetGPA, setTargetGPA] = useState("")
  const [semesters, setSemesters] = useState<Semester[]>([
    {
      id: "1",
      name: "Next Semester",
      courses: [],
    },
  ])
  

  const addSemester = () => {
    const newSemester: Semester = {
      id: Date.now().toString(),
      name: `Semester ${semesters.length + 1}`,
      courses: [],
    }
    setSemesters([...semesters, newSemester])
  }

  const removeSemester = (semesterId: string) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter((sem) => sem.id !== semesterId))
    }
  }

  const addCourse = (semesterId: string) => {
    const newCourse: PlannedCourse = {
      id: Date.now().toString(),
      name: "",
      creditHours: 3,
      expectedGrade: "A",
    }
    setSemesters(
      semesters.map((sem) => (sem.id === semesterId ? { ...sem, courses: [...sem.courses, newCourse] } : sem)),
    )
  }

  const removeCourse = (semesterId: string, courseId: string) => {
    setSemesters(
      semesters.map((sem) =>
        sem.id === semesterId ? { ...sem, courses: sem.courses.filter((course) => course.id !== courseId) } : sem,
      ),
    )
  }

  const updateCourse = (semesterId: string, courseId: string, field: keyof PlannedCourse, value: any) => {
    setSemesters(
      semesters.map((sem) =>
        sem.id === semesterId
          ? {
              ...sem,
              courses: sem.courses.map((course) => (course.id === courseId ? { ...course, [field]: value } : course)),
            }
          : sem,
      ),
    )
  }

  // Live updates: calculations recompute via useMemo on dependencies

  const calculations = useMemo(() => {
    const current = {
      gpa: Number.parseFloat(currentGPA) || 0,
      creditHours: Number.parseInt(currentCreditHours) || 0,
    }
    const target = Number.parseFloat(targetGPA) || 0

    let totalQualityPoints = current.gpa * current.creditHours
    let totalCreditHours = current.creditHours

    const semesterResults = semesters.map((semester) => {
      let semesterQualityPoints = 0
      let semesterCreditHours = 0

      semester.courses.forEach((course) => {
        if (course.name && course.expectedGrade) {
          const points = gradePoints[course.expectedGrade] * course.creditHours
          semesterQualityPoints += points
          semesterCreditHours += course.creditHours
        }
      })

      totalQualityPoints += semesterQualityPoints
      totalCreditHours += semesterCreditHours

      const semesterGPA = semesterCreditHours > 0 ? semesterQualityPoints / semesterCreditHours : 0
      const cumulativeGPA = totalCreditHours > 0 ? totalQualityPoints / totalCreditHours : 0

      return {
        semester: semester.name,
        semesterGPA: semesterGPA,
        cumulativeGPA: cumulativeGPA,
        creditHours: semesterCreditHours,
      }
    })

    const finalGPA = totalCreditHours > 0 ? totalQualityPoints / totalCreditHours : 0
    const targetAchievable = target === 0 || finalGPA >= target
    const gpaNeeded =
      target > 0 && totalCreditHours > current.creditHours
        ? (target * totalCreditHours - current.gpa * current.creditHours) / (totalCreditHours - current.creditHours)
        : 0

    return {
      semesterResults,
      finalGPA,
      targetAchievable,
      gpaNeeded: Math.max(0, gpaNeeded),
      totalPlannedCreditHours: totalCreditHours - current.creditHours,
    }
  }, [currentGPA, currentCreditHours, targetGPA, semesters])

  const reset = () => {
    setCurrentGPA("")
    setCurrentCreditHours("")
    setTargetGPA("")
    setSemesters([
      {
        id: "1",
        name: "Next Semester",
        courses: [],
      },
    ])
  }

  const canCalculate = Boolean(currentGPA && currentCreditHours && calculations.totalPlannedCreditHours > 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            GPA Planning Calculator
          </CardTitle>
          <CardDescription>
            Plan your future semesters to achieve your target GPA. Add courses and expected grades to see projections.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentGPA">Current GPA</Label>
              <Input
                id="currentGPA"
                type="number"
                step="0.01"
                min="0"
                max="4"
                placeholder="3.50"
                value={currentGPA}
                onChange={(e) => setCurrentGPA(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentCreditHours">Current Credit Hours</Label>
              <Input
                id="currentCreditHours"
                type="number"
                min="0"
                placeholder="60"
                value={currentCreditHours}
                onChange={(e) => setCurrentCreditHours(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetGPA">Target GPA</Label>
              <Input
                id="targetGPA"
                type="number"
                step="0.01"
                min="0"
                max="4"
                placeholder="3.75"
                value={targetGPA}
                onChange={(e) => setTargetGPA(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Planned Semesters */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Planned Semesters</h3>
              <Button onClick={addSemester} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Semester
              </Button>
            </div>

            {semesters.map((semester, semesterIndex) => (
              <Card key={semester.id} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{semester.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => addCourse(semester.id)}
                        size="sm"
                        variant="outline"
                        className="bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Course
                      </Button>
                      {semesters.length > 1 && (
                        <Button
                          onClick={() => removeSemester(semester.id)}
                          size="sm"
                          variant="outline"
                          className="bg-transparent text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {semester.courses.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No courses added yet. Click "Add Course" to start planning.
                    </p>
                  ) : (
                    semester.courses.map((course) => (
                      <div key={course.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-muted/30 rounded-lg">
                        <Input
                          placeholder="Course name"
                          value={course.name}
                          onChange={(e) => updateCourse(semester.id, course.id, "name", e.target.value)}
                        />
                        <Select
                          value={course.creditHours.toString()}
                          onValueChange={(value) =>
                            updateCourse(semester.id, course.id, "creditHours", Number.parseInt(value))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 CH</SelectItem>
                            <SelectItem value="2">2 CH</SelectItem>
                            <SelectItem value="3">3 CH</SelectItem>
                            <SelectItem value="4">4 CH</SelectItem>
                            <SelectItem value="6">6 CH</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={course.expectedGrade}
                          onValueChange={(value) => updateCourse(semester.id, course.id, "expectedGrade", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(gradePoints).map((grade) => (
                              <SelectItem key={grade} value={grade}>
                                {grade} ({gradePoints[grade]})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={() => removeCourse(semester.id, course.id)}
                          size="sm"
                          variant="outline"
                          className="bg-transparent text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={reset} variant="outline" className="bg-transparent">
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {canCalculate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              GPA Projection Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{calculations.finalGPA.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Projected GPA</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-accent">{calculations.totalPlannedCreditHours}</div>
                  <div className="text-sm text-muted-foreground">Planned Credit Hours</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {Number.parseInt(currentCreditHours) + calculations.totalPlannedCreditHours}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Credit Hours</div>
                </CardContent>
              </Card>
            </div>

            {/* Target Analysis */}
            {targetGPA && (
              <Card
                className={`border-l-4 ${calculations.targetAchievable ? "border-l-green-500 bg-green-50/50" : "border-l-blue-500 bg-blue-50/50"}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {calculations.targetAchievable ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                    )}
                    <span className="font-semibold">Target GPA: {targetGPA}</span>
                  </div>
                  <p className="text-sm">
                    {calculations.targetAchievable
                      ? `Great! Your planned courses will help you achieve your target GPA of ${targetGPA}.`
                      : `Your current plan won't reach the target GPA of ${targetGPA}. You need an average GPA of ${calculations.gpaNeeded.toFixed(2)} in your planned courses.`}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Semester Breakdown */}
            <div className="space-y-3">
              <h4 className="font-semibold">Semester Breakdown</h4>
              {calculations.semesterResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium">{result.semester}</div>
                    <div className="text-sm text-muted-foreground">{result.creditHours} Credit Hours</div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-1">
                      Semester: {result.semesterGPA.toFixed(2)}
                    </Badge>
                    <div className="text-sm text-muted-foreground">Cumulative: {result.cumulativeGPA.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
