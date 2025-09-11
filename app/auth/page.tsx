"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, GraduationCap, Sparkles, Shield, Users } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const next = searchParams?.get('next') || '/'
      // Basic safety: only allow same-origin relative paths
      const safeNext = next.startsWith('/') ? next : '/'
      router.replace(safeNext)
    }
  }, [isAuthenticated, isLoading, router, searchParams])

  // Surface OAuth errors (e.g., invalid domain)
  useEffect(() => {
    const error = searchParams?.get('error')
    if (error === 'invalid_domain') {
      toast({
        title: 'Use your university Google account',
        description: 'Please sign in with your COMSATS email (e.g., fa22-bse-105@cuilahore.edu.pk).',
        variant: 'destructive',
      })
    } else if (error === 'callback_error') {
      toast({ title: 'Sign-in failed', description: 'Could not complete Google sign-in. Please try again.' , variant: 'destructive'})
    }
  }, [searchParams, toast])

  const features = [
    {
      icon: GraduationCap,
      title: "Academic Excellence",
      description: "Access past papers, calculate GPA, and find study resources"
    },
    {
      icon: Users,
      title: "Community Connection",
      description: "Connect with fellow students and share knowledge"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your data is protected with industry-standard security"
    }
  ]

  return (
    <div className="min-h-screen bg-mesh overflow-hidden relative">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '4s' }} />
        
        {/* Enhanced floating geometric shapes */}
        <div className="absolute top-20 right-20 w-6 h-6 bg-primary/40 rotate-45 animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-20 w-8 h-8 bg-blue-500/40 rounded-full animate-bounce" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-purple-500/40 rotate-45 animate-bounce" style={{ animationDelay: '5s' }} />
        <div className="absolute top-2/3 left-1/4 w-5 h-5 bg-green-500/40 rounded-full animate-bounce" style={{ animationDelay: '7s' }} />
      </div>

      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-blue-500/8" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20" />

      <div className="flex min-h-screen relative z-10">

        {/* Enhanced Left side - Auth Forms */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Enhanced back button */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground px-4 py-3 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 hover-lift shadow-lg"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Home</span>
              </Button>
            </div>

            {/* Enhanced Logo and Title */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/20 to-blue-600/20 hover:from-primary/30 hover:to-blue-600/30 transition-all duration-300 shadow-xl border border-primary/30 backdrop-blur-sm hover-lift">
                  <GraduationCap className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight leading-[0.9]">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent block">
                  CampusAxis
                </span>
              </h1>
              <p className="text-muted-foreground text-lg font-serif leading-relaxed max-w-md mx-auto">
                Your gateway to academic excellence at COMSATS University Lahore
              </p>
            </div>

            {/* Enhanced Auth Forms */}
            <div className="mb-8">
              <Card className="card-modern border-0 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-500 p-8 rounded-3xl">
                <div className="mb-8 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="inline-flex p-2 bg-muted/30 backdrop-blur-sm rounded-2xl border border-border/30">
                      <button
                        onClick={() => setIsLogin(true)}
                        className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                          isLogin 
                            ? 'bg-gradient-to-r from-primary to-blue-600 text-primary-foreground shadow-lg hover:shadow-xl hover-lift' 
                            : 'text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl'
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => setIsLogin(false)}
                        className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                          !isLogin 
                            ? 'bg-gradient-to-r from-primary to-blue-600 text-primary-foreground shadow-lg hover:shadow-xl hover-lift' 
                            : 'text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl'
                        }`}
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </div>
                {isLogin ? (
                  <LoginForm onToggleMode={() => setIsLogin(false)} />
                ) : (
                  <RegisterForm onToggleMode={() => setIsLogin(true)} />
                )}
              </Card>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl card-modern border-0 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                <div className="p-1 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                <span className="font-medium text-foreground">Secure</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl card-modern border-0 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                <div className="p-1 rounded-lg bg-gradient-to-br from-primary/20 to-blue-500/20">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">5,000+ Students</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl card-modern border-0 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                <div className="p-1 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <span className="font-medium text-foreground">Free</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Right side - Features showcase (hidden on mobile) */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-8">
          <div className="max-w-lg space-y-8">
            {/* Enhanced Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary mb-6 hover:from-primary/20 hover:to-blue-500/20 transition-all duration-300 hover-lift">
                <Sparkles className="h-4 w-4" />
                Academic Portal
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight leading-[0.9]">
                Empowering Your{" "}
                <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent block">
                  Academic Journey
                </span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed font-serif">
                Join thousands of COMSATS students who trust CampusAxis for their academic needs.
              </p>
            </div>

            {/* Enhanced Features */}
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card 
                    key={index} 
                    className="card-modern border-0 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 p-6 rounded-2xl group hover-lift"
                  >
                    <div className="flex items-start gap-5">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-600/20 border border-primary/30 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed font-serif">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Enhanced Call to Action */}
            <Card className="card-modern border-0 backdrop-blur-sm shadow-xl p-8 rounded-2xl text-center hover-lift transition-all duration-500">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-2xl flex items-center justify-center border border-primary/30">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-bold text-xl mb-3 text-foreground">Ready to get started?</h4>
              <p className="text-muted-foreground leading-relaxed font-serif">
                Join the CampusAxis community and unlock your academic potential.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
