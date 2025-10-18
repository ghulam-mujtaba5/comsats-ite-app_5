import { supabase } from '@/lib/supabase'

// Define all possible notification types
type NotificationType = 
  // Existing types
  'like' | 'comment' | 'follow' | 'mention' | 'group_invite' | 'event_reminder' | 'poll_vote' | 'share' | 'reply' | 'reaction' |
  // Authentication events
  'user_register' | 'password_reset' | 'password_change' | 'user_login' | 'user_logout' |
  // Content updates
  'post_created' | 'post_updated' | 'post_deleted' | 'post_approved' | 'post_rejected' |
  'resource_uploaded' | 'resource_updated' | 'resource_deleted' | 'resource_approved' | 'resource_rejected' |
  'blog_created' | 'blog_updated' | 'blog_deleted' | 'blog_published' |
  'guidance_created' | 'guidance_updated' | 'guidance_deleted' | 'guidance_published' |
  // Administrative actions
  'admin_login' | 'admin_grant' | 'admin_revoke' |
  'content_approve' | 'content_reject' | 'content_delete' |
  'user_ban' | 'user_unban' | 'user_delete' |
  'settings_update' | 'permissions_change' |
  // Support tickets
  'support_ticket_response' | 'support_ticket_closed' |
  // Role management
  'role_assigned' | 'role_removed' |
  // Review & faculty events
  'review_submitted' | 'review_approved' | 'review_rejected' | 'review_updated' |
  'faculty_added' | 'faculty_updated' |
  // Timetable events
  'timetable_updated' | 'timetable_added' | 'timetable_deleted' |
  // Community interactions
  'group_created' | 'group_joined' | 'group_left' |
  'poll_created' | 'poll_ended' | 'poll_deleted' |
  'achievement_unlocked' | 'badge_earned' |
  // System events
  'maintenance_scheduled' | 'maintenance_completed' |
  'new_feature' | 'announcement' |
  'system_alert' | 'admin_message'

type RelatedType = 
  // Existing types
  'post' | 'comment' | 'group' | 'event' | 'poll' | 'reply' |
  // New types
  'faculty' | 'review' | 'timetable' | 'resource' | 'blog' | 'guidance' | 
  'support_ticket' | 'user' | 'lost_found' | 'achievement' | 'badge' | 'admin_action'

export interface NotificationPayload {
  user_id: string
  type: NotificationType
  title: string
  message: string
  related_id?: string
  related_type?: RelatedType
  metadata?: Record<string, any>
}

/**
 * Send a notification to a user
 */
export async function sendNotification(payload: NotificationPayload) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: payload.user_id,
        actor_id: user?.id,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        related_id: payload.related_id,
        related_type: payload.related_type,
        metadata: payload.metadata || null,
      })

    if (error) {
      console.error('Error sending notification:', error)
      throw error
    }
  } catch (error) {
    console.error('Failed to send notification:', error)
    throw error
  }
}

/**
 * Send notification when someone likes a post
 */
export async function notifyPostLike(postId: string, postAuthorId: string, likerName: string) {
  const { data: { user } } = await supabase.auth.getUser()
  
  // Don't notify if user likes their own post
  if (user?.id === postAuthorId) return

  await sendNotification({
    user_id: postAuthorId,
    type: 'like',
    title: 'New Like on Your Post',
    message: `${likerName} liked your post`,
    related_id: postId,
    related_type: 'post',
    metadata: { liker_id: user?.id }
  })
}

/**
 * Send notification when someone comments on a post
 */
export async function notifyPostComment(postId: string, postAuthorId: string, commenterName: string, commentPreview: string) {
  const { data: { user } } = await supabase.auth.getUser()
  
  // Don't notify if user comments on their own post
  if (user?.id === postAuthorId) return

  await sendNotification({
    user_id: postAuthorId,
    type: 'comment',
    title: 'New Comment on Your Post',
    message: `${commenterName} commented: "${commentPreview.substring(0, 100)}${commentPreview.length > 100 ? '...' : ''}"`,
    related_id: postId,
    related_type: 'post',
    metadata: { commenter_id: user?.id }
  })
}

/**
 * Send notification when someone replies to a comment
 */
