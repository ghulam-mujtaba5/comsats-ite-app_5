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

  // Read admin status on mount
  React.useEffect(() => {
    setIsAdmin(isAdminAuthed())
    const onStorage = (e: StorageEvent) => {
      if (e.key === "__ite_admin_session__") {
        setIsAdmin(isAdminAuthed())
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const onSelect = (value: string) => {
    setOpen(false)
    if (value.startsWith("go:")) {
      router.push(value.replace(/^go:/, ""))
    } else if (value.startsWith("search:")) {
      const q = value.replace(/^search:/, "").trim()
      router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden">
        <Command label="Global Command Menu" shouldFilter={true} className="rounded-md">
          <div className="flex items-center gap-2 px-3 py-2 border-b">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Command.Input placeholder="Type a command or search…" autoFocus />
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto">
            <Command.Empty className="px-3 py-2 text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group heading="Go to">
              <Command.Item onSelect={() => onSelect("go:/")}>Home</Command.Item>
              <Command.Item onSelect={() => onSelect("go:/past-papers")}>Past Papers</Command.Item>
              <Command.Item onSelect={() => onSelect("go:/resources")}>Resources</Command.Item>
              <Command.Item onSelect={() => onSelect("go:/faculty")}>Faculty Reviews</Command.Item>
              <Command.Item onSelect={() => onSelect("go:/gpa-calculator")}>GPA Calculator</Command.Item>
              <Command.Item onSelect={() => onSelect("go:/timetable")}>Timetable</Command.Item>
              <Command.Item onSelect={() => onSelect("go:/community")}>Community</Command.Item>
              <Command.Item onSelect={() => onSelect("go:/search")}>Search Page</Command.Item>
            </Command.Group>

            <Command.Group heading="Actions">
              <Command.Item onSelect={(val) => onSelect("search:" + val)}>
                Search site for typed query
              </Command.Item>
            </Command.Group>

            {isAdmin && (
              <Command.Group heading="Admin">
                <Command.Item onSelect={() => onSelect("go:/admin")}>Admin Dashboard</Command.Item>
                <Command.Item onSelect={() => onSelect("go:/admin/users")}>Users</Command.Item>
                <Command.Item onSelect={() => onSelect("go:/admin/moderation")}>Moderation</Command.Item>
                <Command.Item onSelect={() => onSelect("go:/admin/resources")}>Resources</Command.Item>
                <Command.Item onSelect={() => onSelect("go:/admin/past-papers")}>Past Papers</Command.Item>
                <Command.Item onSelect={() => onSelect("go:/admin/settings")}>Settings</Command.Item>
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
