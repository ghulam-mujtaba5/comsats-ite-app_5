import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { marked } from 'marked'
import { sanitizeHtml } from '@/lib/utils'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

// Create a DOMPurify instance
const window = new JSDOM('').window
const purify = DOMPurify(window)

// GET /api/blog/[id] - Fetch a specific blog article
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15 requires awaiting params for dynamic routes
    const { id } = await context.params

    const cookieStore = await cookies()
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

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      // Try to find by slug
      const { data: articleBySlug, error: slugError } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('slug', id)
        .eq('is_published', true)
        .single()

      if (slugError || !articleBySlug) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 })
      }

      // Increment view count
      await supabase
        .from('blog_articles')
        .update({ view_count: articleBySlug.view_count + 1 })
        .eq('id', articleBySlug.id)

      return NextResponse.json(articleBySlug)
    }

    const { data, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Increment view count
    await supabase
      .from('blog_articles')
      .update({ view_count: data.view_count + 1 })
      .eq('id', id)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching blog article:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/blog/[id] - Update a blog article (admin only)
export async function PUT(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15 requires awaiting params for dynamic routes
    const { id } = await context.params

    const cookieStore = await cookies()
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

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await _request.json()
    const { title, slug, excerpt, content, category, tags, featured_image_url, is_published, is_featured, campus_id, department_id } = body

    // Validate required fields
    if (!title || !slug || !content || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('blog_articles')
      .update({
        title,
        slug,
        excerpt,
        content: sanitizeHtml(content),
        category,
        tags: tags || [],
        featured_image_url,
        is_published,
        is_featured,
        campus_id,
        department_id,
        published_at: is_published && !body.published_at ? new Date().toISOString() : body.published_at,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating blog article:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/blog/[id] - Delete a blog article (admin only)
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15 requires awaiting params for dynamic routes
    const { id } = await context.params

    const cookieStore = await cookies()
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

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if article exists and user has permission to delete it
    const { data: article } = await supabase
      .from('blog_articles')
      .select('author_id')
      .eq('id', id)
      .single()

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Only super admins or the author can delete
    if (adminUser.role !== 'super_admin' && article.author_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
      .from('blog_articles')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog article:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}