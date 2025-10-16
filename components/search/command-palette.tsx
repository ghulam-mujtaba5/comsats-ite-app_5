"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Search } from "lucide-react"
import { isAdminAuthed } from "@/lib/admin"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const [isAdmin, setIsAdmin] = React.useState(false)
  const [adminRole, setAdminRole] = React.useState<string | null>(null)
  const [inputValue, setInputValue] = React.useState("")

  // Global shortcuts to toggle/open
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const tag = target?.tagName?.toLowerCase()
      const isTyping = tag === "input" || tag === "textarea" || tag === "select" || target?.isContentEditable

      // Cmd/Ctrl+K toggles
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        if (!isTyping) setOpen((o) => !o)
      }

      // Slash focuses/open when not typing
      if (e.key === "/" && !isTyping) {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  // Read admin status on mount (local fallback) and try server RBAC session for accuracy
  React.useEffect(() => {
    // Local fallback for dev/admin
    setIsAdmin(isAdminAuthed())

    // Listen for localStorage changes (dev/admin toggle)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "__ite_admin_session__") {
        setIsAdmin(isAdminAuthed())
      }
    }
    window.addEventListener("storage", onStorage)

    // Server check for real RBAC
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/admin/session", { cache: "no-store" })
        if (!mounted) return
        if (res.ok) {
          setIsAdmin(true)
          // Attempt to read role if the API returns it
          try {
            const data = await res.json().catch(() => null)
            if (data && typeof data.role === "string") {
              setAdminRole(data.role)
            }
          } catch { /* noop */ }
        } else {
          setIsAdmin(isAdminAuthed())
          setAdminRole(null)
        }
      } catch {
        // Network/API unavailable; keep fallback
        setIsAdmin(isAdminAuthed())
        setAdminRole(null)
      }
    })()

    return () => {
      mounted = false
      window.removeEventListener("storage", onStorage)
    }
  }, [])

  const onSelect = (value: string) => {
    setOpen(false)
    if (value.startsWith("go:")) {
      router.push(value.replace(/^go:/, ""))
    } else if (value.startsWith("search:")) {
      // Use the current input field value for searching to match user intent
      const q = inputValue.trim() || value.replace(/^search:/, "").trim()
      router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search")
    }
  }

  // Admin command definitions with optional allowedRoles for fine-grained RBAC
  const adminCommands: Array<{
    label: string
    value: string
    allowedRoles?: string[]
  }> = [
    { label: "Admin Dashboard", value: "go:/admin" },
    { label: "Users", value: "go:/admin/users", allowedRoles: ["super_admin", "admin", "support"] },
    { label: "Faculty", value: "go:/admin/faculty", allowedRoles: ["super_admin", "admin", "content"] },
    { label: "Reviews (Moderation)", value: "go:/admin/reviews", allowedRoles: ["super_admin", "admin", "moderator"] },
    { label: "Resources", value: "go:/admin/resources", allowedRoles: ["super_admin", "admin", "content"] },
    { label: "Past Papers", value: "go:/admin/past-papers", allowedRoles: ["super_admin", "admin", "content"] },
    { label: "News", value: "go:/admin/news", allowedRoles: ["super_admin", "admin", "content"] },
    { label: "News & Events", value: "go:/admin/news-events", allowedRoles: ["super_admin", "admin", "content"] },
    { label: "Community Moderation", value: "go:/admin/moderation", allowedRoles: ["super_admin", "admin", "moderator"] },
    { label: "Issues / Reports", value: "go:/admin/issues", allowedRoles: ["super_admin", "admin", "support"] },
    { label: "Timetable", value: "go:/admin/timetable", allowedRoles: ["super_admin", "admin", "content"] },
    { label: "Settings", value: "go:/admin/settings", allowedRoles: ["super_admin", "admin"] },
  ]

  const canSeeAdminCommand = (roles?: string[]) => {
    if (!roles || roles.length === 0) return true
    return !!adminRole && roles.includes(adminRole)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        className="p-0 overflow-hidden"
        aria-label="Command palette"
        aria-describedby="command-palette-description"
      >
        <Command 
          label="Global Command Menu" 
          shouldFilter={true} 
          className="rounded-md"
          aria-label="Command input"
        >
          <div className="flex items-center gap-2 px-3 py-2 border-b">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Command.Input
              placeholder="Type a command or search…"
              value={inputValue}
              onValueChange={setInputValue}
              className="interactive"
              autoFocus
              aria-label="Search input"
            />
          </div>
          <Command.List 
            className="max-h-[60vh] overflow-y-auto fade-in"
            aria-label="Command results"
          >
            <Command.Empty 
              className="px-3 py-2 text-sm text-muted-foreground"
              aria-live="polite"
            >
              No results found.
            </Command.Empty>

            <Command.Group 
              heading="Go to"
              aria-label="Navigation commands"
            >
              <Command.Item 
                className="interactive hover-lift" 
                onSelect={() => onSelect("go:/")}
                aria-label="Go to Home"
              >
                Home
              </Command.Item>
              <Command.Item 
                className="interactive hover-lift" 
                onSelect={() => onSelect("go:/past-papers")}
                aria-label="Go to Past Papers"
              >
                Past Papers
              </Command.Item>
              <Command.Item 
                className="interactive hover-lift" 
                onSelect={() => onSelect("go:/resources")}
                aria-label="Go to Resources"
              >
                Resources
              </Command.Item>
              <Command.Item 
                className="interactive hover-lift" 
                onSelect={() => onSelect("go:/faculty")}
                aria-label="Go to Faculty Reviews"
              >
                Faculty Reviews
              </Command.Item>
              <Command.Item 
                className="interactive hover-lift" 
                onSelect={() => onSelect("go:/gpa-calculator")}
                aria-label="Go to GPA Calculator"
              >
                GPA Calculator
              </Command.Item>
              <Command.Item 
                className="interactive hover-lift" 
                onSelect={() => onSelect("go:/timetable")}
                aria-label="Go to Timetable"
              >
                Timetable
              </Command.Item>
              <Command.Item 
                className="interactive hover-lift" 
                onSelect={() => onSelect("go:/community")}
                aria-label="Go to Community"
              >
                Community
              </Command.Item>
              <Command.Item 
                className="interactive hover-lift" 
                onSelect={() => onSelect("go:/search")}
                aria-label="Go to Search Page"
              >
                Search Page
              </Command.Item>
            </Command.Group>

            <Command.Group 
              heading="Actions"
              aria-label="Action commands"
            >
              <Command.Item
                className="interactive hover-lift"
                onSelect={() => onSelect("search:")}
                // Disable when there's nothing to search for
                disabled={!inputValue.trim()}
                aria-label={inputValue.trim() ? `Search site for “${inputValue.trim()}”` : "Search site"}
              >
                {inputValue.trim() ? `Search site for “${inputValue.trim()}”` : "Search site"}
              </Command.Item>
            </Command.Group>

            {isAdmin && (
              <Command.Group 
                heading="Admin"
                aria-label="Admin commands"
              >
                {adminCommands.filter((c) => canSeeAdminCommand(c.allowedRoles)).map((cmd) => (
                  <Command.Item
                    key={cmd.value}
                    className="interactive hover-lift"
                    onSelect={() => onSelect(cmd.value)}
                    aria-label={cmd.label}
                  >
                    {cmd.label}
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}