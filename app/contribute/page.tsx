"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import layout from "@/app/styles/common.module.css"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Mail, 
  Users, 
  Shield, 
  Heart, 
  Code, 
  FileText, 
  Star, 
  ArrowRight, 
  Sparkles,
  CheckCircle,
  Gift,
  Target,
  Zap,
  Award,
  Globe
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function ContributePage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Removed the previous four large role cards (Moderator, Admin, Content, Technical).
  // New streamlined involvement options for improved hierarchy & clarity.
  const involvementOptions = [
    {
      icon: FileText,
      title: "Content Contributor",
      tagline: "Share knowledge & academic resources",
      description: "Upload past papers, notes, or curated learning material to empower student success.",
      features: [
        "Upload past papers / notes",
        "Create study resources",
        "Improve existing content",
        "Help build knowledge base"
      ],
      gradient: "from-green-500/20 to-emerald-600/20",
      border: "border-green-200/30 dark:border-green-700/30",
      button: "from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
      formLink: "https://forms.gle/sK8fibFaFfVnWv429",
      cta: "Become a Contributor"
    },
    {
      icon: Shield,
      title: "Core Team / Leadership",
      tagline: "Guide direction & platform quality",
      description: "Shape features, review submissions, and drive strategic & technical improvements.",
      features: [
        "Feature & roadmap input",
        "Content quality review",
        "Moderate & mentor community",
        "Technical & UI feedback"
      ],
      gradient: "from-purple-500/20 to-pink-600/20",
      border: "border-purple-200/30 dark:border-purple-700/30",
      button: "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
      formLink: "https://forms.gle/tGHbja14oVo9KSsXA",
      cta: "Apply to Core Team"
    }
  ]

  const benefits = [
    {
      icon: Star,
      title: "Recognition",
      description: "Get recognized for your contributions with special badges and credits"
    },
    {
      icon: Target,
      title: "Experience",
      description: "Gain valuable experience in community management and platform development"
    },
    {
      icon: Heart,
      title: "Impact",
      description: "Make a meaningful difference in fellow students' academic journey"
    },
    {
      icon: Award,
      title: "Skills",
      description: "Develop leadership, technical, and communication skills"
    }
  ]

  const stats = [
    { label: "Active Contributors", value: "25+", icon: Users },
    { label: "Content Reviewed", value: "500+", icon: FileText },
    { label: "Students Helped", value: "1000+", icon: Heart },
    { label: "Features Added", value: "50+", icon: Zap }
  ]

  return (
    <div className="min-h-screen bg-mesh overflow-hidden relative">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '4s' }} />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-primary/30 rotate-45 animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-20 w-6 h-6 bg-blue-500/30 rounded-full animate-bounce" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-500/30 rotate-45 animate-bounce" style={{ animationDelay: '5s' }} />
      </div>

      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-blue-500/8" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20" />

      <main className={`${layout.section} ${layout.max6xl} px-4 py-24 relative z-10`}>
        {/* Enhanced Header Section */}
        <section className="text-center mb-16">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Badge variant="soft" className="mb-8 px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20 hover:from-primary/20 hover:to-blue-500/20 transition-all duration-300 hover-lift">
              <Gift className="h-3 w-3 mr-2 text-primary" />
              Join Our Mission
            </Badge>
          </div>

          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-5xl lg:text-8xl font-bold leading-[0.9] text-balance mb-6">
              Contribute to{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                CampusAxis
              </span>
            </h1>
          </div>

          <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-serif max-w-4xl mx-auto mb-4">
              Want to help fellow COMSATS students? Join our community of contributors and make a 
              meaningful impact on student success. Whether you're sharing resources, moderating content, 
              or building features - there's a place for you.
            </p>
            <p className="text-lg text-muted-foreground/80 font-light max-w-xl mx-auto">
              Together, we're building the ultimate student platform
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <div className={`transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} grid grid-cols-2 md:grid-cols-4 gap-6 mb-16`}>
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="card-modern border-0 backdrop-blur-sm text-center hover-lift transition-all duration-300">
                <CardContent className="p-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm border border-border/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-all duration-300 hover-glow">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* (Removed old role cards) */}

        {/* Benefits Section */}
        <div className={`transition-all duration-700 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} mb-16`}>
          <Card className="card-modern border-0 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl mb-2">
                Why <span className="text-primary">Contribute?</span>
              </CardTitle>
              <p className="text-muted-foreground font-serif max-w-2xl mx-auto">
                Join a community of passionate students making a difference.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <div key={index} className="text-center group">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm border border-border/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-all duration-300 hover-glow">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-serif leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Involvement Section (replacement for removed role cards) */}
        <div className={`transition-all duration-700 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} mb-16`}>
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-5xl font-bold leading-tight mb-4">
              Find Your <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">Impact Path</span>
            </h2>
            <p className="text-muted-foreground font-serif max-w-2xl mx-auto text-lg">
              Choose how you want to help. Whether you focus on academic content or strategic growth, we make sure your effort counts.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {involvementOptions.map((opt, i) => {
              const Icon = opt.icon
              return (
                <Card key={i} className={cn(
                  "card-modern border-0 backdrop-blur-sm hover-lift transition-all duration-500 group flex flex-col",
                  opt.border
                )}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4 mb-3">
                      <div className={cn(
                        "p-4 rounded-2xl bg-gradient-to-br border group-hover:scale-110 transition-transform duration-300",
                        opt.gradient,
                        opt.border
                      )}>
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {opt.title}
                        </CardTitle>
                        <p className="text-sm font-medium text-muted-foreground/80 tracking-tight">{opt.tagline}</p>
                      </div>
                    </div>
                    <CardDescription className="text-base font-serif leading-relaxed">
                      {opt.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col h-full">
                    <div className="space-y-3 mb-6">
                      {opt.features.map((f, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{f}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto">
                      <Button asChild className={cn(
                        "w-full text-lg px-6 py-3 rounded-2xl button-modern shadow-lg hover:shadow-xl transition-all duration-300 group bg-gradient-to-r",
                        opt.button
                      )}>
                        <a href={opt.formLink} target="_blank" rel="noopener noreferrer">
                          {opt.cta}
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

  {/* Contact Section */}
  <div className={`transition-all duration-700 delay-1100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Card className="card-modern border-0 backdrop-blur-sm border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                Ready to Get Started?
              </CardTitle>
              <CardDescription className="text-lg font-serif mt-4">
                Email us your interest and details (name, department, student ID, how you want to help) — 
                we respond quickly and will guide you through the next steps.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-center pt-0">
              <div className="text-center sm:text-left">
                <div className="text-lg font-medium text-foreground mb-1">
                  <Globe className="inline h-5 w-5 mr-2 text-primary" />
                  Email: campusaxis0@gmail.com
                </div>
                <div className="text-sm text-muted-foreground">
                  We typically respond within 24 hours
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <a href="mailto:campusaxis0@gmail.com?subject=Contribute%20to%20CampusAxis" rel="noreferrer">
                  <Button className="text-lg px-8 py-3 rounded-2xl button-modern bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <Mail className="h-5 w-5 mr-2" /> 
                    Email Us
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
                <Button variant="outline" className="text-lg px-8 py-3 rounded-2xl button-modern glass-card hover:bg-primary/5 border-primary/20" asChild>
                  <Link href="/report-issue">
                    Report an Issue
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

