import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60', // Cache for 2 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }

  try {
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    // Fetch activities from different sources
    const activities: any[] = []

    // 1. Community Posts
    const { data: posts } = await supabase
      .from('community_posts')
      .select('id, title, created_at, likes_count')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    posts?.forEach(post => {
      activities.push({
        id: `post-${post.id}`,
        type: 'post',
        title: 'Posted in Community',
        description: post.title,
        timestamp: post.created_at,
        metadata: { likes: post.likes_count || 0 },
        icon: 'MessageSquare',
        color: 'purple'
      })
    })

    // 2. Faculty Reviews
    const { data: reviews } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        created_at,
        faculty:faculty_id (
          name
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    reviews?.forEach(review => {
      activities.push({
        id: `review-${review.id}`,
        type: 'review',
        title: 'Reviewed Faculty',
        description: (review.faculty as any)?.name || 'Faculty Member',
        timestamp: review.created_at,
        metadata: { rating: review.rating },
        icon: 'Star',
        color: 'yellow'
      })
    })

    // 3. Past Papers Uploaded
    const { data: papers } = await supabase
      .from('past_papers')
      .select('id, course_code, course_name, created_at, download_count')
      .eq('uploaded_by', user.email)
      .order('created_at', { ascending: false })
      .limit(10)

    papers?.forEach(paper => {
      activities.push({
        id: `paper-${paper.id}`,
        type: 'upload',
        title: 'Uploaded Past Paper',
        description: `${paper.course_code} - ${paper.course_name}`,
        timestamp: paper.created_at,
        metadata: { downloads: paper.download_count || 0 },
        icon: 'FileText',
        color: 'blue'
      })
    })

    // 4. Help Desk Tickets
    const { data: tickets } = await supabase
      .from('help_desk_tickets')
      .select('id, title, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    tickets?.forEach(ticket => {
      activities.push({
        id: `ticket-${ticket.id}`,
        type: 'ticket',
        title: 'Created Help Ticket',
        description: ticket.title,
        timestamp: ticket.created_at,
        metadata: { status: ticket.status },
        icon: 'Ticket',
        color: 'orange'
      })
    })

    // 5. Lost & Found Items
    const { data: lostFound } = await supabase
      .from('lost_found_items')
      .select('id, title, category, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    lostFound?.forEach(item => {
      activities.push({
        id: `lostfound-${item.id}`,
        type: 'lostfound',
        title: item.category === 'lost' ? 'Reported Lost Item' : 'Reported Found Item',
        description: item.title,
        timestamp: item.created_at,
        metadata: { category: item.category },
        icon: 'MapPin',
        color: 'green'
      })
    })

    // Sort all activities by timestamp and limit
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)

    return NextResponse.json({
      activities: sortedActivities,
      total: activities.length
    }, { headers })

  } catch (error) {
    console.error('Error fetching activity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity' },
      { status: 500, headers }
    )
  }
}
