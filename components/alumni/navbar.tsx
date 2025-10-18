"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { 
  GraduationCap, 
  Mail, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Users
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/alumni",
    icon: GraduationCap,
  },
  {
    name: "Email Management",
    href: "/alumni",
    icon: Mail,
  },
  {
    name: "Profile",
    href: "/alumni/profile",
    icon: User,
  },
  {
    name: "Alumni Directory",
    href: "/alumni/directory",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/alumni/settings",
    icon: Settings,
  },
]

export function AlumniNavbar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      window.location.href = "/"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 glass-navbar">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/alumni" className="flex items-center gap-2 font-bold text-xl">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              Alumni Portal
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between border-b pb-4">
                  <Link href="/alumni" className="flex items-center gap-2 font-bold text-xl">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                      Alumni Portal
                    </span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 py-6">
                  <div className="space-y-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-100 dark:bg-slate-900",
                            isActive ? "bg-slate-100 dark:bg-slate-900 text-primary" : "text-muted-foreground"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>
                </nav>

                {/* Mobile Logout */}
                <div className="border-t pt-4">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3"
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}