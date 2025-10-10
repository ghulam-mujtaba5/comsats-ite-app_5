import { supabase } from '@/lib/supabase'

export interface NotificationPayload {
  user_id: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'group_invite' | 'event_reminder' | 'poll_vote' | 'share' | 'reply' | 'reaction'
  title: string
  message: string
  related_id?: string
  related_type?: 'post' | 'comment' | 'group' | 'event' | 'poll' | 'reply'
  metadata?: Record<string, any>
}

/**
 * Send a notification to a user
 */
export async function sendNotification(payload: NotificationPayload) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase
      .from('notifications_enhanced')
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
      .from('notifications_enhanced')
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