export async function notifyCommentReply(commentId: string, commentAuthorId: string, replierName: string, replyPreview: string) {
  const { data: { user } } = await supabase.auth.getUser()
  
  // Don't notify if user replies to their own comment
  if (user?.id === commentAuthorId) return

  await sendNotification({
    user_id: commentAuthorId,
    type: 'reply',
    title: 'New Reply to Your Comment',
    message: `${replierName} replied: "${replyPreview.substring(0, 100)}${replyPreview.length > 100 ? '...' : ''}"`,
    related_id: commentId,
    related_type: 'comment',
    metadata: { replier_id: user?.id }
  })
}

/**
 * Send notification when someone mentions a user
 */
export async function notifyMention(mentionedUserId: string, mentionerName: string, context: string, relatedId: string, relatedType: 'post' | 'comment') {
  await sendNotification({
    user_id: mentionedUserId,
    type: 'mention',
    title: 'You Were Mentioned',
    message: `${mentionerName} mentioned you: "${context.substring(0, 100)}${context.length > 100 ? '...' : ''}"`,
    related_id: relatedId,
    related_type: relatedType,
  })
}

/**
 * Send notification when someone shares a post
 */
export async function notifyPostShare(postId: string, postAuthorId: string, sharerName: string) {
  const { data: { user } } = await supabase.auth.getUser()
  
  // Don't notify if user shares their own post
  if (user?.id === postAuthorId) return

  await sendNotification({
    user_id: postAuthorId,
    type: 'share',
    title: 'Your Post Was Shared',
    message: `${sharerName} shared your post`,
    related_id: postId,
    related_type: 'post',
    metadata: { sharer_id: user?.id }
  })
}

/**
 * Send notification for group invite
 */
export async function notifyGroupInvite(userId: string, groupName: string, groupId: string, inviterName: string) {
  await sendNotification({
    user_id: userId,
    type: 'group_invite',
    title: 'Group Invitation',
    message: `${inviterName} invited you to join "${groupName}"`,
    related_id: groupId,
    related_type: 'group',
  })
}

/**
 * Send notification for event reminder
 */
export async function notifyEventReminder(userId: string, eventName: string, eventId: string, eventTime: string) {
  await sendNotification({
    user_id: userId,
    type: 'event_reminder',
    title: 'Event Reminder',
    message: `"${eventName}" starts at ${eventTime}`,
    related_id: eventId,
    related_type: 'event',
  })
}

/**
 * Send notification when someone votes on a poll
 */
export async function notifyPollVote(pollId: string, pollAuthorId: string, voterName: string, pollTitle: string) {
  const { data: { user } } = await supabase.auth.getUser()
  
  // Don't notify if user votes on their own poll
  if (user?.id === pollAuthorId) return

  await sendNotification({
    user_id: pollAuthorId,
    type: 'poll_vote',
    title: 'New Vote on Your Poll',
    message: `${voterName} voted on "${pollTitle}"`,
    related_id: pollId,
    related_type: 'poll',
    metadata: { voter_id: user?.id }
  })
}

/**
 * Send notification when someone adds a reaction to a post
 */
export async function notifyPostReaction(postId: string, postAuthorId: string, reactorName: string, reactionType: string) {
  const { data: { user } } = await supabase.auth.getUser()
  
  // Don't notify if user reacts to their own post
  if (user?.id === postAuthorId) return

  await sendNotification({
    user_id: postAuthorId,
    type: 'reaction',
    title: 'New Reaction',
    message: `${reactorName} reacted ${reactionType} to your post`,
    related_id: postId,
    related_type: 'post',
    metadata: { reactor_id: user?.id, reaction: reactionType }
  })
}

/**
 * Send notification when a user registers
 */
export async function notifyUserRegister(userId: string, userName: string) {
  await sendNotification({
    user_id: userId,
    type: 'user_register',
    title: 'Welcome to CampusAxis!',
    message: `Welcome ${userName}! Your account has been successfully created.`,
    related_id: userId,
    related_type: 'user',
  })
}

/**
 * Send notification when a user requests password reset
 */
export async function notifyPasswordReset(userId: string, userName: string) {
  await sendNotification({
    user_id: userId,
    type: 'password_reset',
    title: 'Password Reset Requested',
    message: `Hello ${userName}, a password reset has been requested for your account.`,
    related_id: userId,
    related_type: 'user',
  })
}

