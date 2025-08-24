// Lightweight analytics utilities unified for GTM or GA4.
// Safe to import on both server and client; functions no-op when window is undefined.

export type AnalyticsEventParams = Record<string, any>

const getWin = (): any | undefined => {
  if (typeof window === 'undefined') return undefined
  return window as any
}

export function trackEvent(event: string, params: AnalyticsEventParams = {}): void {
  const w = getWin()
  if (!w) return

  // Prefer GTM dataLayer if present
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event, ...params })
    return
  }

  // Fallback to GA4 gtag if available
  if (typeof w.gtag === 'function') {
    w.gtag('event', event, params)
  }
}

export function trackPageview(path: string, params: AnalyticsEventParams = {}): void {
  const w = getWin()
  if (!w) return

  // GTM: push a virtual page_view
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event: 'page_view', page_path: path, ...params })
    return
  }

  // GA4: use gtag config with page_path
  if (typeof w.gtag === 'function') {
    try {
      const id = (w as any).GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
      if (id) {
        w.gtag('config', id, { page_path: path, ...params })
      }
    } catch {}
  }
}

export function trackSearch(query: string): void {
  trackEvent('search', { search_term: query })
}
