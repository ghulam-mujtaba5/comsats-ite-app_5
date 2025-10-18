import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@lib/supabase'

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

export interface Notification {
  id: string
  user_id: string
  actor_id?: string
  type: NotificationType
  title: string
  message: string
  is_read: boolean
  read_at?: string
  created_at: string
  related_id?: string
  related_type?: RelatedType
  metadata?: Record<string, any>
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)

  const fetchNotifications = useCallback(async (limit: number = 50, newOffset: number = 0, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        if (append) {
          setLoadingMore(false)
        } else {
          setLoading(false)
        }
        setNotifications([])
        setUnreadCount(0)
        return
      }

      // Fetch notifications
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(newOffset, newOffset + limit - 1)

      if (error) throw error

      const mappedData = (data || []).map(n => ({
        ...n,
        // For backward compatibility with old interface
        read: n.is_read,
        createdAt: n.created_at,
        userId: n.user_id,
        relatedId: n.related_id,
        relatedType: n.related_type
      })) as any[]

      if (append) {
        // Append new notifications to existing ones
        setNotifications(prev => [...prev, ...mappedData as Notification[]])
        setHasMore(mappedData.length === limit)
        setOffset(newOffset + mappedData.length)
      } else {
        // Replace existing notifications
        setNotifications(mappedData as Notification[])
        setUnreadCount(mappedData.filter(n => !n.is_read).length)
        setHasMore(mappedData.length === limit)
        setOffset(mappedData.length)
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications')
    } finally {
      if (append) {
        setLoadingMore(false)
      } else {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    fetchNotifications()

    // Subscribe to real-time notification changes
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          const newNotification = payload.new as Notification
          setNotifications((prev) => [newNotification, ...prev])
          if (!newNotification.is_read) {
            setUnreadCount((prev) => prev + 1)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          const updatedNotification = payload.new as Notification
          setNotifications((prev) =>
            prev.map((n) => (n.id === updatedNotification.id ? updatedNotification : n))
          )
          
          // Recalculate unread count
          setUnreadCount((prev) => {
            const oldNotification = notifications.find(n => n.id === updatedNotification.id)
            if (oldNotification && !oldNotification.is_read && updatedNotification.is_read) {
              return Math.max(0, prev - 1)
            } else if (oldNotification && oldNotification.is_read && !updatedNotification.is_read) {
              return prev + 1
            }
            return prev
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          const deletedNotification = payload.old as Notification
          setNotifications((prev) => prev.filter(n => n.id !== deletedNotification.id))
          if (!deletedNotification.is_read) {
            setUnreadCount((prev) => Math.max(0, prev - 1))
          }
        }
      )
      .subscribe()

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchNotifications, notifications])

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)

      if (error) throw error

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Error marking notification as read:', err)
      throw err
    }
  }

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('is_read', false)

      if (error) throw error

      setNotifications((prev) =>
        prev.map((n) => (n.is_read ? n : { ...n, is_read: true, read_at: new Date().toISOString() }))
      )
      setUnreadCount(0)
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
      throw err
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const notification = notifications.find(n => n.id === notificationId)
      const wasUnread = notification && !notification.is_read
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (err) {
      console.error('Error deleting notification:', err)
      throw err
    }
  }

  const sendNotification = async (
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    relatedId?: string,
    relatedType?: RelatedType,
    metadata?: Record<string, any>
  ) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          actor_id: currentUser?.id,
          type,
          title,
          message,
          related_id: relatedId,
          related_type: relatedType,
          metadata: metadata || null,
        })

      if (error) throw error
    } catch (err) {
      console.error('Error sending notification:', err)
      throw err
    }
  }

  const loadMore = useCallback(async (limit: number = 50) => {
    await fetchNotifications(limit, offset, true)
  }, [fetchNotifications, offset])

  const refresh = fetchNotifications

  return {
    notifications,
    unreadCount,
    loading,
    loadingMore,
    error,
    hasMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    sendNotification,
    refresh,
    loadMore,
  }
}