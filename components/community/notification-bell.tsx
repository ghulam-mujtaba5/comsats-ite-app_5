"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bell,
  Heart,
  MessageCircle,
  Users,
  Calendar,
  BarChart3,
  AtSign,
  Check,
  X,
  BellOff
} from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"
import { cn } from "@/lib/utils"

export function NotificationBell() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead,
    markAllAsRead,
    loading
  } = useNotifications()
  const [open, setOpen] = useState(false)

  // Get the 5 most recent unread notifications
  const recentNotifications = notifications
    .filter(n => !n.is_read)
    .slice(0, 5)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case 'follow':
        return <Users className="h-4 w-4 text-green-500" />
      case 'mention':
        return <AtSign className="h-4 w-4 text-purple-500" />
      case 'group_invite':
        return <Users className="h-4 w-4 text-indigo-500" />
      case 'event_reminder':
        return <Calendar className="h-4 w-4 text-orange-500" />
      case 'poll_vote':
        return <BarChart3 className="h-4 w-4 text-pink-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative h-10 w-10 rounded-full"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 justify-center text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-slate-200 dark:border-slate-700 dark:border-slate-700/30 shadow-xl rounded-2xl"
        align="end"
      >
        <div className="p-4 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="h-8 px-2 text-xs"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-96">
          {recentNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <BellOff className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No new notifications
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-slate-700">
              {recentNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(notification.created_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="p-4 border-t border-gray-100 dark:border-slate-700">
          <Button 
            variant="outline" 
            className="w-full" 
            asChild
            onClick={() => setOpen(false)}
          >
            <Link href="/community/notifications">
              View all notifications
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}