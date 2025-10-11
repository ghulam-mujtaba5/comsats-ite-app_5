import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const dynamic = 'force-dynamic'

// GET - Fetch blogs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('blogs')
      .select(`
        *,
        author:author_id(id, full_name, email, avatar_url)
      `, { count: 'exact' })
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Public view - only published blogs
    if (!status) {
      query = query.eq('status', 'published')
    } else if (status) {
      query = query.eq('status', status)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (tag) {
      query = query.contains('tags', [tag])
    }

    const { data: blogs, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      blogs,
      total: count,
      limit,
      offset
    })

  } catch (error: any) {
    console.error('Fetch blogs error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

// POST - Create blog
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has permission to create blogs
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role_id, roles:role_id(name, permissions)')
      .eq('user_id', user.id)

    const canCreate = userRoles?.some((ur: any) => 
      ['super_admin', 'admin', 'faculty'].includes(ur.roles?.name) ||
      ur.roles?.permissions?.create_content
    )

    if (!canCreate) {
      return NextResponse.json({ error: 'Forbidden - Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      slug,
      content,
      excerpt,
      cover_image,
      category,
      tags,
      seo_title,
      seo_description,
      seo_keywords,
      status = 'draft'
    } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Create blog
    const { data: blog, error } = await supabase
      .from('blogs')
      .insert({
        author_id: user.id,
        title,
        slug: finalSlug,
        content,
        excerpt: excerpt || content.substring(0, 200),
        cover_image,
        category,
        tags: tags || [],
        seo_title: seo_title || title,
        seo_description: seo_description || excerpt || content.substring(0, 160),
        seo_keywords: seo_keywords || tags?.join(', '),
        status,
        published_at: status === 'published' ? new Date().toISOString() : null
      })
      .select(`
        *,
        author:author_id(id, full_name, email, avatar_url)
      `)
      .single()

    if (error) throw error

    // If published, create notifications for followers
    if (status === 'published') {
      // Get user's followers (you may need to implement followers table)
      // For now, notify admins
      const { data: adminUsers } = await supabase
        .from('user_roles')
        .select('user_id, roles:role_id(name)')
        .in('roles.name', ['super_admin', 'admin'])

      if (adminUsers) {
        const notifications = adminUsers
          .filter((admin: any) => admin.user_id !== user.id)
          .map((admin: any) => ({
            user_id: admin.user_id,
            actor_id: user.id,
            type: 'blog_published',
            title: 'New Blog Published',
            message: `New blog: ${title}`,
            link: `/blogs/${finalSlug}`,
            related_id: blog.id,
            related_type: 'blog'
          }))

        if (notifications.length > 0) {
          await supabase.from('notifications').insert(notifications)
        }
      }
    }

    // Log activity
    await supabase.rpc('log_activity', {
      p_user_id: user.id,
      p_action: 'blog_created',
      p_resource_type: 'blog',
      p_resource_id: blog.id,
      p_details: { title, status }
    })

    return NextResponse.json({ blog }, { status: 201 })

  } catch (error: any) {
    console.error('Create blog error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create blog' },
      { status: 500 }
    )
  }
}
