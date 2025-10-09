import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { marked } from 'marked'
import { sanitizeHtml } from '@/lib/utils'

// GET /api/blog - Fetch blog articles
export async function GET(request: NextRequest) {
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

  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const campusId = searchParams.get('campus_id')
    const departmentId = searchParams.get('department_id')

    let query = supabase
      .from('blog_articles')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    if (campusId) {
      query = query.eq('campus_id', campusId)
    }

    if (departmentId) {
      query = query.eq('department_id', departmentId)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('blog_articles')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)

    return NextResponse.json({
      data,
      meta: {
        limit,
        offset,
        total: count || 0,
      },
    })
  } catch (error) {
    console.error('Error fetching blog articles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/blog - Create a new blog article (admin only)
export async function POST(request: NextRequest) {
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

  try {
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

    const body = await request.json()
    const { title, slug, excerpt, content, category, tags, featured_image_url, is_published, is_featured, campus_id, department_id } = body

    // Validate required fields
    if (!title || !slug || !content || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('blog_articles')
      .insert({
        title,
        slug,
        excerpt,
        content: sanitizeHtml(content),
        category,
        tags: tags || [],
        author_name: user.email?.split('@')[0] || 'Anonymous',
        author_id: user.id,
        featured_image_url,
        is_published: is_published || false,
        is_featured: is_featured || false,
        campus_id,
        department_id,
        published_at: is_published ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating blog article:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}