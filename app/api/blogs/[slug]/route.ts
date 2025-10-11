import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const dynamic = 'force-dynamic'

// GET - Get single blog
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const { data: blog, error } = await supabase
      .from('blogs')
      .select(`
        *,
        author:author_id(id, full_name, email, avatar_url)
      `)
      .eq('slug', slug)
      .single()

    if (error) throw error

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    // Increment view count
    await supabase
      .from('blogs')
      .update({ view_count: (blog.view_count || 0) + 1 })
      .eq('id', blog.id)

    return NextResponse.json({ blog })

  } catch (error: any) {
    console.error('Fetch blog error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}

// PATCH - Update blog
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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

    const { slug } = await params
    const body = await request.json()

    // Get existing blog
    const { data: existingBlog, error: fetchError } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .single()

    if (fetchError || !existingBlog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    // Check permissions
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role_id, roles:role_id(name, permissions)')
      .eq('user_id', user.id)

    const isAdmin = userRoles?.some((ur: any) => 
      ['super_admin', 'admin'].includes(ur.roles?.name)
    )
    const isAuthor = existingBlog.author_id === user.id

    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ error: 'Forbidden - Not authorized' }, { status: 403 })
    }

    const updates: any = {}
    
    if (body.title) updates.title = body.title
    if (body.content) updates.content = body.content
    if (body.excerpt !== undefined) updates.excerpt = body.excerpt
    if (body.cover_image !== undefined) updates.cover_image = body.cover_image
    if (body.category) updates.category = body.category
    if (body.tags) updates.tags = body.tags
    if (body.seo_title) updates.seo_title = body.seo_title
    if (body.seo_description) updates.seo_description = body.seo_description
    if (body.seo_keywords) updates.seo_keywords = body.seo_keywords
    
    if (body.status) {
      updates.status = body.status
      if (body.status === 'published' && !existingBlog.published_at) {
        updates.published_at = new Date().toISOString()
      }
    }

    const { data: blog, error } = await supabase
      .from('blogs')
      .update(updates)
      .eq('slug', slug)
      .select(`
        *,
        author:author_id(id, full_name, email, avatar_url)
      `)
      .single()

    if (error) throw error

    // Log activity
    await supabase.rpc('log_activity', {
      p_user_id: user.id,
      p_action: 'blog_updated',
      p_resource_type: 'blog',
      p_resource_id: blog.id,
      p_details: updates
    })

    return NextResponse.json({ blog })

  } catch (error: any) {
    console.error('Update blog error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update blog' },
      { status: 500 }
    )
  }
}

// DELETE - Delete blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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

    const { slug } = await params

    // Get existing blog
    const { data: existingBlog, error: fetchError } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .single()

    if (fetchError || !existingBlog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    // Check permissions
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role_id, roles:role_id(name)')
      .eq('user_id', user.id)

    const isAdmin = userRoles?.some((ur: any) => 
      ['super_admin', 'admin'].includes(ur.roles?.name)
    )
    const isAuthor = existingBlog.author_id === user.id

    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ error: 'Forbidden - Not authorized' }, { status: 403 })
    }

    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('slug', slug)

    if (error) throw error

    // Log activity
    await supabase.rpc('log_activity', {
      p_user_id: user.id,
      p_action: 'blog_deleted',
      p_resource_type: 'blog',
      p_resource_id: existingBlog.id,
      p_details: { title: existingBlog.title }
    })

    return NextResponse.json({ message: 'Blog deleted successfully' })

  } catch (error: any) {
    console.error('Delete blog error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete blog' },
      { status: 500 }
    )
  }
}
