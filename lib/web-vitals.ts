// Web Vitals collection & reporting
export type WebVitalMetric = { name: string; value: number; id: string; rating?: string }
let initialized = false
function send(metric: WebVitalMetric) {
  try {
    const body = JSON.stringify({ ...metric, path: window.location.pathname, ts: Date.now() })
    navigator.sendBeacon?.('/api/analytics/web-vitals', body) || fetch('/api/analytics/web-vitals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true })
  } catch {}
}
export function initWebVitals() {
  if (typeof window === 'undefined' || initialized) return
  initialized = true
  import('web-vitals').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
    onCLS(send); onINP(send); onLCP(send); onFCP(send); onTTFB(send)
  }).catch(()=>{})
}
