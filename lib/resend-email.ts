import { Resend } from 'resend'

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY!)

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
  replyTo?: string
}

/**
 * Send email using Resend
 */
export async function sendEmail(options: SendEmailOptions) {
  try {
    const { to, subject, html, from, replyTo } = options

    const data = await resend.emails.send({
      from: from || process.env.RESEND_FROM_EMAIL || 'CampusAxis <noreply@campusaxis.site>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo,
    })

    return { success: true, data }
  } catch (error: any) {
    console.error('Failed to send email:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send notification email for new achievement unlocked
 */
export async function sendAchievementEmail(
  userEmail: string,
  userName: string,
  achievement: {
    title: string
    description: string
    icon: string
    points: number
  }
) {
  return sendEmail({
    to: userEmail,
    subject: `🎉 Achievement Unlocked: ${achievement.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Achievement Unlocked</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Achievement Unlocked!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #667eea;">
              <div style="font-size: 48px; margin-bottom: 10px;">${achievement.icon}</div>
              <h2 style="color: #667eea; margin: 10px 0;">${achievement.title}</h2>
              <p style="color: #6b7280; margin: 10px 0;">${achievement.description}</p>
              <div style="background: #fef3c7; color: #92400e; padding: 10px 20px; border-radius: 20px; display: inline-block; margin-top: 10px;">
                <strong>+${achievement.points} Points</strong>
              </div>
            </div>
            
            <p style="color: #6b7280; margin: 20px 0;">Keep up the great work! Check your profile to see all your achievements.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://campusaxis.site/gamification" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">View My Achievements</a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>CampusAxis - COMSATS University Lahore</p>
            <p>You're receiving this because you unlocked an achievement on CampusAxis.</p>
          </div>
        </body>
      </html>
    `,
  })
}

/**
 * Send notification email for new comment on user's post
 */
export async function sendCommentNotificationEmail(
  userEmail: string,
  userName: string,
  commenter: string,
  postTitle: string,
  commentContent: string,
  postId: string
) {
  return sendEmail({
    to: userEmail,
    subject: `💬 ${commenter} commented on your post`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #3b82f6; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">💬 New Comment</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hi ${userName},</p>
            
            <p><strong>${commenter}</strong> commented on your post:</p>
            
            <div style="background: white; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
              <p style="color: #6b7280; font-style: italic; margin: 0;">"${postTitle}"</p>
            </div>
            
            <div style="background: #eff6ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0;">${commentContent}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://campusaxis.site/community/posts/${postId}" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">View Comment</a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>CampusAxis - COMSATS University Lahore</p>
          </div>
        </body>
      </html>
    `,
  })
}

/**
 * Send notification email for new like on user's post
 */
export async function sendLikeNotificationEmail(
  userEmail: string,
  userName: string,
  liker: string,
  postTitle: string,
  postId: string
) {
  return sendEmail({
    to: userEmail,
    subject: `❤️ ${liker} liked your post`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #ef4444; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">❤️ New Like</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hi ${userName},</p>
            
            <p><strong>${liker}</strong> liked your post:</p>
            
            <div style="background: white; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
              <p style="color: #6b7280; margin: 0;">"${postTitle}"</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://campusaxis.site/community/posts/${postId}" style="background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">View Post</a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>CampusAxis - COMSATS University Lahore</p>
          </div>
        </body>
      </html>
    `,
  })
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(
  userEmail: string,
  userName: string
) {
  return sendEmail({
    to: userEmail,
    subject: '🎓 Welcome to CampusAxis!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Welcome to CampusAxis! 🎓</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hi ${userName},</p>
            
            <p>Welcome to CampusAxis - your all-in-one platform for COMSATS University Lahore! We're excited to have you join our community.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #667eea; margin-top: 0;">What you can do on CampusAxis:</h3>
              <ul style="color: #6b7280;">
                <li>📚 Access learning resources and past papers</li>
                <li>💬 Connect with students in the community</li>
                <li>⭐ Rate and review faculty members</li>
                <li>🏆 Earn achievements and climb the leaderboard</li>
                <li>📅 Stay updated with campus events</li>
                <li>📝 Upload and share study materials</li>
              </ul>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e;">🚀 <strong>Pro Tip:</strong> Complete your profile and make your first post to unlock your first achievement!</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://campusaxis.site/dashboard" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px;">Go to Dashboard</a>
              <a href="https://campusaxis.site/community" style="background: white; color: #667eea; border: 2px solid #667eea; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px;">Explore Community</a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>CampusAxis - COMSATS University Lahore</p>
            <p>Need help? <a href="https://campusaxis.site/contact" style="color: #667eea;">Contact Support</a></p>
          </div>
        </body>
      </html>
    `,
  })
}

/**
 * Send resource approval notification
 */
export async function sendResourceApprovedEmail(
  userEmail: string,
  userName: string,
  resourceTitle: string,
  resourceId: string
) {
  return sendEmail({
    to: userEmail,
    subject: '✅ Your resource has been approved!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #10b981; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">✅ Resource Approved</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hi ${userName},</p>
            
            <p>Great news! Your uploaded resource has been approved and is now live on CampusAxis:</p>
            
            <div style="background: white; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0;">
              <p style="color: #6b7280; margin: 0; font-weight: bold;">"${resourceTitle}"</p>
            </div>
            
            <p>Thank you for contributing to the CampusAxis community! Your resource will help fellow students succeed.</p>
            
            <div style="background: #d1fae5; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; color: #065f46;">🎉 You've earned contribution points towards achievements!</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://campusaxis.site/resources/${resourceId}" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">View Resource</a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>CampusAxis - COMSATS University Lahore</p>
          </div>
        </body>
      </html>
    `,
  })
}

/**
 * Send digest email with weekly summary
 */
export async function sendWeeklyDigestEmail(
  userEmail: string,
  userName: string,
  stats: {
    newPosts: number
    newResources: number
    newAchievements: number
    leaderboardRank: number
  }
) {
  return sendEmail({
    to: userEmail,
    subject: '📊 Your CampusAxis Weekly Digest',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📊 Your Weekly Digest</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px;">Hi ${userName},</p>
            
            <p>Here's what happened this week on CampusAxis:</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
              <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #e5e7eb;">
                <div style="font-size: 32px; color: #3b82f6; font-weight: bold;">${stats.newPosts}</div>
                <div style="color: #6b7280; font-size: 14px;">New Posts</div>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #e5e7eb;">
                <div style="font-size: 32px; color: #10b981; font-weight: bold;">${stats.newResources}</div>
                <div style="color: #6b7280; font-size: 14px;">New Resources</div>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #e5e7eb;">
                <div style="font-size: 32px; color: #f59e0b; font-weight: bold;">${stats.newAchievements}</div>
                <div style="color: #6b7280; font-size: 14px;">Achievements</div>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #e5e7eb;">
                <div style="font-size: 32px; color: #8b5cf6; font-weight: bold;">#${stats.leaderboardRank}</div>
                <div style="color: #6b7280; font-size: 14px;">Your Rank</div>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://campusaxis.site/dashboard" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">View Dashboard</a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>CampusAxis - COMSATS University Lahore</p>
            <p><a href="https://campusaxis.site/settings/notifications" style="color: #667eea;">Manage Email Preferences</a></p>
          </div>
        </body>
      </html>
    `,
  })
}
