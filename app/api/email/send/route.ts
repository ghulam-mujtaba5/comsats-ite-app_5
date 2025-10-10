import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { 
  sendAchievementEmail, 
  sendCommentNotificationEmail, 
  sendLikeNotificationEmail,
  sendWelcomeEmail,
  sendResourceApprovedEmail,
  sendWeeklyDigestEmail 
} from '@/lib/resend-email'

const headers = {
  'Cache-Control': 'no-store, must-revalidate',
  'CDN-Cache-Control': 'no-store',
}

// POST - Send email notification
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    if (!supabaseServiceKey) {
      return NextResponse.json({ error: 'Service key not configured' }, { status: 500, headers })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get request body
    const body = await req.json()
    const { type, recipient_id, data } = body

    if (!type || !recipient_id) {
      return NextResponse.json({ 
        error: 'type and recipient_id are required' 
      }, { status: 400, headers })
    }

    // Get recipient user info
    const { data: user, error: userError } = await supabase
      .from('user_profiles')
      .select('user_id, full_name, email')
      .eq('user_id', recipient_id)
      .single()

    if (userError || !user || !user.email) {
      return NextResponse.json({ 
        error: 'User not found or email not available' 
      }, { status: 404, headers })
    }

    let result

    // Send appropriate email based on type
    switch (type) {
      case 'achievement':
        if (!data?.achievement) {
          return NextResponse.json({ error: 'achievement data required' }, { status: 400, headers })
        }
        result = await sendAchievementEmail(
          user.email,
          user.full_name || 'Student',
          data.achievement
        )
        break

      case 'comment':
        if (!data?.commenter || !data?.postTitle || !data?.commentContent || !data?.postId) {
          return NextResponse.json({ 
            error: 'commenter, postTitle, commentContent, and postId required' 
          }, { status: 400, headers })
        }
        result = await sendCommentNotificationEmail(
          user.email,
          user.full_name || 'Student',
          data.commenter,
          data.postTitle,
          data.commentContent,
          data.postId
        )
        break

      case 'like':
        if (!data?.liker || !data?.postTitle || !data?.postId) {
          return NextResponse.json({ 
            error: 'liker, postTitle, and postId required' 
          }, { status: 400, headers })
        }
        result = await sendLikeNotificationEmail(
          user.email,
          user.full_name || 'Student',
          data.liker,
          data.postTitle,
          data.postId
        )
        break

      case 'welcome':
        result = await sendWelcomeEmail(
          user.email,
          user.full_name || 'Student'
        )
        break

      case 'resource_approved':
        if (!data?.resourceTitle || !data?.resourceId) {
          return NextResponse.json({ 
            error: 'resourceTitle and resourceId required' 
          }, { status: 400, headers })
        }
        result = await sendResourceApprovedEmail(
          user.email,
          user.full_name || 'Student',
          data.resourceTitle,
          data.resourceId
        )
        break

      case 'weekly_digest':
        if (!data?.stats) {
          return NextResponse.json({ error: 'stats required' }, { status: 400, headers })
        }
        result = await sendWeeklyDigestEmail(
          user.email,
          user.full_name || 'Student',
          data.stats
        )
        break

      default:
        return NextResponse.json({ 
          error: 'Invalid type. Valid types: achievement, comment, like, welcome, resource_approved, weekly_digest' 
        }, { status: 400, headers })
    }

    if (!result.success) {
      return NextResponse.json({ 
        error: 'Failed to send email',
        details: result.error 
      }, { status: 500, headers })
    }

    // Log email sent (optional)
    await supabase.from('email_logs').insert({
      user_id: recipient_id,
      email: user.email,
      type,
      status: 'sent',
      sent_at: new Date().toISOString()
    }).catch(err => console.log('Failed to log email:', err))

    return NextResponse.json({ 
      success: true,
      message: 'Email sent successfully',
      emailId: result.data?.id
    }, { status: 200, headers })

  } catch (error: any) {
    console.error('Send email error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers }
    )
  }
}

// GET - Get email preferences for user
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    // Get user email preferences from database
    const { data: preferences, error: prefError } = await supabase
      .from('user_email_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (prefError && prefError.code !== 'PGRST116') {
      console.error('Error fetching preferences:', prefError)
    }

    // Default preferences if not set
    const defaultPreferences = {
      achievements: true,
      comments: true,
      likes: true,
      weekly_digest: true,
      resource_updates: true,
      community_updates: true,
    }

    return NextResponse.json({ 
      preferences: preferences || defaultPreferences 
    }, { headers })

  } catch (error: any) {
    console.error('Get preferences error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers }
    )
  }
}

// PATCH - Update email preferences
export async function PATCH(req: NextRequest) {
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    const body = await req.json()
    const { preferences } = body

    if (!preferences || typeof preferences !== 'object') {
      return NextResponse.json({ 
        error: 'preferences object required' 
      }, { status: 400, headers })
    }

    // Upsert preferences
    const { error: upsertError } = await supabase
      .from('user_email_preferences')
      .upsert({
        user_id: user.id,
        ...preferences,
        updated_at: new Date().toISOString()
      })

    if (upsertError) {
      console.error('Error updating preferences:', upsertError)
      return NextResponse.json({ 
        error: 'Failed to update preferences' 
      }, { status: 500, headers })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Email preferences updated'
    }, { status: 200, headers })

  } catch (error: any) {
    console.error('Update preferences error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers }
    )
  }
}
