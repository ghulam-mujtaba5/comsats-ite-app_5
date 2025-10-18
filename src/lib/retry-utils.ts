/**
 * Retry utilities for handling connection timeouts and failures
 */

export interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffFactor?: number
  timeout?: number
}

export class RetryableError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message)
    this.name = 'RetryableError'
  }
}

/**
 * Exponential backoff delay calculation
 */
function calculateDelay(attempt: number, options: RetryOptions): number {
  const { initialDelay = 1000, maxDelay = 30000, backoffFactor = 2 } = options
  const delay = Math.min(initialDelay * Math.pow(backoffFactor, attempt), maxDelay)
  // Add jitter to prevent thundering herd
  return delay + Math.random() * 1000
}

/**
 * Check if an error is retryable
 */
function isRetryableError(error: any): boolean {
  if (error instanceof RetryableError) return true
  
  // Network errors that are typically temporary
  const retryableCodes = [
    'ECONNRESET',
    'ECONNREFUSED', 
    'ETIMEDOUT',
    'UND_ERR_CONNECT_TIMEOUT',
    'ENOTFOUND',
    'EAI_AGAIN'
  ]
  
  // Check error code
  if (error?.code && retryableCodes.includes(error.code)) return true
  if (error?.cause?.code && retryableCodes.includes(error.cause.code)) return true
  
  // Check error message for timeout patterns
  const message = error?.message?.toLowerCase() || ''
  const timeoutPatterns = [
    'timeout',
    'connect timeout',
    'fetch failed',
    'network error',
    'connection reset'
  ]
  
  return timeoutPatterns.some(pattern => message.includes(pattern))
}

/**
 * Retry function with exponential backoff
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    timeout = 15000
  } = options
  
  let lastError: Error = new Error('Operation failed')
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Wrap operation with timeout
      const result = await Promise.race([
        operation(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error(`Operation timeout after ${timeout}ms`)), timeout)
        )
      ])
      
      return result
    } catch (error: any) {
      lastError = error
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break
      }
      
      // Check if error is retryable
      if (!isRetryableError(error)) {
        throw error
      }
      
      // Calculate delay and wait
      const delay = calculateDelay(attempt, options)
      console.warn(`Retry attempt ${attempt + 1}/${maxRetries + 1} after ${delay.toFixed(0)}ms due to:`, error.message)
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw new RetryableError(`Operation failed after ${maxRetries + 1} attempts`, lastError)
}

/**
 * Wrapper for Supabase operations with retry logic
 */
export async function withSupabaseRetry<T>(
  operation: () => Promise<T>,
  operationName: string = 'Supabase operation',
  options: RetryOptions = {}
): Promise<T> {
  const defaultOptions: Required<RetryOptions> = {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2,
    timeout: 15000,
    ...options
  }
  
  try {
    return await withRetry(operation, defaultOptions)
  } catch (error: any) {
    console.error(`${operationName} failed definitively:`, {
      message: error.message,
      code: error.code || error.cause?.code,
      attempts: defaultOptions.maxRetries + 1
    })
    throw error
  }
}

/**
 * Safe count operation with retry logic
 */
export async function safeCountWithRetry(
  supabase: any,
  tableName: string,
  filters?: Record<string, any | { operator: string; value: any }>
): Promise<number> {
  return withSupabaseRetry(
    async () => {
      let query = supabase.from(tableName).select('*', { count: 'exact', head: true })
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value && typeof value === 'object' && 'operator' in value && 'value' in value) {
            const filterValue = value as { operator: string; value: any }
            query = query[filterValue.operator as keyof typeof query](key, filterValue.value)
          } else {
            query = query.eq(key, value)
          }
        })
      }
      
      const { count, error } = await query
      if (error) throw error
      return count ?? 0
    },
    `Count ${tableName}`,
    { maxRetries: 2, timeout: 10000 }
  )
}

/**
 * Safe user listing with retry logic
 */
export async function safeListUsersWithRetry(
  supabase: any,
  options: { page?: number, perPage?: number } = {}
): Promise<{ users: any[], totalCount: number }> {
  const { page = 1, perPage = 100 } = options
  
  return withSupabaseRetry(
    async () => {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
      if (error) throw error
      return {
        users: data?.users ?? [],
        totalCount: data?.users?.length ?? 0
      }
    },
    'List users',
    { maxRetries: 2, timeout: 12000 }
  )
}