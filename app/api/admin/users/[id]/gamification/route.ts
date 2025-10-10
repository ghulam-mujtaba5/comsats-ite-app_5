import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-access'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await context.params
  const access = await requireAdmin(request)
  if (!access.allow) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { action, achievement_id, points, stat_type, stat_value } = body

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    if (!supabaseServiceKey) {
      return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 })
    }

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Admin actions for gamification
    switch (action) {
      case 'grant_achievement':
        // Manually grant an achievement to a user
        if (!achievement_id) {
          return NextResponse.json({ error: 'achievement_id is required' }, { status: 400 })
        }

        // Check if achievement exists
        const { data: achievement, error: achievementError } = await supabase
          .from('achievements')
          .select('*')
          .eq('id', achievement_id)
          .single()

        if (achievementError || !achievement) {
          return NextResponse.json({ error: 'Achievement not found' }, { status: 404 })
        }

        // Check if user already has it
        const { data: existing } = await supabase
          .from('user_achievements')
          .select('id')
          .eq('user_id', userId)
          .eq('achievement_id', achievement_id)
          .maybeSingle()

        if (existing) {
          return NextResponse.json({ 
            message: 'User already has this achievement' 
          }, { status: 200 })
        }

        // Grant achievement
        const { error: grantError } = await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement_id,
          })

        if (grantError) {
          return NextResponse.json({ error: 'Failed to grant achievement' }, { status: 500 })
        }

        // Update user stats
        await supabase.rpc('increment', { row_id: userId, x: achievement.points })

        return NextResponse.json({ 
          success: true, 
          message: `Achievement granted! User earned ${achievement.points} points.` 
        })

      case 'award_points':
        // Manually award bonus points
        if (!points || typeof points !== 'number') {
          return NextResponse.json({ error: 'points (number) is required' }, { status: 400 })
        }

        const { error: pointsError } = await supabase
          .from('user_stats')
          .update({
            total_points: supabase.rpc('increment', { x: points })
          })
          .eq('user_id', userId)

        if (pointsError) {
          return NextResponse.json({ error: 'Failed to award points' }, { status: 500 })
        }

        return NextResponse.json({ 
          success: true, 
          message: `Awarded ${points} bonus points to user.` 
        })

      case 'update_stat':
        // Manually update a specific stat
        if (!stat_type || stat_value === undefined) {
          return NextResponse.json({ 
            error: 'stat_type and stat_value are required' 
          }, { status: 400 })
        }

        const validStats = [
          'posts_count', 'comments_count', 'likes_received', 'likes_given',
          'resources_uploaded', 'papers_uploaded', 'groups_joined', 'events_attended'
        ]

        if (!validStats.includes(stat_type)) {
          return NextResponse.json({ 
            error: `Invalid stat_type. Valid options: ${validStats.join(', ')}` 
          }, { status: 400 })
        }

        const { error: statError } = await supabase
          .from('user_stats')
          .update({ [stat_type]: stat_value })
          .eq('user_id', userId)

        if (statError) {
          return NextResponse.json({ error: 'Failed to update stat' }, { status: 500 })
        }

        return NextResponse.json({ 
          success: true, 
          message: `Updated ${stat_type} to ${stat_value}.` 
        })

      case 'reset_stats':
        // Reset all user stats (use with caution!)
        const { error: resetError } = await supabase
          .from('user_stats')
          .update({
            posts_count: 0,
            comments_count: 0,
            likes_received: 0,
            likes_given: 0,
            resources_uploaded: 0,
            papers_uploaded: 0,
            groups_joined: 0,
            events_attended: 0,
            total_points: 0,
          })
          .eq('user_id', userId)

        if (resetError) {
          return NextResponse.json({ error: 'Failed to reset stats' }, { status: 500 })
        }

        return NextResponse.json({ 
          success: true, 
          message: 'User stats have been reset.' 
        })

      default:
        return NextResponse.json({ 
          error: 'Invalid action. Valid actions: grant_achievement, award_points, update_stat, reset_stats' 
        }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Error in gamification:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}