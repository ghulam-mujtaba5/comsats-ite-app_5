"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useAccessibility, useKeyboardShortcuts } from '@/hooks/use-accessibility'
import { 
  Menu, 
  X, 
  BarChart3, 
  Users, 
  FileText, 
  MessageSquare, 
  Calendar,
  Settings,
  Shield,
  Heart,
  Compass,
  Search,
  BookOpen,
  Bell,
  Home,
  ChevronRight
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<any>
  badge?: string | number
  description?: string
  roles?: string[]
}

interface ResponsiveAdminNavProps {
  userRole?: string
  className?: string
}

const navigationItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: BarChart3,
    description: "Overview and analytics"
  },
  {
    label: "User Management",
    href: "/admin/users",
    icon: Users,
    description: "Manage user accounts"
  },
  {
    label: "Content Moderation",
    href: "/admin/moderation",
    icon: Shield,
    description: "Review and moderate content"
  },
  {
    label: "News & Events",
    href: "/admin/news-events",
    icon: Calendar,
    description: "Manage announcements"
  },
  {
    label: "Resources",
    href: "/admin/resources",
    icon: FileText,
    description: "Academic resources"
  },
  {
    label: "Past Papers",
    href: "/admin/past-papers",
    icon: BookOpen,
    description: "Exam papers archive"
  },
  {
    label: "Support Requests",
    href: "/admin/support",
    icon: Heart,
    description: "Student support"
  },
  {
    label: "Guidance",
    href: "/admin/guidance",
    icon: Compass,
    description: "Academic guidance"
  },
  {
    label: "Lost & Found",
    href: "/admin/lost-found",
    icon: Search,
    description: "Item recovery system"
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "System configuration"
  }
]

export function ResponsiveAdminNav({ userRole, className = "" }: ResponsiveAdminNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const pathname = usePathname()
  
  const { containerRef, announceToScreenReader } = useAccessibility({
    autoFocus: false,
    announceChanges: true
  })

  // Keyboard shortcuts for navigation
  useKeyboardShortcuts({
    'alt+m': () => setIsOpen(!isOpen),
    'alt+h': () => window.location.href = '/admin/dashboard',
    'alt+u': () => window.location.href = '/admin/users',
    'alt+s': () => window.location.href = '/admin/settings'
  })

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Announce navigation changes to screen readers
  useEffect(() => {
    const currentItem = navigationItems.find(item => item.href === pathname)
    if (currentItem) {
      announceToScreenReader(`Navigated to ${currentItem.label} page`)
    }
  }, [pathname, announceToScreenReader])

  const handleNavigation = (item: NavItem) => {
    setIsOpen(false)
    announceToScreenReader(`Navigating to ${item.label}`)
  }

  const filteredNavItems = navigationItems.filter(item => {
    if (!item.roles) return true
    return userRole && item.roles.includes(userRole)
  })

  return (
    <>
      {/* Desktop Navigation */}
      <nav 
        className={`hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 dark:lg:border-gray-700 lg:bg-white/95 dark:lg:bg-slate-900/95 lg:backdrop-blur-md ${className}`}
        aria-label="Main navigation"
        ref={containerRef}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <Link 
              href="/admin/dashboard"
              className="flex items-center gap-2 focus-ring-enhanced rounded-lg p-2"
              aria-label="Admin Dashboard Home"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Admin Portal
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors focus-ring-enhanced ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => handleNavigation(item)}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && (
                    <div className="w-1 h-6 ml-2 bg-blue-600 rounded-full" aria-hidden="true" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Role: {userRole || 'Admin'}</span>
              {notifications > 0 && (
                <div className="flex items-center gap-1">
                  <Bell className="w-4 h-4" />
                  <span>{notifications}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <header className="admin-nav-mobile">
          <div className="flex items-center justify-between h-16 px-4">
            <Link 
              href="/admin/dashboard"
              className="flex items-center gap-2 focus-ring-enhanced rounded-lg p-1"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Admin Portal
              </span>
            </Link>

            <div className="flex items-center gap-2">
              {notifications > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="relative focus-ring-enhanced"
                  aria-label={`${notifications} notifications`}
                >
                  <Bell className="w-5 h-5" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs"
                  >
                    {notifications}
                  </Badge>
                </Button>
              )}

              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="focus-ring-enhanced"
                    aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isOpen}
                    aria-controls="mobile-nav-menu"
                  >
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </Button>
                </SheetTrigger>

                <SheetContent 
                  side="right" 
                  className="w-80 p-0"
                  id="mobile-nav-menu"
                  aria-label="Navigation menu"
                >
                  <SheetHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <SheetTitle className="text-left">Navigation</SheetTitle>
                  </SheetHeader>

                  <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {filteredNavItems.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors focus-ring-enhanced ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                          onClick={() => handleNavigation(item)}
                        >
                          <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span>{item.label}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="ml-2">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 ml-2 text-gray-400" />
                        </Link>
                      )
                    })}
                  </nav>

                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <p>Logged in as <strong>{userRole || 'Admin'}</strong></p>
                      <p className="text-xs mt-1">
                        Press Alt+M to toggle menu
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        {/* Content spacing for fixed header */}
        <div className="h-16" aria-hidden="true" />
      </div>
    </>
  )
}

export default ResponsiveAdminNav