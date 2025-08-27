"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { ArrowRight, GraduationCap, Sparkles, TrendingUp, Users, BookOpen, Calculator, FileText } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notifyFetch } from "@/lib/notify"

export function HeroSection() {
  const [pastPapersCount, setPastPapersCount] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    const fetchCount = async () => {
      try {
        const response = await notifyFetch("/api/past-papers/count", undefined, { errorMessage: "Failed to load past papers count" })
        if (!response.ok) {
          throw new Error("Failed to fetch count")
        }
        const data = await response.json()
        setPastPapersCount(data.count)
      } catch (error) {
        // notifyFetch already surfaced the error
        // Fallback to a default or hide the count
        setPastPapersCount(1000) // Fallback for display
      }
    }

    fetchCount()
  }, [])

  const quickStats = [
    {
      icon: Users,
      label: "Active Students",
      value: "5,000+",
      color: "text-blue-500"
    },
    {
      icon: FileText,
      label: "Past Papers",
      value: pastPapersCount !== null ? `${(Math.floor(pastPapersCount / 100) * 100).toLocaleString()}+` : "...",
      color: "text-green-500"
    },
    {
      icon: BookOpen,
      label: "Resources",
      value: "300+",
      color: "text-purple-500"
    }
  ]

  const quickActions = [
    {
      title: "Past Papers",
      href: "/past-papers",
      icon: FileText,
      description: "Browse exam papers",
      color: "text-primary"
    },
    {
      title: "GPA Calculator",
      href: "/gpa-calculator",
      icon: Calculator,
      description: "Calculate your GPA",
      color: "text-blue-500"
    },
    {
      title: "Resources",
      href: "/resources",
      icon: BookOpen,
      description: "Study materials",
      color: "text-green-500"
    }
  ]

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-blue-500/5" />

      <div className="app-container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Badge variant="soft" className="mb-6">
                <Sparkles className="h-3 w-3 mr-1" />
                COMSATS University Lahore
              </Badge>
            </div>

            {/* Main heading */}
            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-balance">
                Empowering Your{" "}
                <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Academic Journey
                </span>
              </h1>
            </div>

            {/* Description */}
            <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-xl text-muted-foreground leading-relaxed font-serif max-w-2xl">
                Access past papers, calculate your GPA, explore learning resources, and connect with faculty - 
                all in one comprehensive academic portal designed specifically for COMSATS students.
              </p>
            </div>

            {/* Quick stats */}
            <div className={`transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex flex-wrap gap-6">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                      <div>
                        <div className="text-lg font-bold">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* CTAs */}
            <div className={`transition-all duration-700 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 interactive hover-lift" asChild>
                  <Link href="/resources">
                    Explore Resources
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 interactive hover-lift" asChild>
                  <Link href="/gpa-calculator">
                    <Calculator className="mr-2 h-5 w-5" />
                    Calculate GPA
                  </Link>
                </Button>
              </div>
            </div>

            {/* Quick actions */}
            <div className={`transition-all duration-700 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex flex-wrap gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link key={index} href={action.href}>
                      <Card className="p-4 hover-lift transition-all duration-300 hover:shadow-lg border-0 hover:border-primary/20 cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${action.color} group-hover:scale-110 transition-transform`} />
                          <div>
                            <div className="font-medium text-sm">{action.title}</div>
                            <div className="text-xs text-muted-foreground">{action.description}</div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className={`transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="relative">
              {/* Main visual card */}
              <Card variant="glass" className="p-8 hover-lift transition-all duration-500">
                <div className="text-center space-y-6">
                  <div className="relative w-full max-w-sm mx-auto">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-blue-500/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <GraduationCap className="h-24 w-24 text-primary" />
                      </div>
                      
                      {/* Floating stats card */}
                      <div className="absolute -bottom-6 -right-6 bg-background border rounded-xl p-4 shadow-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          </div>
                          <div>
                            <div className="text-lg font-bold">{pastPapersCount !== null ? `${(Math.floor(pastPapersCount / 100) * 100).toLocaleString()}+` : "..."}</div>
                            <div className="text-xs text-muted-foreground">Past Papers</div>
                          </div>
                        </div>
                      </div>

                      {/* Floating community card */}
                      <div className="absolute -top-4 -left-4 bg-background border rounded-xl p-3 shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1">
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs text-white font-medium">A</div>
                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-medium">B</div>
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs text-white font-medium">C</div>
                          </div>
                          <div className="text-xs text-muted-foreground">5K+ Students</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Join the Community</h3>
                    <p className="text-muted-foreground font-serif">
                      Thousands of students trust CampusAxis for their academic success.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
