import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { 
  sendAchievementEmail, 
  sendCommentNotificationEmail, 
  sendLikeNotificationEmail,
  sendWelcomeEmail,
  sendResourceApprovedEmail,
  sendWeeklyDigestEmail,
  sendUserRegisterEmail,
  sendPasswordResetEmail,
  sendPasswordChangeEmail,
  sendReviewSubmittedEmail,
  sendReviewApprovedEmail,
  sendTimetableUpdatedEmail,
  sendAchievementUnlockedEmail,
  sendMaintenanceScheduledEmail,
  sendNewFeatureEmail
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

      case 'user_register':
        result = await sendUserRegisterEmail(
          user.email,
          user.full_name || 'Student'
        )
        break

      case 'password_reset':
        result = await sendPasswordResetEmail(
          user.email,
          user.full_name || 'Student'
        )
        break

      case 'password_change':
        result = await sendPasswordChangeEmail(
          user.email,
          user.full_name || 'Student'
        )
        break

      case 'review_submitted':
        if (!data?.facultyName) {
          return NextResponse.json({ error: 'facultyName required' }, { status: 400, headers })
        }
        result = await sendReviewSubmittedEmail(
          user.email,
          user.full_name || 'Student',
          data.facultyName
        )
        break

      case 'review_approved':
        if (!data?.facultyName) {
          return NextResponse.json({ error: 'facultyName required' }, { status: 400, headers })
        }
        result = await sendReviewApprovedEmail(
          user.email,
          user.full_name || 'Student',
          data.facultyName
        )
        break

      case 'timetable_updated':
        if (!data?.department || !data?.term) {
          return NextResponse.json({ error: 'department and term required' }, { status: 400, headers })
        }
        result = await sendTimetableUpdatedEmail(
          user.email,
          user.full_name || 'Student',
          data.department,
          data.term
        )
        break

      case 'achievement_unlocked':
        if (!data?.achievementTitle || !data?.points) {
          return NextResponse.json({ error: 'achievementTitle and points required' }, { status: 400, headers })
        }
        result = await sendAchievementUnlockedEmail(
          user.email,
          user.full_name || 'Student',
          data.achievementTitle,
          data.points
        )
        break

      case 'maintenance_scheduled':
        if (!data?.startTime || !data?.endTime) {
          return NextResponse.json({ error: 'startTime and endTime required' }, { status: 400, headers })
        }
        result = await sendMaintenanceScheduledEmail(
          user.email,
          user.full_name || 'Student',
          data.startTime,
          data.endTime
        )
        break

      case 'new_feature':
        if (!data?.featureName || !data?.description) {
          return NextResponse.json({ error: 'featureName and description required' }, { status: 400, headers })
        }
        result = await sendNewFeatureEmail(
          user.email,
          user.full_name || 'Student',
          data.featureName,
          data.description
        )
        break

      default:
        return NextResponse.json({ 
          error: 'Invalid type. Valid types: achievement, comment, like, welcome, resource_approved, weekly_digest, user_register, password_reset, password_change, review_submitted, review_approved, timetable_updated, achievement_unlocked, maintenance_scheduled, new_feature' 
        }, { status: 400, headers })
    }

    if (!result.success) {
      return NextResponse.json({ 
        error: 'Failed to send email',
        details: result.error 
      }, { status: 500, headers })
    }

    // Log email sent (optional)
    const { error: logError } = await supabase.from('email_logs').insert({
      user_id: recipient_id,
      email: user.email,
      type,
      status: 'sent',
      sent_at: new Date().toISOString()
    })
    
    if (logError) {
      console.log('Failed to log email:', logError)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Email sent successfully',
      emailId: (result.data as any)?.data?.id || 'sent'
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
      user_register: true,
      password_reset: true,
      password_change: true,
      post_created: true,
      post_updated: false,
      post_deleted: false,
      resource_uploaded: true,
      resource_updated: false,
      resource_deleted: false,
      blog_created: true,
      blog_updated: false,
      blog_deleted: false,
      guidance_created: true,
      guidance_updated: false,
      guidance_deleted: false,
      admin_login: false,
      admin_grant: true,
      admin_revoke: true,
      content_approve: true,
      content_reject: true,
      user_ban: true,
      user_unban: false,
      user_delete: false,
      settings_update: false,
      permissions_change: false,
      review_submitted: true,
      review_approved: true,
      review_rejected: true,
      review_updated: false,
      faculty_added: true,
      faculty_updated: false,
      timetable_updated: true,
      timetable_added: true,
      timetable_deleted: false,
      group_created: true,
      group_joined: true,
      group_left: false,
      poll_created: true,
      poll_ended: true,
      poll_deleted: false,
      achievement_unlocked: true,
      badge_earned: true,
      maintenance_scheduled: true,
      maintenance_completed: true,
      new_feature: true,
      announcement: true
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