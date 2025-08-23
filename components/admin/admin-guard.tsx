"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function AdminGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [ok, setOk] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/admin/session', { cache: 'no-store' })
        if (!mounted) return
        setOk(res.ok)
        if (!res.ok) {
          // Redirect to dedicated admin auth flow
          router.replace('/admin/auth')
        }
      } catch {
        if (!mounted) return
        setOk(false)
        router.replace('/admin/auth')
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
