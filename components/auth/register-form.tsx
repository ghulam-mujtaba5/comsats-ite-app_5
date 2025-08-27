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
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react"

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
      <div className="w-full space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h2>
          <p className="text-slate-600 dark:text-slate-300">Join the CampusAxis community</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Inline alert removed; using toast notifications instead */}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-200">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
            />
          </div>

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
              placeholder="At least 6 characters"
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

          <div className="space-y-2 relative">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 dark:text-slate-200">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-12 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-8 right-2 h-8 w-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>

          <div className="text-center text-sm">
            <span className="text-slate-600 dark:text-slate-400">Already have an account? </span>
            <button type="button" onClick={onToggleMode} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline font-medium">
              Sign in
            </button>
          </div>
        </form>
      </div>

<Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Registration Successful
            </DialogTitle>
            <DialogDescription className="pt-2">
              Your account has been created. Please check your university email for a verification link to complete the
              registration.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <Button
              className="w-full"
              onClick={() => {
                setShowSuccessDialog(false)
                onToggleMode()
              }}
            >
              Proceed to Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
