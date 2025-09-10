"use client"

import { useEffect, useRef } from 'react'

interface AccessibilityAuditorProps {
  enabled?: boolean
}

export function AccessibilityAuditor({ enabled = process.env.NODE_ENV === 'development' }: AccessibilityAuditorProps) {
  const hasRun = useRef(false)

  useEffect(() => {
    if (!enabled || hasRun.current || typeof window === 'undefined') return
    hasRun.current = true

    // Comprehensive accessibility audit
    const runAccessibilityAudit = () => {
      const issues: string[] = []

      // Check for missing alt text on images
      const images = document.querySelectorAll('img')
      images.forEach((img, index) => {
        if (!img.alt && !img.hasAttribute('aria-hidden')) {
          issues.push(`Image ${index + 1} is missing alt text`)
        }
      })

      // Check for missing form labels
      const inputs = document.querySelectorAll('input, textarea, select')
      inputs.forEach((input, index) => {
        const hasLabel = document.querySelector(`label[for="${input.id}"]`) || 
                        input.hasAttribute('aria-label') || 
                        input.hasAttribute('aria-labelledby')
        const inputType = (input as HTMLInputElement).type
        if (!hasLabel && inputType !== 'hidden') {
          issues.push(`Form input ${index + 1} is missing a label`)
        }
      })

      // Check for missing heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      let previousLevel = 0
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1))
        if (level > previousLevel + 1) {
          issues.push(`Heading ${index + 1} (${heading.tagName}) skips heading levels`)
        }
        previousLevel = level
      })

      // Check for missing focus indicators
      const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])')
      focusableElements.forEach((element, index) => {
        const styles = window.getComputedStyle(element, ':focus')
        if (styles.outline === 'none' && !styles.boxShadow && !styles.border.includes('2px')) {
          issues.push(`Focusable element ${index + 1} may lack visible focus indicator`)
        }
      })

      // Check for missing landmark roles
      const main = document.querySelector('main')
      const nav = document.querySelector('nav')
      const header = document.querySelector('header')
      const footer = document.querySelector('footer')

      if (!main) issues.push('Page is missing a main landmark')
      if (!nav) issues.push('Page is missing a navigation landmark')
      if (!header) issues.push('Page is missing a header landmark')
      if (!footer) issues.push('Page is missing a footer landmark')

      // Check for color contrast (simplified check)
      const textElements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6')
      textElements.forEach((element, index) => {
        const styles = window.getComputedStyle(element)
        const color = styles.color
        const backgroundColor = styles.backgroundColor
        
        // Simple contrast check (would need more sophisticated implementation for production)
        if (color === backgroundColor) {
          issues.push(`Text element ${index + 1} may have insufficient color contrast`)
        }
      })

      // Check for missing ARIA labels on interactive elements
      const buttons = document.querySelectorAll('button')
      buttons.forEach((button, index) => {
        if (!button.textContent?.trim() && !button.hasAttribute('aria-label') && !button.hasAttribute('aria-labelledby')) {
          issues.push(`Button ${index + 1} is missing accessible text`)
        }
      })

      // Log results
      if (issues.length > 0) {
        console.group('🔍 Accessibility Audit Results')
        console.warn(`Found ${issues.length} potential accessibility issues:`)
        issues.forEach((issue, index) => {
          console.warn(`${index + 1}. ${issue}`)
        })
        console.groupEnd()
      } else {
        console.info('✅ Accessibility audit completed - no issues found')
      }

      // Report to analytics in development
      if (typeof window.gtag !== 'undefined' && process.env.NODE_ENV === 'development') {
        window.gtag('event', 'accessibility_audit', {
          event_category: 'Development',
          custom_parameter_1: issues.length,
          non_interaction: true,
        })
      }
    }

    // Run audit after a delay to allow page to fully load
    const timeoutId = setTimeout(runAccessibilityAudit, 3000)

    return () => clearTimeout(timeoutId)
  }, [enabled])

  return null
}