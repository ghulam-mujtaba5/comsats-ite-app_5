import type { Metadata } from "next"
import { createMetadata, jsonLdBreadcrumb } from "@/lib/seo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Target, Users, Sparkles, FileText, Calculator, UserCheck, BookOpen, Calendar, ArrowRight, Heart, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = createMetadata({
  title: "About — CampusAxis",
  description: "Learn about CampusAxis: our mission, what we offer, and our commitment to COMSATS University Lahore students.",
  path: "/about",
  keywords: ["About CampusAxis", "COMSATS Lahore", "student portal", "mission", "features"],
})

export default function AboutUsPage() {
  const features = [
    {
      icon: FileText,
      title: "Past Papers Repository",
      description: "Access a vast collection of past exam papers to prepare effectively.",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Calculator,
      title: "GPA Tools",
      description: "Calculate, plan, and forecast your GPA with our easy-to-use calculators.",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30"
    },
    {
      icon: UserCheck,
      title: "Faculty Reviews",
      description: "Share and read honest reviews to make informed decisions about your courses.",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/30"
    },
    {
      icon: BookOpen,
      title: "Learning Resources",
      description: "Find and share study materials, notes, and other valuable resources.",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/30"
    },
    {
      icon: Calendar,
      title: "Timetable Management",
      description: "Organize your class schedule and never miss a lecture.",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/30"
    }
  ]

  const stats = [
    { label: "Active Students", value: "5,000+", icon: Users },
    { label: "Past Papers", value: "1,000+", icon: FileText },
    { label: "Faculty Reviews", value: "500+", icon: UserCheck },
    { label: "Study Resources", value: "300+", icon: BookOpen }
  ]

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <main className="flex-1 relative">
        {/* Hero Section */}
        <section className="py-20 px-4 relative">
          <div className="app-container">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="soft" className="mb-6 animate-fade-in">
                <Sparkles className="h-3 w-3 mr-1" />
                About CampusAxis
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-balance animate-slide-up" style={{ animationDelay: '200ms' }}>
                Empowering Your 
                <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Academic Journey
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-serif leading-relaxed animate-slide-up" style={{ animationDelay: '400ms' }}>
                Transforming the way COMSATS University Lahore students access resources, 
                connect with faculty, and excel in their academic pursuits.
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 animate-slide-up" style={{ animationDelay: '600ms' }}>
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <Card key={index} variant="glass" className="text-center hover-lift transition-all duration-300">
                      <CardContent className="p-4">
                        <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5">
          <div className="app-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Target className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
                </div>
                
                <p className="text-lg text-muted-foreground leading-relaxed font-serif">
                  Our mission is to provide a centralized, comprehensive academic portal for the students of COMSATS 
                  University Lahore. We aim to streamline access to essential resources, foster a collaborative learning 
                  environment, and empower students to achieve academic excellence.
                </p>

                <div className="space-y-3">
                  {[
                    "Centralized academic resources",
                    "Collaborative learning environment", 
                    "Student empowerment tools",
                    "Academic excellence support"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Card variant="glass" className="p-8 hover-lift transition-all duration-500">
                  <div className="text-center space-y-4">
                    <GraduationCap className="h-16 w-16 mx-auto text-primary" />
                    <h3 className="text-2xl font-semibold">Built for Students</h3>
                    <p className="text-muted-foreground font-serif">
                      Every feature is designed with student needs in mind, 
                      creating an intuitive and powerful academic companion.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="app-container">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-balance">
                What We <span className="text-primary">Offer</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-serif">
                CampusAxis is a one-stop solution for all your academic needs. 
                Our platform offers a comprehensive range of features.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card 
                    key={index} 
                    variant="elevated" 
                    className="group hover-lift transition-all duration-300 border-0 hover:border-primary/20 hover:shadow-xl"
                  >
                    <CardHeader className="pb-4">
                      <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground font-serif leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-accent/10 via-background to-primary/5">
          <div className="app-container">
            <Card variant="glass" className="max-w-4xl mx-auto p-8 lg:p-12">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">Our Commitment</h2>
                </div>
                
                <p className="text-lg text-muted-foreground leading-relaxed font-serif max-w-3xl mx-auto">
                  We are dedicated to continuously improving and expanding our platform to meet the evolving needs of the 
                  student community. Our goal is to create a tool that is not only useful but also an integral part of the 
                  university experience at COMSATS Lahore.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Button size="lg" className="interactive hover-lift" asChild>
                    <Link href="/contact">
                      Get in Touch
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="interactive hover-lift" asChild>
                    <Link href="/contribute">Contribute to CampusAxis</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])) }}
      />
    </div>
  );
}
