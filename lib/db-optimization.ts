/**
 * Database Optimization Utilities
 * 
 * Connection pooling, query caching, and performance optimization
 * for Supabase and MongoDB connections
 */

import { performanceConfig } from './performance-config'

/**
 * Query Cache Store
 * Simple in-memory cache for database queries
 */
class QueryCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private ttl: number

  constructor(ttlSeconds: number = 60) {
    this.ttl = ttlSeconds * 1000
  }

  get(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    // Check if expired
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  clear(): void {
    this.cache.clear()
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  // Clear expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.ttl) {
        this.cache.delete(key)
      }
    }
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      ttl: this.ttl / 1000,
    }
  }
}

// Global query cache instance
export const queryCache = new QueryCache(performanceConfig.database.cacheTime)

// Cleanup expired entries every minute
if (typeof window !== 'undefined') {
  setInterval(() => queryCache.cleanup(), 60000)
}

/**
 * Generate cache key from query parameters
 */
export function generateCacheKey(
  table: string,
  params: Record<string, any>
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${JSON.stringify(params[key])}`)
    .join('|')

  return `${table}:${sortedParams}`
}

/**
 * Cached query wrapper
 * Automatically caches query results
 */
export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  options: { ttl?: number; skipCache?: boolean } = {}
): Promise<T> {
  const { ttl, skipCache = false } = options

  // Check cache first (unless skipCache is true)
  if (!skipCache) {
    const cached = queryCache.get(key)
    if (cached !== null) {
      return cached as T
    }
  }

  // Execute query
  const result = await queryFn()

  // Cache result
  if (ttl) {
    const oldTtl = (queryCache as any).ttl
    ;(queryCache as any).ttl = ttl * 1000
    queryCache.set(key, result)
    ;(queryCache as any).ttl = oldTtl
  } else {
    queryCache.set(key, result)
  }

  return result
}

/**
 * Batch query executor
 * Combines multiple queries into a single request
 */
export class BatchQueryExecutor {
  private queue: Array<{
    resolve: (value: any) => void
    reject: (error: any) => void
    queryFn: () => Promise<any>
  }> = []
  private executing = false

  async add<T>(queryFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject, queryFn })
      this.execute()
    })
  }

  private async execute() {
    if (this.executing || this.queue.length === 0) return

    this.executing = true

    const batch = this.queue.splice(0, performanceConfig.database.batchSize)

    try {
      const results = await Promise.all(batch.map((item) => item.queryFn()))
      batch.forEach((item, index) => item.resolve(results[index]))
    } catch (error) {
      batch.forEach((item) => item.reject(error))
    } finally {
      this.executing = false
      if (this.queue.length > 0) {
        this.execute()
      }
    }
  }
}

// Global batch executor
export const batchExecutor = new BatchQueryExecutor()

/**
 * Query timeout wrapper
 * Automatically times out queries that take too long
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = performanceConfig.database.timeout
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Query timeout after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ])
}

/**
 * Retry wrapper for database queries
 * Automatically retries failed queries with exponential backoff
 */
export async function withRetry<T>(
  queryFn: () => Promise<T>,
  options: {
    maxRetries?: number
    delay?: number
    backoffMultiplier?: number
    onRetry?: (attempt: number, error: any) => void
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delay = 1000,
    backoffMultiplier = 2,
    onRetry,
  } = options

  let lastError: any

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await queryFn()
    } catch (error) {
      lastError = error
      
      if (attempt < maxRetries - 1) {
        const waitTime = delay * Math.pow(backoffMultiplier, attempt)
        
        if (onRetry) {
          onRetry(attempt + 1, error)
        }

        if (performanceConfig.database.logging) {
          console.log(`[DB] Retry attempt ${attempt + 1} after ${waitTime}ms`, error)
        }

        await new Promise((resolve) => setTimeout(resolve, waitTime))
      }
    }
  }

  throw lastError
}

/**
 * Paginated query helper
 * Automatically handles pagination
 */
export async function paginatedQuery<T>(
  queryFn: (offset: number, limit: number) => Promise<T[]>,
  options: {
    pageSize?: number
    maxPages?: number
  } = {}
): Promise<T[]> {
  const { pageSize = 100, maxPages = 10 } = options
  const results: T[] = []

  for (let page = 0; page < maxPages; page++) {
    const offset = page * pageSize
    const pageResults = await queryFn(offset, pageSize)

    results.push(...pageResults)

    // Stop if we got fewer results than requested (last page)
    if (pageResults.length < pageSize) {
      break
    }
  }

  return results
}

/**
 * Connection health checker
 * Checks if database connection is healthy
 */
export async function checkConnectionHealth(
  testFn: () => Promise<any>
): Promise<{ healthy: boolean; latency: number; error?: string }> {
  const start = performance.now()

  try {
    await testFn()
    const latency = performance.now() - start

    return {
      healthy: true,
      latency,
    }
  } catch (error) {
    const latency = performance.now() - start

    return {
      healthy: false,
      latency,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Query performance logger
 * Logs slow queries for optimization
 */
export function logSlowQuery(
  query: string,
  duration: number,
  threshold: number = 1000
) {
  if (duration > threshold) {
    console.warn(`[DB] Slow query detected (${duration.toFixed(2)}ms):`, query)
  }
}

/**
 * Optimized query wrapper with all features
 * Combines caching, timeout, retry, and logging
 */
export async function optimizedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  options: {
    cache?: boolean
    cacheTTL?: number
    timeout?: number
    retries?: number
    logSlow?: boolean
  } = {}
): Promise<T> {
  const {
    cache = true,
    cacheTTL,
    timeout = performanceConfig.database.timeout,
    retries = 3,
    logSlow = performanceConfig.database.logging,
  } = options

  const start = performance.now()

  try {
    // Use cached query if enabled
    if (cache) {
      return await cachedQuery(
        key,
        async () => {
          // Add timeout
          const result = await withTimeout(
            // Add retry
            withRetry(queryFn, { maxRetries: retries }),
            timeout
          )
          return result
        },
        { ttl: cacheTTL }
      )
    } else {
      // No cache, just timeout and retry
      return await withTimeout(
        withRetry(queryFn, { maxRetries: retries }),
        timeout
      )
    }
  } finally {
    const duration = performance.now() - start
    if (logSlow) {
      logSlowQuery(key, duration)
    }
  }
}

/**
 * Invalidate cache for specific patterns
 */
export function invalidateCache(pattern?: string) {
  if (!pattern) {
    queryCache.clear()
    return
  }

  // Clear all keys matching pattern
  const stats = queryCache.getStats()
  console.log(`[Cache] Invalidating cache entries matching: ${pattern}`)
  // Note: In production, implement pattern matching
  queryCache.clear()
}

/**
 * Preload common queries
 * Warms up cache with frequently accessed data
 */
export async function preloadCache(queries: Array<{ key: string; fn: () => Promise<any> }>) {
  console.log(`[Cache] Preloading ${queries.length} queries...`)
  
  await Promise.all(
    queries.map(({ key, fn }) => 
      cachedQuery(key, fn).catch((error) => {
        console.error(`[Cache] Failed to preload ${key}:`, error)
      })
    )
  )

  console.log(`[Cache] Preload complete. Cache size: ${queryCache.getStats().size}`)
}
