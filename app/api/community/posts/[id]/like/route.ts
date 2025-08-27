import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function getClient() {
  return (async () => {
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
    return supabase
  })()
}

// GET /api/community/posts/[id]/like -> { count, liked }
export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const supabase = await getClient()

  // current user
  const { data: auth } = await supabase.auth.getUser()
  const userId = auth.user?.id

  // count likes
  const { count, error: countErr } = await supabase
    .from('post_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', id)

  if (countErr) return NextResponse.json({ error: countErr.message }, { status: 400 })

  let liked = false
  if (userId) {
    const { data: row } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('post_id', id)
      .eq('user_id', userId)
      .maybeSingle()
    liked = !!row
  }

  return NextResponse.json({ count: count || 0, liked })
}

// POST /api/community/posts/[id]/like -> toggle like, returns { count, liked }
export async function POST(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const supabase = await getClient()

  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = auth.user.id

  // check if already liked
  const { data: existing, error: fetchErr } = await supabase
    .from('post_likes')
    .select('post_id,user_id')
    .eq('post_id', id)
    .eq('user_id', userId)
    .maybeSingle()

  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 400 })

  if (existing) {
    // unlike
    const { error: delErr } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', id)
      .eq('user_id', userId)
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 400 })
  } else {
    // like
    const { error: insErr } = await supabase
      .from('post_likes')
      .insert({ post_id: id, user_id: userId })
    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 400 })
  }

  // recompute like count and update community_posts.likes best-effort
  const { count } = await supabase
    .from('post_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', id)

  try {
    if (typeof count === 'number') {
      await supabase
        .from('community_posts')
        .update({ likes: count })
        .eq('id', id)
    }
  } catch {}

  // respond with new state
  const liked = !existing
  return NextResponse.json({ count: count || 0, liked })
}
