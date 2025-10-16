import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase env vars missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.'
  )
}

// Singleton instance to prevent multiple GoTrueClient warnings
let supabaseInstance: SupabaseClient | null = null

/**
 * Get the singleton Supabase client instance
 * This prevents multiple GoTrueClient instances in the browser
 */
export function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance
  }

  // Enhanced client configuration with timeout and retry settings optimized for free tier
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce', // Use PKCE flow for better security
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'campusaxis-auth', // Single storage key to prevent conflicts
    },
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          // Set reasonable timeout for requests to prevent long-running queries
          signal: AbortSignal.timeout(10000), // 10 second timeout (reduced from 15)
        })
      },
    },
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 5, // Reduced from 10 to stay within limits
      },
    }
  })

  return supabaseInstance
}

// Export the singleton client
export const supabase = getSupabaseClient()