import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Calculator, Users, BookOpen, Calendar, Star, ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"

export function FeatureCards() {
  const [stats, setStats] = useState({ pastPapersCount: 1000, reviewsCount: 500 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }

    fetchStats()
  }, [])

  const features = [
    {
      title: "Past Papers",
      description: "Access thousands of past papers organized by course and semester",
      icon: FileText,
      href: "/past-papers",
      color: "text-primary",
      stats: `${stats.pastPapersCount}+ Papers`,
    },
    {
      title: "GPA Calculator",
      description: "Calculate your GPA and aggregate with our comprehensive tools",
      icon: Calculator,
      href: "/gpa-calculator",
      color: "text-accent",
      stats: "Multiple Calculators",
    },
    {
      title: "Faculty Reviews",
      description: "Read and share reviews about faculty members and courses",
      icon: Users,
      href: "/faculty",
      color: "text-primary",
      stats: `${stats.reviewsCount}+ Reviews`,
    },
    {
      title: "Timetable (PDF)",
      description: "Upload and preview official timetable PDFs by department/term",
      icon: Calendar,
      href: "/timetable",
      color: "text-primary",
      stats: "Live Uploads",
    },
    {
      title: "Resources",
      description: "Study material and documents shared by departments",
      icon: BookOpen,
      href: "/resources",
      color: "text-accent",
      stats: "New Uploads",
    },
    {
      title: "Portal",
      description: "Quick access to the official COMSATS student portal",
      icon: ExternalLink,
      href: "https://portal.comsats.edu.pk/",
      color: "text-primary",
      stats: "External",
    },
  ]

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Everything You Need for Academic Success
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-serif">
            Comprehensive tools and resources designed specifically for COMSATS University students
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-accent/50"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {feature.stats}
                  </span>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                <CardDescription className="font-serif">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="ghost" className="w-full justify-between group-hover:bg-accent/10" asChild>
                  {feature.href.startsWith('http') ? (
                    <a href={feature.href} target="_blank" rel="noreferrer">
                      Explore
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  ) : (
                    <Link href={feature.href}>
                      Explore
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
