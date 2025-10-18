/**
 * Centralized error handling and logging
 * 
 * PRODUCTION: Integrate with Sentry or similar service
 * import * as Sentry from '@sentry/nextjs'
 */

export enum ErrorCode {
  // Authentication errors (1000-1099)
  AUTH_REQUIRED = 1000,
  AUTH_INVALID_CREDENTIALS = 1001,
  AUTH_TOKEN_EXPIRED = 1002,
  AUTH_RATE_LIMITED = 1003,
  
  // Authorization errors (1100-1199)
  FORBIDDEN = 1100,
  INSUFFICIENT_PERMISSIONS = 1101,
  
  // Validation errors (1200-1299)
  VALIDATION_FAILED = 1200,
  INVALID_INPUT = 1201,
  MISSING_REQUIRED_FIELD = 1202,
  
  // Database errors (1300-1399)
  DATABASE_ERROR = 1300,
  DUPLICATE_ENTRY = 1301,
  NOT_FOUND = 1302,
  
  // File upload errors (1400-1499)
  FILE_TOO_LARGE = 1400,
  INVALID_FILE_TYPE = 1401,
  UPLOAD_FAILED = 1402,
  
  // Rate limiting (1500-1599)
  RATE_LIMIT_EXCEEDED = 1500,
  
  // Network/External (1600-1699)
  NETWORK_ERROR = 1600,
  EXTERNAL_SERVICE_ERROR = 1601,
  TIMEOUT = 1602,
  
  // Generic (9000+)
  INTERNAL_SERVER_ERROR = 9000,
  UNKNOWN_ERROR = 9999,
}

export interface AppError {
  code: ErrorCode
  message: string
  userMessage: string
  details?: any
  timestamp: string
  path?: string
  userId?: string
}

export class CustomError extends Error {
  public readonly code: ErrorCode
  public readonly userMessage: string
  public readonly details?: any
  public readonly statusCode: number

  constructor(
    code: ErrorCode,
    message: string,
    userMessage: string,
    statusCode: number = 500,
    details?: any
  ) {
    super(message)
    this.code = code
    this.userMessage = userMessage
    this.details = details
    this.statusCode = statusCode
    this.name = 'CustomError'
  }
}

/**
 * Log error (replace with Sentry in production)
 */
export function logError(error: Error | CustomError, context?: any): void {
  const errorInfo = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context,
  }

  if (error instanceof CustomError) {
    Object.assign(errorInfo, {
      code: error.code,
      userMessage: error.userMessage,
      details: error.details,
      statusCode: error.statusCode,
    })
  }

  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Sentry.captureException(error, { extra: errorInfo })
    
    // Only log non-sensitive information
    const sanitized = {
      ...errorInfo,
      stack: undefined, // Don't expose stack traces in production logs
    }
    console.error('[ERROR]', JSON.stringify(sanitized))
  } else {
    // Full error details in development
    console.error('[ERROR]', errorInfo)
  }
}

/**
 * Format error for API response
 */
export function formatErrorResponse(error: Error | CustomError): {
  error: string
  code?: ErrorCode
  details?: any
  timestamp: string
} {
  const isProd = process.env.NODE_ENV === 'production'
  
  if (error instanceof CustomError) {
    return {
      error: error.userMessage,
      code: error.code,
      details: isProd ? undefined : error.details, // Hide details in production
      timestamp: new Date().toISOString(),
    }
  }

  // Generic error - don't expose internal details
  return {
    error: isProd
      ? 'An unexpected error occurred. Please try again later.'
      : error.message,
    code: ErrorCode.UNKNOWN_ERROR,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Common error creators
 */
export const Errors = {
  authRequired: () =>
    new CustomError(
      ErrorCode.AUTH_REQUIRED,
      'Authentication required',
      'You must be signed in to perform this action',
      401
    ),

  invalidCredentials: () =>
    new CustomError(
      ErrorCode.AUTH_INVALID_CREDENTIALS,
      'Invalid credentials',
      'Invalid email or password',
      401
    ),

  forbidden: (message: string = 'Access denied') =>
    new CustomError(
      ErrorCode.FORBIDDEN,
      'Forbidden',
      message,
      403
    ),

  validationFailed: (details: any) =>
    new CustomError(
      ErrorCode.VALIDATION_FAILED,
      'Validation failed',
      'Please check your input and try again',
      400,
      details
    ),

  notFound: (resource: string = 'Resource') =>
    new CustomError(
      ErrorCode.NOT_FOUND,
      `${resource} not found`,
      `The requested ${resource.toLowerCase()} could not be found`,
      404
    ),

  rateLimitExceeded: (retryAfter?: number) =>
    new CustomError(
      ErrorCode.RATE_LIMIT_EXCEEDED,
      'Rate limit exceeded',
      `Too many requests. Please try again ${retryAfter ? `in ${retryAfter} seconds` : 'later'}.`,
      429,
      { retryAfter }
    ),

  fileTooLarge: (maxSize: string) =>
    new CustomError(
      ErrorCode.FILE_TOO_LARGE,
      'File too large',
      `File size exceeds the maximum allowed size of ${maxSize}`,
      400
    ),

  invalidFileType: (allowedTypes: string[]) =>
    new CustomError(
      ErrorCode.INVALID_FILE_TYPE,
      'Invalid file type',
      `Only ${allowedTypes.join(', ')} files are allowed`,
      400
    ),

  databaseError: (operation: string) =>
    new CustomError(
      ErrorCode.DATABASE_ERROR,
      `Database error during ${operation}`,
      'A database error occurred. Please try again later',
      500
    ),

  duplicateEntry: (field: string) =>
    new CustomError(
      ErrorCode.DUPLICATE_ENTRY,
      'Duplicate entry',
      `A record with this ${field} already exists`,
      409
    ),

  networkError: () =>
    new CustomError(
      ErrorCode.NETWORK_ERROR,
      'Network error',
      'Network error. Please check your connection and try again',
      503
    ),

  internalError: (details?: any) =>
    new CustomError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'Internal server error',
      'An unexpected error occurred. Please try again later',
      500,
      details
    ),
}

/**
 * Wrap async route handler with error handling
 */
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args)
    } catch (error) {
      logError(error as Error, { args })
      throw error
    }
  }
}