/**
 * Send notification when a user changes their password
 */
export async function notifyPasswordChange(userId: string, userName: string) {
  await sendNotification({
    user_id: userId,
    type: 'password_change',
    title: 'Password Changed',
    message: `Hello ${userName}, your password has been successfully changed.`,
    related_id: userId,
    related_type: 'user',
  })
}

/**
 * Send notification when a post is created
 */
export async function notifyPostCreated(postId: string, postAuthorId: string, postTitle: string) {
  await sendNotification({
    user_id: postAuthorId,
    type: 'post_created',
    title: 'Post Created',
    message: `Your post "${postTitle}" has been successfully created.`,
    related_id: postId,
    related_type: 'post',
  })
}

/**
 * Send notification when a post is updated
 */
export async function notifyPostUpdated(postId: string, postAuthorId: string, postTitle: string) {
  await sendNotification({
    user_id: postAuthorId,
    type: 'post_updated',
    title: 'Post Updated',
    message: `Your post "${postTitle}" has been successfully updated.`,
    related_id: postId,
    related_type: 'post',
  })
}

/**
 * Send notification when a post is deleted
 */
export async function notifyPostDeleted(postAuthorId: string, postTitle: string) {
  await sendNotification({
    user_id: postAuthorId,
    type: 'post_deleted',
    title: 'Post Deleted',
    message: `Your post "${postTitle}" has been deleted.`,
    related_type: 'post',
  })
}

/**
 * Send notification when a resource is uploaded
 */
export async function notifyResourceUploaded(resourceId: string, uploaderId: string, resourceTitle: string) {
  await sendNotification({
    user_id: uploaderId,
    type: 'resource_uploaded',
    title: 'Resource Uploaded',
    message: `Your resource "${resourceTitle}" has been successfully uploaded and is pending approval.`,
    related_id: resourceId,
    related_type: 'resource',
  })
}

/**
 * Send notification when a resource is approved
 */
export async function notifyResourceApproved(resourceId: string, uploaderId: string, resourceTitle: string) {
  await sendNotification({
    user_id: uploaderId,
    type: 'resource_approved',
    title: 'Resource Approved',
    message: `Your resource "${resourceTitle}" has been approved and is now available to all users.`,
    related_id: resourceId,
    related_type: 'resource',
  })
}

/**
 * Send notification when a review is submitted
 */
export async function notifyReviewSubmitted(reviewId: string, reviewerId: string, facultyName: string) {
  await sendNotification({
    user_id: reviewerId,
    type: 'review_submitted',
    title: 'Review Submitted',
    message: `Your review for ${facultyName} has been submitted and is pending approval.`,
    related_id: reviewId,
    related_type: 'review',
  })
}

/**
 * Send notification when a review is approved
 */
export async function notifyReviewApproved(reviewId: string, reviewerId: string, facultyName: string) {
  await sendNotification({
    user_id: reviewerId,
    type: 'review_approved',
    title: 'Review Approved',
    message: `Your review for ${facultyName} has been approved and is now visible to other students.`,
    related_id: reviewId,
    related_type: 'review',
  })
}

/**
 * Send notification when a timetable is updated
 */
export async function notifyTimetableUpdated(userId: string, department: string, term: string) {
  await sendNotification({
    user_id: userId,
    type: 'timetable_updated',
    title: 'Timetable Updated',
    message: `The timetable for ${department} - ${term} has been updated.`,
    related_type: 'timetable',
  })
}

/**
 * Send notification when a group is joined
 */
export async function notifyGroupJoined(groupId: string, userId: string, groupName: string) {
  await sendNotification({
    user_id: userId,
    type: 'group_joined',
    title: 'Group Joined',
    message: `You have successfully joined the group "${groupName}".`,
    related_id: groupId,
    related_type: 'group',
  })
}

/**
 * Send notification when an achievement is unlocked
 */
export async function notifyAchievementUnlocked(userId: string, achievementTitle: string, points: number) {
  await sendNotification({
    user_id: userId,
    type: 'achievement_unlocked',
    title: 'Achievement Unlocked!',
    message: `Congratulations! You've unlocked the "${achievementTitle}" achievement and earned ${points} points.`,
    related_type: 'achievement',
  })
}

