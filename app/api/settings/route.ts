import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Public site settings GET
// Returns latest row from site_settings with safe fields only
export async function GET() {
  const cookieStore = await (cookies() as any)
  const supabase = createServerClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL']!,
  process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  const { data, error } = await supabase
    .from('site_settings')
    .select('site_name, site_description, site_logo_url, contact_email, maintenance_mode, registration_enabled, max_file_size_mb, allowed_file_types, theme_color, announcement_text, announcement_enabled, social_links, updated_at')
    .order('updated_at', { ascending: false })
    .limit(1)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data: data?.[0] ?? null })
}
