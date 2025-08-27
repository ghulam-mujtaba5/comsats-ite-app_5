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
    <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-mesh">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '4s' }} />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-primary/30 rotate-45 animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-20 w-6 h-6 bg-blue-500/30 rounded-full animate-bounce" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-500/30 rotate-45 animate-bounce" style={{ animationDelay: '5s' }} />
      </div>

      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-blue-500/8" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20" />

      <div className="app-container relative z-10 py-24">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Enhanced badge with gradient */}
            <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Badge variant="soft" className="mb-8 px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20 hover:from-primary/20 hover:to-blue-500/20 transition-all duration-300 hover-lift">
                <Sparkles className="h-3 w-3 mr-2 text-primary" />
                COMSATS University Lahore
              </Badge>
            </div>

            {/* Enhanced main heading */}
            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="text-5xl lg:text-8xl font-bold leading-[0.9] text-balance mb-6">
                Empowering Your{" "}
                <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Academic Journey
                </span>
              </h1>
            </div>

            {/* Enhanced description */}
            <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-serif max-w-2xl mb-2">
                Access past papers, calculate your GPA, explore learning resources, and connect with faculty - 
                all in one comprehensive academic portal designed specifically for COMSATS students.
              </p>
              <p className="text-lg text-muted-foreground/80 font-light max-w-xl">
                Join thousands of students who trust CampusAxis for their academic success.
              </p>
            </div>

            {/* Enhanced quick stats */}
            <div className={`transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex flex-wrap gap-8 mb-8">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="flex items-center gap-4 group">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm border border-border/50 group-hover:scale-110 transition-all duration-300 hover-glow">
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                        <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Enhanced CTAs */}
            <div className={`transition-all duration-700 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="text-lg px-10 py-4 rounded-2xl button-modern bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl" asChild>
                  <Link href="/resources">
                    Explore Resources
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-10 py-4 rounded-2xl button-modern glass-card hover:bg-primary/5 border-primary/20" asChild>
                  <Link href="/gpa-calculator">
                    <Calculator className="mr-2 h-5 w-5" />
                    Calculate GPA
                  </Link>
                </Button>
              </div>
            </div>

            {/* Enhanced quick actions */}
            <div className={`transition-all duration-700 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex flex-wrap gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link key={index} href={action.href}>
                      <Card className="p-5 card-modern hover-lift transition-all duration-300 hover:shadow-xl border-0 hover:border-primary/20 cursor-pointer group backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                          <Icon className={`h-5 w-5 ${action.color} group-hover:scale-110 transition-transform`} />
                          <div>
                            <div className="font-semibold text-sm">{action.title}</div>
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

          {/* Enhanced Right Content - Visual */}
          <div className={`transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="relative">
              {/* Enhanced main visual card */}
              <Card variant="glass" className="p-10 card-modern hover-lift transition-all duration-500 relative overflow-hidden group">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-blue-500/5 to-purple-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                
                <div className="text-center space-y-8 relative z-10">
                  <div className="relative w-full max-w-md mx-auto">
                    <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary/30 to-blue-500/30 hover:from-primary/40 hover:to-blue-500/40 transition-all duration-500 group">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <GraduationCap className="h-32 w-32 text-primary group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      
                      {/* Enhanced floating stats card */}
                      <div className="absolute -bottom-8 -right-8 card-modern p-5 shadow-2xl hover:shadow-3xl transition-all duration-300 hover-lift backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <div className="text-lg font-bold">98%</div>
                            <div className="text-xs text-muted-foreground">Success Rate</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Additional floating element */}
                      <div className="absolute -top-6 -left-6 card-modern p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover-lift backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="text-sm font-bold">5K+</div>
                            <div className="text-xs text-muted-foreground">Students</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced feature highlights */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent hover:from-primary/20 transition-all duration-300">
                      <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-sm font-semibold">Past Papers</div>
                      <div className="text-xs text-muted-foreground">1000+ Available</div>
                    </div>
                    <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent hover:from-blue-500/20 transition-all duration-300">
                      <Calculator className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-sm font-semibold">GPA Tools</div>
                      <div className="text-xs text-muted-foreground">Advanced Calculators</div>
                    </div>
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
