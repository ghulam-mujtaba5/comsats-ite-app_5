"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Eye, EyeOff, Shield, CheckCircle, Lock, Sparkles } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Handle the auth callback from the URL hash
    const handleAuthCallback = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      const type = hashParams.get('type')

      if (type === 'recovery' && accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (error) {
          setError('Invalid or expired reset link')
        }
      }
    }

    handleAuthCallback()
  }, [supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage("Password updated successfully! Redirecting...")
        setTimeout(() => {
          router.push("/auth")
        }, 2000)
      }
    } catch (err: any) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-mesh overflow-hidden relative flex items-center justify-center">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse float" />
  <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse float animate-delay-2000" />
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse float animate-delay-4000" />
        
        {/* Floating geometric shapes */}
  <div className="absolute top-20 right-20 w-10 h-10 bg-primary/30 rotate-45 animate-bounce animate-delay-1000" />
  <div className="absolute bottom-32 left-20 w-10 h-10 bg-blue-500/30 rounded-full animate-bounce animate-delay-3000" />
  <div className="absolute top-1/3 right-1/3 w-10 h-10 bg-purple-500/30 rotate-45 animate-bounce animate-delay-5000" />
      </div>

      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-blue-500/8" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20" />

      <div className="w-full max-w-md p-6 relative z-10">
        {/* Enhanced Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/auth")}
            className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white px-4 py-3 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 hover-lift shadow-lg"
          >
            <ArrowLeft className="h-10 w-10" />
            <span className="font-medium">Back to Login</span>
          </Button>
        </div>

        {/* Enhanced Main Card */}
        <Card className="card-modern border-0 backdrop-blur-sm shadow-10xl hover:shadow-10xl transition-all duration-500 rounded-3xl">
          <CardHeader className="p-8 pb-6 text-center">
            {/* Enhanced Security Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/20 to-blue-600/20 hover:from-primary/30 hover:to-blue-600/30 transition-all duration-300 shadow-xl border border-primary/30 backdrop-blur-sm hover-lift">
                <Shield className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <CardTitle className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Reset Your{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Password
              </span>
            </CardTitle>
            <CardDescription className="text-base text-slate-700 dark:text-slate-300 font-serif leading-relaxed">
              Enter your new password below to secure your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Enhanced Error Alert */}
              {error && (
                <Alert variant="destructive" className="border-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/20 mr-3">
                    <Shield className="h-10 w-10 text-red-600" />
                  </div>
                  <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
              )}
              
              {/* Enhanced Success Alert */}
              {message && (
                <Alert className="border-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-xl">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 mr-3">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <AlertDescription className="font-medium text-green-700">{message}</AlertDescription>
                </Alert>
              )}

              {/* Enhanced Password Input */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="h-10 w-10 text-primary" />
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                    className="input-modern h-12 pr-12 rounded-xl text-base"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg hover:bg-muted/50 transition-all duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-10 w-10 text-muted-foreground" />
                    ) : (
                      <Eye className="h-10 w-10 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Enhanced Confirm Password Input */}
              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="h-10 w-10 text-primary" />
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                    className="input-modern h-12 pr-12 rounded-xl text-base"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg hover:bg-muted/50 transition-all duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-10 w-10 text-muted-foreground" />
                    ) : (
                      <Eye className="h-10 w-10 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Enhanced Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 rounded-xl transition-all duration-300 hover-lift shadow-lg hover:shadow-xl text-base font-semibold" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border-2 border-slate-200 dark:border-slate-700 border-t-white rounded-full animate-spin" />
                    Updating...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Shield className="h-10 w-10" />
                    Update Password
                  </div>
                )}
              </Button>
            </form>
            
            {/* Enhanced Security Notice */}
            <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-blue-500/5 border border-primary/20">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <span className="font-medium">
                  Your password will be encrypted and stored securely
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
