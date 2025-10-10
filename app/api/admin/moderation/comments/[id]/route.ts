import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

async function checkAdminAccess(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { isAdmin: false, user: null }
  }

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, role, permissions')
    .eq('user_id', user.id)
    .single()

  return { isAdmin: !!adminUser, user, adminUser }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const cookieStore = await (cookies() as any)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options?: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options?: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
  
  const { isAdmin } = await checkAdminAccess(supabase)
  
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  try {
    const { action, reason } = await request.json()

    let updateData: any = {}
    
    switch (action) {
      case 'approve':
        updateData.status = 'active'
        break
      case 'hide':
        updateData.status = 'hidden'
        break
      case 'delete':
        updateData.status = 'deleted'
        break
      case 'flag':
        updateData.status = 'flagged'
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const { error } = await supabase
      .from('post_comments_enhanced')
      .update(updateData)
      .eq('id', id)

    if (error) throw error

    // Log moderation action
    await supabase
      .from('moderation_logs')
      .insert({
        content_type: 'comment',
        content_id: id,
        action,
        reason,
        moderator_id: (await supabase.auth.getUser()).data.user?.id
      })

    return NextResponse.json({ success: true, message: `Comment ${action}d successfully` })
  } catch (error: any) {
    console.error('Error moderating comment:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}