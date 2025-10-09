import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { marked } from 'marked'
import { sanitizeHtml } from '@/lib/utils'

// Static blog posts
const STATIC_BLOG_POSTS = [
  {
    id: 'comsats-grading-system',
    slug: 'comsats-grading-system',
    title: 'COMSATS Grading System & GPA Calculators',
    excerpt: 'Understand COMSATS\' absolute grading system, grading scale, GPA/CGPA formulas, and use interactive calculators to compute and plan your GPA.',
    content: '',
    category: 'academic',
    tags: ['gpa', 'grading', 'comsats', 'academic'],
    author_name: 'CampusAxis',
    featured_image_url: null,
    is_published: true,
    is_featured: true,
    published_at: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    view_count: 0
  },
  {
    id: 'comsats-gpa-calculator-guide',
    slug: 'comsats-gpa-calculator-guide',
    title: 'Complete Guide to COMSATS GPA Calculator - How to Calculate Your GPA',
    excerpt: 'Learn how to calculate your GPA at COMSATS University with our free GPA calculator. Complete guide to semester GPA, cumulative CGPA, and admission aggregate calculations.',
    content: '',
    category: 'academic',
    tags: ['gpa', 'calculator', 'comsats', 'academic', 'guide'],
    author_name: 'CampusAxis',
    featured_image_url: null,
    is_published: true,
    is_featured: true,
    published_at: '2024-01-15T00:00:00Z',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    view_count: 0
  }
]

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

    // Combine database articles with static articles
    let allArticles = [...STATIC_BLOG_POSTS, ...(data || [])]

    // Apply filters to static articles as well
    if (category) {
      allArticles = allArticles.filter(article => article.category === category)
    }

    if (search) {
      allArticles = allArticles.filter(article => 
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (featured === 'true') {
      allArticles = allArticles.filter(article => article.is_featured)
    }

    // Sort by published date
    allArticles.sort((a, b) => 
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    )

    // Apply pagination
    const paginatedArticles = allArticles.slice(offset, offset + limit)

    // Get total count for pagination
    const { count } = await supabase
      .from('blog_articles')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)

    const totalCount = (count || 0) + STATIC_BLOG_POSTS.length

    return NextResponse.json({
      data: paginatedArticles,
      meta: {
        limit,
        offset,
        total: totalCount,
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