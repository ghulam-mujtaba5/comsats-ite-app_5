"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Calculator, Users, BookOpen, Calendar, ArrowRight, Bug, TrendingUp, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notifyFetch } from "@/lib/notify"

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
    <section className="py-16 px-4 bg-muted/20">
      <div className="app-container">
        {/* Simplified Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Badge variant="soft" className="mb-6 px-3 py-1.5 text-sm font-medium">
            <Sparkles className="h-3 w-3 mr-1.5 text-primary" />
            Academic Tools
          </Badge>
          
          <h2 className="text-2xl lg:text-4xl font-bold text-balance mb-4">
            Everything You Need for{" "}
            <span className="text-primary">
              Academic Success
            </span>
          </h2>
          
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools and resources designed specifically for COMSATS University students. 
            Access everything you need to excel in your academic journey.
          </p>
        </div>

        {/* Simplified Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ animationDelay: `${100 + (index * 50)}ms` }}
              >
                <Card className="group relative h-full overflow-hidden border bg-card hover:shadow-md transition-all duration-300">
                  {/* Simplified badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge 
                      variant={getBadgeVariant(feature.badge)} 
                      className="text-xs font-medium"
                    >
                      {feature.badge}
                    </Badge>
                  </div>

                  <CardHeader className="relative z-10 pb-4">
                    {/* Simplified icon */}
                    <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>

                    {/* Simplified title and description */}
                    <CardTitle className="text-lg mb-2">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative z-10 pt-0">
                    {/* Simplified stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">{feature.stats}</span>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>

                    {/* CTA */}
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between hover:bg-muted" 
                      asChild
                    >
                      <Link href={feature.href}>
                        {feature.cta}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Simplified call to action */}
        <div className={`text-center mt-12 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Card className="inline-block p-6 border">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Ready to get started?</h3>
              <p className="text-muted-foreground max-w-md">
                Join thousands of COMSATS students who are already using CampusAxis to excel in their studies.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="/auth">
                    Get Started Free
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
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