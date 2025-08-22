"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/admin/session', { cache: 'no-store' })
        if (!mounted) return
        if (res.ok) router.replace('/admin')
      } catch {}
    })()
    return () => { mounted = false }
  }, [router])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    fetch('/api/admin/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }).then(async (res) => {
      if (res.ok) {
        router.replace('/admin')
      } else {
        const j = await res.json().catch(() => ({} as any))
        setError(j?.error || 'Invalid admin credentials')
      }
    }).catch(() => setError('Network error'))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 border rounded-lg p-6">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        {error && <p className="text-sm text-blue-600">{error}</p>}
        <div className="space-y-2">
          <Label htmlFor="username">Username (email)</Label>
          <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
    </div>
  )
}
