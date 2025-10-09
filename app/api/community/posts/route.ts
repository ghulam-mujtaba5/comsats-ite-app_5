import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

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

  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10), 1), 100)
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0)
    const withMeta = (searchParams.get('meta') || '') === '1'
    const campusId = searchParams.get('campus_id')
    const departmentId = searchParams.get('department_id')
    const batch = searchParams.get('batch') // e.g., 'FA22-BSE'

    // Enhanced query with joins to get campus and department information
    let query = supabase
      .from('community_posts')
      .select(`
        *,
        campuses(name, code),
        departments(name, code)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by campus if provided
    if (campusId) {
      query = query.eq('campus_id', campusId)
    }

    // Filter by department if provided
    if (departmentId) {
      query = query.eq('department_id', departmentId)
    }

    // Filter by batch if provided
    if (batch) {
      query = query.eq('batch', batch)
    }

    const { data: posts, error } = await query

    if (error) throw error

    // Determine current user and liked posts
    const { data: auth } = await supabase.auth.getUser()
    let likedSet = new Set<string>()
    if (auth?.user && posts && posts.length) {
      const ids = (posts as any[]).map((p) => p.id)
      const { data: likedRows } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', auth.user.id)
        .in('post_id', ids)
      if (likedRows) {
        likedSet = new Set(likedRows.map((r: any) => String(r.post_id)))
      }
    }

    // Transform data to match frontend interface
    const transformedPosts = (posts as any[]).map((post: any) => ({
      id: post.id.toString(),
      author: post.author_name || 'Anonymous',
      avatar: post.avatar_url || '/student-avatar.png',
      department: post.department || (post.departments ? post.departments.name : ''),
      departmentCode: post.departments ? post.departments.code : '',
      campus: post.campuses ? post.campuses.name : '',
      campusCode: post.campuses ? post.campuses.code : '',
      semester: post.semester || '',
      batch: post.batch || '', // e.g., 'FA22-BSE'
      time: new Date(post.created_at).toLocaleString(),
      content: post.content,
      likes: post.likes || 0,
      comments: post.comments_count || 0,
      shares: post.shares || 0,
      tags: Array.isArray(post.tags) ? post.tags : [],
      liked: likedSet.has(String(post.id)),
      type: post.type || 'general'
    }))

    if (withMeta) {
      const pageLen = transformedPosts.length
      return NextResponse.json({
        data: transformedPosts,
        meta: {
          limit,
          offset,
          nextOffset: offset + pageLen,
          hasMore: pageLen === limit,
        },
      })
    }

    return NextResponse.json(transformedPosts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, type, tags, campusId, departmentId, batch } = body

    if (!content || content.trim().length < 10) {
      return NextResponse.json({ error: 'Content must be at least 10 characters' }, { status: 400 })
    }

    // Get user's campus and department from user_preferences if not provided
    let finalCampusId = campusId
    let finalDepartmentId = departmentId
    let finalBatch = batch
    
    if (!finalCampusId || !finalDepartmentId || !finalBatch) {
      const { data: userPrefs } = await supabase
        .from('user_preferences')
        .select('campus_id, department_id, program_id, semester')
        .eq('user_id', user.id)
        .single()
      
      if (userPrefs) {
        finalCampusId = finalCampusId || userPrefs.campus_id
        finalDepartmentId = finalDepartmentId || userPrefs.department_id
        
        // Generate batch code if not provided and we have program and semester info
        if (!finalBatch && userPrefs.program_id && userPrefs.semester) {
          const { data: program } = await supabase
            .from('programs')
            .select('code')
            .eq('id', userPrefs.program_id)
            .single()
          
          if (program) {
            // Generate batch code like FA22-BSE, SP23-BSEE, etc.
            const semesterCode = userPrefs.semester % 2 === 1 ? 'FA' : 'SP'
            const year = new Date().getFullYear()
            const yearCode = year.toString().substring(2) // Get last 2 digits of year
            finalBatch = `${semesterCode}${yearCode}-${program.code}`
          }
        }
      }
    }

    // Get user's avatar URL from their profile metadata
    let avatarUrl = '/student-avatar.png'
    if (user.user_metadata?.avatar_url) {
      avatarUrl = user.user_metadata.avatar_url
    }

    const { data: post, error } = await supabase
      .from('community_posts')
      .insert({
        content: content.trim(),
        type: type || 'general',
        tags: tags || [],
        batch: finalBatch || '', // e.g., 'FA22-BSE'
        campus_id: finalCampusId,
        department_id: finalDepartmentId,
        user_id: user.id,
        author_name: user.email?.split('@')[0] || 'Anonymous',
        avatar_url: avatarUrl
      })
      .select(`
        *,
        campuses(name, code),
        departments(name, code)
      `)
      .single()

    if (error) throw error

    // Transform response to match frontend interface
    const transformedPost = {
      id: post.id.toString(),
      author: post.author_name,
      avatar: post.avatar_url,
      department: post.department || (post.departments ? post.departments.name : ''),
      departmentCode: post.departments ? post.departments.code : '',
      campus: post.campuses ? post.campuses.name : '',
      campusCode: post.campuses ? post.campuses.code : '',
      semester: post.semester || '',
      batch: post.batch || '',
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
