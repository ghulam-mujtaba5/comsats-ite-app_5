"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bell,
  BellOff,
  Heart,
  MessageCircle,
  Users,
  Calendar,
  BarChart3,
  AtSign,
  Check,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2
} from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { cn } from "@/lib/utils"

export default function CommunityNotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications()
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.is_read
    if (filter === 'read') return notification.is_read
    return true
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-5 w-5 text-red-500" />
      case 'comment':
        return <MessageCircle className="h-5 w-5 text-blue-500" />
      case 'follow':
        return <Users className="h-5 w-5 text-green-500" />
      case 'mention':
        return <AtSign className="h-5 w-5 text-purple-500" />
      case 'group_invite':
        return <Users className="h-5 w-5 text-indigo-500" />
      case 'event_reminder':
        return <Calendar className="h-5 w-5 text-orange-500" />
      case 'poll_vote':
        return <BarChart3 className="h-5 w-5 text-pink-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like':
        return 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200 border-red-200 dark:border-red-800/30'
      case 'comment':
        return 'bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 border-blue-200 dark:border-blue-800/30'
      case 'follow':
        return 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200 border-green-200 dark:border-green-800/30'
      case 'mention':
        return 'bg-purple-50 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200 border-purple-200 dark:border-purple-800/30'
      case 'group_invite':
        return 'bg-indigo-50 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800/30'
      case 'event_reminder':
        return 'bg-orange-50 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200 border-orange-200 dark:border-orange-800/30'
      case 'poll_vote':
        return 'bg-pink-50 text-pink-800 dark:bg-pink-900/20 dark:text-pink-200 border-pink-200 dark:border-pink-800/30'
      default:
        return 'bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className="app-container section py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 to-blue-500/15 border border-primary/30 text-sm font-medium text-primary mb-4 backdrop-blur-sm">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-primary text-primary-foreground text-xs">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Stay <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Updated</span>
          </h1>
          
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
            Never miss important updates from your community.
          </p>
          
          {unreadCount > 0 && (
            <Button 
              onClick={markAllAsRead}
              variant="outline"
              className="px-6 py-2 rounded-full border-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className="rounded-full"
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            onClick={() => setFilter('unread')}
            className="rounded-full"
          >
            Unread
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-primary text-primary-foreground text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
          <Button
            variant={filter === 'read' ? 'default' : 'outline'}
            onClick={() => setFilter('read')}
            className="rounded-full"
          >
            Read
          </Button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <CenteredLoader message="Loading notifications..." />
          ) : error ? (
            <Card className="p-8 text-center text-destructive">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" />
              <h3 className="font-medium text-lg">Error Loading Notifications</h3>
              <p className="mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </Card>
          ) : filteredNotifications.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <BellOff className="h-12 w-12 text-gray-400" />
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {filter === 'unread' 
                    ? "No unread notifications" 
                    : filter === 'read' 
                      ? "No read notifications" 
                      : "No notifications yet"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {filter === 'all' 
                    ? "You'll see notifications here when people interact with your content." 
                    : "Check back later for new notifications."}
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={cn(
                    "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden",
                    !notification.is_read && "border-l-4 border-l-primary"
                  )}
                >
                  <CardContent className="p-0">
                    <div className="flex items-start p-6">
                      <div className={cn(
                        "p-3 rounded-full mr-4",
                        getNotificationColor(notification.type)
                      )}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {notification.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              {new Date(notification.created_at).toLocaleString()}
                            </p>
                          </div>
                          
                          {!notification.is_read && (
                            <Badge className="ml-2 bg-primary text-primary-foreground text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        
                        {notification.related_id && notification.related_type && (
                          <div className="mt-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              asChild
                            >
                              <Link href={`/community/${notification.related_type}/${notification.related_id}`}>
                                View {notification.related_type}
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end p-4 bg-gray-50 dark:bg-slate-700/30 border-t border-gray-100 dark:border-slate-700">
                      <div className="flex gap-2">
                        {!notification.is_read ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Mark as read
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Read
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}