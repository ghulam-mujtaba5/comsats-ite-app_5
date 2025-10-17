"use client"

import { useEffect, useMemo, useState } from "react"
import { useTheme } from "next-themes"

type PreferredTheme = {
  theme: string | undefined
  systemTheme: "light" | "dark" | undefined
  resolvedTheme: "light" | "dark" | undefined
  isDark: boolean
}

export function usePreferredTheme(): PreferredTheme {
  const { theme, systemTheme, resolvedTheme } = useTheme()
  const [effective, setEffective] = useState<"light" | "dark" | undefined>(undefined)

  useEffect(() => {
    // If next-themes has resolved theme, use it
    if (resolvedTheme === "light" || resolvedTheme === "dark") {
      setEffective(resolvedTheme)
      return
    }
    // Fallback to system preference
    if (typeof window !== "undefined" && window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)")
      const handler = () => setEffective(mq.matches ? "dark" : "light")
      handler()
      mq.addEventListener?.("change", handler)
      return () => mq.removeEventListener?.("change", handler)
    }
    setEffective("light")
  }, [resolvedTheme])

  const isDark = useMemo(() => effective === "dark", [effective])

  return {
    theme,
    systemTheme: (systemTheme as any) ?? undefined,
    resolvedTheme: effective,
    isDark,
  }
}
