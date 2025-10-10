import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const headers = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
  'CDN-Cache-Control': 'public, s-maxage=60',
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers }
      )
    }

    // Get user stats
    const { data: stats, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (statsError) {
      console.error('Error fetching user stats:', statsError)
      return NextResponse.json(
        { error: 'Failed to fetch user progress' },
        { status: 500, headers }
      )
    }

    // Get user's rank from leaderboard
    const { data: leaderboardEntry, error: leaderboardError } = await supabase
      .from('leaderboard')
      .select('rank')
      .eq('user_id', user.id)
      .maybeSingle()

    if (leaderboardError) {
      console.error('Error fetching user rank:', leaderboardError)
    }

    // Get total achievements unlocked
    const { count: achievementsCount, error: achievementsError } = await supabase
      .from('user_achievements')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (achievementsError) {
      console.error('Error counting achievements:', achievementsError)
    }

    // Get total available achievements
    const { count: totalAchievements, error: totalError } = await supabase
      .from('achievements')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true)

    if (totalError) {
      console.error('Error counting total achievements:', totalError)
    }

    const progress = {
      user_id: user.id,
      stats: stats || {
        posts_count: 0,
        comments_count: 0,
        likes_received: 0,
        likes_given: 0,
        resources_uploaded: 0,
        papers_uploaded: 0,
        groups_joined: 0,
        events_attended: 0,
        total_points: 0,
      },
      rank: leaderboardEntry?.rank || null,
      achievements_unlocked: achievementsCount || 0,
      achievements_total: totalAchievements || 0,
      achievement_progress: totalAchievements ? 
        Math.round(((achievementsCount || 0) / totalAchievements) * 100) : 0,
    }

    return NextResponse.json({ progress }, { headers })

  } catch (error: any) {
    console.error('Progress API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers }
    )
  }
}
