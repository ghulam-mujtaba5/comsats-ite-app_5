"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function AdminAuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams?.get('next') || '/admin'
  const { isAuthenticated, isLoading } = useAuth()
  const [elevating, setElevating] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/admin/session', { cache: 'no-store' })
        if (!mounted) return
        if (res.ok) {
          router.replace(next)
        }
      } catch {}
    })()
    return () => { mounted = false }
  }, [router, next])

  const elevate = async () => {
    setElevating(true)
    try {
      const res = await fetch('/api/admin/session/elevate', { method: 'POST' })
      if (res.ok) {
        router.replace(next)
        return
      }
      if (res.status === 401) {
        router.replace(`/auth?next=/admin/auth`)
        return
      }
    } finally {
      setElevating(false)
    }
  }

  // While auth state is loading, render nothing to avoid flicker
  if (isLoading) return null

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 border rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold">Admin Sign-in</h1>
        {!isAuthenticated ? (
          <>
            <p className="text-sm text-muted-foreground">
              You need to sign in first with an admin-enabled account.
            </p>
            <Button asChild className="w-full">
              <Link href={`/auth?next=/admin/auth`}>Sign in</Link>
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              You're signed in. Continue to elevate admin access.
            </p>
            <Button onClick={elevate} disabled={elevating} className="w-full">
              {elevating ? 'Checking…' : 'Continue as Admin'}
            </Button>
          </>
        )}
        <p className="text-xs text-muted-foreground">
          Admin access is restricted to users in the admin directory.
        </p>
      </div>
    </div>
  )
}
