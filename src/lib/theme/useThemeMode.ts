"use client"

// Back-compat hook for legacy imports: '@/lib/theme/useThemeMode'
// Provides a minimal theme mode detector using next-themes if available,
// and falls back to system preference. Matches the old public API: { theme, isDark, toggle? }.

import { useEffect, useState, useCallback } from 'react'
// next-themes is already used elsewhere; guard in case it's unavailable in some environments
let useThemeImpl: any = null
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  useThemeImpl = require('next-themes').useTheme
} catch (_) {
  useThemeImpl = null
}

export function useThemeMode() {
  const prefersDark = typeof window !== 'undefined'
    ? window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    : false

  const [theme, setTheme] = useState<'light' | 'dark'>(prefersDark ? 'dark' : 'light')

  // If next-themes is present, sync with it
  const themeHook = useThemeImpl ? useThemeImpl() : null

  useEffect(() => {
    if (themeHook && themeHook.theme) {
      setTheme(themeHook.theme === 'system'
        ? (prefersDark ? 'dark' : 'light')
        : themeHook.theme)
    }
  }, [themeHook?.theme, prefersDark])

  useEffect(() => {
    if (!themeHook) return
    if (themeHook.theme !== theme) {
      // Prefer explicit light/dark to avoid system oscillation
      themeHook.setTheme(theme)
    }
  }, [themeHook, theme])

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return {
    theme,
    isDark: theme === 'dark',
    toggle,
  }
}

export default useThemeMode
