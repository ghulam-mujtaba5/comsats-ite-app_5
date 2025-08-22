// Mock data and types for past papers system

export interface PastPaper {
  id: string
  title: string
  course: string
  courseCode: string
  department: string
  semester: string
  year: number
  examType: "Mid-Term" | "Final" | "Quiz" | "Assignment"
  uploadedBy: string
  uploadDate: string
  downloadCount: number
  fileSize: string
  fileType: "PDF" | "DOC" | "DOCX"
  downloadUrl?: string // Added downloadUrl property for file downloads
  tags: string[]
}

export interface Department {
  id: string
  name: string
  code: string
  courses: Course[]
}

export interface Course {
  id: string
  name: string
  code: string
  creditHours: number
}

// Mock departments and courses data
export const departments: Department[] = [
  {
    id: "1",
    name: "Computer Science",
    code: "CS",
    courses: [
      { id: "1", name: "Programming Fundamentals", code: "CS-101", creditHours: 3 },
      { id: "2", name: "Data Structures", code: "CS-201", creditHours: 3 },
      { id: "3", name: "Database Systems", code: "CS-301", creditHours: 3 },
      { id: "4", name: "Software Engineering", code: "CS-302", creditHours: 3 },
      { id: "5", name: "Computer Networks", code: "CS-401", creditHours: 3 },
    ],
  },
  {
    id: "2",
    name: "Electrical Engineering",
    code: "EE",
    courses: [
      { id: "6", name: "Circuit Analysis", code: "EE-101", creditHours: 3 },
      { id: "7", name: "Digital Logic Design", code: "EE-201", creditHours: 3 },
      { id: "8", name: "Microprocessors", code: "EE-301", creditHours: 3 },
      { id: "9", name: "Power Systems", code: "EE-401", creditHours: 3 },
    ],
  },
  {
    id: "3",
    name: "Business Administration",
    code: "BBA",
    courses: [
      { id: "10", name: "Principles of Management", code: "MGT-101", creditHours: 3 },
      { id: "11", name: "Financial Accounting", code: "ACC-101", creditHours: 3 },
      { id: "12", name: "Marketing Management", code: "MKT-201", creditHours: 3 },
      { id: "13", name: "Human Resource Management", code: "HRM-301", creditHours: 3 },
    ],
  },
]

// Mock past papers data
export const mockPastPapers: PastPaper[] = [
  {
    id: "1",
    title: "Programming Fundamentals Mid-Term Exam",
    course: "Programming Fundamentals",
    courseCode: "CS-101",
    department: "Computer Science",
    semester: "Fall 2023",
    year: 2023,
    examType: "Mid-Term",
    uploadedBy: "Dr. Ahmed Khan",
    uploadDate: "2024-01-15",
    downloadCount: 245,
    fileSize: "2.3 MB",
    fileType: "PDF",
    downloadUrl: "/placeholder-paper-1.pdf", // Added download URL
    tags: ["C++", "Loops", "Functions", "Arrays"],
  },
  {
    id: "2",
    title: "Data Structures Final Exam",
    course: "Data Structures",
    courseCode: "CS-201",
    department: "Computer Science",
    semester: "Spring 2023",
    year: 2023,
    examType: "Final",
    uploadedBy: "Dr. Sarah Ali",
    uploadDate: "2024-01-10",
    downloadCount: 189,
    fileSize: "3.1 MB",
    fileType: "PDF",
    downloadUrl: "/placeholder-paper-2.pdf", // Added download URL
    tags: ["Trees", "Graphs", "Sorting", "Searching"],
  },
  {
    id: "3",
    title: "Database Systems Mid-Term",
    course: "Database Systems",
    courseCode: "CS-301",
    department: "Computer Science",
    semester: "Fall 2023",
    year: 2023,
    examType: "Mid-Term",
    uploadedBy: "Dr. Muhammad Hassan",
    uploadDate: "2024-01-08",
    downloadCount: 156,
    fileSize: "1.8 MB",
    fileType: "PDF",
    downloadUrl: "/placeholder-paper-3.pdf", // Added download URL
    tags: ["SQL", "ER Diagrams", "Normalization"],
  },
  {
    id: "4",
    title: "Circuit Analysis Final Exam",
    course: "Circuit Analysis",
    courseCode: "EE-101",
    department: "Electrical Engineering",
    semester: "Spring 2023",
    year: 2023,
    examType: "Final",
    uploadedBy: "Dr. Fatima Sheikh",
    uploadDate: "2024-01-05",
    downloadCount: 98,
    fileSize: "2.7 MB",
    fileType: "PDF",
    downloadUrl: "/placeholder-paper-4.pdf", // Added download URL
    tags: ["Ohms Law", "Kirchhoff", "AC Circuits"],
  },
  {
    id: "5",
    title: "Financial Accounting Quiz 1",
    course: "Financial Accounting",
    courseCode: "ACC-101",
    department: "Business Administration",
    semester: "Fall 2023",
    year: 2023,
    examType: "Quiz",
    uploadedBy: "Prof. Aisha Malik",
    uploadDate: "2024-01-03",
    downloadCount: 67,
    fileSize: "0.9 MB",
    fileType: "PDF",
    downloadUrl: "/placeholder-paper-5.pdf", // Added download URL
    tags: ["Balance Sheet", "Income Statement", "Assets"],
  },
]

