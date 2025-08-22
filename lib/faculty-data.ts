// Mock data and types for faculty reviews system

export interface Faculty {
  id: string
  name: string
  title: string
  department: string
  email: string
  office: string
  phone?: string
  specialization: string[]
  courses: string[]
  education: string[]
  experience: string
  profileImage?: string
  averageRating: number
  totalReviews: number
  joinDate: string
}

export interface Review {
  id: string
  facultyId: string
  studentName: string
  studentId: string
  course: string
  semester: string
  rating: number
  teachingQuality: number
  accessibility: number
  courseMaterial: number
  grading: number
  comment: string
  pros: string[]
  cons: string[]
  wouldRecommend: boolean
  isAnonymous: boolean
  createdAt: string
  helpful: number
  reported: number
}

export interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: { [key: number]: number }
  recommendationRate: number
}

// Mock faculty data
export const mockFaculty: Faculty[] = [
  {
    id: "1",
    name: "Dr. Ahmed Khan",
    title: "Professor",
    department: "Computer Science",
    email: "ahmed.khan@cuilahore.edu.pk",
    office: "CS-201",
    phone: "+92-42-111-001-007",
    specialization: ["Software Engineering", "Database Systems", "Web Development"],
    courses: ["CS-101 Programming Fundamentals", "CS-301 Database Systems", "CS-401 Software Engineering"],
    education: ["PhD Computer Science - University of Punjab", "MS Computer Science - LUMS"],
    experience: "15 years",
    averageRating: 4.2,
    totalReviews: 45,
    joinDate: "2010-08-15",
  },
  {
    id: "2",
    name: "Dr. Sarah Ali",
    title: "Associate Professor",
    department: "Computer Science",
    email: "sarah.ali@cuilahore.edu.pk",
    office: "CS-105",
    specialization: ["Data Structures", "Algorithms", "Machine Learning"],
    courses: ["CS-201 Data Structures", "CS-301 Algorithms", "CS-501 Machine Learning"],
    education: ["PhD Computer Science - MIT", "MS Computer Science - Stanford"],
    experience: "12 years",
    averageRating: 4.6,
    totalReviews: 38,
    joinDate: "2012-01-20",
  },
  {
    id: "3",
    name: "Dr. Muhammad Hassan",
    title: "Assistant Professor",
    department: "Computer Science",
    email: "m.hassan@cuilahore.edu.pk",
    office: "CS-110",
    specialization: ["Computer Networks", "Cybersecurity", "Distributed Systems"],
    courses: ["CS-401 Computer Networks", "CS-501 Network Security", "CS-601 Distributed Systems"],
    education: ["PhD Computer Science - NUST", "MS Computer Science - FAST"],
    experience: "8 years",
    averageRating: 3.9,
    totalReviews: 29,
    joinDate: "2016-09-01",
  },
  {
    id: "4",
    name: "Dr. Fatima Sheikh",
    title: "Professor",
    department: "Electrical Engineering",
    email: "fatima.sheikh@cuilahore.edu.pk",
    office: "EE-201",
    specialization: ["Circuit Analysis", "Power Systems", "Control Systems"],
    courses: ["EE-101 Circuit Analysis", "EE-301 Power Systems", "EE-401 Control Systems"],
    education: ["PhD Electrical Engineering - UET", "MS Electrical Engineering - NUST"],
    experience: "18 years",
    averageRating: 4.4,
    totalReviews: 52,
    joinDate: "2008-03-10",
  },
  {
    id: "5",
    name: "Prof. Aisha Malik",
    title: "Professor",
    department: "Business Administration",
    email: "aisha.malik@cuilahore.edu.pk",
    office: "BBA-301",
    specialization: ["Financial Management", "Strategic Management", "Entrepreneurship"],
    courses: ["ACC-101 Financial Accounting", "MGT-301 Strategic Management", "ENT-401 Entrepreneurship"],
    education: ["PhD Business Administration - IBA", "MBA Finance - LUMS"],
    experience: "20 years",
    averageRating: 4.1,
    totalReviews: 67,
    joinDate: "2005-07-15",
  },
]

