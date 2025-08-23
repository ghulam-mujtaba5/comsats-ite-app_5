"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function AdminLoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dedicated admin auth flow
    router.replace('/admin/auth')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4 border rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold">Redirecting to Login…</h1>
        <p className="text-sm text-muted-foreground">Taking you to the secure sign-in page.</p>
        <Button onClick={() => router.replace('/admin/auth')} className="w-full">
          Go to Login
        </Button>
      </div>
    </div>
  )
}
