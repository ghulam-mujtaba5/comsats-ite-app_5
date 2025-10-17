"use client"

import { useEffect, useState } from "react"

export type ThemeMode = "light" | "dark"

/**
 * useThemeMode
 * Detects current theme by observing <html> class changes (expects 'dark' toggle)
 * Falls back to prefers-color-scheme on first render, updates reactively.
 */
export function useThemeMode(): ThemeMode {
  // Start with system preference to minimize flicker before hydration
  const prefersDark = typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches
  const [mode, setMode] = useState<ThemeMode>(prefersDark ? "dark" : "light")

  useEffect(() => {
    const getHtmlMode = (): ThemeMode =>
      document.documentElement.classList.contains("dark") ? "dark" : "light"

    // Initialize from current DOM
    setMode(getHtmlMode())

    // Observe class changes on <html>
    const observer = new MutationObserver(() => {
      setMode(getHtmlMode())
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    // Also respond to OS scheme changes (in case app mirrors it)
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)")
    const onChange = () => setMode(getHtmlMode())
    mq?.addEventListener?.("change", onChange)

    return () => {
      observer.disconnect()
      mq?.removeEventListener?.("change", onChange)
    }
  }, [])

  return mode
}
