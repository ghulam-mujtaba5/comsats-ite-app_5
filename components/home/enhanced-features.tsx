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
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="app-container">
        {/* Enhanced Header with proper spacing and visual hierarchy */}
        <div className={`text-center mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Badge variant="soft" className="mb-6 px-4 py-2 text-base font-medium bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-primary border border-primary/30">
            <Sparkles className="h-4 w-4 mr-2" />
            Academic Tools & Resources
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-balance mb-6">
            Everything You Need for{" "}
            <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              Academic Success
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Comprehensive tools and resources designed specifically for COMSATS University students. 
            Access everything you need to excel in your academic journey.
          </p>
        </div>

        {/* Enhanced Feature Grid with proper spacing and visual hierarchy */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
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
                >
                  <AnimatedCard 
                    enableHover={true} 
                    className="group relative h-full overflow-hidden border border-white/20 bg-card/80 backdrop-blur-xl rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl"
                  >
                    {/* Enhanced badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <Badge 
                        variant={getBadgeVariant(feature.badgeColor)} 
                        className="text-xs font-medium px-2.5 py-1"
                      >
                        {feature.badge}
                      </Badge>
                    </div>

                    <CardHeader className="relative z-10 pb-4">
                      {/* Enhanced icon with hover effect */}
                      <motion.div 
                        className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                        animate={isHovered ? { 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, 0]
                        } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className={`h-8 w-8 ${feature.color}`} />
                      </motion.div>

                      {/* Enhanced title and description */}
                      <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="relative z-10 pt-0">
                      {/* Enhanced stats */}
                      <div className="flex items-center justify-between mb-5 py-3 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-muted-foreground">{feature.stats}</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>

                      {/* Enhanced CTA with hover effect */}
                      <Button 
                        variant="ghost" 
                        className="w-full justify-between hover:bg-muted group/btn p-3 h-auto rounded-xl relative overflow-hidden" 
                        asChild
                      >
                        <Link href={feature.href} className="font-medium">
                          {feature.cta}
                          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0"
                            whileHover={{ opacity: 1, x: '100%' }}
                            transition={{ duration: 0.5 }}
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
        <FadeInScroll className="text-center mt-24" delay={0.5}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <AnimatedCard enableHover={true} className="inline-block p-10 border border-white/20 bg-card/80 backdrop-blur-2xl shadow-2xl rounded-3xl max-w-3xl mx-auto">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="relative p-5 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-2xl">
                    <GraduationCap className="h-14 w-14 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">Ready to Transform Your Academic Experience?</h3>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of COMSATS students who are already using CampusAxis to excel in their studies and connect with their academic community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Button 
                    size="lg" 
                    className="text-base px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                    asChild
                  >
                    <Link href="/auth" className="flex items-center justify-center">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
                    className="text-base px-8 py-4 rounded-xl border-2 hover:shadow-md transition-all duration-300"
                    asChild
                  >
                    <Link href="/about" className="flex items-center justify-center">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Learn More
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-6">
                  <Clock className="h-4 w-4" />
                  <span>Join in less than 2 minutes</span>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        </FadeInScroll>
        
        {/* Stats showcase section with proper spacing */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
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
                className="text-center p-5 rounded-2xl bg-card/80 backdrop-blur-lg border border-white/20 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex justify-center mb-3">
                  <div className={`p-3 rounded-xl ${stat.color.replace('text', 'bg')}/10`}>
                    <Icon className={`h-7 w-7 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}