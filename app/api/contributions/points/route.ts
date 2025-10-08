import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Contribution point values
export const CONTRIBUTION_POINTS = {
  // Past Papers
  UPLOAD_PAST_PAPER: 50,
  PAST_PAPER_DOWNLOAD: 2,
  PAST_PAPER_HELPFUL: 10,
  
  // Faculty Reviews
  WRITE_REVIEW: 25,
  REVIEW_HELPFUL: 5,
  QUALITY_REVIEW: 15, // Bonus for reviews >200 chars with good rating
  
  // Community Posts
  CREATE_POST: 15,
  POST_LIKE: 3,
  POST_COMMENT: 5,
  POPULAR_POST: 20, // Bonus for 10+ likes
  
  // Help Desk
  CREATE_TICKET: 10,
  RESOLVE_TICKET: 30,
  HELP_RESPONSE: 20,
  
  // Lost & Found
  REPORT_ITEM: 15,
  ITEM_FOUND: 25,
  
  // Engagement
  PROFILE_COMPLETE: 50,
  DAILY_LOGIN_STREAK: 5,
  WEEKLY_ACTIVE: 25,
  MONTHLY_ACTIVE: 100,
}

// Badge thresholds
export const BADGE_THRESHOLDS = {
  // Contribution badges
  CONTRIBUTOR: 100,
  ACTIVE_CONTRIBUTOR: 500,
  SUPER_CONTRIBUTOR: 1000,
  ELITE_CONTRIBUTOR: 2500,
  LEGENDARY_CONTRIBUTOR: 5000,
  
  // Specific category badges
  PAPER_MASTER: 500, // Past papers contribution
  REVIEW_EXPERT: 300, // Review contribution
  COMMUNITY_LEADER: 400, // Community contribution
  HELPER_HERO: 600, // Help desk contribution
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Fetch user's contributions from all sources
    const [
      pastPapersResult,
      reviewsResult,
      postsResult,
      ticketsResult,
      lostFoundResult,
    ] = await Promise.all([
      // Past papers uploaded and their downloads
      supabase
        .from('past_papers')
        .select('id, uploaded_by, downloads, helpful_count')
        .eq('uploaded_by', userId),
      
      // Reviews written and their helpful votes
      supabase
        .from('reviews')
        .select('id, rating, comment, helpful_count, created_at')
        .eq('user_id', userId),
      
      // Community posts and their likes
      supabase
        .from('community_posts')
        .select('id, likes, comment_count, created_at')
        .eq('user_id', userId),
      
      // Help desk tickets
      supabase
        .from('help_desk_tickets')
        .select('id, status, created_at')
        .eq('user_id', userId),
      
      // Lost & found items
      supabase
        .from('lost_found_items')
        .select('id, status, item_type, created_at')
        .eq('reported_by', userId),
    ])

    // Calculate points from each category
    let totalPoints = 0
    const breakdown: Record<string, number> = {
      pastPapers: 0,
      reviews: 0,
      community: 0,
      helpDesk: 0,
      lostFound: 0,
    }

    // Past Papers points
    if (pastPapersResult.data) {
      const papers = pastPapersResult.data
      breakdown.pastPapers += papers.length * CONTRIBUTION_POINTS.UPLOAD_PAST_PAPER
      papers.forEach(paper => {
        breakdown.pastPapers += (paper.downloads || 0) * CONTRIBUTION_POINTS.PAST_PAPER_DOWNLOAD
        breakdown.pastPapers += (paper.helpful_count || 0) * CONTRIBUTION_POINTS.PAST_PAPER_HELPFUL
      })
    }

    // Reviews points
    if (reviewsResult.data) {
      const reviews = reviewsResult.data
      breakdown.reviews += reviews.length * CONTRIBUTION_POINTS.WRITE_REVIEW
      reviews.forEach(review => {
        breakdown.reviews += (review.helpful_count || 0) * CONTRIBUTION_POINTS.REVIEW_HELPFUL
        // Quality bonus for detailed reviews
        if (review.comment && review.comment.length > 200) {
          breakdown.reviews += CONTRIBUTION_POINTS.QUALITY_REVIEW
        }
      })
    }

    // Community posts points
    if (postsResult.data) {
      const posts = postsResult.data
      breakdown.community += posts.length * CONTRIBUTION_POINTS.CREATE_POST
      posts.forEach(post => {
        breakdown.community += (post.likes || 0) * CONTRIBUTION_POINTS.POST_LIKE
        breakdown.community += (post.comment_count || 0) * CONTRIBUTION_POINTS.POST_COMMENT
        // Popular post bonus
        if ((post.likes || 0) >= 10) {
          breakdown.community += CONTRIBUTION_POINTS.POPULAR_POST
        }
      })
    }

    // Help Desk points
    if (ticketsResult.data) {
      const tickets = ticketsResult.data
      breakdown.helpDesk += tickets.length * CONTRIBUTION_POINTS.CREATE_TICKET
      // Bonus for resolved tickets
      const resolved = tickets.filter(t => t.status === 'resolved')
      breakdown.helpDesk += resolved.length * CONTRIBUTION_POINTS.RESOLVE_TICKET
    }

    // Lost & Found points
    if (lostFoundResult.data) {
      const items = lostFoundResult.data
      breakdown.lostFound += items.length * CONTRIBUTION_POINTS.REPORT_ITEM
      // Bonus for found items
      const found = items.filter(i => i.status === 'found')
      breakdown.lostFound += found.length * CONTRIBUTION_POINTS.ITEM_FOUND
    }

    // Calculate total
    totalPoints = Object.values(breakdown).reduce((sum, val) => sum + val, 0)

    // Determine badges earned
    const badges = []
    
    // Overall contribution badges
    if (totalPoints >= BADGE_THRESHOLDS.LEGENDARY_CONTRIBUTOR) {
      badges.push({ id: 'legendary', name: 'Legendary Contributor', description: '5000+ points', rarity: 'legendary', icon: 'Trophy' })
    } else if (totalPoints >= BADGE_THRESHOLDS.ELITE_CONTRIBUTOR) {
      badges.push({ id: 'elite', name: 'Elite Contributor', description: '2500+ points', rarity: 'epic', icon: 'Star' })
    } else if (totalPoints >= BADGE_THRESHOLDS.SUPER_CONTRIBUTOR) {
      badges.push({ id: 'super', name: 'Super Contributor', description: '1000+ points', rarity: 'rare', icon: 'Award' })
    } else if (totalPoints >= BADGE_THRESHOLDS.ACTIVE_CONTRIBUTOR) {
      badges.push({ id: 'active', name: 'Active Contributor', description: '500+ points', rarity: 'uncommon', icon: 'Medal' })
    } else if (totalPoints >= BADGE_THRESHOLDS.CONTRIBUTOR) {
      badges.push({ id: 'contributor', name: 'Contributor', description: '100+ points', rarity: 'common', icon: 'Badge' })
    }

    // Category-specific badges
    if (breakdown.pastPapers >= BADGE_THRESHOLDS.PAPER_MASTER) {
      badges.push({ id: 'paper_master', name: 'Paper Master', description: '500+ paper points', rarity: 'rare', icon: 'FileText' })
    }
    if (breakdown.reviews >= BADGE_THRESHOLDS.REVIEW_EXPERT) {
      badges.push({ id: 'review_expert', name: 'Review Expert', description: '300+ review points', rarity: 'uncommon', icon: 'Star' })
    }
    if (breakdown.community >= BADGE_THRESHOLDS.COMMUNITY_LEADER) {
      badges.push({ id: 'community_leader', name: 'Community Leader', description: '400+ community points', rarity: 'rare', icon: 'Users' })
    }
    if (breakdown.helpDesk >= BADGE_THRESHOLDS.HELPER_HERO) {
      badges.push({ id: 'helper_hero', name: 'Helper Hero', description: '600+ help points', rarity: 'epic', icon: 'Heart' })
    }

    // Count activities for stats
    const stats = {
      papersUploaded: pastPapersResult.data?.length || 0,
      reviewsWritten: reviewsResult.data?.length || 0,
      postsCreated: postsResult.data?.length || 0,
      ticketsCreated: ticketsResult.data?.length || 0,
      itemsReported: lostFoundResult.data?.length || 0,
      totalDownloads: pastPapersResult.data?.reduce((sum, p) => sum + (p.downloads || 0), 0) || 0,
      totalLikes: postsResult.data?.reduce((sum, p) => sum + (p.likes || 0), 0) || 0,
      totalHelpful: reviewsResult.data?.reduce((sum, r) => sum + (r.helpful_count || 0), 0) || 0,
    }

    return NextResponse.json({
      totalPoints,
      breakdown,
      badges,
      stats,
      nextBadge: getNextBadge(totalPoints),
    })

  } catch (error) {
    console.error('Error calculating contribution points:', error)
    return NextResponse.json(
      { error: 'Failed to calculate contribution points' },
      { status: 500 }
    )
  }
}

function getNextBadge(currentPoints: number) {
  const thresholds = [
    { points: BADGE_THRESHOLDS.CONTRIBUTOR, name: 'Contributor', rarity: 'common' },
    { points: BADGE_THRESHOLDS.ACTIVE_CONTRIBUTOR, name: 'Active Contributor', rarity: 'uncommon' },
    { points: BADGE_THRESHOLDS.SUPER_CONTRIBUTOR, name: 'Super Contributor', rarity: 'rare' },
    { points: BADGE_THRESHOLDS.ELITE_CONTRIBUTOR, name: 'Elite Contributor', rarity: 'epic' },
    { points: BADGE_THRESHOLDS.LEGENDARY_CONTRIBUTOR, name: 'Legendary Contributor', rarity: 'legendary' },
  ]

  const next = thresholds.find(t => currentPoints < t.points)
  if (!next) return null

  return {
    ...next,
    pointsNeeded: next.points - currentPoints,
    progress: (currentPoints / next.points) * 100,
  }
}
