"use client"

import type React from "react"
import { useEffect, useState } from "react"

export function AdminGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [ok, setOk] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/admin/session', { cache: 'no-store' })
        if (!mounted) return
        setOk(res.ok)
      } catch {
        if (!mounted) return
        setOk(false)
      } finally {
        if (mounted) setReady(true)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  if (!ready) return null
  if (!ok) return fallback || null
  return <>{children}</>
}
