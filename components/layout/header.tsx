"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { CampusSelector } from "@/components/layout/campus-selector"
import { LogOut, User, Menu, Shield, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { CommandPalette } from "@/components/search/command-palette"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const navigationItems = [
  {
    name: "Past Papers",
    href: "/past-papers",
    description: "Browse and download past exam papers",
  },
  {
    name: "Resources",
    href: "/resources",
    description: "Study material and documents shared by departments",
  },
  {
    name: "News & Events",
    href: "/news-events",
    description: "Latest announcements and upcoming events",
  },
  {
    name: "Faculty Reviews",
    href: "/faculty",
    description: "Read and write faculty reviews",
  },
  {
    name: "GPA Calculator",
    href: "/gpa-calculator",
    description: "Calculate GPA/CGPA with the latest scale",
  },
  {
    name: "Timetable",
    href: "/timetable",
    description: "Upload, preview, and download timetables (PDF)",
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
    <header className="sticky top-0 z-[100] w-full border-b border-white/20 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 fade-in shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="app-container h-16 flex items-center justify-between">
        <Link
          href={isAdmin ? "/admin" : "/"}
          title={isAdmin ? "Go to Admin Panel" : "Go to Home"}
          className="flex items-center space-x-4 hover:opacity-90 transition-all duration-300 interactive group px-2 py-1 rounded-2xl hover:bg-white/30 dark:hover:bg-slate-800/30 backdrop-blur-sm"
        >
          <div className="relative">
            <Image src="/new-logo.jpg" alt="CampusAxis Logo" width={40} height={40} className="rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-lg" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl leading-tight tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">CampusAxis</span>
            {pathname !== '/' && (
              <span className="text-xs text-slate-600 dark:text-slate-400 leading-tight font-medium">Academic Portal</span>
            )}
          </div>
        </Link>

        <nav className="hidden lg:flex items-center space-x-1 whitespace-nowrap" aria-label="Primary navigation">
          {navigationItems.map((item) => {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative inline-flex items-center h-10 px-4 rounded-2xl text-sm font-semibold transition-all duration-300 interactive hover-lift group box-border ${
                  isActivePath(item.href) 
                    ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-600 dark:text-blue-400 border border-blue-200/30 dark:border-blue-400/30 backdrop-blur-sm shadow-lg" 
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60 backdrop-blur-sm hover:shadow-md hover:border-white/40 dark:hover:border-slate-600/40 border border-transparent"
                }`}
                aria-current={isActivePath(item.href) ? "page" : undefined}
              >
                {isActivePath(item.href) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-sm" />
                )}
                <span className="relative z-10">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center space-x-3">
          {/* Campus Selector */}
          <CampusSelector />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/search" title="Search (Ctrl/⌘ K)" className="hidden lg:inline-flex">
                <Button variant="ghost" size="sm" className="px-3 py-2 interactive hover-lift rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 backdrop-blur-sm border border-transparent hover:border-white/40 dark:hover:border-slate-600/40 hover:shadow-md transition-all duration-300" aria-keyshortcuts="Control+K Meta+K">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>Search (Ctrl/⌘ K)</TooltipContent>
          </Tooltip>
          <span
            className="hidden lg:inline-flex h-9 select-none items-center gap-1 rounded-xl border border-white/30 dark:border-slate-600/40 px-3 text-[11px] leading-none text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm shadow-sm"
            aria-hidden="true"
          >
            <span className="font-mono">Ctrl</span>
            <span>/</span>
            <span className="font-mono">⌘</span>
            <span>+</span>
            <span className="font-mono">K</span>
          </span>
          {isAdmin && (
            <Link
              href="/admin"
              title="Admin Panel"
              className="hidden lg:inline-flex"
            >
              <Button variant="ghost" size="sm" className="px-3 py-2 interactive hover-lift rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 backdrop-blur-sm border border-transparent hover:border-white/40 dark:hover:border-slate-600/40 hover:shadow-md transition-all duration-300">
                <Shield className="h-5 w-5" />
                <span className="sr-only">Admin Panel</span>
              </Button>
            </Link>
          )}
          <div className="ml-2">
            <ThemeToggle />
          </div>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden interactive p-3 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 backdrop-blur-sm border border-transparent hover:border-white/40 dark:hover:border-slate-600/40 hover:shadow-md transition-all duration-300 relative z-[110]">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 dark:border-white/10 shadow-2xl z-[105] overflow-y-auto max-h-screen">
              <div className="flex flex-col space-y-4 mt-8 pb-8 px-2">
                <div className="flex items-center space-x-4 pb-6 border-b border-white/20 dark:border-white/10">
                  <div className="relative">
                    <Image src="/new-logo.jpg" alt="CampusAxis Logo" width={44} height={44} className="rounded-xl" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 opacity-50" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xl">CampusAxis</span>
                    {pathname !== '/' && (
                      <span className="text-sm text-slate-600 dark:text-slate-400">Academic Portal</span>
                    )}
                  </div>
                </div>

                {navigationItems.map((item) => {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`relative p-4 min-h-[72px] rounded-2xl transition-all duration-300 hover:bg-white/60 dark:hover:bg-slate-800/60 interactive hover-lift group backdrop-blur-sm border ${
                        isActivePath(item.href) ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-blue-200/30 dark:border-blue-400/30 shadow-lg" : "border-transparent hover:border-white/40 dark:hover:border-slate-600/40 hover:shadow-md"
                      }`}
                      aria-current={isActivePath(item.href) ? "page" : undefined}
                    >
                      {isActivePath(item.href) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-sm" />
                      )}
                      <div className="relative z-10 flex flex-col">
                        <span className={`font-semibold text-base ${
                          isActivePath(item.href) ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white"
                        }`}>{item.name}</span>
                        <span className={`text-sm ${
                          isActivePath(item.href) ? "text-blue-500/80 dark:text-blue-300/80" : "text-slate-600 dark:text-slate-400"
                        }`}>{item.description}</span>
                      </div>
                    </Link>
                  )
                })}


                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="relative p-4 min-h-[72px] rounded-2xl transition-all duration-300 hover:bg-white/60 dark:hover:bg-slate-800/60 interactive hover-lift backdrop-blur-sm border border-transparent hover:border-white/40 dark:hover:border-slate-600/40 hover:shadow-md"
                  >
                    <div className="relative z-10 flex items-start space-x-3">
                      <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-white">Admin Panel</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Manage site content</span>
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
                <Button variant="ghost" className="relative h-9 w-9 rounded-full interactive hover-lift">
                  <Avatar className="h-9 w-9">
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
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <Button size="sm" className="font-semibold interactive hover-lift bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl backdrop-blur-sm transition-all duration-300 rounded-xl">
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
