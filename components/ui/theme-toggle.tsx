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
      <Button 
        variant="ghost" 
        size="sm" 
        aria-label="Toggle theme" 
        className="px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Sun className="h-5 w-5" />
      </Button>
    )
  }

  const current = theme === "system" ? systemTheme : theme
  const next = current === "dark" ? "light" : "dark"

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setTheme(next)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={`Switch to ${next} mode`}
      className="px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onClick={() => setTheme(next)}
      onKeyDown={handleKeyDown}
      title={`Switch to ${next} mode`}
      role="switch"
      aria-checked={current === "dark"}
    >
      {current === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}
