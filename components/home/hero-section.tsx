"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { ArrowRight, GraduationCap, Sparkles, TrendingUp, Users, BookOpen, Calculator, FileText, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notifyFetch } from "@/lib/notify"

export function HeroSection() {
  const [stats, setStats] = useState<{
    pastPapersCount: number
    reviewsCount: number
    facultyCount: number
    resourcesCount: number
    eventsCount: number
    activeStudents: number
    departmentCount: number
    avgRating: number
    communityPosts: number
    newsItems: number
  } | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsVisible(true)
    
    const fetchStats = async () => {
      try {
        const response = await notifyFetch("/api/stats", undefined, { errorMessage: "Failed to load platform stats" })
        if (!response.ok) {
          throw new Error("Failed to fetch stats")
        }
        const data = await response.json()
        setStats(data)
      } catch (error) {
        // notifyFetch already surfaced the error
        // Honest fallback data matching actual seeded database content
        setStats({
          pastPapersCount: 0, // No past papers seeded yet
          reviewsCount: 2, // 2 reviews from seed.ts
          facultyCount: 2, // 2 faculty members from seed.ts
          resourcesCount: 1, // 1 support resource from seed-complete.ts
          eventsCount: 1, // 1 AI Workshop from seed-complete.ts
          activeStudents: 2, // 2 test users from seeding
          departmentCount: 2, // CS and SE departments
          avgRating: 4.5, // Average of 5 and 4 from seeded reviews
          communityPosts: 2, // 2 community posts from seed.ts
          newsItems: 2 // From seed-complete.ts homepage news
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const quickStats = [
    {
      icon: Users,
      label: "Active Students",
      value: stats ? (stats.activeStudents > 100 ? `${(Math.floor(stats.activeStudents / 100) * 100).toLocaleString()}+` : `${stats.activeStudents}`) : "...",
      color: "text-blue-500"
    },
    {
      icon: FileText,
      label: "Past Papers",
      value: stats ? (stats.pastPapersCount > 0 ? `${stats.pastPapersCount}+` : "Coming Soon") : "...",
      color: "text-green-500"
    },
    {
      icon: BookOpen,
      label: "Resources",
      value: stats ? `${stats.resourcesCount}+` : "...",
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
            {/* Logo showcase */}
            <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                  <Image 
                    src="/logo-square.svg" 
                    alt="CampusAxis Logo" 
                    width={100} 
                    height={100} 
                    className="rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500 relative z-10"
                    priority
                  />
                </div>
                <div>
                  <Badge variant="soft" className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20 hover:from-primary/20 hover:to-blue-500/20 transition-all duration-300 hover-lift">
                    <Sparkles className="h-3 w-3 mr-2 text-primary" />
                    CampusAxis
                  </Badge>
                </div>
              </div>
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
                Access past papers, calculate your GPA, explore learning resources, and read faculty reviews - 
                all in one comprehensive academic portal designed specifically for COMSATS students.
              </p>
              <p className="text-lg text-muted-foreground/80 font-light max-w-xl">
                A growing platform for COMSATS students to share resources and read faculty reviews.
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

            {/* About CampusAxis CTA replaces Explore Resources */}
            <div className={`transition-all duration-700 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="text-lg px-10 py-4 rounded-2xl button-modern bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl" asChild>
                  <Link href="/about">
                    About CampusAxis
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

          {/* Enhanced Right Content - Perfect Visual Card */}
          <div className={`transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="relative">
              {/* Main Perfect Card */}
              <Card className="relative p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/30 dark:border-slate-700/40 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden group">
                {/* Animated Background Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }} />
                
                <div className="relative z-10 space-y-8">
                  {/* Header Section */}
                  <div className="text-center space-y-4">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                      <div className="relative p-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl">
                        <GraduationCap className="h-16 w-16 text-white group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">CampusAxis Platform</h3>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">Real-time Academic Analytics</p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Community Engagement Card */}
                    <div className="relative group/stat p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/30 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="text-xs font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded-full">Active</span>
                      </div>
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300 mb-1">
                        {isLoading ? '...' : `${stats?.communityPosts || 2}`}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium">Community Posts</div>
                    </div>

                    {/* Faculty Rating Card */}
                    <div className="relative group/stat p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200/50 dark:border-yellow-700/30 hover:from-yellow-100 hover:to-orange-100 dark:hover:from-yellow-900/30 dark:hover:to-orange-900/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <Users className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        <div className="flex text-yellow-500">
                          {[1,2,3,4,5].map((star) => (
                            <span key={star} className={`text-xs ${star <= Math.floor(stats?.avgRating || 4.3) ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mb-1">
                        {isLoading ? '...' : `${stats?.avgRating || 4.3}`}
                      </div>
                      <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Avg Rating</div>
                    </div>

                    {/* Active Events Card */}
                    <div className="relative group/stat p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200/50 dark:border-purple-700/30 hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 px-2 py-1 rounded-full">Active</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-1">
                        {isLoading ? '...' : `${stats?.eventsCount || 1}`}
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Live Events</div>
                    </div>

                    {/* Faculty Count Card */}
                    <div className="relative group/stat p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-700/30 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded-full">{stats?.departmentCount || 2} Depts</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                        {isLoading ? '...' : `${stats?.facultyCount || 2}`}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Faculty Members</div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-center mb-4">Quick Actions</div>
                    <div className="grid grid-cols-2 gap-3">
                      <Link href="/past-papers" className="group/action">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-primary/10 to-blue-500/10 hover:from-primary/20 hover:to-blue-500/20 border border-primary/20 transition-all duration-300 hover:scale-105">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary group-hover/action:scale-110 transition-transform" />
                            <div>
                              <div className="text-sm font-semibold text-slate-900 dark:text-white">Papers</div>
                              <div className="text-xs text-slate-600 dark:text-slate-400">{isLoading ? '...' : (stats?.pastPapersCount === 0 ? 'Soon' : `${stats?.pastPapersCount}+`)}</div>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <Link href="/gpa-calculator" className="group/action">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border border-green-500/20 transition-all duration-300 hover:scale-105">
                          <div className="flex items-center gap-2">
                            <Calculator className="h-4 w-4 text-green-600 group-hover/action:scale-110 transition-transform" />
                            <div>
                              <div className="text-sm font-semibold text-slate-900 dark:text-white">GPA Calc</div>
                              <div className="text-xs text-slate-600 dark:text-slate-400">Advanced</div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Trust Indicator */}
                  <div className="text-center p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 to-gray-800 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">Live</span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">•</span>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Trusted by {isLoading ? '...' : `${stats?.activeStudents || 2}`} students</span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Real-time data from COMSATS Lahore</div>
                  </div>
                </div>

                {/* Floating Accent Elements */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s' }} />
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1.5s' }} />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
