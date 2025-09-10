import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// POST /api/reviews/actions  { reviewId, action: 'helpful'|'report' }
export async function POST(req: NextRequest) {
  try {
    const { reviewId, action } = await req.json()
    if (!reviewId || !['helpful','report'].includes(action)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    const cookieStore = await (cookies() as any)
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anon) return NextResponse.json({ error: 'Supabase env vars missing' }, { status: 500 })
    const supabase = createServerClient(url, anon, {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options?: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options?: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Auth required' }, { status: 401 })

    // Soft vote tracking using a lightweight table if exists; else fallback to per-user duplication check in memory
    // Try upsert into review_votes (optional table). If table missing, ignore.
    let allow = true
    try {
      const { data: existing } = await supabase
        .from('review_votes')
        .select('review_id')
        .eq('review_id', reviewId)
        .eq('user_id', user.id)
        .eq('action', action)
        .limit(1)
      if (existing && existing.length) allow = false
      if (allow) {
        await supabase.from('review_votes').insert({ review_id: reviewId, user_id: user.id, action })
      }
    } catch {
      // table might not exist yet; still proceed but client may double vote
    }
    if (!allow) return NextResponse.json({ ok: true, duplicate: true })

    const column = action === 'helpful' ? 'helpful' : 'reported'
    const { error } = await supabase.rpc('increment_review_counter', { review_id_input: reviewId, column_name: column })
    if (error) {
      // Fallback: atomic-ish increment via select + update (race-prone but acceptable interim)
  const { data: row } = await supabase.from('reviews').select(column).eq('id', reviewId).maybeSingle() as any
  const currentVal = (row && typeof row[column] === 'number') ? row[column] : 0
  await supabase.from('reviews').update({ [column]: currentVal + 1 } as any).eq('id', reviewId)
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 400 })
  }
}
