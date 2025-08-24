"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { validateCUIEmail } from "@/lib/auth"
import { useAuth } from "@/contexts/auth-context"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface LoginFormProps {
  onToggleMode: () => void
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()
  const [resetLoading, setResetLoading] = useState(false)
  const { login, isLoading } = useAuth()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // clear previous messages (using toast instead)

    if (!validateCUIEmail(email)) {
      toast({ title: "Invalid university email", description: "Use format fa22-bse-105@cuilahore.edu.pk", variant: "destructive" })
      return
    }

    try {
      await login(email, password)
      toast({ title: "Signed in" })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed"
      toast({ title: "Login failed", description: msg, variant: "destructive" })
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      toast({ title: "Enter email first", variant: "destructive" })
      return
    }
    if (!validateCUIEmail(email)) {
      toast({ title: "Invalid university email", description: "Use format fa22-bse-105@cuilahore.edu.pk", variant: "destructive" })
      return
    }

    setResetLoading(true)

    try {
      // Use server-side API to ensure correct URL
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({ title: "Reset failed", description: data.error || 'Failed to send reset email', variant: "destructive" })
      } else {
        toast({ title: "Reset email sent", description: data.message })
      }
    } catch (err) {
      toast({ title: "Failed to send reset email", variant: "destructive" })
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Sign in to your CampusAxis account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Inline alerts removed; using toast notifications instead */}

          <div className="space-y-2">
            <Label htmlFor="email">University Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.name@cuilahore.edu.pk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-2 transform -translate-y-1/2 h-7 w-7 text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetLoading}
              className="text-sm text-primary hover:underline disabled:opacity-50"
            >
              {resetLoading ? "Sending..." : "Forgot your password?"}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <button type="button" onClick={onToggleMode} className="text-primary hover:underline">
              Sign up
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
