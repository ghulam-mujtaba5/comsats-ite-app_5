/**
 * API Middleware Utilities
 * Centralized middleware for authentication, authorization, validation, and error handling
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ZodSchema } from 'zod'
import { supabaseAdmin } from './supabase-admin'
import { handleApiError, createError, logError, AppError } from './error-handler'
import { rateLimit as checkRateLimit } from './rate-limit'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email?: string
    role?: string
  }
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  meta?: any
}

/**
 * Creates a Supabase server client with proper cookie handling
 */
export async function createSupabaseServerClient() {
  const cookieStore = await (cookies() as any)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw createError('Server configuration error', 'SERVER_CONFIG_ERROR', 500)
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set(name, value, options)
      },
      remove(name: string, options: any) {
        cookieStore.set(name, '', { ...options, maxAge: 0 })
      },
    },
  })
}

/**
 * Middleware to authenticate requests
 * Returns the authenticated user or throws an error
 */
export async function authenticateRequest(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      throw createError('Authentication required', 'UNAUTHORIZED', 401)
    }

    return { user, supabase }
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Middleware to check if user is an admin
 * Returns admin details or throws an error
 */
export async function requireAdminAuth(request: NextRequest) {
  const { user, supabase } = await authenticateRequest(request)

  try {
    // Check admin status using service role client to bypass RLS
    const { data: adminUser, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, role, permissions')
      .eq('user_id', user.id)
      .single()

    if (error || !adminUser) {
      throw createError('Admin access required', 'FORBIDDEN', 403)
    }

    return {
      user: {
        ...user,
        role: adminUser.role,
        permissions: adminUser.permissions || [],
      },
      supabase,
      adminUser,
    }
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Middleware to validate request body against a Zod schema
 */
export async function validateRequestBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json()
    const validatedData = schema.parse(body)
    return validatedData
  } catch (error: any) {
    if (error.name === 'ZodError') {
      const messages = error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')
      throw createError(`Validation error: ${messages}`, 'VALIDATION_ERROR', 400, error.errors)
    }
    throw handleApiError(error)
  }
}

/**
 * Rate limiting middleware
 */
export async function rateLimit(
  request: NextRequest,
  key: string,
  limit: number = 10,
  windowMs: number = 60000
): Promise<void> {
  const allowed = checkRateLimit(key, limit, windowMs)
  
  if (!allowed) {
    throw createError('Rate limit exceeded. Please try again later.', 'RATE_LIMITED', 429)
  }
}

/**
 * Wrapper for API route handlers with consistent error handling
 */
export function withErrorHandling<T = any>(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse<T>>
) {
  return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    try {
      return await handler(request, ...args)
    } catch (error: any) {
      const appError = handleApiError(error)
      logError(appError, request.nextUrl.pathname, (request as any).user?.id)
      
      return NextResponse.json(
        {
          error: appError.message,
          code: appError.code,
          ...(appError.details && { details: appError.details }),
        },
        { status: appError.status }
      )
    }
  }
}

/**
 * Success response helper
 */
export function successResponse<T>(
  data: T,
  options?: {
    message?: string
    meta?: any
    status?: number
    headers?: Record<string, string>
  }
): NextResponse<ApiResponse<T>> {
  const { message, meta, status = 200, headers = {} } = options || {}
  
  return NextResponse.json(
    {
      data,
      ...(message && { message }),
      ...(meta && { meta }),
    },
    { status, headers }
  )
}

/**
 * Error response helper
 */
export function errorResponse(
  error: string | AppError,
  status?: number
): NextResponse<ApiResponse> {
  if (typeof error === 'string') {
    return NextResponse.json(
      { error },
      { status: status || 500 }
    )
  }

  return NextResponse.json(
    {
      error: error.message,
      code: error.code,
      ...(error.details && { details: error.details }),
    },
    { status: error.status }
  )
}

/**
 * Paginated response helper
 */
export function paginatedResponse<T>(
  data: T[],
  options: {
    page: number
    limit: number
    total?: number
    hasMore?: boolean
    headers?: Record<string, string>
  }
): NextResponse<ApiResponse<T[]>> {
  const { page, limit, total, hasMore, headers = {} } = options
  
  return NextResponse.json(
    {
      data,
      meta: {
        page,
        limit,
        ...(total !== undefined && { total }),
        ...(hasMore !== undefined && { hasMore }),
      },
    },
    { headers }
  )
}

/**
 * Check specific admin permission
 */
export async function checkAdminPermission(
  userId: string,
  requiredPermission: string
): Promise<boolean> {
  try {
    const { data: adminUser } = await supabaseAdmin
      .from('admin_users')
      .select('permissions')
      .eq('user_id', userId)
      .single()

    if (!adminUser) return false

    const permissions = adminUser.permissions || []
    return permissions.includes(requiredPermission) || permissions.includes('*')
  } catch (error) {
    return false
  }
}

/**
 * Verify resource ownership
 */
export async function verifyOwnership(
  table: string,
  resourceId: string,
  userId: string,
  userIdField: string = 'user_id'
): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from(table)
      .select(userIdField)
      .eq('id', resourceId)
      .single()

    if (error || !data) return false
    return data[userIdField] === userId
  } catch (error) {
    return false
  }
}

/**
 * Cache headers for API responses
 */
export const cacheHeaders = {
  short: {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150',
    'CDN-Cache-Control': 'public, s-maxage=300',
  },
  medium: {
    'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=900',
    'CDN-Cache-Control': 'public, s-maxage=1800',
  },
  long: {
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
    'CDN-Cache-Control': 'public, s-maxage=3600',
  },
  none: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  },
}
