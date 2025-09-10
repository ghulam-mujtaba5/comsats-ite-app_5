import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
  const adminToken = process.env['REVIEW_ADMIN_TOKEN']
    const auth = req.headers.get('authorization') || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
    if (!adminToken || token !== adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, status } = await req.json()
    if (!id || !status || !['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
  const url = process.env['NEXT_PUBLIC_SUPABASE_URL']
  const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Supabase env vars missing (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)' }, { status: 500 })
    }
    const supabase = createClient(url, serviceKey)

    // Update status and fetch the review to get faculty_id
    const { data: updated, error } = await supabase
      .from('reviews')
      .update({ status })
      .eq('id', id)
      .select('id, faculty_id, status')
      .single()
    if (error) throw error

    // Recalculate aggregates for the faculty
    if (updated?.faculty_id) {
      const { data: ratings, error: aggError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('faculty_id', updated.faculty_id)
        .eq('status', 'approved')
      if (!aggError) {
        const count = ratings?.length || 0
        const avg = count > 0 ? (ratings.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / count) : 0
        await supabase
          .from('faculty')
          .update({ rating_avg: avg, rating_count: count })
          .eq('id', updated.faculty_id)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'Unknown error' }, { status: 400 })
  }
}

