import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const isProd = (process.env.NODE_ENV as string) === 'production'

// In development, allow routes to use dev fallbacks by exporting a minimal mock
// client instead of throwing at module load. In production, we still require
// the real environment variables to be present.
if (!url || !serviceKey) {
  if (isProd) {
    throw new Error('Supabase admin env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local (server only).')
  }
}

// If envs are available, export the real admin client
export const supabaseAdmin = (url && serviceKey)
  ? createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        fetch: (url, options = {}) => {
          return fetch(url, {
            ...options,
            // Set reasonable timeout for admin requests
            signal: AbortSignal.timeout(20000), // 20 second timeout for admin operations
          })
        },
      },
      db: {
        schema: 'public',
      },
    })
  : ({
      auth: {
        admin: {
          async listUsers({ page, perPage }: { page: number; perPage: number }) {
            return { data: { users: [] as any[] }, error: null as any }
          },
          async getUserById(_id: string) {
            return { data: { user: null }, error: null as any }
          },
          async updateUserById(_id: string, _attrs: Record<string, any>) {
            return { data: null, error: null as any }
          },
        },
      },
      // Minimal query interface used by dashboard-stats safeCount
      from(_table: string) {
        return {
          async select(_cols?: string, _opts?: any) {
            return { data: [], count: 0, error: null as any }
          },
        }
      },
    } as unknown as ReturnType<typeof createClient>)
