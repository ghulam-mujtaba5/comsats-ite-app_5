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
    <div className="w-full space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
        <p className="text-slate-600 dark:text-slate-300">Sign in to your CampusAxis account</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
          {/* Inline alerts removed; using toast notifications instead */}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-200">University Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.name@cuilahore.edu.pk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
            />
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-8 right-2 h-8 w-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetLoading}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline disabled:opacity-50 font-medium"
            >
              {resetLoading ? "Sending..." : "Forgot your password?"}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-slate-600 dark:text-slate-400">Don't have an account? </span>
            <button type="button" onClick={onToggleMode} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline font-medium">
              Sign up
            </button>
          </div>
        </form>
    </div>
  )
}
