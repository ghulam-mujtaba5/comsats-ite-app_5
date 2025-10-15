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
    const { data: posts, error } = await supabase
      .from('community_posts')
      .select(`
        id,
        title,
        content,
        user_id,
        created_at,
        likes,
        comments,
        shares,
        tags,
        type
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform data to match the expected format
    const transformedPosts = posts?.map(post => ({
      ...post,
      author_name: 'Unknown User', // We don't have author_name in the schema
      author_email: 'unknown@example.com', // We don't have author_email in the schema
      status: post.type === 'spam' ? 'flagged' : 'active', // Derive status from type
      category: post.type,
      likes_count: post.likes,
      comments_count: post.comments,
      reports_count: 0 // We don't have reports_count in the schema
    })) || []

    return NextResponse.json(transformedPosts || [])
  } catch (error: any) {
    console.error('Error fetching posts for moderation:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}