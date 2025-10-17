"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, useAnimation, useInView } from "framer-motion"
import { ArrowRight, GraduationCap, Sparkles, TrendingUp, Users, BookOpen, Calculator, FileText, Calendar, Star, Award, Zap, Rocket, Target, Flame } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notifyFetch } from "@/lib/notify"
import { FadeInScroll, AnimatedCard, CountUp, Pulse, AnimatedButton, FloatingButton, Bounce, Shimmer } from "@/components/animations/enhanced"
import { useCelebrationAnimations } from "@/hooks/use-celebration-animations"
import { useAnimation as useAnimationContext } from "@/contexts/animation-context"
import { useMotivationalFeedback } from "@/components/motivational"
import layout from "@/app/styles/common.module.css"

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
  const { isAnimationEnabled } = useAnimationContext()
  const { triggerFeedback } = useMotivationalFeedback()
  
  // Performance optimization: Use refs to track if animations should be reduced
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

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

  // Performance optimization: Reduce animations when not in view
  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

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

  // Performance optimization: Reduce animation complexity
  const reducedMotionVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.02 }
  }

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 dark:from-slate-900/30 dark:via-slate-800/20 dark:to-slate-900/10" aria-labelledby="hero-heading" ref={ref} role="region">
      {/* Enhanced background elements with proper spacing and reduced visual noise */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/8 to-indigo-500/8 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-600/8 to-indigo-600/8 dark:from-blue-600/10 dark:to-indigo-600/10 rounded-full blur-3xl" style={{ animationDelay: '2s' }} aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/6 to-indigo-400/6 dark:from-blue-400/5 dark:to-indigo-400/5 rounded-full blur-3xl" aria-hidden="true" />
      </div>

      <div className={`${layout.section} relative z-10 py-12 md:py-16 lg:py-20`}>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 flex flex-col justify-center h-full">
            {/* Logo showcase with enhanced animations */}
            <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-8 justify-center md:justify-start">
                <motion.div 
                  className="relative group"
                  whileHover={isAnimationEnabled ? { scale: 1.05 } : {}}
                  whileTap={isAnimationEnabled ? { scale: 0.95 } : {}}
                  role="banner"
                  aria-label="CampusAxis Logo"
                >
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-500" aria-hidden="true" />
                  <Image 
                    src="/Campus Axis 1.svg" 
                    alt="CampusAxis Logo" 
                    width={80} 
                    height={80} 
                    className="rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-500 relative z-10 glass-card glass-border-light glass-hover"
                    priority
                  />
                  <motion.div 
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
                    animate={isAnimationEnabled ? { scale: [1, 1.2, 1] } : {}}
                    transition={isAnimationEnabled ? { duration: 2, repeat: Infinity } : {}}
                    aria-label="Online status"
                    role="status"
                  >
                    <div className="w-2 h-2 rounded-full bg-white" aria-hidden="true" />
                  </motion.div>
                </motion.div>
                <div>
                  <Badge variant="soft" className="px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
                    <Sparkles className="h-3 w-3 mr-1.5" aria-hidden="true" />
                    CampusAxis
                  </Badge>
                </div>
              </div>
            </div>

            {/* Enhanced main heading with gradient text */}
            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 id="hero-heading" className="text-display-2 md:text-display-1 font-extrabold text-balance mb-md md:mb-lg text-center md:text-left">
                Empowering Your{" "}
                <motion.span 
                  className="text-primary inline-block"
                  animate={isAnimationEnabled ? { 
                    scale: [1, 1.02, 1],
                  } : {}}
                  transition={isAnimationEnabled ? { 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  } : {}}
                  aria-label="Academic Journey"
                >
                  Academic Journey
                </motion.span>
              </h1>
            </div>

            {/* Enhanced description with proper spacing and readability */}
            <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-body-lg md:text-body-xl text-muted-foreground leading-relaxed max-w-2xl mb-md md:mb-lg text-center md:text-left">
                Access past papers, calculate your GPA, explore learning resources, and read faculty reviews - 
                all in one comprehensive academic portal designed specifically for COMSATS students.
              </p>
              <p className="text-body-md text-muted-foreground/90 max-w-xl text-center md:text-left">
                A growing platform for COMSATS students to share resources and read faculty reviews.
              </p>
            </div>

            {/* Quick Stats with improved visual hierarchy */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-5 max-w-2xl mx-auto md:mx-0">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={isAnimationEnabled ? { y: -5 } : {}}
                    className="p-3 sm:p-4 md:p-5 rounded-2xl bg-card/90 backdrop-blur-xl border border-white/30 text-center transition-all duration-300 hover:shadow-xl glass-interactive interactive-elevated focus-ring"
                    tabIndex={0}
                    role="region"
                    aria-label={`${stat.value} ${stat.label}`}
                  >
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 sm:mb-3 ${stat.color}`} aria-hidden="true" />
                    <div className="text-lg sm:text-xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </motion.div>
                )
              })}
            </div>

            {/* Enhanced CTA buttons with proper spacing and visual hierarchy */}
            <div className={`transition-all duration-700 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-5 justify-center md:justify-start">
                <Button 
                  size="lg" 
                  className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group interactive-scale focus-glow"
                  onClick={handleGetStarted}
                  asChild
                  aria-label="Get Started with CampusAxis"
                >
                  <Link href="/auth" className="flex items-center justify-center">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    {isAnimationEnabled && (
                      <motion.div 
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 hover:shadow-md transition-all duration-300 relative interactive-scale focus-glow"
                  onClick={handleExploreFeatures}
                  asChild
                  aria-label="Explore CampusAxis Features"
                >
                  <Link href="/about" className="flex items-center justify-center">
                    <GraduationCap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    Explore Features
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Right Content - Stats Card */}
          <div className={`transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="relative">
              {/* Main Stats Card with enhanced glass effect */}
              <Card className="relative p-6 bg-card/90 border border-white/30 rounded-3xl shadow-2xl backdrop-blur-3xl glass-primary" role="region" aria-labelledby="platform-stats-heading">
                <div className="space-y-6">
                  {/* Header Section with animated icon */}
                  <div className="text-center space-y-3">
                    <motion.div 
                      className="relative inline-block"
                      animate={isAnimationEnabled ? { rotate: [0, 5, -5, 0] } : {}}
                      transition={isAnimationEnabled ? { duration: 4, repeat: Infinity } : {}}
                      role="img"
                      aria-label="Graduation cap icon"
                    >
                      <div className="relative p-4 bg-gradient-to-r from-primary/30 to-indigo-500/30 rounded-2xl glass-secondary">
                        <GraduationCap className="h-10 w-10 text-primary" aria-hidden="true" />
                      </div>
                    </motion.div>
                    <div>
                      <h3 id="platform-stats-heading" className="text-xl font-bold text-foreground mb-1">CampusAxis Platform</h3>
                      <p className="text-muted-foreground">Real-time Academic Analytics</p>
                    </div>
                  </div>

                  {/* Stats Grid with interactive cards */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Community Engagement Card */}
                    <AnimatedCard 
                      enableHover={isAnimationEnabled}
                      className="p-4 rounded-2xl bg-muted/70 border border-white/30 transition-all duration-300 hover:shadow-xl glass-card interactive-elevated focus-ring"
                      role="region"
                      aria-label="Community Engagement"
                      tabIndex={0}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Active</span>
                      </div>
                      <div className="text-xl font-bold text-foreground mb-1">
                        {isLoading ? '...' : <CountUp end={stats?.communityPosts || 2} duration={1500} />}
                      </div>
                      <div className="text-xs text-muted-foreground">Community Posts</div>
                    </AnimatedCard>

                    {/* Faculty Rating Card */}
                    <AnimatedCard 
                      enableHover={isAnimationEnabled}
                      className="p-4 rounded-2xl bg-muted/70 border border-white/30 transition-all duration-300 hover:shadow-xl glass-card interactive-elevated focus-ring"
                      role="region"
                      aria-label="Faculty Rating"
                      tabIndex={0}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" aria-hidden="true" />
                          <span className="ml-1 text-xs font-medium text-foreground">{isLoading ? '...' : `${stats?.avgRating || 4.3}`}</span>
                        </div>
                        <div className="flex text-yellow-500" role="img" aria-label={`${stats?.avgRating || 4.3} out of 5 stars`}>
                          {[1,2,3,4,5].map((star) => (
                            <span key={star} className={`text-xs ${star <= Math.floor(stats?.avgRating || 4.3) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} aria-hidden="true">★</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-xl font-bold text-foreground mb-1">
                        {isLoading ? '...' : `${stats?.avgRating || 4.3}`}
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Rating</div>
                    </AnimatedCard>

                    {/* Active Events Card */}
                    <AnimatedCard 
                      enableHover={isAnimationEnabled}
                      className="p-4 rounded-2xl bg-muted/70 border border-white/30 transition-all duration-300 hover:shadow-xl glass-card interactive-elevated focus-ring"
                      role="region"
                      aria-label="Active Events"
                      tabIndex={0}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Active</span>
                      </div>
                      <div className="text-xl font-bold text-foreground mb-1">
                        {isLoading ? '...' : <CountUp end={stats?.eventsCount || 1} duration={1500} />}
                      </div>
                      <div className="text-xs text-muted-foreground">Live Events</div>
                    </AnimatedCard>

                    {/* Faculty Count Card */}
                    <AnimatedCard 
                      enableHover={isAnimationEnabled}
                      className="p-4 rounded-2xl bg-muted/70 border border-white/30 transition-all duration-300 hover:shadow-xl glass-card interactive-elevated focus-ring"
                      role="region"
                      aria-label="Faculty Information"
                      tabIndex={0}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <GraduationCap className="h-5 w-5 text-primary" aria-hidden="true" />
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">{stats?.departmentCount || 2} Depts</span>
                      </div>
                      <div className="text-xl font-bold text-foreground mb-1">
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
                        <div className="p-3 rounded-xl bg-muted/70 hover:bg-muted/80 border border-white/30 transition-all duration-300 hover:shadow-lg glass-card glass-hover glass-border-light glass-depth">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary group-hover/action:scale-110 transition-transform" aria-hidden="true" />
                            <div>
                              <div className="text-sm font-medium text-foreground">Papers</div>
                              <div className="text-xs text-muted-foreground">{isLoading ? '...' : (stats?.pastPapersCount === 0 ? 'Soon' : `${stats?.pastPapersCount}+`)}</div>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <Link href="/gpa-calculator" className="group/action">
                        <div className="p-3 rounded-xl bg-muted/70 hover:bg-muted/80 border border-white/30 transition-all duration-300 hover:shadow-lg glass-card glass-hover glass-border-light glass-depth">
                          <div className="flex items-center gap-2">
                            <Calculator className="h-5 w-5 text-primary group-hover/action:scale-110 transition-transform" aria-hidden="true" />
                            <div>
                              <div className="text-sm font-medium text-foreground">GPA Calc</div>
                              <div className="text-xs text-muted-foreground">Advanced</div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Trust Indicator with live pulse */}
                  <div className="text-center p-4 rounded-xl bg-muted/70 border border-white/30 glass-secondary">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Pulse active={isAnimationEnabled}>
                          <div className="w-2.5 h-2.5 bg-green-500 rounded-full" aria-hidden="true"></div>
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
              {isAnimationEnabled && (
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
                  role="status"
                  aria-label="Student approved badge"
                >
                  <Badge className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                    <Award className="h-4 w-4 mr-1" aria-hidden="true" />
                    Student Approved
                  </Badge>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}