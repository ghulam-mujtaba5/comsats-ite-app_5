"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, GraduationCap, Sparkles, TrendingUp, Users, BookOpen, Calculator, FileText, Calendar, Star, Award, Zap, Rocket, Target, Flame } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notifyFetch } from "@/lib/notify"
import { FadeInScroll, AnimatedCard, CountUp, Pulse, AnimatedButton, FloatingButton, Bounce, Shimmer } from "@/components/animations/enhanced"
import { useCelebrationAnimations } from "@/hooks/use-celebration-animations"
import { useAnimation } from "@/contexts/animation-context"
import { useMotivationalFeedback } from "@/components/motivational"

export function EnhancedHero() {
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
  const [activeFeature, setActiveFeature] = useState(0)
  const { triggerConfetti, triggerBalloons, triggerFlickeringLights } = useCelebrationAnimations()
  const { isAnimationEnabled } = useAnimation()
  const { triggerFeedback } = useMotivationalFeedback()

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

  // Rotate featured stats
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const quickStats = [
    {
      icon: Users,
      label: "Active Students",
      value: stats ? (stats.activeStudents > 100 ? `${(Math.floor(stats.activeStudents / 100) * 100).toLocaleString()}+` : `${stats.activeStudents}`) : "...",
      color: "text-primary",
      description: "Students using CampusAxis daily"
    },
    {
      icon: FileText,
      label: "Past Papers",
      value: stats ? (stats.pastPapersCount > 0 ? `${stats.pastPapersCount}+` : "Coming Soon") : "...",
      color: "text-primary",
      description: "Exam papers to help you succeed"
    },
    {
      icon: BookOpen,
      label: "Resources",
      value: stats ? `${stats.resourcesCount}+` : "...",
      color: "text-primary",
      description: "Study materials and guides"
    }
  ]

  const quickActions = [
    {
      title: "Past Papers",
      href: "/past-papers",
      icon: FileText,
      description: "Browse exam papers",
      color: "text-primary",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "GPA Calculator",
      href: "/gpa-calculator",
      icon: Calculator,
      description: "Calculate your GPA",
      color: "text-primary",
      bgColor: "bg-indigo-500/10"
    },
    {
      title: "Faculty Reviews",
      href: "/faculty",
      icon: Users,
      description: "Read faculty reviews",
      color: "text-primary",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Resources",
      href: "/resources",
      icon: BookOpen,
      description: "Study materials",
      color: "text-primary",
      bgColor: "bg-pink-500/10"
    }
  ]

  const handleGetStarted = () => {
    if (isAnimationEnabled) {
      triggerConfetti({
        message: "Welcome to CampusAxis!",
        duration: 3000,
        particleCount: 150
      })
      
      // Trigger motivational feedback
      triggerFeedback({
        type: 'achievement_unlocked',
        message: "Welcome to CampusAxis!"
      })
    }
  }

  const handleExploreFeatures = () => {
    if (isAnimationEnabled) {
      triggerBalloons({
        message: "Discover amazing features!",
        duration: 4000,
        balloonCount: 10
      })
      
      // Trigger motivational feedback
      triggerFeedback({
        type: 'challenge_completed',
        message: "Exploring new features!"
      })
    }
  }

  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/20 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/20 glass-hero glass-border-glow glass-depth">
      {/* Enhanced background elements with glassmorphism */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full blur-3xl animate-pulse glass-depth" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-secondary/10 to-amber-500/10 rounded-full blur-3xl animate-pulse glass-depth" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl glass-depth" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="app-container relative z-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Logo showcase with enhanced animations */}
            <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-6 mb-8">
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-500 glass-depth" />
                  <Image 
                    src="/logo-square.svg" 
                    alt="CampusAxis Logo" 
                    width={80} 
                    height={80} 
                    className="rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-500 relative z-10 glass-card glass-border-light glass-hover"
                    priority
                  />
                  <motion.div 
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </motion.div>
                </motion.div>
                <div>
                  <Badge variant="soft" className="px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg glass-button glass-border-light glass-depth">
                    <Sparkles className="h-3 w-3 mr-1.5" />
                    CampusAxis
                  </Badge>
                </div>
              </div>
            </div>

            {/* Enhanced main heading with gradient text */}
            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-balance mb-6 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                Empowering Your{" "}
                <motion.span 
                  className="text-primary inline-block"
                  animate={{ 
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Academic Journey
                </motion.span>
              </h1>
            </div>

            {/* Enhanced description with typing effect simulation */}
            <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-4">
                Access past papers, calculate your GPA, explore learning resources, and read faculty reviews - 
                all in one comprehensive academic portal designed specifically for COMSATS students.
              </p>
              <p className="text-base text-muted-foreground/80 max-w-xl">
                A growing platform for COMSATS students to share resources and read faculty reviews.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="p-3 rounded-xl glass-card glass-border-subtle glass-hover glass-depth text-center"
                    data-testid="stat-item"
                  >
                    <Icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-lg font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </motion.div>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href={action.href} onClick={handleGetStarted}>
                      <Card className="p-4 border bg-card/80 backdrop-blur-sm cursor-pointer hover:shadow-lg transition-all duration-300 glass-card glass-border-subtle glass-hover glass-depth" data-testid="quick-action">
                        <div className={`${action.bgColor} p-2 rounded-lg w-fit mb-3`}>
                          <Icon className={`h-5 w-5 ${action.color}`} />
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </Card>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Enhanced CTA buttons with celebration animations */}
            <div className={`transition-all duration-700 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="text-base px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 glass-button glass-border-light glass-hover glass-depth relative overflow-hidden group"
                  onClick={handleGetStarted}
                  asChild
                >
                  <Link href="/auth" className="flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    <motion.div 
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base px-8 py-3 rounded-xl border-2 hover:shadow-md transition-all duration-300 glass-button glass-border-light glass-hover glass-depth relative"
                  onClick={handleExploreFeatures}
                  asChild
                >
                  <Link href="/about" className="flex items-center">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Explore Features
                  </Link>
                </Button>
              </div>
            </div>

            {/* Enhanced quick actions with hover effects */}
            <div className={`transition-all duration-700 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex flex-wrap gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5, scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href={action.href}>
                        <Card className="p-4 hover:shadow-md transition-all duration-300 border cursor-pointer group bg-card/80 backdrop-blur-sm glass-card glass-border-subtle glass-hover glass-depth">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform`}>
                              <Icon className={`h-4 w-4 ${action.color}`} />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{action.title}</div>
                              <div className="text-xs text-muted-foreground">{action.description}</div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Enhanced Right Content - Stats Card */}
          <div className={`transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="relative">
              {/* Main Stats Card with enhanced glass effect */}
              <Card className="relative p-6 bg-card/80 border rounded-2xl shadow-xl backdrop-blur-sm glass-card-premium glass-border-glow glass-depth glass-gradient">
                <div className="space-y-6">
                  {/* Header Section with animated icon */}
                  <div className="text-center space-y-3">
                    <motion.div 
                      className="relative inline-block"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <div className="relative p-4 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-xl">
                        <GraduationCap className="h-10 w-10 text-primary" />
                      </div>
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">CampusAxis Platform</h3>
                      <p className="text-muted-foreground">Real-time Academic Analytics</p>
                    </div>
                  </div>

                  {/* Stats Grid with interactive cards */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Community Engagement Card */}
                    <AnimatedCard 
                      enableHover={true} 
                      className="p-3 rounded-xl bg-muted/50 border glass-card glass-border-subtle glass-hover glass-depth relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">Active</span>
                      </div>
                      <div className="text-lg font-bold text-foreground mb-1">
                        {isLoading ? '...' : <CountUp end={stats?.communityPosts || 2} duration={1500} />}
                      </div>
                      <div className="text-xs text-muted-foreground">Community Posts</div>
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0"
                        whileHover={{ opacity: 1 }}
                      />
                    </AnimatedCard>

                    {/* Faculty Rating Card */}
                    <AnimatedCard 
                      enableHover={true} 
                      className="p-3 rounded-xl bg-muted/50 border glass-card glass-border-subtle glass-hover glass-depth"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="ml-1 text-xs font-medium text-foreground">{isLoading ? '...' : `${stats?.avgRating || 4.3}`}</span>
                        </div>
                        <div className="flex text-yellow-500">
                          {[1,2,3,4,5].map((star) => (
                            <span key={star} className={`text-xs ${star <= Math.floor(stats?.avgRating || 4.3) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}>★</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-foreground mb-1">
                        {isLoading ? '...' : `${stats?.avgRating || 4.3}`}
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Rating</div>
                    </AnimatedCard>

                    {/* Active Events Card */}
                    <AnimatedCard 
                      enableHover={true} 
                      className="p-3 rounded-xl bg-muted/50 border glass-card glass-border-subtle glass-hover glass-depth"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">Active</span>
                      </div>
                      <div className="text-lg font-bold text-foreground mb-1">
                        {isLoading ? '...' : <CountUp end={stats?.eventsCount || 1} duration={1500} />}
                      </div>
                      <div className="text-xs text-muted-foreground">Live Events</div>
                    </AnimatedCard>

                    {/* Faculty Count Card */}
                    <AnimatedCard 
                      enableHover={true} 
                      className="p-3 rounded-xl bg-muted/50 border glass-card glass-border-subtle glass-hover glass-depth"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">{stats?.departmentCount || 2} Depts</span>
                      </div>
                      <div className="text-lg font-bold text-foreground mb-1">
                        {isLoading ? '...' : <CountUp end={stats?.facultyCount || 2} duration={1500} />}
                      </div>
                      <div className="text-xs text-muted-foreground">Faculty Members</div>
                    </AnimatedCard>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-foreground text-center mb-3">Quick Actions</div>
                    <div className="grid grid-cols-2 gap-3">
                      <Link href="/past-papers" className="group/action">
                        <div className="p-2.5 rounded-lg bg-muted/50 hover:bg-muted/70 border transition-all duration-300 glass-card glass-border-subtle glass-hover glass-depth relative overflow-hidden">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary group-hover/action:scale-110 transition-transform" />
                            <div>
                              <div className="text-sm font-medium text-foreground">Papers</div>
                              <div className="text-xs text-muted-foreground">{isLoading ? '...' : (stats?.pastPapersCount === 0 ? 'Soon' : `${stats?.pastPapersCount}+`)}</div>
                            </div>
                          </div>
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0"
                            whileHover={{ opacity: 1 }}
                          />
                        </div>
                      </Link>
                      <Link href="/gpa-calculator" className="group/action">
                        <div className="p-2.5 rounded-lg bg-muted/50 hover:bg-muted/70 border transition-all duration-300 glass-card glass-border-subtle glass-hover glass-depth relative overflow-hidden">
                          <div className="flex items-center gap-2">
                            <Calculator className="h-4 w-4 text-primary group-hover/action:scale-110 transition-transform" />
                            <div>
                              <div className="text-sm font-medium text-foreground">GPA Calc</div>
                              <div className="text-xs text-muted-foreground">Advanced</div>
                            </div>
                          </div>
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0"
                            whileHover={{ opacity: 1 }}
                          />
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Trust Indicator with live pulse */}
                  <div className="text-center p-3 rounded-lg bg-muted/50 border glass-card glass-border-subtle glass-depth">
                    <div className="flex items-center justify-center gap-2 mb-1.5">
                      <div className="flex items-center gap-1">
                        <Pulse active={true}>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </Pulse>
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">Live</span>
                      </div>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs font-medium text-foreground">Trusted by {isLoading ? '...' : `${stats?.activeStudents || 2}`} students</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Real-time data from COMSATS Lahore</div>
                  </div>
                </div>
              </Card>
              
              {/* Achievement Badge with bounce animation */}
              <motion.div 
                className="absolute -top-3 -right-3"
                animate={{ 
                  y: [0, -5, 0],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Badge className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg glass-button glass-border-light glass-hover glass-depth">
                  <Award className="h-4 w-4 mr-1" />
                  Student Approved
                </Badge>
              </motion.div>
              
              {/* Floating action button */}
              <FloatingButton 
                className="glass-button glass-border-light glass-hover glass-depth"
                onClick={() => {
                  if (isAnimationEnabled) {
                    triggerFlickeringLights({
                      message: "✨ Amazing features await! ✨",
                      duration: 3000,
                      lightCount: 20
                    })
                  }
                }}
              >
                <Zap className="h-6 w-6" />
              </FloatingButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}