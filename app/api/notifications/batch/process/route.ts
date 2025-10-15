import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/admin-access'
import { sendEmail } from '@/lib/resend-email'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const headers = {
  'Cache-Control': 'no-store, must-revalidate',
  'CDN-Cache-Control': 'no-store',
}

// POST - Process batch notifications
export async function POST(req: NextRequest) {
  try {
    // Check admin access
    const access = await requireAdmin(req)
    if (!access.allow) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers })
    }

    // Get pending batch notifications that are scheduled to run
    const { data: batchNotifications, error } = await supabase
      .from('batch_notifications')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .order('created_at', { ascending: true })
      .limit(5) // Process max 5 at a time

    if (error) {
      console.error('Error fetching batch notifications:', error)
      return NextResponse.json({ error: 'Failed to fetch batch notifications' }, { status: 500, headers })
    }

    if (!batchNotifications || batchNotifications.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No batch notifications to process' 
      }, { headers })
    }

    // Process each batch notification
    for (const batch of batchNotifications) {
      try {
        // Update status to processing
        await supabase
          .from('batch_notifications')
          .update({ 
            status: 'processing',
            started_at: new Date().toISOString()
          })
          .eq('id', batch.id)

        // Process recipients
        let processedCount = 0
        const totalRecipients = batch.recipients.length

        for (const recipientId of batch.recipients) {
          try {
            // Create notification for recipient
            const notificationData = {
              user_id: recipientId,
              actor_id: batch.created_by,
              type: batch.notification_template.type || 'announcement',
              title: batch.notification_template.title,
              message: batch.notification_template.message,
              related_id: batch.notification_template.related_id,
              related_type: batch.notification_template.related_type,
              metadata: batch.notification_template.metadata || {}
            }

            // Insert notification
            const { error: notificationError } = await supabase
              .from('notifications')
              .insert(notificationData)

            if (notificationError) {
              console.error(`Error creating notification for user ${recipientId}:`, notificationError)
              continue
            }

            // Send email if email template exists
            if (batch.email_template) {
              try {
                // Get user email
                const { data: user, error: userError } = await supabase
                  .from('user_profiles')
                  .select('email, full_name')
                  .eq('user_id', recipientId)
                  .single()

                if (!userError && user?.email) {
                  // Send email
                  await sendEmail({
                    to: user.email,
                    subject: batch.email_template.subject,
                    html: batch.email_template.html.replace(/\{userName\}/g, user.full_name || 'User')
                  })
                }
              } catch (emailError) {
                console.error(`Error sending email to user ${recipientId}:`, emailError)
              }
            }

            processedCount++
            
            // Update progress every 10 recipients
            if (processedCount % 10 === 0 || processedCount === totalRecipients) {
              const progress = Math.round((processedCount / totalRecipients) * 100)
              await supabase
                .from('batch_notifications')
                .update({ 
                  progress,
                  processed_recipients: processedCount
                })
                .eq('id', batch.id)
            }
          } catch (recipientError) {
            console.error(`Error processing recipient ${recipientId}:`, recipientError)
          }
        }

        // Update batch notification as completed
        await supabase
          .from('batch_notifications')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString(),
            progress: 100,
            processed_recipients: processedCount
          })
          .eq('id', batch.id)

      } catch (batchError) {
        console.error(`Error processing batch ${batch.id}:`, batchError)
        
        // Update batch notification as failed
        await supabase
          .from('batch_notifications')
          .update({ 
            status: 'failed',
            failed_at: new Date().toISOString(),
            error_message: batchError instanceof Error ? batchError.message : 'Unknown error'
          })
          .eq('id', batch.id)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processed ${batchNotifications.length} batch notifications`,
      processed_count: batchNotifications.length
    }, { headers })

  } catch (error: any) {
    console.error('Process batch notifications error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers }
    )
  }
}