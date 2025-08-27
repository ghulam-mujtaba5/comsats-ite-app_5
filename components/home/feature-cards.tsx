"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Calculator, Users, BookOpen, Calendar, ArrowRight, Bug, TrendingUp, Sparkles } from "lucide-react"
import Link from "next/link"
import { notifyFetch } from "@/lib/notify"

export function FeatureCards() {
  const [stats, setStats] = useState({ pastPapersCount: 1000, reviewsCount: 500 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    const fetchStats = async () => {
      try {
        const response = await notifyFetch("/api/stats", undefined, { errorMessage: "Failed to load site stats" })
        if (response.ok) {
          const data = await response.json()
          setStats(data)
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
      gradientFrom: "from-primary/20",
      gradientTo: "to-blue-500/20",
      stats: `${stats.pastPapersCount}+ Papers`,
      cta: "Browse Papers",
      badge: "Popular"
    },
    {
      title: "GPA Calculator",
      description: "Calculate your GPA and aggregate with our comprehensive tools designed for COMSATS grading",
      icon: Calculator,
      href: "/gpa-calculator",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      gradientFrom: "from-blue-500/20",
      gradientTo: "to-cyan-500/20",
      stats: "Multiple Calculators",
      cta: "Calculate GPA",
      badge: "Essential"
    },
    {
      title: "Faculty Reviews",
      description: "Read and share honest reviews about faculty members and courses from fellow students",
      icon: Users,
      href: "/faculty",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      gradientFrom: "from-green-500/20",
      gradientTo: "to-emerald-500/20",
      stats: `${stats.reviewsCount}+ Reviews`,
      cta: "Read Reviews",
      badge: "Community"
    },
    {
      title: "Timetable",
      description: "Find and download the latest departmental timetables to stay organized and never miss a class",
      icon: Calendar,
      href: "/timetable",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      gradientFrom: "from-purple-500/20",
      gradientTo: "to-pink-500/20",
      stats: "Live Uploads",
      cta: "View Timetables",
      badge: "Updated"
    },
    {
      title: "Study Resources",
      description: "Study material and documents shared by departments and students to enhance your learning",
      icon: BookOpen,
      href: "/resources",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
      gradientFrom: "from-orange-500/20",
      gradientTo: "to-red-500/20",
      stats: "300+ Resources",
      cta: "Explore Resources",
      badge: "Growing"
    },
    {
      title: "Report Issues",
      description: "Found a bug or have a suggestion? Help us improve CampusAxis for everyone",
      icon: Bug,
      href: "/report-issue",
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/30",
      gradientFrom: "from-red-500/20",
      gradientTo: "to-rose-500/20",
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
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-primary/5" />
      <div className="absolute -top-40 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="app-container relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Badge variant="soft" className="mb-6">
            <Sparkles className="h-3 w-3 mr-1" />
            Academic Tools
          </Badge>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-balance mb-6">
            Everything You Need for{" "}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Academic Success
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-serif leading-relaxed">
            Comprehensive tools and resources designed specifically for COMSATS University students. 
            Access everything you need to excel in your academic journey.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ animationDelay: `${200 + (index * 100)}ms` }}
              >
                <Card className="group relative h-full overflow-hidden border-0 bg-gradient-to-br from-background to-muted/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge 
                      variant={getBadgeVariant(feature.badge)} 
                      className="text-xs font-medium transform group-hover:scale-110 transition-transform duration-300"
                    >
                      {feature.badge}
                    </Badge>
                  </div>

                  <CardHeader className="relative z-10 pb-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon className={`h-7 w-7 ${feature.color}`} />
                    </div>

                    {/* Title and description */}
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="font-serif text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative z-10 pt-0">
                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-muted-foreground">{feature.stats}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300" 
                      asChild
                    >
                      <Link href={feature.href}>
                        {feature.cta}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </CardContent>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 border border-transparent group-hover:border-primary/20 rounded-xl transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              </div>
            )
          })}
        </div>

        {/* Call to action */}
        <div className={`text-center mt-16 transition-all duration-700 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Card variant="glass" className="inline-block p-8 hover-lift transition-all duration-500">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Ready to get started?</h3>
              <p className="text-muted-foreground font-serif max-w-md">
                Join thousands of COMSATS students who are already using CampusAxis to excel in their studies.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="interactive hover-lift" asChild>
                  <Link href="/auth">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="interactive hover-lift" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
