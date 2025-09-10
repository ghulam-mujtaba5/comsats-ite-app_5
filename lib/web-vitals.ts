// Web Vitals collection & reporting
export type WebVitalMetric = { name: string; value: number; id: string; rating?: string }
let initialized = false
// Minimal ambient module typing fallback (web-vitals ships types but safeguard if resolution fails)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
  // eslint-disable-next-line no-var
  var __WEB_VITALS_TYPES_FALLBACK__: boolean | undefined
}
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
