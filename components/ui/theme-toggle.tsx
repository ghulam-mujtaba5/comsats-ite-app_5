"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" aria-label="Toggle theme" className="px-2">
        <Sun className="h-5 w-5" />
      </Button>
    )
  }

  const current = theme === "system" ? systemTheme : theme
  const next = current === "dark" ? "light" : "dark"

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label="Toggle theme"
      className="px-2"
      onClick={() => setTheme(next)}
      title={`Switch to ${next} mode`}
    >
      {current === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}
