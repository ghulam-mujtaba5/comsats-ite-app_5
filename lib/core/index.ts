// Core Business Logic and Domain Models Export
export * from '@/lib/auth'
export * from '@/lib/community'
export * from '@/lib/gamification'
export { mockFaculty, mockReviews, type Faculty, type Review, type ReviewStats } from '@/lib/faculty-data'
export { mockPastPapers, departments as pastPaperDepartments, type PastPaper, type Department } from '@/lib/past-papers-data'
export * from '@/lib/resources-data'
export * from '@/lib/gpa-utils'