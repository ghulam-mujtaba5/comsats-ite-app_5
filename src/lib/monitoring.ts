/**
 * Monitoring and Analytics Utilities
 * Integration with Google Analytics, Search Console, and performance monitoring
 */

// Google Analytics 4 Event Tracking
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

interface GAEvent {
  action: string
  category: string
  label?: string
  value?: number
}

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID!, {
      page_path: url,
    })
  }
}

// Track custom events
export const event = ({ action, category, label, value }: GAEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track search queries
export const trackSearch = (query: string, resultsCount: number) => {
  event({
    action: 'search',
    category: 'Search',
    label: query,
    value: resultsCount,
  })
}

// Track downloads
export const trackDownload = (fileName: string, fileType: string) => {
  event({
    action: 'download',
    category: 'Downloads',
    label: `${fileType}: ${fileName}`,
  })
}

// Track external links
export const trackOutboundLink = (url: string) => {
  event({
    action: 'click',
    category: 'Outbound Link',
    label: url,
  })
}

// Track errors
export const trackError = (error: string, fatal: boolean = false) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: error,
      fatal: fatal,
    })
  }
}

// Track performance metrics
export const trackPerformance = (metric: string, value: number) => {
  event({
    action: 'performance_metric',
    category: 'Performance',
    label: metric,
    value: Math.round(value),
  })
}

// Core Web Vitals tracking
export const trackWebVitals = (metric: {
  id: string
  name: string
  value: number
  label: 'web-vital' | 'custom'
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    })
  }
}

// Track user engagement
export const trackEngagement = (type: string, details?: string) => {
  event({
    action: type,
    category: 'Engagement',
    label: details,
  })
}

// Track feature usage
export const trackFeatureUsage = (feature: string, action: string) => {
  event({
    action: action,
    category: 'Feature Usage',
    label: feature,
  })
}

/**
 * Google Search Console Integration
 */

// Submit URL for indexing (requires API setup)
export const submitUrlForIndexing = async (url: string) => {
  try {
    const response = await fetch('/api/search-console/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      throw new Error('Failed to submit URL for indexing')
    }

    return await response.json()
  } catch (error) {
    console.error('Error submitting URL for indexing:', error)
    throw error
  }
}

/**
 * Performance Monitoring
 */

// Monitor API response times
export const monitorAPIPerformance = (endpoint: string, duration: number) => {
  trackPerformance(`API: ${endpoint}`, duration)
}

// Monitor page load times
export const monitorPageLoad = (page: string, duration: number) => {
  trackPerformance(`Page Load: ${page}`, duration)
}

// Monitor resource loading
export const monitorResourceLoad = (resource: string, duration: number) => {
  trackPerformance(`Resource: ${resource}`, duration)
}

/**
 * User Behavior Tracking
 */

// Track scroll depth
export const trackScrollDepth = (percentage: number) => {
  event({
    action: 'scroll_depth',
    category: 'Engagement',
    label: `${percentage}%`,
    value: percentage,
  })
}

// Track time on page
export const trackTimeOnPage = (seconds: number) => {
  event({
    action: 'time_on_page',
    category: 'Engagement',
    value: seconds,
  })
}

// Track form submissions
export const trackFormSubmission = (formName: string, success: boolean) => {
  event({
    action: success ? 'submit_success' : 'submit_failure',
    category: 'Form',
    label: formName,
  })
}

// Track video interactions
export const trackVideo = (action: 'play' | 'pause' | 'complete', videoTitle: string) => {
  event({
    action: `video_${action}`,
    category: 'Video',
    label: videoTitle,
  })
}

/**
 * Conversion Tracking
 */

// Track user registration
export const trackRegistration = (method: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up', {
      method: method,
    })
  }
}

// Track user login
export const trackLogin = (method: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'login', {
      method: method,
    })
  }
}

// Track content sharing
export const trackShare = (contentType: string, method: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'share', {
      content_type: contentType,
      method: method,
    })
  }
}

/**
 * A/B Testing Support
 */

// Track experiment view
export const trackExperiment = (experimentId: string, variantId: string) => {
  event({
    action: 'experiment_view',
    category: 'Experiments',
    label: `${experimentId}:${variantId}`,
  })
}

/**
 * Error Boundary Integration
 */

export const reportError = (error: Error, errorInfo: { componentStack: string }) => {
  trackError(`${error.name}: ${error.message}`, true)
  
  // Log to external error tracking service (e.g., Sentry)
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Sentry.captureException(error, { contexts: { react: errorInfo } })
  }
}

/**
 * Session Tracking
 */

export const startSession = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'session_start')
  }
}

export const endSession = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'session_end')
  }
}

/**
 * Helper to check if analytics is enabled
 */
export const isAnalyticsEnabled = (): boolean => {
  return !!(
    typeof window !== 'undefined' &&
    typeof window.gtag === 'function' &&
    process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false'
  )
}

// TypeScript declarations for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export default {
  pageview,
  event,
  trackSearch,
  trackDownload,
  trackOutboundLink,
  trackError,
  trackPerformance,
  trackWebVitals,
  trackEngagement,
  trackFeatureUsage,
  submitUrlForIndexing,
  monitorAPIPerformance,
  monitorPageLoad,
  monitorResourceLoad,
  trackScrollDepth,
  trackTimeOnPage,
  trackFormSubmission,
  trackVideo,
  trackRegistration,
  trackLogin,
  trackShare,
  trackExperiment,
  reportError,
  startSession,
  endSession,
  isAnalyticsEnabled,
}
