"use client"

import { useEffect } from 'react'

// Google Core Web Vitals monitoring
export function LighthouseMetrics() {
  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return

    // Enhanced Web Vitals tracking
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
      const sendToGoogleAnalytics = ({ name, delta, value, id }: any) => {
        // Send to Google Analytics 4
        if (typeof window.gtag !== 'undefined') {
          window.gtag('event', name, {
            event_category: 'Web Vitals',
            event_label: id,
            value: Math.round(name === 'CLS' ? delta * 1000 : delta),
            custom_parameter_1: value,
            non_interaction: true,
          })
        }
      }

      // Track all Core Web Vitals
      onCLS(sendToGoogleAnalytics)
      onFID(sendToGoogleAnalytics)
      onFCP(sendToGoogleAnalytics)
      onLCP(sendToGoogleAnalytics)
      onTTFB(sendToGoogleAnalytics)
      
      // Track INP (Interaction to Next Paint) - newer metric
      onINP(sendToGoogleAnalytics)
    })

    // Performance Observer for additional metrics
    if ('PerformanceObserver' in window) {
      // Track largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformanceEntry
        
        if (typeof window.gtag !== 'undefined') {
          window.gtag('event', 'largest_contentful_paint', {
            event_category: 'Performance',
            value: Math.round(lastEntry.startTime),
            non_interaction: true,
          })
        }
      })

      try {
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
      } catch (e) {
        // LCP not supported
      }

      // Track long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'long_task', {
              event_category: 'Performance',
              value: Math.round(entry.duration),
              non_interaction: true,
            })
          }
        })
      })

      try {
        longTaskObserver.observe({ type: 'longtask', buffered: true })
      } catch (e) {
        // Long tasks not supported
      }
    }

    // Track user device and connection info
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'network_information', {
          event_category: 'Device Info',
          custom_parameter_1: connection.effectiveType,
          custom_parameter_2: connection.downlink,
          non_interaction: true,
        })
      }
    }

  }, [])

  return null
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}