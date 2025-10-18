// Mock data and types for learning resources and timetables

export interface LearningResource {
  id: string
  title: string
  description: string
  type: "Notes" | "Video" | "Book" | "Tutorial" | "Practice" | "Reference"
  subject: string
  course: string
  department: string
  author: string
  uploadDate: string
  downloadCount: number
  rating: number
  totalRatings: number
  fileSize?: string
  duration?: string
  url?: string
  downloadUrl?: string // Added downloadUrl property for file downloads
  fileType?: string // Added fileType property for download functionality
  tags: string[]
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  isVerified: boolean
}

export interface TimetableEvent {
  id: string
  title: string
  type: "Class" | "Exam" | "Assignment" | "Holiday" | "Event" | "Deadline"
  course?: string
  instructor?: string
  location?: string
  startTime: string
  endTime: string
  date: string
  description?: string
  department?: string
  semester?: string
  isRecurring: boolean
  color: string
}

// Mock learning resources data
export const mockLearningResources: LearningResource[] = [
  {
    id: "1",
    title: "Complete C++ Programming Guide",
    description:
      "Comprehensive notes covering all C++ fundamentals including OOP concepts, data structures, and advanced topics.",
    type: "Notes",
    subject: "Programming",
    course: "CS-101",
    department: "Computer Science",
    author: "Dr. Ahmed Khan",
    uploadDate: "2024-01-15",
    downloadCount: 342,
    rating: 4.6,
    totalRatings: 45,
    fileSize: "2.3 MB",
    fileType: "PDF", // Added file type
    downloadUrl: "/placeholder-resource-1.pdf", // Added download URL
    tags: ["C++", "OOP", "Programming", "Fundamentals"],
    difficulty: "Beginner",
    isVerified: true,
  },
  {
    id: "2",
    title: "Data Structures Video Lectures",
    description:
      "Complete video series covering arrays, linked lists, trees, graphs, and sorting algorithms with practical examples.",
    type: "Video",
    subject: "Data Structures",
    course: "CS-201",
    department: "Computer Science",
    author: "Dr. Sarah Ali",
    uploadDate: "2024-01-12",
    downloadCount: 256,
    rating: 4.8,
    totalRatings: 38,
    duration: "12 hours",
    url: "https://example.com/video-series",
    fileType: "MP4", // Added file type
    downloadUrl: "/placeholder-resource-2.mp4", // Added download URL
    tags: ["Data Structures", "Algorithms", "Trees", "Graphs"],
    difficulty: "Intermediate",
    isVerified: true,
  },
  {
    id: "3",
    title: "Database Design Practice Problems",
    description:
      "Collection of practice problems for ER diagrams, normalization, SQL queries, and database optimization.",
    type: "Practice",
    subject: "Database Systems",
    course: "CS-301",
    department: "Computer Science",
    author: "Dr. Muhammad Hassan",
    uploadDate: "2024-01-10",
    downloadCount: 189,
    rating: 4.4,
    totalRatings: 29,
    fileSize: "1.8 MB",
    fileType: "PDF", // Added file type
    downloadUrl: "/placeholder-resource-3.pdf", // Added download URL
    tags: ["Database", "SQL", "ER Diagrams", "Normalization"],
    difficulty: "Intermediate",
    isVerified: true,
  },
  {
    id: "4",
    title: "Circuit Analysis Reference Book",
    description:
      "Essential reference material for circuit analysis including Ohm's law, Kirchhoff's laws, and AC/DC circuits.",
    type: "Book",
    subject: "Circuit Analysis",
    course: "EE-101",
    department: "Electrical Engineering",
    author: "Dr. Fatima Sheikh",
    uploadDate: "2024-01-08",
    downloadCount: 145,
    rating: 4.3,
    totalRatings: 22,
    fileSize: "5.2 MB",
    fileType: "PDF", // Added file type
    downloadUrl: "/placeholder-resource-4.pdf", // Added download URL
    tags: ["Circuits", "Ohms Law", "Kirchhoff", "AC/DC"],
    difficulty: "Beginner",
    isVerified: true,
  },
  {
    id: "5",
    title: "Financial Accounting Tutorial Series",
    description:
      "Step-by-step tutorials covering balance sheets, income statements, cash flow, and financial ratio analysis.",
    type: "Tutorial",
    subject: "Accounting",
    course: "ACC-101",
    department: "Business Administration",
    author: "Prof. Aisha Malik",
    uploadDate: "2024-01-05",
    downloadCount: 98,
    rating: 4.2,
    totalRatings: 18,
    duration: "8 hours",
    fileType: "MP4", // Added file type
    downloadUrl: "/placeholder-resource-5.mp4", // Added download URL
    tags: ["Accounting", "Balance Sheet", "Income Statement", "Financial Analysis"],
    difficulty: "Beginner",
    isVerified: true,
  },
  {
    id: "6",
    title: "Machine Learning Quick Reference",
    description: "Concise reference guide for ML algorithms, implementation tips, and common use cases.",
    type: "Reference",
    subject: "Machine Learning",
    course: "CS-501",
    department: "Computer Science",
    author: "Student Contributor",
    uploadDate: "2024-01-03",
    downloadCount: 67,
    rating: 4.0,
    totalRatings: 12,
    fileSize: "0.9 MB",
    fileType: "PDF", // Added file type
    downloadUrl: "/placeholder-resource-6.pdf", // Added download URL
    tags: ["Machine Learning", "AI", "Algorithms", "Python"],
    difficulty: "Advanced",
    isVerified: false,
  },
]