/**
 * Send notification when a new feature is released
 */
export async function notifyNewFeature(userId: string, featureName: string, description: string) {
  await sendNotification({
    user_id: userId,
    type: 'new_feature',
    title: 'New Feature Available',
    message: `We've launched ${featureName} - ${description}`,
    related_type: 'admin_action',
  })
}

/**
 * Send notification for maintenance schedule
 */
export async function notifyMaintenanceScheduled(userId: string, startTime: string, endTime: string) {
  await sendNotification({
    user_id: userId,
    type: 'maintenance_scheduled',
    title: 'Scheduled Maintenance',
    message: `CampusAxis will be undergoing maintenance from ${startTime} to ${endTime}.`,
    related_type: 'admin_action',
  })
}

/**
 * Send bulk notifications to multiple users
 */
export async function sendBulkNotifications(notifications: NotificationPayload[]) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    const notificationsWithActor = notifications.map(n => ({
      user_id: n.user_id,
      actor_id: user?.id,
      type: n.type,
      title: n.title,
      message: n.message,
      related_id: n.related_id,
      related_type: n.related_type,
      metadata: n.metadata || null,
    }))

    const { error } = await supabase
      .from('notifications')
      .insert(notificationsWithActor)

    if (error) {
      console.error('Error sending bulk notifications:', error)
      throw error
    }
  } catch (error) {
    console.error('Failed to send bulk notifications:', error)
    throw error
  }
}

/**
 * Send bulk notifications with audit logging
 */
export async function sendBulkNotificationsWithAudit(
  notifications: NotificationPayload[],
  action: string,
  resourceType?: string,
  details?: Record<string, any>
) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    // Prepare notifications with actor info
    const notificationsWithActor = notifications.map(n => ({
      user_id: n.user_id,
      actor_id: user?.id,
      type: n.type,
      title: n.title,
      message: n.message,
      related_id: n.related_id,
      related_type: n.related_type,
      metadata: n.metadata || null,
    }))

    // Call the database function to send notifications and log audit
    const { error } = await supabase.rpc('send_bulk_notifications_with_audit', {
      p_notifications: JSON.stringify(notificationsWithActor),
      p_actor_id: user?.id,
      p_action: action,
      p_resource_type: resourceType,
      p_details: details ? JSON.stringify(details) : '{}'
    })

    if (error) {
      console.error('Error sending bulk notifications with audit:', error)
      throw error
    }
  } catch (error) {
    console.error('Failed to send bulk notifications with audit:', error)
    throw error
  }
}

/**
 * Send notification when a new issue is created
 */
export async function notifyNewIssue(issueId: string, issueTitle: string, reporterEmail?: string) {
  // Get all admin and super admin users
  const { data: adminUsers, error } = await supabase
    .from('user_roles')
    .select('user_id, roles:role_id(name)')
    .in('roles.name', ['super_admin', 'admin'])

  if (error) {
    console.error('Error fetching admin users:', error)
    return
  }

  // Create notifications for all admins
  const notifications: NotificationPayload[] = adminUsers.map((admin: any) => ({
    user_id: admin.user_id,
    type: 'admin_message',
    title: 'New Issue Reported',
    message: `A new issue has been reported: "${issueTitle}"${reporterEmail ? ` by ${reporterEmail}` : ''}`,
    related_id: issueId,
    related_type: 'support_ticket',
  }))

  if (notifications.length > 0) {
    await sendBulkNotifications(notifications)
  }
}

/**
 * Send notification when an issue is resolved
 */
export async function notifyIssueResolved(issueId: string, issueTitle: string, resolverName: string) {
  // Get the issue reporter to notify them
  const { data: issue, error: issueError } = await supabase
    .from('issue_reports')
    .select('email, user_id')
    .eq('id', issueId)
    .single()

  if (issueError) {
    console.error('Error fetching issue:', issueError)
    return
  }

  // Notify the reporter if they have a user account
  if (issue.user_id) {
    await sendNotification({
      user_id: issue.user_id,
      type: 'support_ticket_closed',
      title: 'Issue Resolved',
      message: `Your issue "${issueTitle}" has been resolved by ${resolverName}`,
      related_id: issueId,
      related_type: 'support_ticket',
    })
  }

  // Also notify all admins
  const { data: adminUsers, error: adminError } = await supabase
    .from('user_roles')
    .select('user_id, roles:role_id(name)')
    .in('roles.name', ['super_admin', 'admin'])

  if (adminError) {
    console.error('Error fetching admin users:', adminError)
    return
  }

  // Create notifications for all admins
  const notifications: NotificationPayload[] = adminUsers.map((admin: any) => ({
    user_id: admin.user_id,
    type: 'admin_message',
    title: 'Issue Resolved',
    message: `Issue "${issueTitle}" has been resolved by ${resolverName}`,
    related_id: issueId,
    related_type: 'support_ticket',
  }))

  if (notifications.length > 0) {
    await sendBulkNotifications(notifications)
  }
}

