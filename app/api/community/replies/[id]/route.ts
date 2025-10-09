import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { requireAdmin } from '@/lib/admin-access'

// DELETE /api/community/replies/[id]
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params

  const access = await requireAdmin(req)
  if (!access.allow) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

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

  // Fetch reply to get post_id for recount
  const { data: reply, error: fetchErr } = await supabase
    .from('community_replies')
    .select('id, post_id')
    .eq('id', id)
    .single()

  if (fetchErr || !reply) {
    return NextResponse.json({ error: 'Reply not found' }, { status: 404 })
  }

  const { error } = await supabase
    .from('community_replies')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Best-effort: update comments_count
  try {
    const { count } = await supabase
      .from('community_replies')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', (reply as any).post_id)

    if (typeof count === 'number') {
      await supabase
        .from('community_posts')
        .update({ comments_count: count })
        .eq('id', (reply as any).post_id)
    }
  } catch {}

  return NextResponse.json({ ok: true })
}
