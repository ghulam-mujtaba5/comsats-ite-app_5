"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Calculator, Users, BookOpen, Calendar, ArrowRight, Bug, TrendingUp, Sparkles, GraduationCap, MessageSquare, Clock, Rocket, Target, Flame, Zap, Star, Award } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { notifyFetch } from "@/lib/notify"
import { StaggerContainer, StaggerItem, AnimatedCard, AnimatedButton, FadeInScroll } from "@/components/animations/enhanced"
import { useCelebrationAnimations } from "@/hooks/use-celebration-animations"
import { useAnimation } from "@/contexts/animation-context"
import { useMotivationalFeedback } from "@/components/motivational"

export function EnhancedFeatures() {
  const [stats, setStats] = useState({ pastPapersCount: 1000, reviewsCount: 500, facultyCount: 156, resourcesCount: 324 })
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const { triggerAchievement } = useCelebrationAnimations()
  const { isAnimationEnabled } = useAnimation()
  const { triggerFeedback } = useMotivationalFeedback()

  useEffect(() => {
    setIsVisible(true)
    
    const fetchStats = async () => {
      try {
        const response = await notifyFetch("/api/stats", undefined, { errorMessage: "Failed to load site stats" })
        if (response.ok) {
          const data = await response.json()
          setStats({
            pastPapersCount: data.pastPapersCount || 1000,
            reviewsCount: data.reviewsCount || 500,
            facultyCount: data.facultyCount || 156,
            resourcesCount: data.resourcesCount || 324
          })
        }
      } catch (error) {
        // Errors are already shown via notifyFetch
      }
    }

    fetchStats()
  }, [])

  const features = [
    {
      title: "Past Papers",
      description: "Access thousands of past papers organized by course and semester to excel in your exams",
      icon: FileText,
      href: "/past-papers",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      stats: `${stats.pastPapersCount}+ Papers`,
      cta: "Browse Papers",
      badge: "Popular",
      badgeColor: "default"
    },
    {
      title: "GPA Calculator",
      description: "Calculate your GPA and aggregate with our comprehensive tools designed for COMSATS grading",
      icon: Calculator,
      href: "/gpa-calculator",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      stats: "Multiple Calculators",
      cta: "Calculate GPA",
      badge: "Essential",
      badgeColor: "secondary"
    },
    {
      title: "Faculty Reviews",
      description: "Read and share honest reviews about faculty members and courses from fellow students",
      icon: Users,
      href: "/faculty",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      stats: `${stats.reviewsCount}+ Reviews`,
      cta: "Read Reviews",
      badge: "Community",
      badgeColor: "success"
    },
    {
      title: "Timetable",
      description: "Find and download the latest departmental timetables to stay organized and never miss a class",
      icon: Calendar,
      href: "/timetable",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      stats: "Live Uploads",
      cta: "View Timetables",
      badge: "Updated",
      badgeColor: "info"
    },
    {
      title: "Study Resources",
      description: "Study material and documents shared by departments and students to enhance your learning",
      icon: BookOpen,
      href: "/resources",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      stats: "300+ Resources",
      cta: "Explore Resources",
      badge: "Growing",
      badgeColor: "warning"
    },
    {
      title: "Report Issues",
      description: "Found a bug or have a suggestion? Help us improve CampusAxis for everyone",
      icon: Bug,
      href: "/report-issue",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      stats: "Quick Response",
      cta: "Report Issue",
      badge: "Help Us",
      badgeColor: "destructive"
    },
  ]

  const getBadgeVariant = (badgeColor: string) => {
    switch (badgeColor) {
      case "default": return "default"
      case "secondary": return "secondary"
      case "success": return "success"
      case "info": return "info"
      case "warning": return "warning"
      case "destructive": return "destructive"
      default: return "outline"
    }
  }

  const handleFeatureHover = (index: number) => {
    setHoveredFeature(index)
  }

  const handleFeatureLeave = () => {
    setHoveredFeature(null)
  }

  const handleFeatureClick = (title: string) => {
    if (isAnimationEnabled) {
      triggerAchievement({
        title: `Exploring ${title}`,
        description: `You're discovering the ${title} feature`,
        type: 'badge'
      })
      
      // Trigger motivational feedback
      triggerFeedback({
        type: 'challenge_completed',
        message: `Exploring ${title}`
      })
    }
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background/80 to-muted/30 glass-primary" aria-labelledby="features-heading">
      <div className="app-container">
        {/* Enhanced Header with proper spacing and visual hierarchy */}
        <div className={`text-center mb-16 md:mb-24 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Badge variant="soft" className="mb-6 md:mb-8 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-medium bg-gradient-to-r from-blue-500/30 to-indigo-500/30 text-primary border border-primary/40 glass-secondary">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" aria-hidden="true" />
            Academic Tools & Resources
          </Badge>
          
          <h2 id="features-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-balance mb-6 md:mb-8">
            Everything You Need for{" "}
            <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              Academic Success
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-2">
            Comprehensive tools and resources designed specifically for COMSATS University students. 
            Access everything you need to excel in your academic journey.
          </p>
        </div>

        {/* Enhanced Feature Grid with proper spacing and visual hierarchy */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10" staggerDelay={0.1}>
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isHovered = hoveredFeature === index
            
            return (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{ y: -10 }}
                  onHoverStart={() => handleFeatureHover(index)}
                  onHoverEnd={handleFeatureLeave}
                  onClick={() => handleFeatureClick(feature.title)}
                  role="article"
                  aria-labelledby={`feature-title-${index}`}
                >
                  <AnimatedCard 
                    enableHover={true} 
                    className="group relative h-full overflow-hidden border border-white/30 bg-card/90 backdrop-blur-3xl rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-2xl glass-primary glass-professional"
                  >
                    {/* Enhanced badge */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                      <Badge 
                        variant={getBadgeVariant(feature.badgeColor)} 
                        className="text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-1"
                      >
                        {feature.badge}
                      </Badge>
                    </div>

                    <CardHeader className="relative z-10 pb-4 sm:pb-6">
                      {/* Enhanced icon with hover effect */}
                      <motion.div 
                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                        animate={isHovered ? { 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, 0]
                        } : {}}
                        transition={{ duration: 0.5 }}
                        role="img"
                        aria-label={`${feature.title} icon`}
                      >
                        <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${feature.color}`} aria-hidden="true" />
                      </motion.div>

                      {/* Enhanced title and description */}
                      <CardTitle id={`feature-title-${index}`} className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 group-hover:text-primary-600 transition-colors">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground/90">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="relative z-10 pt-0">
                      {/* Enhanced stats */}
                      <div className="flex items-center justify-between mb-4 sm:mb-6 py-2 sm:py-3 border-t border-white/10">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600" aria-hidden="true" />
                          <span className="text-xs sm:text-sm font-medium text-muted-foreground/90">{feature.stats}</span>
                        </div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary" aria-hidden="true" />
                      </div>

                      {/* Enhanced CTA with hover effect */}
                      <Button 
                        variant="ghost" 
                        className="w-full justify-between hover:bg-muted group/btn p-2 sm:p-3 h-auto rounded-lg sm:rounded-xl relative overflow-hidden text-sm sm:text-base" 
                        asChild
                      >
                        <Link href={feature.href} className="font-medium">
                          {feature.cta}
                          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0"
                            whileHover={{ opacity: 1, x: '100%' }}
                            transition={{ duration: 0.5 }}
                            aria-hidden="true"
                          />
                        </Link>
                      </Button>
                    </CardContent>
                  </AnimatedCard>
                </motion.div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        {/* Enhanced call to action with proper spacing */}
        <FadeInScroll className="text-center mt-32" delay={0.5}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            role="region"
            aria-labelledby="cta-heading"
          >
            <AnimatedCard enableHover={true} className="inline-block p-8 sm:p-10 md:p-12 border border-white/20 bg-card/80 backdrop-blur-2xl shadow-2xl rounded-2xl sm:rounded-3xl max-w-3xl mx-auto glass-primary glass-gradient">
              <div className="space-y-6 sm:space-y-8">
                <div className="flex justify-center">
                  <div className="relative p-4 sm:p-6 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-2xl sm:rounded-2xl glass-layered">
                    <GraduationCap className="h-12 w-12 sm:h-16 sm:w-16 text-primary" aria-hidden="true" />
                  </div>
                </div>
                <h3 id="cta-heading" className="text-xl sm:text-2xl md:text-3xl font-bold">Ready to Transform Your Academic Experience?</h3>
                <p className="text-base sm:text-lg text-muted-foreground/90 max-w-2xl mx-auto">
                  Join thousands of COMSATS students who are already using CampusAxis to excel in their studies and connect with their academic community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-6 sm:pt-8">
                  <Button 
                    size="lg" 
                    className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                    asChild
                  >
                    <Link href="/auth" className="flex items-center justify-center">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                      <motion.div 
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                        aria-hidden="true"
                      />
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 hover:shadow-md transition-all duration-300"
                    asChild
                  >
                    <Link href="/about" className="flex items-center justify-center">
                      <MessageSquare className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                      Learn More
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground/90 pt-6 sm:pt-8">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  <span>Join in less than 2 minutes</span>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        </FadeInScroll>
        
        {/* Stats showcase section with proper spacing */}
        <div className="mt-24 sm:mt-32 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
          {[
            { icon: FileText, label: "Past Papers", value: "1000+", color: "text-blue-500" },
            { icon: Users, label: "Faculty Reviews", value: "500+", color: "text-purple-500" },
            { icon: BookOpen, label: "Study Resources", value: "300+", color: "text-pink-500" },
            { icon: Award, label: "Student Rating", value: "4.8★", color: "text-amber-500" }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="text-center p-4 sm:p-6 rounded-2xl bg-card/80 backdrop-blur-lg border border-white/20 transition-all duration-300 hover:shadow-lg glass-card glass-hover glass-border-light"
                role="region"
                aria-label={`${stat.label}: ${stat.value}`}
              >
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className={`p-3 sm:p-4 rounded-xl ${stat.color.replace('text', 'bg')}/10`}>
                    <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`} aria-hidden="true" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}