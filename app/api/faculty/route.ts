import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// GET /api/faculty
export async function GET(_req: NextRequest) {
  const cookieStore = await (cookies() as any)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .order('name', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json((data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    title: row.title || '',
    department: row.department || '',
    email: row.email || '',
    office: row.office || '',
    phone: row.phone || undefined,
    specialization: row.specialization || [],
    courses: row.courses || [],
    education: row.education || [],
    experience: row.experience || '',
    profileImage: row.profile_image || undefined,
    averageRating: Number(row.rating_avg ?? 0),
    totalReviews: Number(row.rating_count ?? 0),
    joinDate: row.created_at || new Date().toISOString(),
  })))
}
