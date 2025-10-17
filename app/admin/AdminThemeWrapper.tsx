"use client"

import React from 'react'
import clsx from 'clsx'
import { useThemeMode } from '@/lib/theme/useThemeMode'
import stylesLight from './admin.light.module.css'
import stylesDark from './admin.dark.module.css'

type ThemeMode = 'light' | 'dark'

type AdminThemeWrapperProps = {
  children: React.ReactNode
  className?: string
  /**
   * Use a specific theme mode regardless of detected value.
   * Useful for forcing a preview or a section-level theme.
   */
  forceMode?: ThemeMode
  /**
   * Theme to render on the server before hydration to avoid flicker.
   * If not provided, defaults to 'light'.
   */
  initialMode?: ThemeMode
  /**
   * When true, temporarily disables CSS transitions when the theme changes
   * to avoid jank (adds a short-lived <style> that turns off transitions).
   */
  disableTransitionOnChange?: boolean
  /**
   * Which element to render for the wrapper. Defaults to 'div'.
   */
  as?: React.ElementType
  /**
   * Optional custom data attribute value to scope styles/analytics.
   */
  dataScope?: string
}

export function AdminThemeWrapper({
  children,
  className,
  forceMode,
  initialMode = 'light',
  disableTransitionOnChange = true,
  as: Tag = 'div',
  dataScope,
}: AdminThemeWrapperProps) {
  const detected = useThemeMode()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Compute the effective mode: prefer forced, then detected (after mount), else initial
  const effectiveMode: ThemeMode = forceMode ?? (mounted ? detected : initialMode)

  // Optionally disable transitions during mode flips to avoid jank
  React.useEffect(() => {
    if (!mounted) return
    if (!disableTransitionOnChange) return
    let cleanup: (() => void) | undefined
    try {
      const style = document.createElement('style')
      style.setAttribute('data-admin-theme-transitions', 'off')
      style.appendChild(document.createTextNode('*{transition: none !important}'))
      document.head.appendChild(style)
      // Remove shortly after paint
      const timeout = window.setTimeout(() => {
        style.remove()
      }, 50)
      cleanup = () => {
        window.clearTimeout(timeout)
        style.remove()
      }
    } catch {
      // no-op on SSR or if document is unavailable
    }
    return cleanup
    // only when computed mode changes post-mount
  }, [effectiveMode, mounted, disableTransitionOnChange])

  // Choose the correct CSS Module class for the current mode
  const themeClass = effectiveMode === 'dark' ? stylesDark.adminDark : stylesLight.adminLight

  return (
    <Tag
      className={clsx(themeClass, className)}
      data-theme={effectiveMode}
      data-admin-theme={effectiveMode}
      {...(dataScope ? { 'data-scope': dataScope } : {})}
      suppressHydrationWarning
    >
      {children}
    </Tag>
  )
}
