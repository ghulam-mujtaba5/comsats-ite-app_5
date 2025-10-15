/**
 * Data fetching utilities with retry logic and error handling
 */

export interface FetchOptions extends RequestInit {
  retries?: number
  retryDelay?: number
  timeout?: number
}

/**
 * Enhanced fetch with retry logic and timeout
 */
export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const {
    retries = 3,
    retryDelay = 1000,
    timeout = 10000,
    ...fetchOptions
  } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // If response is ok, return it
      if (response.ok) {
        return response
      }

      // If it's a client error (4xx), don't retry
      if (response.status >= 400 && response.status < 500) {
        return response
      }

      // Server error (5xx), retry
      lastError = new Error(`HTTP ${response.status}: ${response.statusText}`)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Don't retry on abort
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
    }

    // Wait before retrying (exponential backoff)
    if (attempt < retries) {
      await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)))
    }
  }

  throw lastError || new Error('Failed to fetch')
}

/**
 * Fetch JSON data with retry logic
 */
export async function fetchJSON<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await fetchWithRetry(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.text().catch(() => response.statusText)
    throw new Error(`Failed to fetch: ${error}`)
  }

  return response.json()
}

/**
 * Cache management utilities
 */
export class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number }>()
  private maxAge: number

  constructor(maxAgeSeconds: number = 60) {
    this.maxAge = maxAgeSeconds * 1000
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    // Check if cache is still valid
    if (Date.now() - cached.timestamp > this.maxAge) {
      this.cache.delete(key)
      return null
    }

    return cached.data as T
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key)
    } else {
      this.cache.clear()
    }
  }

  invalidate(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key)
      }
    }
  }
}

// Global cache instance
export const globalCache = new CacheManager(60)

/**
 * Fetch with cache support
 */
export async function fetchWithCache<T>(
  url: string,
  options: FetchOptions & { cacheKey?: string; useCache?: boolean } = {}
): Promise<T> {
  const { cacheKey = url, useCache = true, ...fetchOptions } = options

  // Check cache first
  if (useCache) {
    const cached = globalCache.get<T>(cacheKey)
    if (cached !== null) {
      return cached
    }
  }

  // Fetch fresh data
  const data = await fetchJSON<T>(url, fetchOptions)

  // Store in cache
  if (useCache) {
    globalCache.set(cacheKey, data)
  }

  return data
}
