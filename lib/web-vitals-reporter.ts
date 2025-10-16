/**
 * Web Vitals Reporter
 * 
 * Monitors and reports Core Web Vitals metrics
 * Works with Google Analytics, custom analytics, or console logging
 */

import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP } from 'web-vitals'
import type { Metric } from 'web-vitals'

/**
 * Report Web Vitals to analytics service
 */
function sendToAnalytics(metric: Metric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', {
      name: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
      delta: Math.round(metric.delta),
      id: metric.id,
    })
  }

  // Send to Google Analytics if available
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as any).gtag
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    })
  }

  // Send to custom analytics endpoint
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    })

    // Use sendBeacon if available, fallback to fetch
    if (navigator.sendBeacon) {
      navigator.sendBeacon(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, body)
    } else {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        body,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch((error) => {
        console.error('[Web Vitals] Failed to send metric:', error)
      })
    }
  }
}

/**
 * Get rating color for visualization
 */
function getRatingColor(rating: string): string {
  switch (rating) {
    case 'good':
      return '#0CCE6B'
    case 'needs-improvement':
      return '#FFA400'
    case 'poor':
      return '#FF4E42'
    default:
      return '#9CA3AF'
  }
}

/**
 * Format metric value for display
 */
function formatMetricValue(name: string, value: number): string {
  if (name === 'CLS') {
    return value.toFixed(3)
  }
  return `${Math.round(value)}ms`
}

/**
 * Show Web Vitals overlay (development only)
 */
function showWebVitalsOverlay(metrics: Record<string, Metric>) {
  if (process.env.NODE_ENV !== 'development') return

  // Remove existing overlay
  const existingOverlay = document.getElementById('web-vitals-overlay')
  if (existingOverlay) {
    existingOverlay.remove()
  }

  // Create new overlay
  const overlay = document.createElement('div')
  overlay.id = 'web-vitals-overlay'
  overlay.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 16px;
    border-radius: 12px;
    font-family: monospace;
    font-size: 12px;
    z-index: 9999;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 300px;
  `

  const content = Object.entries(metrics)
    .map(([name, metric]) => {
      const color = getRatingColor(metric.rating)
      const value = formatMetricValue(name, metric.value)
      return `
        <div style="margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: bold;">${name}</span>
            <span style="color: ${color};">${value}</span>
          </div>
          <div style="
            height: 4px;
            background: #333;
            border-radius: 2px;
            margin-top: 4px;
            overflow: hidden;
          ">
            <div style="
              height: 100%;
              width: ${metric.rating === 'good' ? '100' : metric.rating === 'needs-improvement' ? '66' : '33'}%;
              background: ${color};
              transition: width 0.3s ease;
            "></div>
          </div>
        </div>
      `
    })
    .join('')

  overlay.innerHTML = `
    <div style="margin-bottom: 12px; font-weight: bold; font-size: 14px;">
      Web Vitals
    </div>
    ${content}
    <div style="margin-top: 12px; font-size: 10px; opacity: 0.6;">
      ${Object.keys(metrics).length} metrics collected
    </div>
  `

  document.body.appendChild(overlay)
}

/**
 * Initialize Web Vitals monitoring
 */
export function reportWebVitals(options: { showOverlay?: boolean } = {}) {
  const metrics: Record<string, Metric> = {}

  const handleMetric = (metric: Metric) => {
    metrics[metric.name] = metric
    sendToAnalytics(metric)

    if (options.showOverlay && process.env.NODE_ENV === 'development') {
      showWebVitalsOverlay(metrics)
    }
  }

  // Monitor all Core Web Vitals
  onCLS(handleMetric)
  onFID(handleMetric)
  onFCP(handleMetric)
  onLCP(handleMetric)
  onTTFB(handleMetric)
  onINP(handleMetric)
}

/**
 * Get current Web Vitals metrics
 */
export function getCurrentMetrics(): Promise<Record<string, Metric>> {
  return new Promise((resolve) => {
    const metrics: Record<string, Metric> = {}
    let collectedCount = 0
    const totalMetrics = 6

    const handleMetric = (metric: Metric) => {
      metrics[metric.name] = metric
      collectedCount++

      if (collectedCount === totalMetrics) {
        resolve(metrics)
      }
    }

    onCLS(handleMetric)
    onFID(handleMetric)
    onFCP(handleMetric)
    onLCP(handleMetric)
    onTTFB(handleMetric)
    onINP(handleMetric)

    // Timeout after 10 seconds
    setTimeout(() => {
      resolve(metrics)
    }, 10000)
  })
}

/**
 * Export formatted metrics for display
 */
export function getFormattedMetrics(metrics: Record<string, Metric>) {
  return Object.entries(metrics).map(([name, metric]) => ({
    name,
    value: formatMetricValue(name, metric.value),
    rating: metric.rating,
    color: getRatingColor(metric.rating),
    rawValue: metric.value,
  }))
}
