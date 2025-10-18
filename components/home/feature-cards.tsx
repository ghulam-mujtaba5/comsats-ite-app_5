"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Calculator, Users, BookOpen, Calendar, ArrowRight, Bug, TrendingUp, Sparkles, GraduationCap, MessageSquare, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import layout from "@/app/styles/common.module.css"
import { notifyFetch } from "@/lib/notify"
import { StaggerContainer, StaggerItem, AnimatedCard, AnimatedButton, FadeInScroll } from "@/components/animations/enhanced"

export function FeatureCards() {
  const [stats, setStats] = useState({ pastPapersCount: 1000, reviewsCount: 500, facultyCount: 156, resourcesCount: 324 })
  const [isVisible, setIsVisible] = useState(false)

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
      color: "text-primary",
      bgColor: "bg-primary/10",
      stats: `${stats.pastPapersCount}+ Papers`,
      cta: "Browse Papers",
      badge: "Popular"
    },
    {
      title: "GPA Calculator",
      description: "Calculate your GPA and aggregate with our comprehensive tools designed for COMSATS grading",
      icon: Calculator,
      href: "/gpa-calculator",
      color: "text-primary",
      bgColor: "bg-primary/10",
      stats: "Multiple Calculators",
      cta: "Calculate GPA",
      badge: "Essential"
    },
    {
      title: "Faculty Reviews",
      description: "Read and share honest reviews about faculty members and courses from fellow students",
      icon: Users,
      href: "/faculty",
      color: "text-primary",
      bgColor: "bg-primary/10",
      stats: `${stats.reviewsCount}+ Reviews`,
      cta: "Read Reviews",
      badge: "Community"
    },
    {
      title: "Timetable",
      description: "Find and download the latest departmental timetables to stay organized and never miss a class",
      icon: Calendar,
      href: "/timetable",
      color: "text-primary",
      bgColor: "bg-primary/10",
      stats: "Live Uploads",
      cta: "View Timetables",
      badge: "Updated"
    },
    {
      title: "Study Resources",
      description: "Study material and documents shared by departments and students to enhance your learning",
      icon: BookOpen,
      href: "/resources",
      color: "text-primary",
      bgColor: "bg-primary/10",
      stats: "300+ Resources",
      cta: "Explore Resources",
      badge: "Growing"
    },
    {
      title: "Report Issues",
      description: "Found a bug or have a suggestion? Help us improve CampusAxis for everyone",
      icon: Bug,
      href: "/report-issue",
      color: "text-primary",
      bgColor: "bg-primary/10",
      stats: "Quick Response",
      cta: "Report Issue",
      badge: "Help Us"
    },
  ]

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case "Popular": return "default"
      case "Essential": return "secondary"
      case "Community": return "success"
      case "Updated": return "info"
      case "Growing": return "warning"
      case "Help Us": return "destructive"
      default: return "outline"
    }
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/20 glass-primary">
      <div className={layout.section}>
        {/* Enhanced Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Badge variant="soft" className="mb-6 px-4 py-2 text-base font-medium bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-primary border border-primary/30 glass-interactive">
            <Sparkles className="h-4 w-4 mr-2" />
            Academic Tools & Resources
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-balance mb-6">
            Everything You Need for{" "}
            <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              Academic Success
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive tools and resources designed specifically for COMSATS University students. 
            Access everything you need to excel in your academic journey.
          </p>
        </div>

        {/* Enhanced Feature Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <StaggerItem key={index}>
                <AnimatedCard 
                  enableHover={true} 
                  enableGlow={true}
                  className="group relative h-full overflow-hidden border bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm glass-interactive glass-gradient"
                >
                  {/* Enhanced badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge 
                      variant={getBadgeVariant(feature.badge)} 
                      className="text-xs font-medium px-2.5 py-1"
                    >
                      {feature.badge}
                    </Badge>
                  </div>

                  <CardHeader className="relative z-10 pb-4">
                    {/* Enhanced icon */}
                    <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-5 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110 glass-interactive`}>
                      <Icon className={`h-7 w-7 ${feature.color}`} />
                    </div>

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
                    <div className="flex items-center justify-between mb-5 py-3 border-t border-muted">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">{feature.stats}</span>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>

                    {/* Enhanced CTA */}
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between hover:bg-slate-100 dark:bg-slate-900 group/btn p-3 h-auto glass-button glass-border-subtle glass-hover glass-depth" 
                      asChild
                    >
                      <Link href={feature.href} className="font-medium">
                        {feature.cta}
                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                  
                  {/* Decorative elements */}
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-xl" />
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-secondary/5 rounded-full blur-xl" />
                </AnimatedCard>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        {/* Enhanced call to action */}
        <FadeInScroll className="text-center mt-20" delay={0.5}>
          <AnimatedCard enableHover={true} className="inline-block p-8 border bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl max-w-3xl mx-auto glass-primary glass-gradient">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative p-4 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-2xl glass-interactive">
                  <GraduationCap className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">Ready to Transform Your Academic Experience?</h3>
              <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
                Join thousands of COMSATS students who are already using CampusAxis to excel in their studies and connect with their academic community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" className="text-base px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 glass-interactive" asChild>
                  <Link href="/auth" className="flex items-center">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8 py-3 rounded-xl border-2 hover:shadow-md transition-all duration-300 glass-interactive" asChild>
                  <Link href="/about" className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Learn More
                  </Link>
                </Button>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-700 dark:text-slate-300 pt-4">
                <Clock className="h-4 w-4" />
                <span>Join in less than 2 minutes</span>
              </div>
            </div>
          </AnimatedCard>
        </FadeInScroll>
      </div>
    </section>
  )
}