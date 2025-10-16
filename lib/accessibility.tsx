/**
 * Accessibility Utilities and Helpers
 * 
 * Tools for improving accessibility across the application
 */

/**
 * Skip Navigation Component
 * Allows keyboard users to skip repetitive navigation
 */
export function SkipNavigation() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-background focus:text-foreground focus:px-4 focus:py-2 focus:rounded-md focus:ring-2 focus:ring-primary focus:outline-none transition-all"
    >
      Skip to main content
    </a>
  )
}

/**
 * Visually Hidden Component
 * Hides content visually but keeps it accessible to screen readers
 */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  )
}

/**
 * Focus Trap Hook
 * Traps focus within a component (useful for modals/dialogs)
 */
export function useFocusTrap(ref: React.RefObject<HTMLElement>) {
  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    element.addEventListener('keydown', handleTabKey)

    // Focus first element on mount
    firstElement?.focus()

    return () => {
      element.removeEventListener('keydown', handleTabKey)
    }
  }, [ref])
}

/**
 * Keyboard Navigation Hook
 * Handles arrow key navigation for lists
 */
export function useKeyboardNavigation(items: number) {
  const [focusedIndex, setFocusedIndex] = React.useState(0)

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex((prev) => (prev + 1) % items)
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex((prev) => (prev - 1 + items) % items)
          break
        case 'Home':
          e.preventDefault()
          setFocusedIndex(0)
          break
        case 'End':
          e.preventDefault()
          setFocusedIndex(items - 1)
          break
      }
    },
    [items]
  )

  return { focusedIndex, setFocusedIndex, handleKeyDown }
}

/**
 * Announce to Screen Readers
 * Creates a live region announcement
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  if (typeof document === 'undefined') return

  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Color Contrast Checker
 * Checks if two colors have sufficient contrast ratio
 */
export function getContrastRatio(foreground: string, background: string): number {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  // Calculate relative luminance
  const getLuminance = (rgb: { r: number; g: number; b: number }) => {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
      val = val / 255
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const fg = hexToRgb(foreground)
  const bg = hexToRgb(background)

  if (!fg || !bg) return 0

  const fgLuminance = getLuminance(fg)
  const bgLuminance = getLuminance(bg)

  const lighter = Math.max(fgLuminance, bgLuminance)
  const darker = Math.min(fgLuminance, bgLuminance)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if contrast ratio meets WCAG standards
 */
export function meetsWCAG(
  contrastRatio: number,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  if (level === 'AAA') {
    return size === 'large' ? contrastRatio >= 4.5 : contrastRatio >= 7
  }
  return size === 'large' ? contrastRatio >= 3 : contrastRatio >= 4.5
}

/**
 * Focus Visible Utility
 * Only shows focus outline when navigating with keyboard
 */
export function useFocusVisible() {
  const [isFocusVisible, setIsFocusVisible] = React.useState(false)

  React.useEffect(() => {
    function handleKeyDown() {
      setIsFocusVisible(true)
    }

    function handleMouseDown() {
      setIsFocusVisible(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousedown', handleMouseDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  return isFocusVisible
}

/**
 * ARIA Label Generator
 * Generates descriptive ARIA labels for interactive elements
 */
export function generateAriaLabel(
  action: string,
  target: string,
  context?: string
): string {
  let label = `${action} ${target}`
  if (context) {
    label += ` in ${context}`
  }
  return label
}

/**
 * Accessible Icon Component
 * Wraps icons with proper ARIA attributes
 */
interface AccessibleIconProps {
  children: React.ReactNode
  label: string
  decorative?: boolean
}

export function AccessibleIcon({ children, label, decorative = false }: AccessibleIconProps) {
  return (
    <span
      role={decorative ? 'presentation' : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative}
    >
      {children}
    </span>
  )
}

/**
 * Accessible Button Component
 * Button with proper ARIA attributes and keyboard support
 */
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  ariaLabel?: string
  loading?: boolean
  loadingText?: string
}

export function AccessibleButton({
  children,
  ariaLabel,
  loading = false,
  loadingText = 'Loading...',
  disabled,
  ...props
}: AccessibleButtonProps) {
  return (
    <button
      {...props}
      aria-label={ariaLabel}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <VisuallyHidden>{loadingText}</VisuallyHidden>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
}

/**
 * Live Region Component
 * For dynamic content updates
 */
interface LiveRegionProps {
  children: React.ReactNode
  priority?: 'polite' | 'assertive'
  atomic?: boolean
}

export function LiveRegion({ children, priority = 'polite', atomic = true }: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic={atomic}
      className="sr-only"
    >
      {children}
    </div>
  )
}

/**
 * Landmark Component
 * Creates semantic landmarks for screen readers
 */
interface LandmarkProps {
  children: React.ReactNode
  as?: 'main' | 'nav' | 'aside' | 'section' | 'article' | 'header' | 'footer'
  label?: string
  className?: string
}

export function Landmark({ children, as: Component = 'section', label, className }: LandmarkProps) {
  return (
    <Component aria-label={label} className={className}>
      {children}
    </Component>
  )
}

// Re-export React
import React from 'react'
