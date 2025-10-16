import { createSupabaseClient, extractQueryParams, transformPostRecord } from '@/lib/supabase-utils'
import { checkAndUnlockAchievements } from '@/lib/gamification-achievements'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/community/posts
 * Fetches community posts with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60', // Cache for 2 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
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
        user:user_id (
          id,
          email
        )
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
      transformEnhancedPostRecord(post, likedSet)
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
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60', // Cache for 2 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }
  
  const supabase = await createSupabaseClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    const body = await request.json()
    const { 
      content, 
      type, 
      tags, 
      media, 
      location, 
      feeling, 
      tagged_users, 
      visibility,
      campus_id,
      department_id,
      batch
    } = body

    if (!content || content.trim().length < 3) {
      return NextResponse.json({ error: 'Content must be at least 3 characters' }, { status: 400, headers })
    }

    // Get user's campus and department from user_preferences
    const { campusId, departmentId, batchValue } = await getUserContext(supabase, user.id, body)

    // Get user profile info
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('full_name, avatar_url')
      .eq('user_id', user.id)
      .single()

    const authorName = userProfile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous'
    const avatarUrl = userProfile?.avatar_url || user.user_metadata?.avatar_url || '/student-avatar.png'

    const { data: post, error } = await supabase
      .from('community_posts_enhanced')
      .insert({
        user_id: user.id,
        content: content.trim(),
        type: type || 'general',
        media: media || [],
        location: location || null,
        feeling: feeling || null,
        tagged_users: tagged_users || [],
        visibility: visibility || 'public',
        campus_id: campus_id || campusId,
        department_id: department_id || departmentId,
        batch: batch || batchValue,
        likes_count: 0,
        comments_count: 0,
        shares_count: 0,
        views_count: 0
      })
      .select(`
        id,
        user_id,
        content,
        type,
        media,
        location,
        feeling,
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
        updated_at
      `)
      .single()

    if (error) throw error

    // Transform response to match frontend interface
    const transformedPost = transformEnhancedPostRecord(post)

    // Update user stats and check for achievements
    try {
      // First, get current stats
      const { data: currentStats, error: fetchError } = await supabase
        .from('user_stats')
        .select('posts_count, total_points')
        .eq('user_id', user.id)
        .single()

      if (!fetchError && currentStats) {
        // Update stats with incremented values
        const { error: statsError } = await supabase
          .from('user_stats')
          .update({ 
            posts_count: currentStats.posts_count + 1,
            total_points: currentStats.total_points + 15
          })
          .eq('user_id', user.id)

        if (statsError) {
          console.error('Error updating user stats:', statsError)
        } else {
          // Check for new achievements
          await checkAndUnlockAchievements(supabase, user.id)
        }
      }
    } catch (statsError) {
      console.error('Error updating user stats:', statsError)
    }

    return NextResponse.json(transformedPost, { headers })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

/**
 * PATCH /api/community/posts/[id]
 * Updates an existing community post
 */
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60',
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }
  
  const supabase = await createSupabaseClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    const body = await request.json()
    const { content, type, media, location, feeling, visibility } = body

    // Check if post exists and user is the owner
    const { data: existingPost, error: fetchError } = await supabase
      .from('community_posts_enhanced')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404, headers })
    }

    if (existingPost.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers })
    }

    const { data: post, error } = await supabase
      .from('community_posts_enhanced')
      .update({
        content: content?.trim(),
        type,
        media,
        location,
        feeling,
        visibility,
        is_edited: true,
        edited_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        id,
        user_id,
        content,
        type,
        media,
        location,
        feeling,
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
        updated_at
      `)
      .single()

    if (error) throw error

    const transformedPost = transformEnhancedPostRecord(post)
    return NextResponse.json(transformedPost, { headers })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

/**
 * DELETE /api/community/posts/[id]
 * Deletes a community post
 */
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60',
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }
  
  const supabase = await createSupabaseClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    // Check if post exists and user is the owner
    const { data: existingPost, error: fetchError } = await supabase
      .from('community_posts_enhanced')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404, headers })
    }

    if (existingPost.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers })
    }

    const { error } = await supabase
      .from('community_posts_enhanced')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Post deleted successfully' }, { headers })
  } catch (error) {
    console.error('Error deleting post:', error)
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
): Promise<{ campusId: string | null; departmentId: string | null; batchValue: string | null }> {
  let { campus_id: campusId, department_id: departmentId, batch: batchValue } = body
  
  // If not provided in body, get from user preferences
  if (!campusId || !departmentId || !batchValue) {
    const { data: userPrefs } = await supabase
      .from('user_preferences')
      .select('campus_id, department_id, program_id, semester')
      .eq('user_id', userId)
      .single()
    
    if (userPrefs) {
      campusId = campusId || userPrefs.campus_id
      departmentId = departmentId || userPrefs.department_id
      
      // Generate batch code if not provided and we have program and semester info
      if (!batchValue && userPrefs.program_id && userPrefs.semester) {
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
          batchValue = `${semesterCode}${yearCode}-${program.code}`
        }
      }
    }
  }
  
  return { campusId, departmentId, batchValue }
}

/**
 * Transforms an enhanced post record to match the frontend interface
 */
function transformEnhancedPostRecord(post: any, likedSet: Set<string> = new Set()): any {
  return {
    id: post.id,
    user_id: post.user_id,
    author: post.user?.email?.split('@')[0] || 'Anonymous',
    avatar: post.avatar_url || '/student-avatar.png',
    department: post.department_id || '',
    departmentCode: '',
    campus: post.campus_id || '',
    campusCode: '',
    semester: '',
    batch: post.batch || '',
    time: new Date(post.created_at).toLocaleDateString(),
    content: post.content || '',
    likes: post.likes_count || 0,
    comments: post.comments_count || 0,
    shares: post.shares_count || 0,
    tags: [],
    liked: likedSet.has(post.id),
    type: post.type || 'general',
    media: post.media || [],
    location: post.location || '',
    feeling: post.feeling || '',
    visibility: post.visibility || 'public',
    is_pinned: post.is_pinned || false,
    is_edited: post.is_edited || false,
    edited_at: post.edited_at || '',
    views_count: post.views_count || 0,
    created_at: post.created_at,
    updated_at: post.updated_at || ''
  }
}