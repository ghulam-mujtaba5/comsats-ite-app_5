import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { mockFaculty, mockReviews } from '@/lib/faculty-data'

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !anon) {
      const f = mockFaculty.find((x) => x.id === id)
      if (!f) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      const r = mockReviews.filter((rv) => rv.facultyId === id)
      const rating_count = r.length
      const rating_avg = rating_count === 0 ? 0 : r.reduce((s, x) => s + x.rating, 0) / rating_count
      // Return DB-like row structure the page maps from
      const row = {
        id: f.id,
        name: f.name,
        title: f.title,
        department: f.department,
        email: f.email,
        office: f.office,
        phone: f.phone ?? null,
        specialization: f.specialization,
        courses: f.courses,
        education: f.education,
        experience: f.experience,
        profile_image: f.profileImage ?? null,
        created_at: f.joinDate,
        rating_avg,
        rating_count,
      }
      return NextResponse.json({ data: row })
    }

    // Prefer service role on server to avoid RLS-related errors
    const supabase = serviceKey
      ? createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
      : createClient(url, anon)
    let { data: fData, error: fErr } = await supabase.from('faculty').select('*').eq('id', id).maybeSingle()
    if (fErr) throw fErr
    if (!fData) {
      // Optional auto-seed if enabled and we have service role
      if (process.env.AUTO_SEED_FACULTY === '1' && serviceKey) {
        const placeholder = {
          id,
          name: `Faculty ${id.slice(0, 6)}`,
          department: 'Unknown',
          title: '',
          email: null,
          office: null,
          phone: null,
          specialization: [],
          courses: [],
          education: [],
          experience: '',
          profile_image: null,
        }
        const { data: seeded, error: seedErr } = await supabase
          .from('faculty')
          .upsert(placeholder, { onConflict: 'id' })
          .select('*')
          .maybeSingle()
        if (seedErr) throw seedErr
        fData = seeded || placeholder
      } else {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
    }

    const { data: stats, error: sErr } = await supabase
      .from('reviews')
      .select('rating', { count: 'exact' })
      .eq('faculty_id', id)
      .eq('status', 'approved')
    if (sErr) throw sErr
    const rating_count = (stats as any[])?.length ?? 0
    const rating_avg = rating_count === 0 ? 0 : (stats as any[]).reduce((s, x: any) => s + Number(x.rating || 0), 0) / rating_count

    return NextResponse.json({ data: { ...fData, rating_avg, rating_count } })
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unknown error' }, { status: 400 })
  }
}
