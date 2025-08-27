"use client"

import { useEffect, useRef, useCallback, useState } from 'react'

interface UseAccessibilityOptions {
  autoFocus?: boolean
  trapFocus?: boolean
  announceChanges?: boolean
  skipLinks?: boolean
}

interface UseAccessibilityReturn {
  containerRef: React.RefObject<HTMLDivElement | null>
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void
  focusFirstElement: () => void
  focusLastElement: () => void
}

export function useAccessibility(options: UseAccessibilityOptions = {}): UseAccessibilityReturn {
  const {
    autoFocus = true,
    trapFocus = false,
    announceChanges = true,
    skipLinks = true
  } = options

  const containerRef = useRef<HTMLDivElement>(null)
  const announcementRef = useRef<HTMLDivElement>(null)

  // Create or get the live region for screen reader announcements
  useEffect(() => {
    if (!announceChanges) return

    let liveRegion = document.getElementById('sr-live-region')
    if (!liveRegion) {
      liveRegion = document.createElement('div')
      liveRegion.id = 'sr-live-region'
      liveRegion.setAttribute('aria-live', 'polite')
      liveRegion.setAttribute('aria-atomic', 'true')
      liveRegion.className = 'sr-only-enhanced'
      document.body.appendChild(liveRegion)
    }
    
    announcementRef.current = liveRegion as HTMLDivElement
  }, [announceChanges])

  // Auto focus on the first focusable element when component mounts
  useEffect(() => {
    if (!autoFocus || !containerRef.current) return

    const focusableElements = getFocusableElements(containerRef.current)
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }
  }, [autoFocus])

  // Focus trap implementation
  useEffect(() => {
    if (!trapFocus || !containerRef.current) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const focusableElements = getFocusableElements(containerRef.current!)
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [trapFocus])

  // Skip links creation
  useEffect(() => {
    if (!skipLinks) return

    // Create main skip link if it doesn't exist
    let skipLink = document.getElementById('skip-to-main') as HTMLAnchorElement
    if (!skipLink) {
      skipLink = document.createElement('a')
      skipLink.id = 'skip-to-main'
      skipLink.href = '#main-content'
      skipLink.textContent = 'Skip to main content'
      skipLink.className = 'skip-link'
      skipLink.setAttribute('aria-label', 'Skip navigation and go to main content')
      document.body.insertBefore(skipLink, document.body.firstChild)
    }
  }, [skipLinks])

  // Function to get all focusable elements
  const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter(element => {
        // Check if element is visible
        const style = window.getComputedStyle(element as HTMLElement)
        return style.display !== 'none' && style.visibility !== 'hidden'
      }) as HTMLElement[]
  }

  // Function to announce messages to screen readers
  const announceToScreenReader = useCallback((
    message: string, 
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    if (!announcementRef.current) return

    announcementRef.current.setAttribute('aria-live', priority)
    announcementRef.current.textContent = message

    // Clear the message after a brief delay to allow for repeated announcements
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = ''
      }
    }, 1000)
  }, [])

  // Function to focus the first focusable element
  const focusFirstElement = useCallback(() => {
    if (!containerRef.current) return
    
    const focusableElements = getFocusableElements(containerRef.current)
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }
  }, [])

  // Function to focus the last focusable element
  const focusLastElement = useCallback(() => {
    if (!containerRef.current) return
    
    const focusableElements = getFocusableElements(containerRef.current)
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus()
    }
  }, [])

  return {
    containerRef,
    announceToScreenReader,
    focusFirstElement,
    focusLastElement
  }
}

// Hook for managing keyboard shortcuts in admin pages
export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger shortcuts when not typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as HTMLElement)?.contentEditable === 'true'
      ) {
        return
      }

      const key = [
        event.ctrlKey && 'ctrl',
        event.metaKey && 'meta',
        event.altKey && 'alt',
        event.shiftKey && 'shift',
        event.key.toLowerCase()
      ].filter(Boolean).join('+')

      const handler = shortcuts[key]
      if (handler) {
        event.preventDefault()
        handler()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

// Hook for detecting user preferences
export function useUserPreferences() {
  const [preferences, setPreferences] = useState({
    reducedMotion: false,
    highContrast: false,
    colorScheme: 'light' as 'light' | 'dark' | 'auto'
  })

  useEffect(() => {
    // Check for reduced motion preference
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)')
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const updatePreferences = () => {
      setPreferences({
        reducedMotion: reducedMotionQuery.matches,
        highContrast: highContrastQuery.matches,
        colorScheme: colorSchemeQuery.matches ? 'dark' : 'light'
      })
    }

    updatePreferences()

    reducedMotionQuery.addEventListener('change', updatePreferences)
    highContrastQuery.addEventListener('change', updatePreferences)
    colorSchemeQuery.addEventListener('change', updatePreferences)

    return () => {
      reducedMotionQuery.removeEventListener('change', updatePreferences)
      highContrastQuery.removeEventListener('change', updatePreferences)
      colorSchemeQuery.removeEventListener('change', updatePreferences)
    }
  }, [])

  return preferences
}

// Utility function to generate unique IDs for ARIA relationships
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

// Hook for managing focus restoration
export function useFocusRestore() {
  const previousActiveElement = useRef<HTMLElement | null>(null)

  const saveFocus = useCallback(() => {
    previousActiveElement.current = document.activeElement as HTMLElement
  }, [])

  const restoreFocus = useCallback(() => {
    if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
      previousActiveElement.current.focus()
    }
  }, [])

  return { saveFocus, restoreFocus }
}