"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { CampusSelector, CampusSelectorCompact } from "@/components/layout/campus-selector"
import { LogOut, User, Menu, Shield, Search, Calculator } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import layout from "@/app/styles/common.module.css"
import { useEffect, useState } from "react"
import { CommandPalette } from "@/components/search/command-palette"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { NotificationBell } from "@/components/community/notification-bell"

const navigationItems = [
  {
    name: "Past Papers",
    href: "/past-papers",
    description: "Browse and download past exam papers",
  },
  {
    name: "Admissions",
    href: "/admissions",
    description: "Applications, merit lists, fees, scholarships",
  },
  {
    name: "Faculty",
    href: "/faculty",
    description: "Read and write faculty reviews",
  },
  {
    name: "Resources",
    href: "/resources",
    description: "Study material and documents",
  },
  {
    name: "GPA Calculator",
    href: "/gpa-calculator",
    description: "Calculate GPA/CGPA",
    icon: Calculator,
  },
]

export function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/admin/session', { cache: 'no-store' })
        if (!mounted) return
        setIsAdmin(res.ok)
      } catch {
        if (!mounted) return
        setIsAdmin(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  // Control body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup function to reset scroll on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const isActivePath = (path: string) => {
    return pathname === path || (path !== "/" && pathname.startsWith(path))
  }

  return (
    <header className="sticky top-0 z-50 w-full glass-nav border-b glass-border-subtle" role="banner">
      <div className={`${layout.section} px-2 sm:px-4 lg:px-6 h-16 flex items-center justify-between gap-1 sm:gap-2`}>
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-shrink">
          <Link
            href={isAdmin ? "/admin" : "/"}
            title={isAdmin ? "Go to Admin Panel" : "Go to Home"}
            className="flex items-center space-x-2 sm:space-x-3 hover:opacity-90 transition-all duration-300 interactive group px-1 sm:px-2 py-1 rounded-2xl hover:bg-white/30 dark:hover:bg-slate-800/30 backdrop-blur-sm min-w-0 flex-shrink"
            aria-label={isAdmin ? "Go to Admin Panel" : "Go to Home"}
          >
            <div className="relative flex-shrink-0 navbar-logo-container navbar-logo-wrapper">
              <Image 
                src="/Campus Axis 1.svg" 
                alt="CampusAxis Logo" 
                width={40} 
                height={40} 
                className="sm:w-10 sm:h-10 rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-lg navbar-logo" 
                priority 
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-base sm:text-xl leading-tight tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent truncate">CampusAxis</span>
              {pathname !== '/' && (
                <span className="hidden sm:block text-xs text-slate-600 dark:text-slate-400 leading-tight font-medium">Academic Portal</span>
              )}
            </div>
          </Link>

          {/* Campus Selector - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block">
            <CampusSelector />
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-1 flex-wrap" aria-label="Primary navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative inline-flex items-center h-10 px-3 rounded-2xl text-sm font-semibold transition-all duration-300 interactive hover-lift group box-border whitespace-nowrap min-h-[44px] ${
                  isActivePath(item.href) 
                    ? "glass-medium glass-border-light text-blue-700 dark:text-blue-400 shadow-lg glass-hover-glow" 
                    : "text-slate-800 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white glass-light glass-hover glass-border-subtle hover:shadow-md border border-transparent"
                }`}
                aria-current={isActivePath(item.href) ? "page" : undefined}
                aria-label={item.name}
              >
                {isActivePath(item.href) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-sm" />
                )}
                {Icon && <Icon className="h-4 w-4 mr-2" aria-hidden="true" />}
                <span className="relative z-10">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          {/* Campus Selector for mobile - placed before other icons */}
          <div className="lg:hidden">
            <CampusSelectorCompact />
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Link 
                href="/search" 
                title="Search (Ctrl/⌘ K)" 
                className="hidden lg:inline-flex"
                aria-label="Search"
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="px-3 py-2 interactive hover-lift rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 backdrop-blur-sm border border-transparent hover:border-white/40 dark:hover:border-slate-600/40 hover:shadow-md transition-all duration-300 h-9"
                  aria-keyshortcuts="Control+K Meta+K"
                >
                  <Search className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Search</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>Search (Ctrl/⌘ K)</TooltipContent>
          </Tooltip>
          {/* Ctrl/⌘+K keyboard hint removed per design request */}
          <div className="hidden sm:block">
            <NotificationBell />
          </div>
          <Link
            href="/admin"
            title={isAdmin ? "Admin Panel" : "Admin Portal"}
            className="hidden lg:inline-flex"
            aria-label={isAdmin ? "Admin Panel" : "Admin Portal"}
          >
            <Button 
              variant="ghost" 
              size="sm" 
              className="px-3 py-2 interactive hover-lift rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 backdrop-blur-sm border border-transparent hover:border-white/40 dark:hover:border-slate-600/40 hover:shadow-md transition-all duration-300 h-9"
              aria-label={isAdmin ? "Admin Panel" : "Admin Portal"}
            >
              <Shield className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">{isAdmin ? "Admin Panel" : "Admin Portal"}</span>
            </Button>
          </Link>
          <ThemeToggle />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden interactive p-2 sm:p-3 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 backdrop-blur-sm border border-transparent hover:border-white/40 dark:hover:border-slate-600/40 hover:shadow-md transition-all duration-300 relative z-[110] h-9 w-9 min-h-[44px] min-w-[44px]"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[80vw] max-w-[360px] glass-modal glass-border-light glass-noise shadow-2xl z-[105] overflow-y-auto overflow-x-hidden max-h-screen p-4"
              aria-label="Mobile navigation menu"
            >
              <div className="flex flex-col space-y-4 mt-4 pb-4 w-full">
                <div className="flex items-center justify-center pb-6 border-b border-white/20 dark:border-white/10 w-full max-w-full box-border">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-20" />
                    <Image 
                      src="/Campus Axis 1.svg" 
                      alt="CampusAxis Logo" 
                      width={64} 
                      height={64} 
                      className="rounded-2xl shadow-lg navbar-logo" 
                      priority
                    />
                  </div>
                </div>

                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`relative p-3 min-h-[60px] rounded-2xl transition-all duration-300 hover:bg-white/60 dark:hover:bg-slate-800/60 interactive hover-lift group backdrop-blur-sm border w-full max-w-full box-border flex items-center ${
                        isActivePath(item.href) ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-blue-200/30 dark:border-blue-400/30 shadow-lg" : "border-transparent hover:border-white/40 dark:hover:border-slate-600/40 hover:shadow-md"
                      }`}
                      aria-current={isActivePath(item.href) ? "page" : undefined}
                    >
                      {isActivePath(item.href) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-sm" />
                      )}
                      <div className="relative z-10 flex items-center space-x-3 w-full max-w-full min-w-0 box-border overflow-hidden">
                        {Icon && <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />}
                        <div className="flex flex-col min-w-0 flex-1 overflow-hidden max-w-full">
                          <span className={`font-semibold text-base break-words ${
                            isActivePath(item.href) ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white"
                          }`}>{item.name}</span>
                          <span className={`text-xs break-words ${
                            isActivePath(item.href) ? "text-blue-500/80 dark:text-blue-300/80" : "text-slate-600 dark:text-slate-400"
                          }`}>{item.description}</span>
                        </div>
                      </div>
                    </Link>
                  )
                })}

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="relative p-4 min-h-[72px] rounded-2xl transition-all duration-300 hover:bg-white/60 dark:hover:bg-slate-800/60 interactive hover-lift backdrop-blur-sm border border-transparent hover:border-white/40 dark:hover:border-slate-600/40 hover:shadow-md w-full flex items-center"
                    aria-label="Admin Panel"
                  >
                    <div className="relative z-10 flex items-start space-x-3 w-full min-w-0">
                      <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-semibold text-slate-900 dark:text-white truncate">Admin Panel</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400 truncate">Manage site content</span>
                      </div>
                    </div>
                  </Link>
                )}
                {!isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="relative p-4 min-h-[72px] rounded-2xl transition-all duration-300 hover:bg-white/60 dark:hover:bg-slate-800/60 interactive hover-lift backdrop-blur-sm border border-transparent hover:border-white/40 dark:hover:border-slate-600/40 hover:shadow-md w-full flex items-center"
                    aria-label="Admin Portal"
                  >
                    <div className="relative z-10 flex items-start space-x-3 w-full min-w-0">
                      <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-semibold text-slate-900 dark:text-white truncate">Admin Portal</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400 truncate">Login required</span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full interactive hover-lift flex-shrink-0 min-h-[44px] min-w-[44px]"
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                    <AvatarImage 
                      src={(user as any).user_metadata?.avatar_url || undefined} 
                      alt={user.email || "Profile"} 
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {(() => {
                        const email = user.email ?? ""
                        const handle = email.split("@")[0] ?? ""
                        const parts = handle.split(/[._\-\s]+/).filter(Boolean)
                        const init = (parts.length ? parts : [handle])
                          .map((p) => p[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                        return init || "U"
                      })()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.email?.split("@")[0] ?? "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" aria-hidden="true" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={logout} 
                  className="cursor-pointer"
                  aria-label="Sign out"
                >
                  <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth" className="flex-shrink-0">
              <Button 
                size="sm" 
                className="font-semibold interactive hover-lift bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl backdrop-blur-sm transition-all duration-300 rounded-xl h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm min-h-[44px]"
                aria-label="Sign In"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
      <CommandPalette />
    </header>
  )
}