import { NextRequest } from 'next/server'

/**
 * Enhanced Rate Limiting System
 * 
 * PRODUCTION NOTE: Replace in-memory storage with Redis/Upstash for:
 * - Distributed rate limiting across multiple instances
 * - Persistent rate limit counters
 * - Better performance at scale
 * 
 * Example with Upstash Redis:
 * ```typescript
 * import { Redis } from '@upstash/redis'
 * const redis = new Redis({
 *   url: process.env.UPSTASH_REDIS_REST_URL,
 *   token: process.env.UPSTASH_REDIS_REST_TOKEN,
 * })
 * ```
 */

interface RateLimitBucket {
  count: number
  resetAt: number
  blockedUntil?: number
}

// In-memory storage (replace with Redis in production)
const rateBuckets = new Map<string, RateLimitBucket>()
const blockedIPs = new Map<string, number>()

// Cleanup old entries every 5 minutes
if (typeof global !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, bucket] of rateBuckets.entries()) {
      if (now > bucket.resetAt) {
        rateBuckets.delete(key)
      }
    }
    for (const [ip, until] of blockedIPs.entries()) {
      if (now > until) {
        blockedIPs.delete(ip)
      }
    }
  }, 5 * 60 * 1000)
}

export interface RateLimitConfig {
  limit: number // Max requests
  windowMs: number // Time window in milliseconds
  blockDurationMs?: number // How long to block after exceeding limit
  skipSuccessfulRequests?: boolean // Don't count successful requests
  keyGenerator?: (req: NextRequest) => string
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

/**
 * Get client IP address from request headers
 */
export function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIP = req.headers.get('x-real-ip')
  const cfConnectingIP = req.headers.get('cf-connecting-ip') // Cloudflare
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP.trim()
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP.trim()
  }
  
  return 'unknown'
}

/**
 * Rate limit middleware
 */
export async function rateLimit(
  req: NextRequest,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const key = config.keyGenerator ? config.keyGenerator(req) : getClientIP(req)
  const now = Date.now()
  
  // Check if IP is blocked
  const blockedUntil = blockedIPs.get(key)
  if (blockedUntil && now < blockedUntil) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset: blockedUntil,
      retryAfter: Math.ceil((blockedUntil - now) / 1000),
    }
  }
  
  // Get or create bucket
  let bucket = rateBuckets.get(key)
  
  if (!bucket || now > bucket.resetAt) {
    // Create new bucket
    bucket = {
      count: 0,
      resetAt: now + config.windowMs,
    }
    rateBuckets.set(key, bucket)
  }
  
  // Increment counter
  bucket.count++
  
  // Check if limit exceeded
  if (bucket.count > config.limit) {
    // Block IP if configured
    if (config.blockDurationMs) {
      const blockedUntil = now + config.blockDurationMs
      blockedIPs.set(key, blockedUntil)
      bucket.blockedUntil = blockedUntil
    }
    
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset: bucket.resetAt,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    }
  }
  
  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - bucket.count,
    reset: bucket.resetAt,
  }
}

/**
 * Preset rate limit configurations
 */
export const RateLimitPresets = {
  // Strict limit for authentication endpoints
  auth: {
    limit: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 30 * 60 * 1000, // Block for 30 minutes after exceeding
  },
  
  // Moderate limit for API endpoints
  api: {
    limit: 100,
    windowMs: 60 * 1000, // 1 minute
    blockDurationMs: 5 * 60 * 1000, // Block for 5 minutes
  },
  
  // Lenient limit for file uploads
  upload: {
    limit: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  
  // Very strict for admin operations
  admin: {
    limit: 50,
    windowMs: 60 * 1000, // 1 minute
    blockDurationMs: 60 * 60 * 1000, // Block for 1 hour
  },
  
  // Search/read operations
  read: {
    limit: 200,
    windowMs: 60 * 1000, // 1 minute
  },
  
  // Write operations
  write: {
    limit: 30,
    windowMs: 60 * 1000, // 1 minute
    blockDurationMs: 10 * 60 * 1000, // Block for 10 minutes
  },
} as const

/**
 * User-based rate limiting (instead of IP)
 */
export async function rateLimitByUser(
  userId: string,
  action: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const key = `user:${userId}:${action}`
  const now = Date.now()
  
  let bucket = rateBuckets.get(key)
  
  if (!bucket || now > bucket.resetAt) {
    bucket = {
      count: 0,
      resetAt: now + config.windowMs,
    }
    rateBuckets.set(key, bucket)
  }
  
  bucket.count++
  
  if (bucket.count > config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset: bucket.resetAt,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    }
  }
  
  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - bucket.count,
    reset: bucket.resetAt,
  }
}

/**
 * Create rate limit response headers
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(result.reset),
  }
  
  if (result.retryAfter) {
    headers['Retry-After'] = String(result.retryAfter)
  }
  
  return headers
}
