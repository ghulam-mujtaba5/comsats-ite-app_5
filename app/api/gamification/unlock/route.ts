import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const headers = {
  'Cache-Control': 'no-store, must-revalidate',
  'CDN-Cache-Control': 'no-store',
}

// POST - Unlock an achievement for the current user
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    // Use service role key for unlocking achievements (bypass RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get authenticated user
    const supabaseUser = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    })

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers }
      )
    }

    // Parse request body
    const body = await req.json()
    const { achievement_id } = body

    if (!achievement_id) {
      return NextResponse.json(
        { error: 'achievement_id is required' },
        { status: 400, headers }
      )
    }

    // Check if achievement exists
    const { data: achievement, error: achievementError } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', achievement_id)
      .eq('is_active', true)
      .single()

    if (achievementError || !achievement) {
      return NextResponse.json(
        { error: 'Achievement not found' },
        { status: 404, headers }
      )
    }

    // Check if user already has this achievement
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', user.id)
      .eq('achievement_id', achievement_id)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { 
          message: 'Achievement already unlocked',
          achievement: existing
        },
        { status: 200, headers }
      )
    }

    // Unlock the achievement
    const { data: userAchievement, error: unlockError } = await supabase
      .from('user_achievements')
      .insert({
        user_id: user.id,
        achievement_id: achievement_id,
      })
      .select(`
        *,
        achievement:achievements (*)
      `)
      .single()

    if (unlockError) {
      console.error('Error unlocking achievement:', unlockError)
      return NextResponse.json(
        { error: 'Failed to unlock achievement' },
        { status: 500, headers }
      )
    }

    // Update user stats - add points
    const { error: statsError } = await supabase
      .from('user_stats')
      .update({
        total_points: supabase.rpc('increment', { x: achievement.points })
      })
      .eq('user_id', user.id)

    if (statsError) {
      console.error('Error updating user stats:', statsError)
    }

    // Send achievement email notification (async - don't wait)
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'}/api/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'achievement',
        recipient_id: user.id,
        data: {
          achievement: {
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            points: achievement.points,
          }
        }
      })
    }).catch(err => console.log('Failed to send achievement email:', err))

    return NextResponse.json({
      success: true,
      message: `Achievement unlocked! +${achievement.points} points`,
      achievement: userAchievement,
      points_earned: achievement.points
    }, { status: 201, headers })

  } catch (error: any) {
    console.error('Unlock achievement error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers }
    )
  }
}

// GET - Get user's achievements
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

    // Get user's unlocked achievements
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievements (*)
      `)
      .eq('user_id', user.id)
      .order('unlocked_at', { ascending: false })

    if (error) {
      console.error('Error fetching user achievements:', error)
      return NextResponse.json(
        { error: 'Failed to fetch achievements' },
        { status: 500, headers }
      )
    }

    return NextResponse.json({ 
      achievements: data || [],
      total: data?.length || 0
    }, { headers })

  } catch (error: any) {
    console.error('Get achievements error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers }
    )
  }
}
