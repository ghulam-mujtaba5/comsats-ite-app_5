"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useUserPreferences } from '@/hooks/use-accessibility'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
  preferences: {
    reducedMotion: boolean
    highContrast: boolean
    colorScheme: 'light' | 'dark' | 'auto'
  }
  toggleTheme: () => void
  applyUserPreferences: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

interface EnhancedThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
  enableSystem?: boolean
  enableColorScheme?: boolean
}

export function EnhancedThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'admin-theme',
  enableSystem = true,
  enableColorScheme = true
}: EnhancedThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)
  const preferences = useUserPreferences()

  // Get the resolved theme (actual light/dark value)
  const getResolvedTheme = (): 'light' | 'dark' => {
    if (theme === 'system') {
      return preferences.colorScheme === 'dark' ? 'dark' : 'light'
    }
    return theme === 'dark' ? 'dark' : 'light'
  }

  const resolvedTheme = getResolvedTheme()

  // Initialize theme from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        setThemeState(stored as Theme)
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error)
    }
    setMounted(true)
  }, [storageKey])

  // Apply theme changes to document
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    const isDark = resolvedTheme === 'dark'

    // Update theme class
    root.classList.toggle('dark', isDark)
    root.classList.toggle('light', !isDark)

    // Update color scheme
    if (enableColorScheme) {
      root.style.colorScheme = resolvedTheme
    }

    // Update meta theme-color for mobile browsers
    const themeColorMeta = document.querySelector('meta[name="theme-color"]')
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', isDark ? '#0f172a' : '#ffffff')
    }

    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('theme-change', { 
      detail: { theme, resolvedTheme } 
    }))
  }, [theme, resolvedTheme, mounted, enableColorScheme])

  // Apply user preferences
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement

    // Apply reduced motion preference
    if (preferences.reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }

    // Apply high contrast preference
    if (preferences.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Set CSS custom properties for user preferences
    root.style.setProperty('--motion-reduce', preferences.reducedMotion ? '1' : '0')
    root.style.setProperty('--contrast-high', preferences.highContrast ? '1' : '0')
  }, [preferences, mounted])

  // Set theme function
  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem(storageKey, newTheme)
      setThemeState(newTheme)
      
      // Announce theme change to screen readers
      const announcement = `Theme changed to ${newTheme === 'system' ? 'system default' : newTheme} mode`
      const liveRegion = document.getElementById('sr-live-region')
      if (liveRegion) {
        liveRegion.textContent = announcement
      }
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error)
      setThemeState(newTheme)
    }
  }

  // Toggle between light and dark (skipping system)
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('light')
    } else {
      // If system, toggle to opposite of current resolved theme
      setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
    }
  }

  // Apply user preferences manually
  const applyUserPreferences = () => {
    if (preferences.colorScheme !== 'auto' && theme === 'system') {
      setTheme(preferences.colorScheme)
    }
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  const value: ThemeContextValue = {
    theme,
    setTheme,
    resolvedTheme,
    preferences,
    toggleTheme,
    applyUserPreferences
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within an EnhancedThemeProvider')
  }
  return context
}

// Theme toggle button component
export function ThemeToggle({ 
  className = "",
  showLabel = false,
  size = "default"
}: { 
  className?: string
  showLabel?: boolean
  size?: "sm" | "default" | "lg"
}) {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-9 w-9",
    lg: "h-10 w-10"
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={() => {
          if (theme === 'light') setTheme('dark')
          else if (theme === 'dark') setTheme('system')
          else setTheme('light')
        }}
        className={`${sizeClasses[size]} rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus-ring-enhanced transition-colors`}
        aria-label={`Switch theme. Current: ${theme === 'system' ? `System (${resolvedTheme})` : theme}`}
        title={`Switch theme. Current: ${theme === 'system' ? `System (${resolvedTheme})` : theme}`}
      >
        {resolvedTheme === 'dark' ? (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>
      
      {showLabel && (
        <span className="text-sm font-medium">
          {theme === 'system' ? `System (${resolvedTheme})` : theme}
        </span>
      )}
    </div>
  )
}

// CSS styles to inject for theme support
export const themeCSS = `
  /* Reduced motion support */
  .reduce-motion *,
  .reduce-motion *::before,
  .reduce-motion *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* High contrast support */
  .high-contrast {
    --tw-bg-opacity: 1;
    --tw-text-opacity: 1;
  }

  .high-contrast .glass-card-enhanced,
  .high-contrast .glass-input-enhanced,
  .high-contrast .glass-button-enhanced {
    backdrop-filter: none !important;
    background: rgb(255 255 255 / 0.95) !important;
    border: 2px solid rgb(55 65 81) !important;
  }

  .dark.high-contrast .glass-card-enhanced,
  .dark.high-contrast .glass-input-enhanced,
  .dark.high-contrast .glass-button-enhanced {
    background: rgb(15 23 42 / 0.95) !important;
    border: 2px solid rgb(156 163 175) !important;
  }

  /* Theme transition */
  :root {
    transition: color-scheme 0.2s ease;
  }

  .reduce-motion:root {
    transition: none;
  }

  /* Focus improvements for high contrast */
  .high-contrast .focus-ring-enhanced:focus-visible {
    ring-width: 3px !important;
    ring-offset-width: 2px !important;
  }
`