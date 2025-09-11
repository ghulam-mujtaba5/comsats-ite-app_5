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
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight } from "lucide-react"
import Image from 'next/image'

interface LoginFormProps {
  onToggleMode: () => void
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()
  const [resetLoading, setResetLoading] = useState(false)
  const { login, isLoading, loginWithGoogle } = useAuth()

  const normalizeError = (raw: string) => {
    const lower = raw.toLowerCase()
    if (lower.includes('email not confirmed') || lower.includes('not confirmed')) {
      return {
        title: 'Email not confirmed',
        description: 'We sent a verification link to your university email. Confirm it, then try signing in again. Need a new link? Click Resend below.',
        code: 'email_not_confirmed'
      }
    }
    if (lower.includes('invalid login credentials') || lower.includes('invalid') || lower.includes('credential')) {
      return {
        title: 'Incorrect email or password',
        description: 'Double‑check your university email format and password. Passwords are case sensitive.',
        code: 'invalid_credentials'
      }
    }
    if (lower.includes('too many') || lower.includes('rate limit')) {
      return {
        title: 'Too many attempts',
        description: 'For your security login is temporarily throttled. Please wait 30–60 seconds before retrying.',
        code: 'rate_limited'
      }
    }
    if (lower.includes('network') || lower.includes('fetch')) {
      return {
        title: 'Network error',
        description: 'Unable to reach authentication service. Check your connection or VPN and retry.',
        code: 'network'
      }
    }
    return { title: 'Login failed', description: raw || 'Unable to sign in. Please try again.', code: 'generic' }
  }

  const [resending, setResending] = useState(false)

  const resendVerification = async () => {
    if (!validateCUIEmail(email)) {
      toast({ title: 'Enter a valid university email first', variant: 'destructive' })
      return
    }
    setResending(true)
    try {
      const response = await fetch('/api/auth/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        toast({ title: 'Could not resend', description: data.error || 'Please try again later.', variant: 'destructive' })
      } else {
        toast({ title: 'Verification email sent', description: 'Check your inbox (and spam folder).'} )
      }
    } catch {
      toast({ title: 'Resend failed', description: 'Network issue – retry shortly.', variant: 'destructive' })
    } finally {
      setResending(false)
    }
  }

  const [lastErrorCode, setLastErrorCode] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // clear previous messages (using toast instead)

    if (!validateCUIEmail(email)) {
      toast({ title: "Invalid university email", description: "Use format fa22-bse-105@cuilahore.edu.pk", variant: "destructive" })
      return
    }

    try {
      await login(email, password)
      setLastErrorCode(null)
      toast({ title: 'Signed in' })
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'Login failed'
      const norm = normalizeError(raw)
      setLastErrorCode(norm.code)
      toast({ title: norm.title, description: norm.description, variant: 'destructive' })
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
    <div className="w-full space-y-8">
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3 tracking-tight">
          Welcome Back
        </h2>
        <p className="text-muted-foreground font-serif leading-relaxed">
          Sign in to your CampusAxis account
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Enhanced Email Input */}
        <div className="space-y-3">
          <Label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            University Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.name@cuilahore.edu.pk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-modern h-12 rounded-xl text-base pl-4"
          />
        </div>

        {/* Enhanced Password Input */}
        <div className="space-y-3">
          <Label htmlFor="password" className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-modern h-12 pr-12 rounded-xl text-base pl-4"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-muted/50 transition-all duration-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>

        {/* Enhanced Submit Button */}
        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-primary-foreground font-semibold rounded-xl transition-all duration-300 hover-lift shadow-lg hover:shadow-xl text-base" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin" />
              Signing In...
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span>Sign In</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          )}
        </Button>

        {/* Or divider */}
        <div className="flex items-center gap-4 my-2">
          <div className="h-px bg-border flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px bg-border flex-1" />
        </div>

        {/* Google Sign In */}
        <Button
          type="button"
          variant="outline"
          onClick={() => loginWithGoogle('/dashboard')}
          className="w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-3"
          disabled={isLoading}
        >
          <Image src="/google.svg" alt="Google icon" width={18} height={18} priority />
          <span>Continue with Google</span>
        </Button>

        {/* Policy hint and explanation */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Use your COMSATS Google account (<span className="font-mono">@cuilahore.edu.pk</span>)
          </p>
          <details className="text-xs text-muted-foreground mx-auto w-fit">
            <summary className="cursor-pointer hover:text-foreground">Why do I see supabase.co?</summary>
            <div className="mt-2 max-w-sm text-left">
              We use Supabase to securely complete Google signDin. Your session comes back to CampusAxis, and we only allow university emails.
            </div>
          </details>
        </div>

        {/* Contextual Actions Under Form */}
        <div className="space-y-3">
          {lastErrorCode === 'email_not_confirmed' && (
            <div className="text-xs rounded-lg p-3 bg-amber-500/10 border border-amber-400/30 text-amber-700 dark:text-amber-300 flex flex-col gap-2">
              <span className="font-semibold">Haven't received the verification email?</span>
              <ul className="list-disc pl-5 space-y-1">
                <li>Check spam / promotions folders.</li>
                <li>It may take up to a minute to arrive.</li>
              </ul>
              <Button onClick={resendVerification} variant="outline" size="sm" disabled={resending} className="w-fit">
                {resending ? 'Sending...' : 'Resend verification email'}
              </Button>
            </div>
          )}
          {lastErrorCode === 'invalid_credentials' && (
            <div className="text-xs rounded-lg p-3 bg-red-500/10 border border-red-400/30 text-red-700 dark:text-red-300">
              Tip: Use your full university email (e.g. fa22-bse-105@cuilahore.edu.pk) and ensure Caps Lock is off.
            </div>
          )}
          {lastErrorCode === 'rate_limited' && (
            <div className="text-xs rounded-lg p-3 bg-orange-500/10 border border-orange-400/30 text-orange-700 dark:text-orange-300">
              Security cooldown active. You can retry shortly; repeated rapid attempts extend the wait.
            </div>
          )}
        </div>

        {/* Enhanced Forgot Password */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={resetLoading}
            className="text-sm text-primary hover:text-primary/80 hover:underline disabled:opacity-50 font-medium transition-colors duration-200"
          >
            {resetLoading ? "Sending reset email..." : "Forgot your password?"}
          </button>
        </div>

        {/* Enhanced Toggle Link */}
        <div className="text-center text-sm p-4 rounded-xl bg-muted/30 border border-border/30">
          <span className="text-muted-foreground">Don't have an account? </span>
          <button 
            type="button" 
            onClick={onToggleMode} 
            className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors duration-200"
          >
            Sign up now
          </button>
        </div>
      </form>
    </div>
  )
}
