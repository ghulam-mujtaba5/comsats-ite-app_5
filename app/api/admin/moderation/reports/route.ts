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
    // Since community_reports table may not exist, let's create a workaround
    // We'll simulate reports based on flagged posts and comments
    
    // Get flagged posts
    const { data: flaggedPosts, error: postsError } = await supabase
      .from('community_posts')
      .select(`
        id,
        title,
        content,
        created_at,
        user_id
      `)
      .eq('type', 'spam') // Treat spam posts as flagged
      .order('created_at', { ascending: false })

    if (postsError) throw postsError

    // Get flagged comments (replies)
    const { data: flaggedReplies, error: repliesError } = await supabase
      .from('community_replies')
      .select(`
        id,
        content,
        created_at,
        post_id,
        author_name
      `)
      .ilike('content', '%spam%') // Treat comments with "spam" as flagged
      .order('created_at', { ascending: false })

    if (repliesError) throw repliesError

    // Combine into a simulated reports format
    const simulatedReports = [
      ...flaggedPosts.map((post: any) => ({
        id: `post-${post.id}`,
        content_type: 'post',
        content_id: post.id,
        content_title: post.title || 'Untitled Post',
        reason: 'Spam',
        description: 'Post identified as spam content',
        reporter_email: 'system@campusaxis.site',
        created_at: post.created_at,
        status: 'pending'
      })),
      ...flaggedReplies.map((reply: any) => ({
        id: `comment-${reply.id}`,
        content_type: 'comment',
        content_id: reply.id,
        content_title: `Comment on post ${reply.post_id.substring(0, 8)}`,
        reason: 'Spam',
        description: 'Comment identified as spam content',
        reporter_email: 'system@campusaxis.site',
        created_at: reply.created_at,
        status: 'pending'
      }))
    ]

    return NextResponse.json(simulatedReports || [])
  } catch (error: any) {
    console.error('Error fetching reports:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}