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

export async function GET(request: NextRequest) {
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
    const { data: comments, error } = await supabase
      .from('community_replies')
      .select(`
        id,
        post_id,
        content,
        author_name,
        avatar_url,
        likes,
        created_at
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform data to match the expected format
    const transformedComments = comments?.map(comment => ({
      ...comment,
      author_email: 'unknown@example.com', // We don't have author_email in the schema
      status: comment.content.toLowerCase().includes('spam') ? 'flagged' : 'active', // Derive status from content
      reports_count: 0, // We don't have reports_count in the schema
      post_title: `Post ${comment.post_id.substring(0, 8)}` // We don't have direct access to post title
    })) || []

    return NextResponse.json(transformedComments)
  } catch (error: any) {
    console.error('Error fetching comments for moderation:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}