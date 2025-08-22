// GPA calculation utilities for COMSATS University system

export interface Course {
  id: string
  name: string
  creditHours: number
  grade: string
  gradePoints?: number
}

export interface Semester {
  id: string
  name: string
  courses: Course[]
  gpa?: number
  totalCredits?: number
}

// COMSATS grading system
export const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.66,
  "B+": 3.33,
  B: 3.0,
  "B-": 2.67,
  "C+": 2.33,
  C: 2.0,
  "C-": 1.67,
  "D+": 1.33,
  D: 1.0,
  F: 0.0,
}

export const gradePoints = GRADE_POINTS

export const GRADES = Object.keys(GRADE_POINTS)

export function calculateCoursePoints(course: Course): number {
  const gradePoints = GRADE_POINTS[course.grade] || 0
  return gradePoints * course.creditHours
}

export function calculateSemesterGPA(courses: Course[]): { gpa: number; totalCredits: number } {
  if (courses.length === 0) return { gpa: 0, totalCredits: 0 }

  let totalPoints = 0
  let totalCredits = 0

  courses.forEach((course) => {
    if (course.grade && course.creditHours > 0) {
      totalPoints += calculateCoursePoints(course)
      totalCredits += course.creditHours
    }
  })

  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0
  return { gpa: round2(gpa), totalCredits }
}

export function calculateCumulativeGPA(semesters: Semester[]): { cgpa: number; totalCredits: number } {
  let totalPoints = 0
  let totalCredits = 0

  semesters.forEach((semester) => {
    semester.courses.forEach((course) => {
      if (course.grade && course.creditHours > 0) {
        totalPoints += calculateCoursePoints(course)
        totalCredits += course.creditHours
      }
    })
  })

  const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0
  return { cgpa: round2(cgpa), totalCredits }
}

// Aggregate calculation for admissions (typically Matric + Inter + Entry Test)
export interface AggregateData {
  matricMarks: number
  matricTotal: number
  interMarks: number
  interTotal: number
  entryTestMarks: number
  entryTestTotal: number
}

export function calculateAggregate(data: AggregateData): number {
  const matricPercentage = (data.matricMarks / data.matricTotal) * 100
  const interPercentage = (data.interMarks / data.interTotal) * 100
  const entryTestPercentage = (data.entryTestMarks / data.entryTestTotal) * 100

  // COMSATS aggregate formula: 10% Matric + 40% Inter + 50% Entry Test
  const aggregate = matricPercentage * 0.1 + interPercentage * 0.4 + entryTestPercentage * 0.5
  return round2(aggregate)
}

export function getGradeFromGPA(gpa: number): string {
  if (gpa >= 4.0) return "A+"
  if (gpa >= 3.67) return "A"
  if (gpa >= 3.66) return "A-"
  if (gpa >= 3.33) return "B+"
  if (gpa >= 3.0) return "B"
  if (gpa >= 2.67) return "B-"
  if (gpa >= 2.33) return "C+"
  if (gpa >= 2.0) return "C"
  if (gpa >= 1.67) return "C-"
  if (gpa >= 1.33) return "D+"
  if (gpa >= 1.0) return "D"
  return "F"
}

// Helper to consistently round to 2 decimals avoiding floating errors
function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}
