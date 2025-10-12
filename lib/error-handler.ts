/**
 * Standardized error handling utilities for the application
 */

export interface AppError {
  message: string
  code: string
  status: number
  details?: any
}

/**
 * Creates a standardized error object
 */
export function createError(message: string, code: string, status: number = 500, details?: any): AppError {
  return {
    message,
    code,
    status,
    details
  }
}

/**
 * Handles API errors and returns appropriate error objects
 */
export function handleApiError(error: any): AppError {
  // Handle Supabase errors
  if (error.code) {
    switch (error.code) {
      case 'PGRST116':
        return createError('Resource not found', 'NOT_FOUND', 404)
      case '23505':
        return createError('Duplicate entry', 'DUPLICATE_ENTRY', 400)
      case '23503':
        return createError('Foreign key violation', 'FOREIGN_KEY_VIOLATION', 400)
      case '42501':
        return createError('Insufficient privileges', 'INSUFFICIENT_PRIVILEGES', 403)
      default:
        return createError(error.message || 'Database error', 'DATABASE_ERROR', 500, { code: error.code })
    }
  }
  
  // Handle HTTP errors
  if (error.status) {
    return createError(error.message || 'HTTP error', 'HTTP_ERROR', error.status)
  }
  
  // Handle network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return createError('Network error - please check your connection', 'NETWORK_ERROR', 500)
  }
  
  // Handle validation errors
  if (error.name === 'ValidationError') {
    return createError(error.message || 'Validation failed', 'VALIDATION_ERROR', 400)
  }
  
  // Default error
  return createError(error.message || 'An unexpected error occurred', 'UNKNOWN_ERROR', 500)
}

/**
 * Formats error for display to user
 */
export function formatErrorForUser(error: AppError): string {
  switch (error.code) {
    case 'NOT_FOUND':
      return 'The requested resource could not be found'
    case 'UNAUTHORIZED':
      return 'You need to be logged in to perform this action'
    case 'FORBIDDEN':
      return 'You do not have permission to perform this action'
    case 'VALIDATION_ERROR':
      return error.message
    case 'NETWORK_ERROR':
      return 'Network connection error. Please check your internet connection and try again'
    case 'RATE_LIMITED':
      return 'Too many requests. Please wait a moment and try again'
    default:
      return error.message || 'An unexpected error occurred. Please try again later'
  }
}

/**
 * Logs error with context
 */
export function logError(error: AppError, context: string, userId?: string) {
  console.error(`[${context}] Error ${error.code}: ${error.message}`, {
    userId,
    status: error.status,
    details: error.details,
    timestamp: new Date().toISOString()
  })
}

/**
 * Creates a toast notification for an error
 */
export function createErrorToast(error: AppError) {
  return {
    title: "Error",
    description: formatErrorForUser(error),
    variant: "destructive" as const
  }
}

/**
 * Creates a success toast notification
 */
export function createSuccessToast(title: string, description: string) {
  return {
    title,
    description
  }
}

/**
 * Creates an info toast notification
 */
export function createInfoToast(title: string, description: string) {
  return {
    title,
    description,
    variant: "default" as const
  }
}

/**
 * Common application errors
 */
export const CommonErrors = {
  UNAUTHORIZED: () => createError('You must be logged in to perform this action', 'UNAUTHORIZED', 401),
  FORBIDDEN: () => createError('You do not have permission to perform this action', 'FORBIDDEN', 403),
  NOT_FOUND: () => createError('The requested resource was not found', 'NOT_FOUND', 404),
  VALIDATION_ERROR: (message: string) => createError(message, 'VALIDATION_ERROR', 400),
  NETWORK_ERROR: () => createError('Network connection error', 'NETWORK_ERROR', 500),
  RATE_LIMITED: () => createError('Too many requests. Please try again later', 'RATE_LIMITED', 429)
}