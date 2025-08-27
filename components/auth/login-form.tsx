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
