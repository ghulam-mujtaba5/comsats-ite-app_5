"use client"

import { Bell } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"
import { Button } from "@/components/ui/button"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { useState } from "react"

export function NotificationBadge() {
  const { unreadCount } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(true)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>
      
      <NotificationCenter 
        open={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  )
}