// Mock reviews data
export const mockReviews: Review[] = [
  {
    id: "1",
    facultyId: "1",
    studentName: "Anonymous Student",
    studentId: "SP21-BCS-001",
    course: "CS-301 Database Systems",
    semester: "Fall 2023",
    rating: 4,
    teachingQuality: 4,
    accessibility: 4,
    courseMaterial: 5,
    grading: 3,
    comment:
      "Dr. Khan is very knowledgeable and explains concepts clearly. His database course was well-structured with practical examples. However, his grading can be quite strict.",
    pros: ["Clear explanations", "Practical examples", "Well-organized course"],
    cons: ["Strict grading", "Heavy workload"],
    wouldRecommend: true,
    isAnonymous: true,
    createdAt: "2024-01-15",
    helpful: 12,
    reported: 0,
  },
  {
    id: "2",
    facultyId: "1",
    studentName: "Ali Ahmad",
    studentId: "SP20-BCS-045",
    course: "CS-101 Programming Fundamentals",
    semester: "Spring 2023",
    rating: 5,
    teachingQuality: 5,
    accessibility: 4,
    courseMaterial: 5,
    grading: 4,
    comment:
      "Excellent teacher! Made programming concepts very easy to understand. Always available for help during office hours.",
    pros: ["Excellent teaching", "Always available", "Patient with beginners"],
    cons: ["Sometimes moves too fast"],
    wouldRecommend: true,
    isAnonymous: false,
    createdAt: "2024-01-10",
    helpful: 8,
    reported: 0,
  },
  {
    id: "3",
    facultyId: "2",
    studentName: "Anonymous Student",
    studentId: "SP21-BCS-023",
    course: "CS-201 Data Structures",
    semester: "Fall 2023",
    rating: 5,
    teachingQuality: 5,
    accessibility: 5,
    courseMaterial: 4,
    grading: 5,
    comment:
      "Dr. Sarah is amazing! Her teaching style is very engaging and she makes complex topics seem simple. Fair grading and very approachable.",
    pros: ["Engaging teaching", "Fair grading", "Very approachable", "Clear explanations"],
    cons: ["Course can be challenging"],
    wouldRecommend: true,
    isAnonymous: true,
    createdAt: "2024-01-08",
    helpful: 15,
    reported: 0,
  },
]

// Utility functions
export function getFacultyByDepartment(department: string): Faculty[] {
  if (department === "All") return mockFaculty
  return mockFaculty.filter((faculty) => faculty.department === department)
}

export function getFacultyById(id: string): Faculty | undefined {
  return mockFaculty.find((faculty) => faculty.id === id)
}

export function getReviewsByFacultyId(facultyId: string): Review[] {
  return mockReviews.filter((review) => review.facultyId === facultyId)
}

export function calculateReviewStats(reviews: Review[]): ReviewStats {
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      recommendationRate: 0,
    }
  }

  const totalReviews = reviews.length
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  const recommendations = reviews.filter((review) => review.wouldRecommend).length

  reviews.forEach((review) => {
    ratingDistribution[review.rating as keyof typeof ratingDistribution]++
  })

  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    ratingDistribution,
    recommendationRate: Math.round((recommendations / totalReviews) * 100),
  }
}

export function searchFaculty(faculty: Faculty[], query: string): Faculty[] {
  if (!query.trim()) return faculty

  const searchTerm = query.toLowerCase()
  return faculty.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm) ||
      f.specialization.some((spec) => spec.toLowerCase().includes(searchTerm)) ||
      f.courses.some((course) => course.toLowerCase().includes(searchTerm)) ||
      f.department.toLowerCase().includes(searchTerm),
  )
}

export const departments = ["All", "Computer Science", "Electrical Engineering", "Business Administration"]
