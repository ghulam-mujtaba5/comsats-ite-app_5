import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const { data: posts, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    // Transform data to match frontend interface
    const transformedPosts = posts.map(post => ({
      id: post.id.toString(),
      author: post.author_name || 'Anonymous',
      avatar: post.avatar_url || '/student-avatar.png',
      department: post.department || '',
      semester: post.semester || '',
      time: new Date(post.created_at).toLocaleString(),
      content: post.content,
      likes: post.likes || 0,
      comments: post.comments_count || 0,
      shares: post.shares || 0,
      tags: Array.isArray(post.tags) ? post.tags : [],
      liked: false, // TODO: Implement user-specific likes
      type: post.type || 'general'
    }))

    return NextResponse.json(transformedPosts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, type, tags } = body

    if (!content || content.trim().length < 10) {
      return NextResponse.json({ error: 'Content must be at least 10 characters' }, { status: 400 })
    }

    const { data: post, error } = await supabase
      .from('community_posts')
      .insert({
        content: content.trim(),
        type: type || 'general',
        tags: tags || [],
        user_id: user.id,
        author_name: user.email?.split('@')[0] || 'Anonymous',
        avatar_url: '/student-avatar.png'
      })
      .select()
      .single()

    if (error) throw error

    // Transform response to match frontend interface
    const transformedPost = {
      id: post.id.toString(),
      author: post.author_name,
      avatar: post.avatar_url,
      department: post.department || '',
      semester: post.semester || '',
      time: new Date(post.created_at).toLocaleString(),
      content: post.content,
      likes: post.likes || 0,
      comments: post.comments_count || 0,
      shares: post.shares || 0,
      tags: Array.isArray(post.tags) ? post.tags : [],
      liked: false,
      type: post.type
    }

    return NextResponse.json(transformedPost)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