/**
 * Send notification when an issue status changes
 */
export async function notifyIssueStatusChange(issueId: string, issueTitle: string, newStatus: string, reporterEmail?: string) {
  // Get all admin and super admin users
  const { data: adminUsers, error } = await supabase
    .from('user_roles')
    .select('user_id, roles:role_id(name)')
    .in('roles.name', ['super_admin', 'admin'])

  if (error) {
    console.error('Error fetching admin users:', error)
    return
  }

  // Create status change message
  const statusMessages: Record<string, string> = {
    'open': 'opened',
    'in_progress': 'is being worked on',
    'resolved': 'resolved'
  }
  
  const statusMessage = statusMessages[newStatus] || newStatus

  // Create notifications for all admins
  const notifications: NotificationPayload[] = adminUsers.map((admin: any) => ({
    user_id: admin.user_id,
    type: 'admin_message',
    title: 'Issue Status Updated',
    message: `Issue "${issueTitle}" has been ${statusMessage}`,
    related_id: issueId,
    related_type: 'support_ticket',
  }))

  if (notifications.length > 0) {
    await sendBulkNotifications(notifications)
  }
}

/**
 * Send notification to user when their issue status changes
 */
export async function notifyUserIssueStatusChange(issueId: string, issueTitle: string, newStatus: string, reporterUserId?: string) {
  // Only notify if we have a user ID
  if (!reporterUserId) return

  // Create status change message
  const statusMessages: Record<string, string> = {
    'open': 'has been reopened',
    'in_progress': 'is now being worked on',
    'resolved': 'has been resolved'
  }
  
  const statusMessage = statusMessages[newStatus] || `status changed to ${newStatus}`

  await sendNotification({
    user_id: reporterUserId,
    type: 'support_ticket_response',
    title: 'Issue Status Updated',
    message: `Your issue "${issueTitle}" ${statusMessage}`,
    related_id: issueId,
    related_type: 'support_ticket',
  })
}

/**
 * Send notification to admins when a query receives a response
 */
export async function notifyQueryResponse(issueId: string, issueTitle: string, responderName: string) {
  // Get all admin and super admin users
  const { data: adminUsers, error } = await supabase
    .from('user_roles')
    .select('user_id, roles:role_id(name)')
    .in('roles.name', ['super_admin', 'admin'])

  if (error) {
    console.error('Error fetching admin users:', error)
    return
  }

  // Create notifications for all admins
  const notifications: NotificationPayload[] = adminUsers.map((admin: any) => ({
    user_id: admin.user_id,
    type: 'admin_message',
    title: 'New Response to Issue',
    message: `${responderName} responded to issue: "${issueTitle}"`,
    related_id: issueId,
    related_type: 'support_ticket',
  }))

  if (notifications.length > 0) {
    await sendBulkNotifications(notifications)
  }
}

/**
 * Send notification to user when their query receives a response
 */
export async function notifyUserQueryResponse(issueId: string, issueTitle: string, responderName: string) {
  // Get the issue reporter to notify them
  const { data: issue, error } = await supabase
    .from('issue_reports')
    .select('user_id')
    .eq('id', issueId)
    .single()

  if (error) {
    console.error('Error fetching issue:', error)
    return
  }

  // Notify the reporter if they have a user account
  if (issue.user_id) {
    await sendNotification({
      user_id: issue.user_id,
      type: 'support_ticket_response',
      title: 'New Response to Your Issue',
      message: `${responderName} responded to your issue: "${issueTitle}"`,
      related_id: issueId,
      related_type: 'support_ticket',
    })
  }
}
