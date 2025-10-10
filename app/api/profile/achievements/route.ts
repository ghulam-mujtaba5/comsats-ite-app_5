import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  earned: boolean
  progress?: number
  maxProgress?: number
  earnedDate?: string
}

export async function GET(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150', // Cache for 5 minutes, stale for 2.5 min
    'CDN-Cache-Control': 'public, s-maxage=300',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
  }

  try {
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    // Fetch user stats
    const { data: posts, count: postsCount } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const { data: reviews, count: reviewsCount } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const { data: papers, count: papersCount } = await supabase
      .from('past_papers')
      .select('*', { count: 'exact', head: true })
      .eq('uploaded_by', user.email)

    const { data: tickets, count: ticketsCount } = await supabase
      .from('help_desk_tickets')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Calculate total likes
    const { data: postsWithLikes } = await supabase
      .from('community_posts')
      .select('likes_count')
      .eq('user_id', user.id)

    const totalLikes = postsWithLikes?.reduce((sum, post) => sum + (post.likes_count || 0), 0) || 0

    // Get user join date
    const joinDate = new Date(user.created_at)
    const daysSinceJoin = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24))
    const isEarlyAdopter = daysSinceJoin <= 30

    // Define achievements with real progress
    const achievements: Achievement[] = [
      {
        id: 'early-adopter',
        title: 'Early Adopter',
        description: 'Joined in the first month',
        icon: 'Trophy',
        rarity: 'rare',
        earned: isEarlyAdopter,
        earnedDate: isEarlyAdopter ? user.created_at : undefined
      },
      {
        id: 'first-post',
        title: 'First Steps',
        description: 'Create your first community post',
        icon: 'MessageSquare',
        rarity: 'common',
        earned: (postsCount || 0) >= 1,
        progress: Math.min(postsCount || 0, 1),
        maxProgress: 1
      },
      {
        id: 'active-contributor',
        title: 'Active Contributor',
        description: 'Create 10+ community posts',
        icon: 'MessageSquare',
        rarity: 'uncommon',
        earned: (postsCount || 0) >= 10,
        progress: Math.min(postsCount || 0, 10),
        maxProgress: 10
      },
      {
        id: 'prolific-writer',
        title: 'Prolific Writer',
        description: 'Create 50+ community posts',
        icon: 'Pencil',
        rarity: 'epic',
        earned: (postsCount || 0) >= 50,
        progress: Math.min(postsCount || 0, 50),
        maxProgress: 50
      },
      {
        id: 'first-review',
        title: 'Critic\'s Debut',
        description: 'Write your first faculty review',
        icon: 'Star',
        rarity: 'common',
        earned: (reviewsCount || 0) >= 1,
        progress: Math.min(reviewsCount || 0, 1),
        maxProgress: 1
      },
      {
        id: 'review-master',
        title: 'Review Master',
        description: 'Write 20+ faculty reviews',
        icon: 'Star',
        rarity: 'rare',
        earned: (reviewsCount || 0) >= 20,
        progress: Math.min(reviewsCount || 0, 20),
        maxProgress: 20
      },
      {
        id: 'helpful-citizen',
        title: 'Community Helper',
        description: 'Receive 100+ total likes',
        icon: 'Heart',
        rarity: 'epic',
        earned: totalLikes >= 100,
        progress: Math.min(totalLikes, 100),
        maxProgress: 100
      },
      {
        id: 'popular-creator',
        title: 'Popular Creator',
        description: 'Receive 500+ total likes',
        icon: 'Heart',
        rarity: 'legendary',
        earned: totalLikes >= 500,
        progress: Math.min(totalLikes, 500),
        maxProgress: 500
      },
      {
        id: 'knowledge-sharer',
        title: 'Knowledge Sharer',
        description: 'Upload 5+ past papers',
        icon: 'BookOpen',
        rarity: 'uncommon',
        earned: (papersCount || 0) >= 5,
        progress: Math.min(papersCount || 0, 5),
        maxProgress: 5
      },
      {
        id: 'resource-champion',
        title: 'Resource Champion',
        description: 'Upload 20+ past papers',
        icon: 'FileText',
        rarity: 'rare',
        earned: (papersCount || 0) >= 20,
        progress: Math.min(papersCount || 0, 20),
        maxProgress: 20
      },
      {
        id: 'problem-solver',
        title: 'Problem Solver',
        description: 'Create 5+ help desk tickets',
        icon: 'Ticket',
        rarity: 'uncommon',
        earned: (ticketsCount || 0) >= 5,
        progress: Math.min(ticketsCount || 0, 5),
        maxProgress: 5
      },
      {
        id: 'veteran',
        title: 'Veteran Member',
        description: 'Active for 100+ days',
        icon: 'Calendar',
        rarity: 'rare',
        earned: daysSinceJoin >= 100,
        progress: Math.min(daysSinceJoin, 100),
        maxProgress: 100
      }
    ]

    // Calculate stats
    const earnedCount = achievements.filter(a => a.earned).length
    const totalCount = achievements.length
    const completionRate = Math.round((earnedCount / totalCount) * 100)

    return NextResponse.json({
      achievements,
      stats: {
        earned: earnedCount,
        total: totalCount,
        completionRate
      }
    }, { headers })

  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500, headers }
    )
  }
}
