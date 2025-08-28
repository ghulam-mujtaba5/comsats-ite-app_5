"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Calculator } from "lucide-react"
import { type Course, GRADES, calculateSemesterGPA, getGradeFromGPA } from "@/lib/gpa-utils"

export function SemesterGPACalculator() {
  const [courses, setCourses] = useState<Course[]>([{ id: "1", name: "", creditHours: 3, grade: "" }])

  const validCourses = useMemo(
    () => courses.filter((course) => course.grade && course.creditHours > 0),
    [courses],
  )

  const liveResult = useMemo(() => {
    if (validCourses.length === 0) return null
    return calculateSemesterGPA(validCourses)
  }, [validCourses])

  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: "",
      creditHours: 3,
      grade: "",
    }
    setCourses([...courses, newCourse])
  }

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter((course) => course.id !== id))
    }
  }

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(courses.map((course) => (course.id === id ? { ...course, [field]: value } : course)))
  }

  const resetCalculator = () => {
    setCourses([{ id: "1", name: "", creditHours: 3, grade: "" }])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Semester GPA Calculator
        </CardTitle>
        <CardDescription>Calculate your GPA for a single semester by entering your courses and grades</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {courses.map((course, index) => (
            <div key={course.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-border rounded-lg">
              <div className="md:col-span-5">
                <Label htmlFor={`course-${course.id}`}>Course Name</Label>
                <Input
                  id={`course-${course.id}`}
                  placeholder="e.g., Data Structures"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor={`credits-${course.id}`}>Credit Hours</Label>
                <Input
                  id={`credits-${course.id}`}
                  type="number"
                  min="1"
                  max="6"
                  value={course.creditHours}
                  onChange={(e) => updateCourse(course.id, "creditHours", Number.parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="md:col-span-3">
                <Label htmlFor={`grade-${course.id}`}>Grade</Label>
                <Select value={course.grade} onValueChange={(value) => updateCourse(course.id, "grade", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeCourse(course.id)}
                  disabled={courses.length === 1}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={addCourse} className="flex-1 bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
          <Button variant="outline" onClick={resetCalculator} className="flex-1 bg-transparent">
            Reset
          </Button>
        </div>

        {liveResult && (
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div>
                  <div className="text-3xl font-bold text-primary">{liveResult.gpa.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Semester GPA</div>
                </div>
                <div className="flex justify-center gap-4">
                  <Badge variant="secondary">Grade: {getGradeFromGPA(liveResult.gpa)}</Badge>
                  <Badge variant="outline">Total Credits: {liveResult.totalCredits}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
