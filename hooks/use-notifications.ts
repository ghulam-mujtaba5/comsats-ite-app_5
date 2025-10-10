import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface Notification {
  id: string
  user_id: string
  actor_id?: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'group_invite' | 'event_reminder' | 'poll_vote' | 'share' | 'reply' | 'reaction'
  title: string
  message: string
  is_read: boolean
  read_at?: string
  created_at: string
  related_id?: string // ID of the related post, comment, etc.
  related_type?: 'post' | 'comment' | 'group' | 'event' | 'poll' | 'reply'
  metadata?: Record<string, any>
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setLoading(false)
        setNotifications([])
        setUnreadCount(0)
        return
      }

      // Fetch notifications
      const { data, error } = await supabase
        .from('notifications_enhanced')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

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

      setNotifications(mappedData as Notification[])
      setUnreadCount(mappedData.filter(n => !n.is_read).length)
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications')
    } finally {
      setLoading(false)
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
          table: 'notifications_enhanced',
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
          table: 'notifications_enhanced',
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
      .subscribe()

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchNotifications])

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications_enhanced')
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
        .from('notifications_enhanced')
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
        .from('notifications_enhanced')
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
    type: Notification['type'],
    title: string,
    message: string,
    relatedId?: string,
    relatedType?: Notification['relatedType'],
    metadata?: Record<string, any>
  ) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      const { error } = await supabase
        .from('notifications_enhanced')
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

  const refresh = fetchNotifications

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    sendNotification,
    refresh,
  }
}