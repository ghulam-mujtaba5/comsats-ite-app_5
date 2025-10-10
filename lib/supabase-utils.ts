import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

/**
 * Creates a Supabase client for server-side operations
 * @returns Supabase client instance
 */
export async function createSupabaseClient() {
  const cookieStore = await (cookies() as any)
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options?: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options?: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

/**
 * Extracts and validates query parameters from a request
 * @param request Next.js request object
 * @returns Object containing validated parameters
 */
export function extractQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  return {
    limit: Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10), 1), 100),
    offset: Math.max(parseInt(searchParams.get('offset') || '0', 10), 0),
    withMeta: (searchParams.get('meta') || '') === '1',
    campusId: searchParams.get('campus_id'),
    departmentId: searchParams.get('department_id'),
    batch: searchParams.get('batch'), // e.g., 'FA22-BSE'
    sortBy: searchParams.get('sort') || 'created_at',
    sortOrder: (searchParams.get('order') || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc'
  }
}

/**
 * Transforms a database post record to the frontend interface
 * @param post Database post record
 * @param likedSet Set of post IDs that the current user has liked
 * @returns Transformed post object
 */
export function transformPostRecord(post: any, likedSet: Set<string> = new Set()): any {
  // Format time ago
  const timeAgo = formatTimeAgo(post.created_at)
  
  return {
    id: post.id.toString(),
    author: post.author_name || post.user?.email?.split('@')[0] || 'Anonymous',
    avatar: post.avatar_url || post.user?.user_metadata?.avatar_url || '/student-avatar.png',
    department: post.department || (post.departments ? post.departments.name : ''),
    departmentCode: post.departments ? post.departments.code : '',
    campus: post.campuses ? post.campuses.name : '',
    campusCode: post.campuses ? post.campuses.code : '',
    semester: post.semester || '',
    batch: post.batch || '', // e.g., 'FA22-BSE'
    time: timeAgo,
    content: post.content,
    likes: post.likes_count || 0,
    comments: post.comments_count || 0,
    shares: post.shares_count || 0,
    tags: Array.isArray(post.tags) ? post.tags : [],
    liked: likedSet.has(String(post.id)),
    type: post.type || 'general',
    media: post.media || [],
    location: post.location || null,
    feeling: post.feeling || null,
    isEdited: post.is_edited || false,
    isPinned: post.is_pinned || false,
    createdAt: post.created_at,
    updatedAt: post.updated_at
  }
}

/**
 * Formats a date string to relative time (e.g., "2 hours ago")
 * @param dateString Date string to format
 * @returns Formatted relative time string
 */
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`
  
  return date.toLocaleDateString()
}

/**
 * Generates a batch code based on program and semester information
 * @param programCode Program code (e.g., 'BSE', 'BSCS')
 * @param semester Semester number
 * @returns Batch code in format FA22-BSE or SP23-BSEE
 */
export function generateBatchCode(programCode: string, semester: number): string {
  const semesterCode = semester % 2 === 1 ? 'FA' : 'SP'
  const year = new Date().getFullYear()
  const yearCode = year.toString().substring(2) // Get last 2 digits of year
  return `${semesterCode}${yearCode}-${programCode}`
}