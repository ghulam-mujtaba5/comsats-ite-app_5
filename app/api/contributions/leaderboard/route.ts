import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60', // Cache for 2 minutes (balanced for free tier)
    'CDN-Cache-Control': 'public, s-maxage=120',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=120'
  }

  try {
    const { searchParams } = new URL(request.url)
    const campusId = searchParams.get('campus_id')
    const category = searchParams.get('category') || 'overall' // overall, papers, reviews, community, helpdesk
    const limit = parseInt(searchParams.get('limit') || '50')

    // Fetch all users with their contributions
    let query = supabase
      .from('user_preferences')
      .select(`
        user_id,
        campus_id,
        department_id,
        campuses(name, code),
        departments(name, code)
      `)

    if (campusId) {
      query = query.eq('campus_id', campusId)
    }

    const { data: users, error: usersError } = await query

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500, headers })
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ leaderboard: [] }, { headers })
    }

    // Calculate points for each user
    const leaderboardData = await Promise.all(
      users.map(async (user) => {
        const [papers, reviews, posts, tickets] = await Promise.all([
          supabase.from('past_papers').select('downloads, helpful_count').eq('uploaded_by', user.user_id),
          supabase.from('reviews').select('helpful_count, comment').eq('user_id', user.user_id),
          supabase.from('community_posts').select('likes, comment_count').eq('user_id', user.user_id),
          supabase.from('help_desk_tickets').select('status').eq('user_id', user.user_id),
        ])

        // Calculate category points
        const paperPoints = calculatePaperPoints(papers.data || [])
        const reviewPoints = calculateReviewPoints(reviews.data || [])
        const communityPoints = calculateCommunityPoints(posts.data || [])
        const helpdeskPoints = calculateHelpdeskPoints(tickets.data || [])

        const totalPoints = paperPoints + reviewPoints + communityPoints + helpdeskPoints

        // Get user profile info
        const { data: profile } = await supabase
          .from('auth.users')
          .select('email')
          .eq('id', user.user_id)
          .single()

        // Check for admin role and gamification role
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('role, gamification_role')
          .eq('user_id', user.user_id)
          .single()

        // Extract student ID from email (fa22-bse-105@...)
        const email = profile?.email || ''
        const studentId = email.split('@')[0] || 'Unknown'

        return {
          userId: user.user_id,
          studentId,
          campusName: (user.campuses as any)?.name || 'Unknown',
          campusCode: (user.campuses as any)?.code || 'UNK',
          departmentName: (user.departments as any)?.name || 'Unknown',
          departmentCode: (user.departments as any)?.code || 'UNK',
          totalPoints,
          gamificationRole: adminUser?.gamification_role || null,
          isAdmin: !!adminUser,
          isAdminRole: adminUser?.role || null,
          breakdown: {
            papers: paperPoints,
            reviews: reviewPoints,
            community: communityPoints,
            helpdesk: helpdeskPoints,
          },
          stats: {
            papersUploaded: papers.data?.length || 0,
            reviewsWritten: reviews.data?.length || 0,
            postsCreated: posts.data?.length || 0,
            ticketsCreated: tickets.data?.length || 0,
          }
        }
      })
    )

    // Sort based on category
    let sortedLeaderboard = [...leaderboardData]
    switch (category) {
      case 'papers':
        sortedLeaderboard.sort((a, b) => b.breakdown.papers - a.breakdown.papers)
        break
      case 'reviews':
        sortedLeaderboard.sort((a, b) => b.breakdown.reviews - a.breakdown.reviews)
        break
      case 'community':
        sortedLeaderboard.sort((a, b) => b.breakdown.community - a.breakdown.community)
        break
      case 'helpdesk':
        sortedLeaderboard.sort((a, b) => b.breakdown.helpdesk - a.breakdown.helpdesk)
        break
      default:
        sortedLeaderboard.sort((a, b) => b.totalPoints - a.totalPoints)
    }

    // Add rank and limit results
    const rankedLeaderboard = sortedLeaderboard.slice(0, limit).map((entry, index) => ({
      ...entry,
      rank: index + 1,
      badge: getBadgeForRank(index + 1)
    }))

    return NextResponse.json({ leaderboard: rankedLeaderboard }, { headers })

  } catch (error) {
    console.error('Error generating leaderboard:', error)
    return NextResponse.json({ error: 'Failed to generate leaderboard' }, { status: 500, headers })
  }
}

// Helper functions to calculate points
function calculatePaperPoints(papers: any[]) {
  let points = papers.length * 50 // 50 points per paper
  papers.forEach(paper => {
    points += (paper.downloads || 0) * 2
    points += (paper.helpful_count || 0) * 10
  })
  return points
}

function calculateReviewPoints(reviews: any[]) {
  let points = reviews.length * 25 // 25 points per review
  reviews.forEach(review => {
    points += (review.helpful_count || 0) * 5
    if (review.comment && review.comment.length > 200) {
      points += 15 // Quality bonus
    }
  })
  return points
}

function calculateCommunityPoints(posts: any[]) {
  let points = posts.length * 15 // 15 points per post
  posts.forEach(post => {
    points += (post.likes || 0) * 3
    points += (post.comment_count || 0) * 5
    if ((post.likes || 0) >= 10) {
      points += 20 // Popular post bonus
    }
  })
  return points
}

function calculateHelpdeskPoints(tickets: any[]) {
  let points = tickets.length * 10 // 10 points per ticket
  const resolved = tickets.filter(t => t.status === 'resolved')
  points += resolved.length * 30 // 30 bonus for resolved
  return points
}

function getBadgeForRank(rank: number) {
  if (rank === 1) return { icon: '🏆', color: 'gold', label: 'Champion' }
  if (rank === 2) return { icon: '🥈', color: 'silver', label: '2nd Place' }
  if (rank === 3) return { icon: '🥉', color: 'bronze', label: '3rd Place' }
  if (rank <= 10) return { icon: '⭐', color: 'blue', label: 'Top 10' }
  if (rank <= 25) return { icon: '🌟', color: 'purple', label: 'Top 25' }
  return { icon: '✨', color: 'gray', label: 'Contributor' }
}