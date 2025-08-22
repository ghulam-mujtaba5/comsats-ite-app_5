import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
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

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { isAdmin } = await checkAdminAccess(supabase)
  
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
  }

  try {
    const { data: comments, error } = await supabase
      .from('community_comments')
      .select(`
        id,
        content,
        author_name,
        author_email,
        created_at,
        status,
        reports_count,
        post:community_posts(title)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform data to include post title
    const transformedComments = comments?.map(comment => ({
      ...comment,
      post_title: (comment.post as any)?.title || 'Unknown Post'
    })) || []

    return NextResponse.json(transformedComments)
  } catch (error: any) {
    console.error('Error fetching comments for moderation:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
