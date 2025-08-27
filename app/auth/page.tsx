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
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '4s' }} />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-6 h-6 bg-blue-500/40 rotate-45 animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-20 w-8 h-8 bg-indigo-500/40 rounded-full animate-bounce" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-purple-500/40 rotate-45 animate-bounce" style={{ animationDelay: '5s' }} />
      </div>

      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.8)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />

      {/* Left side - Enhanced Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Enhanced back button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-3 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 px-4 py-3 rounded-2xl hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/30"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Button>
          </div>

          {/* Enhanced logo and title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 hover:from-blue-500/30 hover:to-indigo-600/30 transition-all duration-300 shadow-xl border border-white/30 dark:border-slate-700/30 backdrop-blur-sm">
                <GraduationCap className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Welcome to <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">CampusAxis</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg font-medium leading-relaxed max-w-md mx-auto">
              Your gateway to academic excellence at COMSATS University Lahore
            </p>
          </div>

          {/* Enhanced auth forms */}
          <div className="mb-8">
            <Card className="p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl">
              <div className="mb-6 text-center">
                <div className="flex justify-center mb-6">
                  <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                    <button
                      onClick={() => setIsLogin(true)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        isLogin 
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-lg' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setIsLogin(false)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        !isLogin 
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-lg' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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

          {/* Enhanced trust indicators */}
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="font-medium text-slate-700 dark:text-slate-300">Secure</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-slate-700 dark:text-slate-300">5,000+ Students</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="font-medium text-slate-700 dark:text-slate-300">Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Enhanced Features showcase (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 relative z-10">
        <div className="max-w-lg space-y-8">
          {/* Enhanced header */}
          <div className="text-center">
            <Badge className="mb-6 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700/30 text-blue-700 dark:text-blue-300">
              <Sparkles className="h-4 w-4 mr-2" />
              Academic Portal
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              Empowering Your Academic Journey
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Join thousands of COMSATS students who trust CampusAxis for their academic needs.
            </p>
          </div>

          {/* Enhanced features */}
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card 
                  key={index} 
                  className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/30 dark:border-slate-700/30 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl group hover:-translate-y-1"
                >
                  <div className="flex items-start gap-5">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-200/30 dark:border-blue-700/30 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Enhanced call to action */}
          <div className="text-center">
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-xl border border-white/30 dark:border-slate-700/30 shadow-xl rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl flex items-center justify-center border border-blue-200/30 dark:border-blue-700/30">
                <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Ready to get started?</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Join the CampusAxis community and unlock your academic potential.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
