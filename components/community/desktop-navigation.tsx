"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  MessageSquare,
  Users,
  Calendar,
  BarChart3,
  User,
  Settings,
  BellRing,
  Home,
  Trophy,
  Target
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  { name: "Home", href: "/community", icon: Home },
  { name: "Discussions", href: "/community", icon: MessageSquare },
  { name: "Groups", href: "/community/groups", icon: Users },
  { name: "Events", href: "/community/events", icon: Calendar },
  { name: "Polls", href: "/community/polls", icon: BarChart3 },
  { name: "Achievements", href: "/community/gamification", icon: Trophy },
  { name: "Goals", href: "/community/goals", icon: Target },
  { name: "Profile", href: "/community/profile", icon: User },
  { name: "Notifications", href: "/community/notifications", icon: BellRing },
  { name: "Settings", href: "/community/settings", icon: Settings },
]

export function DesktopNavigation() {
  const pathname = usePathname()
  
  return (
    <nav className="hidden lg:block w-64 flex-shrink-0 border-r border-border bg-background/80 backdrop-blur-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold text-foreground">Community</h2>
        <p className="text-sm text-muted-foreground mt-1">Connect with fellow students</p>
      </div>
      
      <div className="px-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </div>
      
      <div className="p-4 mt-4">
        <Button className="w-full" variant="outline">
          <MessageSquare className="h-4 w-4 mr-2" />
          New Discussion
        </Button>
      </div>
    </nav>
  )
}