export const examTypes = ["All", "Mid-Term", "Final", "Quiz", "Assignment"] as const
export const semesters = ["All", "Fall 2023", "Spring 2023", "Fall 2022", "Spring 2022"] as const
export const years = [2024, 2023, 2022, 2021, 2020]

// Utility functions
export function filterPapers(
  papers: PastPaper[],
  filters: {
    department?: string
    course?: string
    examType?: string
    semester?: string
    year?: number
    search?: string
  },
): PastPaper[] {
  return papers.filter((paper) => {
    if (filters.department && filters.department !== "All" && paper.department !== filters.department) {
      return false
    }
    if (filters.course && filters.course !== "All" && paper.courseCode !== filters.course) {
      return false
    }
    if (filters.examType && filters.examType !== "All" && paper.examType !== filters.examType) {
      return false
    }
    if (filters.semester && filters.semester !== "All" && paper.semester !== filters.semester) {
      return false
    }
    if (filters.year && paper.year !== filters.year) {
      return false
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      return (
        paper.title.toLowerCase().includes(searchLower) ||
        paper.course.toLowerCase().includes(searchLower) ||
        paper.courseCode.toLowerCase().includes(searchLower) ||
        paper.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      )
    }
    return true
  })
}

export function getCoursesByDepartment(departmentName: string): Course[] {
  const department = departments.find((dept) => dept.name === departmentName)
  return department?.courses || []
}

export interface CourseWithPapers extends Course {
  department: string
  totalPapers: number
  assignments: PastPaper[]
  quizzes: PastPaper[]
  midterms: PastPaper[]
  finals: PastPaper[]
  lastUpdated: string
}

export function getCoursesWithPapers(): CourseWithPapers[] {
  const coursesMap = new Map<string, CourseWithPapers>()

  // Initialize courses
  departments.forEach((dept) => {
    dept.courses.forEach((course) => {
      coursesMap.set(course.code, {
        ...course,
        department: dept.name,
        totalPapers: 0,
        assignments: [],
        quizzes: [],
        midterms: [],
        finals: [],
        lastUpdated: "2024-01-15",
      })
    })
  })

  // Organize papers by course and type
  mockPastPapers.forEach((paper) => {
    const course = coursesMap.get(paper.courseCode)
    if (course) {
      course.totalPapers++
      switch (paper.examType) {
        case "Assignment":
          course.assignments.push(paper)
          break
        case "Quiz":
          course.quizzes.push(paper)
          break
        case "Mid-Term":
          course.midterms.push(paper)
          break
        case "Final":
          course.finals.push(paper)
          break
      }
      // Update last updated date
      if (paper.uploadDate > course.lastUpdated) {
        course.lastUpdated = paper.uploadDate
      }
    }
  })

  return Array.from(coursesMap.values()).filter((course) => course.totalPapers > 0)
}

export function getCourseByCode(courseCode: string): CourseWithPapers | undefined {
  return getCoursesWithPapers().find((course) => course.code === courseCode)
}
