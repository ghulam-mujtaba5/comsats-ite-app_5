import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30', // Cache for 1 minute, stale for 30 sec (optimized for free tier)
    'CDN-Cache-Control': 'public, s-maxage=60',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=60'
  }

  try {
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    // Fetch user preferences
    const { data: preferences, error: prefsError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Default settings if no preferences exist
    const defaultSettings = {
      notifications: {
        email: true,
        push: false,
        communityPosts: true,
        facultyReviews: true,
        helpDeskUpdates: true,
        lostFoundMatches: true,
        newPapers: false,
        weeklyDigest: true
      },
      privacy: {
        profileVisible: true,
        showEmail: false,
        showActivity: true,
        allowMessages: true,
        showStats: true
      },
      preferences: {
        theme: 'system',
        language: 'en',
        emailFrequency: 'instant',
        digestDay: 'monday'
      }
    }

    // Merge with existing settings
    const settings = preferences?.settings || defaultSettings

    return NextResponse.json({
      settings,
      user_id: user.id,
      email: user.email
    }, { headers })

  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500, headers }
    )
  }
}

export async function PATCH(request: NextRequest) {
  // Set cache headers to reduce function invocations
  const headers = {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30', // Cache for 1 minute, stale for 30 sec (optimized for free tier)
    'CDN-Cache-Control': 'public, s-maxage=60',
    'Vercel-CDN-Cache-Control': 'public, s-maxage=60'
  }

  try {
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    const body = await request.json()
    const { settings } = body

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings data required' },
        { status: 400, headers }
      )
    }

    // Update or insert user preferences
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        settings,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Error updating settings:', error)
      return NextResponse.json(
        { error: 'Failed to update settings' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      settings: data.settings
    }, { headers })

  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500, headers }
    )
  }
}