// Mock timetable events data
export const mockTimetableEvents: TimetableEvent[] = [
  {
    id: "1",
    title: "Programming Fundamentals",
    type: "Class",
    course: "CS-101",
    instructor: "Dr. Ahmed Khan",
    location: "Room CS-201",
    startTime: "09:00",
    endTime: "10:30",
    date: "2024-03-18",
    department: "Computer Science",
    semester: "Spring 2024",
    isRecurring: true,
    color: "#3b82f6",
  },
  {
    id: "2",
    title: "Data Structures Lab",
    type: "Class",
    course: "CS-201",
    instructor: "Dr. Sarah Ali",
    location: "Lab CS-105",
    startTime: "11:00",
    endTime: "12:30",
    date: "2024-03-18",
    department: "Computer Science",
    semester: "Spring 2024",
    isRecurring: true,
    color: "#10b981",
  },
  {
    id: "3",
    title: "Database Systems Mid-Term",
    type: "Exam",
    course: "CS-301",
    instructor: "Dr. Muhammad Hassan",
    location: "Main Hall",
    startTime: "14:00",
    endTime: "16:00",
    date: "2024-03-20",
    description: "Mid-term examination covering ER diagrams, normalization, and SQL queries",
    department: "Computer Science",
    semester: "Spring 2024",
    isRecurring: false,
    color: "#ef4444",
  },
  {
    id: "4",
    title: "Software Engineering Project Submission",
    type: "Deadline",
    course: "CS-401",
    startTime: "23:59",
    endTime: "23:59",
    date: "2024-03-22",
    description: "Final project submission deadline for Software Engineering course",
    department: "Computer Science",
    semester: "Spring 2024",
    isRecurring: false,
    color: "#f59e0b",
  },
  {
    id: "5",
    title: "Spring Break",
    type: "Holiday",
    startTime: "00:00",
    endTime: "23:59",
    date: "2024-03-25",
    description: "University closed for spring break",
    isRecurring: false,
    color: "#8b5cf6",
  },
  {
    id: "6",
    title: "Career Fair 2024",
    type: "Event",
    location: "University Auditorium",
    startTime: "10:00",
    endTime: "16:00",
    date: "2024-03-28",
    description: "Annual career fair with leading companies and recruitment opportunities",
    isRecurring: false,
    color: "#06b6d4",
  },
]

// Utility functions
export const resourceTypes = ["All", "Notes", "Video", "Book", "Tutorial", "Practice", "Reference"] as const
export const difficulties = ["All", "Beginner", "Intermediate", "Advanced"] as const
export const eventTypes = ["All", "Class", "Exam", "Assignment", "Holiday", "Event", "Deadline"] as const

export const departments = ["All", "Computer Science", "Electrical Engineering", "Business Administration"] as const

export function filterResources(
  resources: LearningResource[],
  filters: {
    type?: string
    department?: string
    difficulty?: string
    search?: string
    verified?: boolean
  },
): LearningResource[] {
  return resources.filter((resource) => {
    if (filters.type && filters.type !== "All" && resource.type !== filters.type) {
      return false
    }
    if (filters.department && filters.department !== "All" && resource.department !== filters.department) {
      return false
    }
    if (filters.difficulty && filters.difficulty !== "All" && resource.difficulty !== filters.difficulty) {
      return false
    }
    if (filters.verified !== undefined && resource.isVerified !== filters.verified) {
      return false
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      return (
        resource.title.toLowerCase().includes(searchLower) ||
        resource.description.toLowerCase().includes(searchLower) ||
        resource.subject.toLowerCase().includes(searchLower) ||
        resource.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      )
    }
    return true
  })
}

export function filterTimetableEvents(
  events: TimetableEvent[],
  filters: {
    type?: string
    department?: string
    date?: string
  },
): TimetableEvent[] {
  return events.filter((event) => {
    if (filters.type && filters.type !== "All" && event.type !== filters.type) {
      return false
    }
    if (filters.department && filters.department !== "All" && event.department !== filters.department) {
      return false
    }
    if (filters.date && event.date !== filters.date) {
      return false
    }
    return true
  })
}

export function getEventsForDate(events: TimetableEvent[], date: string): TimetableEvent[] {
  return events.filter((event) => event.date === date).sort((a, b) => a.startTime.localeCompare(b.startTime))
}
