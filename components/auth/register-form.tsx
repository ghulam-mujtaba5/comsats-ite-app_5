"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// Replaced inline alerts with toasts
import { useToast } from "@/hooks/use-toast"
import { validateCUIEmail } from "@/lib/auth"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { Eye, EyeOff, Loader2, CheckCircle, User, Mail, Lock, UserPlus } from "lucide-react"

interface RegisterFormProps {
  onToggleMode: () => void
}

export function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const { toast } = useToast()
  const { register, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // clear previous inline errors (now using toast)

    if (password !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" })
      return
    }

    if (!validateCUIEmail(email)) {
      toast({
        title: "Invalid university email",
        description: "Use format fa22-bse-105@cuilahore.edu.pk",
        variant: "destructive",
      })
      return
    }

    try {
      await register(email, password, name)
      setShowSuccessDialog(true)
      toast({ title: "Registration successful", description: "Check your email for verification." })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed"
      toast({ title: "Registration failed", description: msg, variant: "destructive" })
    }
  }

  return (
    <>
      <div className="w-full space-y-8">
        <div className="text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
            Create Account
          </h2>
          <p className="text-slate-700 dark:text-slate-300 font-serif leading-relaxed">
            Join the CampusAxis community
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Enhanced Name Input */}
          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-modern h-12 rounded-xl text-base pl-4"
            />
          </div>

          {/* Enhanced Email Input */}
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
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
            <Label htmlFor="password" className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
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

          {/* Enhanced Confirm Password Input */}
          <div className="space-y-3">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input-modern h-12 pr-12 rounded-xl text-base pl-4"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-muted/50 transition-all duration-200"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
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
                Creating Account...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <UserPlus className="h-5 w-5" />
                Create Account
              </div>
            )}
          </Button>

          {/* Enhanced Toggle Link */}
          <div className="text-center text-sm p-4 rounded-xl bg-muted/30 border border-border/30">
            <span className="text-muted-foreground">Already have an account? </span>
            <button 
              type="button" 
              onClick={onToggleMode} 
              className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors duration-200"
            >
              Sign in now
            </button>
          </div>
        </form>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="card-modern border-0 backdrop-blur-sm rounded-3xl">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-200/30">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Registration Successful!
            </DialogTitle>
            <DialogDescription className="text-base text-slate-700 dark:text-slate-300 font-serif leading-relaxed">
              Your account has been created successfully. Please check your university email for a verification link to complete the
              registration process.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-6">
            <Button
              className="w-full h-12 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 rounded-xl transition-all duration-300 hover-lift shadow-lg hover:shadow-xl text-base font-semibold"
              onClick={() => {
                setShowSuccessDialog(false)
                onToggleMode()
              }}
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5" />
                Proceed to Sign In
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
