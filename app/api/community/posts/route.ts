import { createSupabaseClient, extractQueryParams, transformPostRecord } from '@/lib/supabase-utils'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/community/posts
 * Fetches community posts with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }

  const supabase = await createSupabaseClient()
  
  try {
    const { limit, offset, withMeta, campusId, departmentId, batch } = extractQueryParams(request)

    // Build the base query with joins to get campus and department information
    // Select only necessary fields to reduce data transfer and CPU usage
    let query = supabase
      .from('community_posts_enhanced')
      .select(`
        id,
        user_id,
        content,
        type,
        media,
        location,
        feeling,
        tagged_users,
        visibility,
        campus_id,
        department_id,
        batch,
        is_pinned,
        is_edited,
        edited_at,
        likes_count,
        comments_count,
        shares_count,
        views_count,
        created_at,
        updated_at,
        campuses(name, code),
        departments(name, code)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    query = applyFilters(query, { campusId, departmentId, batch })

    const { data: posts, error } = await query

    if (error) throw error

    // Determine current user and liked posts
    const likedSet = await getUserLikedPosts(supabase, posts)

    // Transform data to match frontend interface
    const transformedPosts = (posts as any[]).map((post: any) => 
      transformPostRecord(post, likedSet)
    )

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
      }, { headers })
    }

    return NextResponse.json(transformedPosts, { headers })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: { ...headers, "Content-Type": "application/json" } })
  }
}

/**
 * POST /api/community/posts
 * Creates a new community post
 */
export async function POST(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }
  
  const supabase = await createSupabaseClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    const body = await request.json()
    const { content, type, tags } = body

    if (!content || content.trim().length < 10) {
      return NextResponse.json({ error: 'Content must be at least 10 characters' }, { status: 400, headers })
    }

    // Get user's campus and department from user_preferences
    const { campusId, departmentId, batch } = await getUserContext(supabase, user.id, body)

    // Get user's avatar URL from their profile metadata
    const avatarUrl = user.user_metadata?.avatar_url || '/student-avatar.png'

    const { data: post, error } = await supabase
      .from('community_posts_enhanced')
      .insert({
        content: content.trim(),
        type: type || 'general',
        tags: tags || [],
        batch: batch || '', // e.g., 'FA22-BSE'
        campus_id: campusId,
        department_id: departmentId,
        user_id: user.id,
        author_name: user.email?.split('@')[0] || 'Anonymous',
        avatar_url: avatarUrl
      })
      .select(`
        id,
        user_id,
        content,
        type,
        media,
        location,
        feeling,
        tagged_users,
        visibility,
        campus_id,
        department_id,
        batch,
        is_pinned,
        is_edited,
        edited_at,
        likes_count,
        comments_count,
        shares_count,
        views_count,
        created_at,
        updated_at,
        campuses(name, code),
        departments(name, code)
      `)
      .single()

    if (error) throw error

    // Transform response to match frontend interface
    const transformedPost = transformPostRecord(post)

    return NextResponse.json(transformedPost, { headers })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

// === Helper Functions ===

/**
 * Applies filters to the Supabase query
 */
function applyFilters(
  query: any, 
  filters: { campusId?: string | null; departmentId?: string | null; batch?: string | null }
) {
  let result = query
  
  if (filters.campusId) {
    result = result.eq('campus_id', filters.campusId)
  }

  if (filters.departmentId) {
    result = result.eq('department_id', filters.departmentId)
  }

  if (filters.batch) {
    result = result.eq('batch', filters.batch)
  }
  
  return result
}

/**
 * Gets the set of post IDs that the current user has liked
 */
async function getUserLikedPosts(supabase: any, posts: any[]): Promise<Set<string>> {
  const { data: auth } = await supabase.auth.getUser()
  const likedSet = new Set<string>()
  
  if (auth?.user && posts && posts.length) {
    const ids = posts.map((p) => p.id)
    const { data: likedRows } = await supabase
      .from('post_reactions')
      .select('post_id')
      .eq('user_id', auth.user.id)
      .in('post_id', ids)
      
    if (likedRows) {
      likedRows.forEach((r: any) => likedSet.add(String(r.post_id)))
    }
  }
  
  return likedSet
}

/**
 * Gets user context (campus, department, batch) for post creation
 */
async function getUserContext(
  supabase: any, 
  userId: string, 
  body: any
): Promise<{ campusId: string | null; departmentId: string | null; batch: string | null }> {
  let { campus_id: campusId, department_id: departmentId, batch } = body
  
  // If not provided in body, get from user preferences
  if (!campusId || !departmentId || !batch) {
    const { data: userPrefs } = await supabase
      .from('user_preferences')
      .select('campus_id, department_id, program_id, semester')
      .eq('user_id', userId)
      .single()
    
    if (userPrefs) {
      campusId = campusId || userPrefs.campus_id
      departmentId = departmentId || userPrefs.department_id
      
      // Generate batch code if not provided and we have program and semester info
      if (!batch && userPrefs.program_id && userPrefs.semester) {
        const { data: program } = await supabase
          .from('programs')
          .select('code')
          .eq('id', userPrefs.program_id)
          .single()
        
        if (program) {
          // Import the generateBatchCode function
          const semesterCode = userPrefs.semester % 2 === 1 ? 'FA' : 'SP'
          const year = new Date().getFullYear()
          const yearCode = year.toString().substring(2) // Get last 2 digits of year
          batch = `${semesterCode}${yearCode}-${program.code}`
        }
      }
    }
  }
  
  return { campusId, departmentId, batch }
}