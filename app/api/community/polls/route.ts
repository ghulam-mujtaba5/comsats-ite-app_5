import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }

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
    const campusId = searchParams.get('campus_id')
    const departmentId = searchParams.get('department_id')
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10), 1), 100)
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0)

    let query = supabase
      .from('community_polls')
      .select(`
        *,
        creator:user_id (
          id,
          email
        ),
        campuses(name, code),
        departments(name, code)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters if provided
    if (campusId) {
      query = query.eq('campus_id', campusId)
    }

    if (departmentId) {
      query = query.eq('department_id', departmentId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching polls:', error)
      return NextResponse.json({ error: 'Failed to fetch polls' }, { status: 500, headers })
    }

    // Get current user for vote status
    const { data: auth } = await supabase.auth.getUser()
    
    // Transform data for frontend
    const polls = (data || []).map((poll: any) => {
      return {
        id: poll.id,
        question: poll.title,
        description: poll.description,
        options: poll.options.map((option: string, index: number) => ({
          id: index.toString(),
          text: option,
          votes: poll.votes?.[index] || 0
        })),
        totalVotes: poll.votes?.reduce((sum: number, count: number) => sum + count, 0) || 0,
        userHasVoted: false, // Will be updated when we get user votes
        createdAt: poll.created_at,
        expiresAt: poll.expires_at,
        createdBy: {
          name: poll.creator?.email?.split('@')[0] || 'Anonymous',
          avatar: poll.creator?.user_metadata?.avatar_url || '/student-avatar.png'
        },
        campusId: poll.campus_id,
        departmentId: poll.department_id,
        batch: poll.batch,
        tags: [],
        category: 'general',
        isAnonymous: false
      }
    })

    return NextResponse.json(polls, { headers })
  } catch (error) {
    console.error('Error in GET /api/community/polls:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}

export async function POST(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }

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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    const body = await request.json()
    const {
      question,
      description,
      options,
      category,
      isAnonymous,
      expiresIn,
      campusId,
      departmentId,
      batch
    } = body

    // Validate required fields
    if (!question || !options || options.length < 2) {
      return NextResponse.json({ error: 'Question and at least 2 options are required' }, { status: 400, headers })
    }

    // Validate options
    const validOptions = options.filter((option: string) => option.trim().length > 0)
    if (validOptions.length < 2) {
      return NextResponse.json({ error: 'At least 2 valid options are required' }, { status: 400, headers })
    }

    // Calculate expiration date
    let expiresAt = null
    if (expiresIn) {
      const days = parseInt(expiresIn)
      if (!isNaN(days) && days > 0) {
        const date = new Date()
        date.setDate(date.getDate() + days)
        expiresAt = date.toISOString()
      }
    }

    // Create poll
    const { data, error } = await supabase
      .from('community_polls')
      .insert({
        user_id: user.id,
        title: question.trim(),
        description: description?.trim() || null,
        options: validOptions,
        votes: new Array(validOptions.length).fill(0), // Initialize vote counts to 0
        allow_multiple: false, // For now, single selection only
        expires_at: expiresAt,
        is_active: true,
        campus_id: campusId,
        department_id: departmentId,
        batch: batch
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating poll:', error)
      return NextResponse.json({ error: 'Failed to create poll' }, { status: 500, headers })
    }

    // Transform for frontend
    const poll = {
      id: data.id,
      question: data.title,
      description: data.description,
      options: data.options.map((option: string, index: number) => ({
        id: index.toString(),
        text: option,
        votes: 0
      })),
      totalVotes: 0,
      userHasVoted: false,
      createdAt: data.created_at,
      expiresAt: data.expires_at,
      createdBy: {
        name: user.email?.split('@')[0] || 'Anonymous',
        avatar: user.user_metadata?.avatar_url || '/student-avatar.png'
      },
      campusId: data.campus_id,
      departmentId: data.department_id,
      batch: data.batch,
      tags: [],
      category: category || 'general',
      isAnonymous: isAnonymous || false
    }

    return NextResponse.json(poll)
  } catch (error) {
    console.error('Error in POST /api/community/polls:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  }
}