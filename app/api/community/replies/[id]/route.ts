import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { requireAdmin } from '@/lib/admin-access'

// DELETE /api/community/replies/[id]
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params

  const access = await requireAdmin(req)
  if (!access.allow) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const cookieStore = (cookies() as any)
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

  // Fetch reply to get post_id and parent_comment_id for recount
  const { data: reply, error: fetchErr } = await supabase
    .from('post_comments_enhanced')
    .select('id, post_id, parent_comment_id')
    .eq('id', id)
    .single()

  if (fetchErr || !reply) {
    return NextResponse.json({ error: 'Reply not found' }, { status: 404 })
  }

  const { error } = await supabase
    .from('post_comments_enhanced')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Update replies count on parent comment if this was a reply to a comment
  if (reply.parent_comment_id) {
    const { count: repliesCount } = await supabase
      .from('post_comments_enhanced')
      .select('*', { count: 'exact', head: true })
      .eq('parent_comment_id', reply.parent_comment_id)

    try {
      if (typeof repliesCount === 'number') {
        await supabase
          .from('post_comments_enhanced')
          .update({ replies_count: repliesCount })
          .eq('id', reply.parent_comment_id)
      }
    } catch {}
  }

  // Update comment count on post
  const { count: commentsCount } = await supabase
    .from('post_comments_enhanced')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', reply.post_id)

  try {
    if (typeof commentsCount === 'number') {
      await supabase
        .from('community_posts')
        .update({ comments_count: commentsCount })
        .eq('id', reply.post_id)
    }
  } catch {}

  return NextResponse.json({ ok: true })
}