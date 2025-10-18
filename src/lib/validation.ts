import { z } from 'zod'

/**
 * Centralized validation schemas for API routes
 * This ensures consistent validation across the application
 */

// Common reusable schemas
export const uuidSchema = z.string().uuid({ message: 'Invalid UUID format' })
export const emailSchema = z.string().email({ message: 'Invalid email format' })
export const urlSchema = z.string().url({ message: 'Invalid URL format' })

// Sanitization helpers
export function sanitizeString(input: string, maxLength: number = 1000): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '') // Remove iframes
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
}

export function sanitizeHtml(input: string): string {
  // Basic HTML sanitization - consider using DOMPurify for production
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Past Paper Upload Schema
export const pastPaperUploadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  course: z.string().min(2, 'Course code required').max(50),
  courseName: z.string().optional(),
  examType: z.enum(['midterm', 'final', 'quiz', 'assignment', 'other'], {
    errorMap: () => ({ message: 'Invalid exam type' })
  }),
  semester: z.string().min(1, 'Semester required').max(20),
  year: z.number().int().min(2000).max(2100).optional(),
  department: z.string().max(100).optional(),
  campus_id: uuidSchema.optional(),
  externalUrl: urlSchema.optional(),
})

// Review Schema
export const reviewCreateSchema = z.object({
  faculty_id: uuidSchema,
  course: z.string().min(1, 'Course is required').max(50),
  semester: z.string().min(1, 'Semester is required').max(20),
  rating: z.number().int().min(1, 'Rating must be 1-5').max(5, 'Rating must be 1-5'),
  teaching_quality: z.number().int().min(0).max(5).default(0),
  accessibility: z.number().int().min(0).max(5).default(0),
  course_material: z.number().int().min(0).max(5).default(0),
  grading: z.number().int().min(0).max(5).default(0),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(2000, 'Comment too long'),
  pros: z.array(z.string().max(200)).max(10).default([]),
  cons: z.array(z.string().max(200)).max(10).default([]),
  would_recommend: z.boolean().default(false),
  is_anonymous: z.boolean().default(false),
})

// Admin User Schema
export const adminUserCreateSchema = z.object({
  userId: uuidSchema,
  role: z.enum(['super_admin', 'admin', 'moderator', 'content_curator'], {
    errorMap: () => ({ message: 'Invalid role' })
  }),
  permissions: z.array(z.string()).max(50).default([]),
  gamification_role: z.string().max(50).optional().nullable(),
})

// Lost & Found Schema
export const lostFoundCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  category: z.enum(['electronics', 'documents', 'clothing', 'accessories', 'books', 'other']),
  type: z.enum(['lost', 'found']),
  location: z.string().min(2, 'Location required').max(200),
  contact: z.string().min(5, 'Contact info required').max(100),
  campus_id: uuidSchema.optional(),
})

// Community Post Schema
export const communityPostCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  content: z.string().min(10, 'Content must be at least 10 characters').max(10000),
  category: z.enum(['general', 'academic', 'events', 'help', 'announcement', 'discussion']),
  tags: z.array(z.string().max(30)).max(10).default([]),
  campus_id: uuidSchema.optional(),
})

// Event Schema
export const eventCreateSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  event_time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)').optional(),
  location: z.string().min(2).max(200),
  category: z.enum(['academic', 'sports', 'cultural', 'workshop', 'seminar', 'other']),
  organizer: z.string().max(100).optional(),
  capacity: z.number().int().min(0).optional(),
  registration_open: z.boolean().default(true),
  image_url: urlSchema.optional().nullable(),
})

// File Upload Validation
export const fileUploadSchema = z.object({
  size: z.number().max(10 * 1024 * 1024, 'File size must not exceed 10MB'),
  type: z.string().refine(
    (type) => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(type),
    { message: 'Only PDF, DOC, and DOCX files are allowed' }
  ),
})

export const imageUploadSchema = z.object({
  size: z.number().max(5 * 1024 * 1024, 'Image size must not exceed 5MB'),
  type: z.string().refine(
    (type) => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(type),
    { message: 'Only JPEG, PNG, WebP, and GIF images are allowed' }
  ),
})

// Search Query Schema
export const searchQuerySchema = z.object({
  q: z.string().min(1).max(200).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sort: z.enum(['relevance', 'date', 'popularity']).default('relevance'),
})

// Validation helper function
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  const errors = result.error.errors.map(
    (err) => `${err.path.join('.')}: ${err.message}`
  )
  
  return { success: false, errors }
}

// SQL Injection Prevention
export function escapeSQL(input: string): string {
  return input.replace(/['";\\]/g, '\\$&')
}

// XSS Prevention for display
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Rate limit key generation (for IP-based limiting)
export function getRateLimitKey(identifier: string, action: string): string {
  return `ratelimit:${action}:${identifier}`
}
