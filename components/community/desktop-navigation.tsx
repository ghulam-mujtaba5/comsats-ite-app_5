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
    <nav className="hidden lg:block w-64 flex-shrink-0 border-r border-border bg-background/95 backdrop-blur-lg sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Community Hub</h2>
        <p className="text-sm text-muted-foreground mt-1">Connect & engage with peers</p>
      </div>
      
      <div className="px-3 py-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-primary to-blue-600 text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-md"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-600/10 animate-pulse" />
              )}
              <Icon className={cn(
                "h-4 w-4 transition-transform group-hover:scale-110",
                isActive && "animate-pulse"
              )} />
              <span className="relative z-10">{item.name}</span>
            </Link>
          )
        })}
      </div>
      
      <div className="p-4 border-t border-border mt-auto sticky bottom-0 bg-background/95 backdrop-blur-lg">
        <Button className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all" variant="default">
          <MessageSquare className="h-4 w-4 mr-2" />
          New Discussion
        </Button>
      </div>
    </nav>
  )
}