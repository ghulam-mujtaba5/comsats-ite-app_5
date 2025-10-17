"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Shield, 
  FileText, 
  ExternalLink,
  Headphones,
  Users,
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  Star
} from "lucide-react"
import Link from "next/link"
import layout from "@/app/styles/common.module.css"
import './support.light.module.css'
import './support.dark.module.css'

export default function SupportPage() {
  const supportOptions = [
    {
      title: "Report an Issue",
      description: "Found a bug, want to suggest an improvement, or need to report content?",
      href: "/report-issue",
      icon: Shield,
      color: "from-red-500/20 to-orange-500/20",
      borderColor: "border-red-200/30",
      textColor: "text-red-600",
      badge: "High Priority"
    },
    {
      title: "Help Center",
      description: "Browse comprehensive FAQs, guides, and solutions to common questions.",
      href: "/help",
      icon: HelpCircle,
      color: "from-primary/20 to-blue-500/20",
      borderColor: "border-primary/30",
      textColor: "text-primary",
      badge: "Most Popular"
    },
    {
      title: "Contact Us",
      description: "Need direct assistance? Reach out to our support team for personalized help.",
      href: "/contact",
      icon: Mail,
      color: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-200/30",
      textColor: "text-green-600",
      badge: "24/7 Support"
    },
    {
      title: "Community",
      description: "Connect with fellow students and get help from the community.",
      href: "/community",
      icon: Users,
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-200/30",
      textColor: "text-purple-600",
      badge: "Active"
    }
  ]

  const quickLinks = [
    { title: "Privacy Policy", href: "/privacy", icon: Shield },
    { title: "Terms of Service", href: "/terms", icon: FileText },
    { title: "Student Support", href: "/student-support", icon: Headphones },
    { title: "Help Desk", href: "/help-desk", icon: MessageSquare }
  ]

  const topFAQs = [
    "How to calculate GPA accurately using CampusAxis",
    "Where to find past papers for a specific course",
    "How to submit faculty reviews responsibly",
    "Understanding community moderation guidelines",
    "Reporting inappropriate content or behavior"
  ]

  return (
    <div className="min-h-screen bg-mesh overflow-hidden relative">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '4s' }} />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-primary/30 rotate-45 animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-20 w-6 h-6 bg-blue-500/30 rounded-full animate-bounce" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-500/30 rotate-45 animate-bounce" style={{ animationDelay: '5s' }} />
      </div>

      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-blue-500/8" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20" />

      <main className={`${layout.section} px-4 py-24 relative z-10`}>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Support" }]} />
        
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary mb-6 hover:from-primary/20 hover:to-blue-500/20 transition-all duration-300 hover-lift">
            <Headphones className="h-4 w-4" />
            Support Center
          </div>
          <h1 className="text-5xl lg:text-8xl font-bold leading-[0.9] text-balance mb-6">
            Get{" "}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Support
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-serif max-w-4xl mx-auto mb-4">
            How can we help you today? Choose from our comprehensive support options 
            to get the assistance you need.
          </p>
          <p className="text-lg text-muted-foreground/80 font-light max-w-xl mx-auto">
            We're here to help you succeed
          </p>
        </div>

        {/* Enhanced Support Options Grid */}
        <div className="grid gap-8 md:grid-cols-2 mb-16">
          {supportOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <Link key={index} href={option.href} className="block group">
                <Card className="bg-white/90 dark:bg-slate-800/90 shadow-lg hover:shadow-xl rounded-2xl h-full transition-all duration-500 group-hover:scale-[1.02]">
                  <CardHeader className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${option.color} border ${option.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-8 w-8 ${option.textColor}`} />
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="text-xs font-medium px-3 py-1 rounded-xl bg-primary/5 border-primary/20 text-primary"
                      >
                        {option.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                      {option.title}
                    </CardTitle>
                    <CardDescription className="text-base text-muted-foreground font-serif leading-relaxed">
                      {option.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <div className="flex items-center gap-2 text-primary group-hover:text-primary/80 font-medium">
                      <span>Learn more</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Enhanced Quick Links */}
          <Card className="glass-card glass-border-light glass-hover rounded-2xl transition-all duration-300">
            <CardHeader className="p-8">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-foreground">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-200/30">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                Quick Links
              </CardTitle>
              <CardDescription className="text-muted-foreground font-serif text-base">
                Fast access to important resources and policies
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="space-y-3">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon
                  return (
                    <Link key={index} href={link.href}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start h-12 rounded-xl glass-input glass-interactive glass-border-subtle transition-all duration-300 hover-lift"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          {link.title}
                        </div>
                      </Button>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Top FAQs */}
          <Card className="glass-card glass-border-light glass-hover rounded-2xl transition-all duration-300">
            <CardHeader className="p-8">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-foreground">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-200/30">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                Top Support FAQs
              </CardTitle>
              <CardDescription className="text-muted-foreground font-serif text-base">
                Most frequently asked questions by our community
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="space-y-4">
                {topFAQs.map((faq, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-background/50 transition-colors duration-200 cursor-pointer group">
                    <div className="p-1 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-foreground font-medium leading-relaxed group-hover:text-primary transition-colors duration-200">
                      {faq}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link href="/help">
                  <Button className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 rounded-xl transition-all duration-300 hover-lift shadow-lg hover:shadow-xl">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    View All FAQs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Response Time Notice */}
        <Card className="bg-white/90 dark:bg-slate-800/90 shadow-lg mt-12 rounded-2xl">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-200/30">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Response Times</h3>
            <p className="text-muted-foreground font-serif leading-relaxed max-w-2xl mx-auto">
              We typically respond to support requests within 24 hours during business days. 
              For urgent issues, please use our priority support channels.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
