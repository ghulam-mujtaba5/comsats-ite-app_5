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
import Image from "next/image"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const next = searchParams?.get('next') || '/'
      // Basic safety: only allow same-origin relative paths
      const safeNext = next.startsWith('/') ? next : '/'
      router.replace(safeNext)
    }
  }, [isAuthenticated, isLoading, router, searchParams])

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
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-blue-500/5" />

      {/* Left side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Back button */}
          <div className="mb-6 animate-fade-in">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground interactive hover-lift"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          {/* Logo and title */}
          <div className="text-center mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-balance">
              Welcome to <span className="text-primary">CampusAxis</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-serif">
              Your gateway to academic excellence at COMSATS University Lahore
            </p>
          </div>

          {/* Auth forms */}
          <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
            {isLogin ? (
              <LoginForm onToggleMode={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onToggleMode={() => setIsLogin(true)} />
            )}
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground animate-slide-up" style={{ animationDelay: '600ms' }}>
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Secure
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              5,000+ Students
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Free to Use
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Features showcase (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 relative z-10">
        <div className="max-w-lg space-y-8">
          {/* Header */}
          <div className="text-center animate-slide-up" style={{ animationDelay: '800ms' }}>
            <Badge variant="soft" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Academic Portal
            </Badge>
            <h2 className="text-4xl font-bold text-balance mb-4">
              Empowering Your Academic Journey
            </h2>
            <p className="text-lg text-muted-foreground font-serif">
              Join thousands of COMSATS students who trust CampusAxis for their academic needs.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card 
                  key={index} 
                  variant="glass" 
                  className="p-6 hover-lift transition-all duration-500 animate-slide-up"
                  style={{ animationDelay: `${1000 + (index * 200)}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground font-serif">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Image placeholder */}
          <div className="text-center animate-slide-up" style={{ animationDelay: '1600ms' }}>
            <div className="relative w-full max-w-sm mx-auto">
              <Card variant="glass" className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Ready to get started?</h4>
                <p className="text-sm text-muted-foreground">
                  Join the CampusAxis community and unlock your academic potential.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
