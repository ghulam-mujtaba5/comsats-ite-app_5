import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !anon) {
      return NextResponse.json({ data: [] })
    }

    const { searchParams } = new URL(req.url)
    const course = searchParams.get('course') || undefined
    const semester = searchParams.get('semester') || undefined
    const year = searchParams.get('year') ? Number(searchParams.get('year')) : undefined
    const q = searchParams.get('q') || undefined
    const limit = Number(searchParams.get('limit') || '50')

    const supabase = serviceKey
      ? createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
      : createClient(url, anon)

    let query = supabase
      .from('past_papers')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (course) query = query.ilike('course_code', `%${course}%`)
    if (semester) query = query.ilike('semester', `%${semester}%`)
    if (typeof year === 'number' && !Number.isNaN(year)) query = query.eq('year', year)
    if (q) query = query.or(`title.ilike.%${q}%,course_code.ilike.%${q}%`)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to fetch past papers', data: [] }, { status: 200 })
  }
}
