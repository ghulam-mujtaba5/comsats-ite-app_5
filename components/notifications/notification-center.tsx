"use client"

import { useState, useEffect } from "react"
import { Bell, X, Check, Clock, AlertCircle, User, MessageSquare, Star, Calendar, BookOpen, Users, Trophy, Wrench, Heart, AtSign, BarChart, Share, Reply, Smile, UserPlus, Key, Lock, FileText, Edit, Trash, Upload, CheckCircle, XCircle, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "@/hooks/use-notifications"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface NotificationCenterProps {
  open: boolean
  onClose: () => void
}

export function NotificationCenter({ open, onClose }: NotificationCenterProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, loading } = useNotifications()
  const { toast } = useToast()
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.is_read
    if (filter === 'read') return notification.is_read
    return true
  })

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="h-4 w-4" />
      case 'comment': return <MessageSquare className="h-4 w-4" />
      case 'follow': return <User className="h-4 w-4" />
      case 'mention': return <AtSign className="h-4 w-4" />
      case 'group_invite': return <Users className="h-4 w-4" />
      case 'event_reminder': return <Calendar className="h-4 w-4" />
      case 'poll_vote': return <BarChart className="h-4 w-4" />
      case 'share': return <Share className="h-4 w-4" />
      case 'reply': return <Reply className="h-4 w-4" />
      case 'reaction': return <Smile className="h-4 w-4" />
      case 'user_register': return <UserPlus className="h-4 w-4" />
      case 'password_reset': return <Key className="h-4 w-4" />
      case 'password_change': return <Lock className="h-4 w-4" />
      case 'post_created': return <FileText className="h-4 w-4" />
      case 'post_updated': return <Edit className="h-4 w-4" />
      case 'post_deleted': return <Trash className="h-4 w-4" />
      case 'resource_uploaded': return <Upload className="h-4 w-4" />
      case 'resource_approved': return <CheckCircle className="h-4 w-4" />
      case 'resource_rejected': return <XCircle className="h-4 w-4" />
      case 'review_submitted': return <Star className="h-4 w-4" />
      case 'review_approved': return <CheckCircle className="h-4 w-4" />
      case 'faculty_added': return <UserPlus className="h-4 w-4" />
      case 'timetable_updated': return <Calendar className="h-4 w-4" />
      case 'group_joined': return <Users className="h-4 w-4" />
      case 'achievement_unlocked': return <Trophy className="h-4 w-4" />
      case 'maintenance_scheduled': return <Wrench className="h-4 w-4" />
      case 'new_feature': return <Rocket className="h-4 w-4" />
      case 'announcement': return <AlertCircle className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case 'like':
      case 'comment':
      case 'follow':
      case 'mention':
      case 'group_invite':
      case 'share':
      case 'reply':
      case 'reaction':
        return 'text-blue-500'
      case 'user_register':
      case 'password_reset':
      case 'password_change':
      case 'post_created':
      case 'resource_uploaded':
      case 'review_submitted':
      case 'faculty_added':
      case 'group_joined':
        return 'text-green-500'
      case 'resource_approved':
      case 'review_approved':
      case 'achievement_unlocked':
        return 'text-purple-500'
      case 'resource_rejected':
      case 'review_rejected':
      case 'post_deleted':
        return 'text-red-500'
      case 'event_reminder':
      case 'poll_vote':
      case 'timetable_updated':
        return 'text-yellow-500'
      case 'maintenance_scheduled':
      case 'new_feature':
      case 'announcement':
      case 'system_alert':
        return 'text-orange-500'
      default:
        return 'text-gray-500'
    }
  }

  const markAllAsReadHandler = async () => {
    try {
      await markAllAsRead()
      toast({
        title: "Success",
        description: "All notifications marked as read"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive"
      })
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Notification Center */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={markAllAsReadHandler}
                disabled={unreadCount === 0}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filter */}
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <button
              className={`flex-1 py-3 text-sm font-medium ${
                filter === 'all' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium ${
                filter === 'unread' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium ${
                filter === 'read' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              onClick={() => setFilter('read')}
            >
              Read
            </button>
          </div>

          {/* Notifications List */}
          <ScrollArea className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 dark:text-slate-400">
                <Bell className="h-12 w-12 mb-4" />
                <p className="text-lg">No notifications</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                      !notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-1 ${getIconColor(notification.type)}`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                            {notification.title}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </span>
                          {!notification.is_read && (
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                              <Clock className="h-3 w-3 mr-1" />
                              New
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {!notification.is_read && (
                      <div className="mt-3 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
