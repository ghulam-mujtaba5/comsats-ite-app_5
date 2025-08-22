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
import { useAuth } from "@/contexts/auth-context"
import { GraduationCap, LogOut, User, Menu, Calculator, FileText, Users, BookOpen, Calendar, Shield, Search, HelpCircle, Newspaper, Info, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const navigationItems = [
  {
    name: "Community",
    href: "/community",
    icon: Users,
    description: "Connect with fellow students and join discussions",
  },
  {
    name: "Faculty Reviews",
    href: "/faculty",
    icon: BookOpen,
    description: "Read and write faculty reviews",
  },
  {
    name: "Lost & Found",
    href: "/lost-found",
    icon: Search,
    description: "Report lost items or help others find theirs",
  },
  {
    name: "Help Desk",
    href: "/help-desk",
    icon: HelpCircle,
    description: "Get help with admissions, fees, and queries",
  },
  {
    name: "News & Events",
    href: "/news-events",
    icon: Newspaper,
    description: "Stay updated with campus news and events",
  },
  {
    name: "Guidance Portal",
    href: "/guidance",
    icon: Info,
    description: "Essential policies and student guides",
  },
  {
    name: "Student Support",
    href: "/student-support",
    icon: Heart,
    description: "Mental health and academic support resources",
  },
  {
    name: "Past Papers",
    href: "/past-papers",
    icon: FileText,
    description: "Browse and download past exam papers",
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

  const isActivePath = (path: string) => {
    return pathname === path || (path !== "/" && pathname.startsWith(path))
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href={isAdmin ? "/admin" : "/"}
          title={isAdmin ? "Go to Admin Panel" : "Go to Home"}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <Image src="/placeholder-logo.png" alt="COMSATS ITE Logo" width={40} height={40} />
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight">COMSATS ITE</span>
            <span className="text-xs text-muted-foreground leading-tight">Academic Portal</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isActivePath(item.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center space-x-2">
          {isAdmin && (
            <Link href="/admin" title="Admin Panel" className="hidden lg:inline-flex">
              <Button variant="ghost" size="sm" className="px-2">
                <Shield className="h-5 w-5" />
                <span className="sr-only">Admin Panel</span>
              </Button>
            </Link>
          )}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                <div className="flex items-center space-x-3 pb-4 border-b">
                  <Image src="/placeholder-logo.png" alt="COMSATS ITE Logo" width={40} height={40} />
                  <div className="flex flex-col">
                    <span className="font-bold text-lg">COMSATS ITE</span>
                    <span className="text-sm text-muted-foreground">Academic Portal</span>
                  </div>
                </div>

                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-start space-x-3 p-3 rounded-lg transition-colors hover:bg-accent ${
                        isActivePath(item.href) ? "bg-accent" : ""
                      }`}
                    >
                      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.description}</span>
                      </div>
                    </Link>
                  )
                })}

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-start space-x-3 p-3 rounded-lg transition-colors hover:bg-accent"
                  >
                    <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-medium">Admin Panel</span>
                      <span className="text-sm text-muted-foreground">Manage site content</span>
                    </div>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
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
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-blue-600 focus:text-blue-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <Button size="sm" className="font-medium">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
