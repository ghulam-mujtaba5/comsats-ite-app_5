import type { Metadata } from "next"
import { createMetadata, jsonLdBreadcrumb } from "@/lib/seo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Database, Cookie, Eye, Lock, Mail, UserCheck, Settings, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy — CampusAxis",
  description: "How CampusAxis collects, uses, and protects your data.",
  path: "/privacy",
  keywords: ["privacy policy", "data", "cookies", "CampusAxis"],
})

export default function PrivacyPage() {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Account details (name, email) when you create an account",
        "Basic usage analytics to improve our services and user experience",
        "Device information and IP address for security purposes",
        "Content you voluntarily share (reviews, posts, resources)",
        "Communication records when you contact our support team"
      ],
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30"
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "Provide and maintain our academic platform services",
        "Personalize your experience and improve our features",
        "Communicate with you about updates and important notices",
        "Ensure platform security and prevent fraudulent activities",
        "Analyze usage patterns to enhance user experience"
      ],
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/30"
    },
    {
      icon: Cookie,
      title: "Use of Cookies",
      content: "We use essential cookies for authentication and user preferences. Optional analytics cookies help us understand how you use our platform. You can disable non-essential cookies in your browser settings at any time.",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/30"
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "We implement industry-standard security measures including encryption, secure servers, and regular security audits. Your personal information is protected both in transit and at rest using advanced encryption protocols.",
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/30"
    },
    {
      icon: Settings,
      title: "Data Retention",
      content: "We retain your data only as long as necessary to provide our services and comply with legal obligations. You can request deletion of your account and associated data at any time through your profile settings.",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/30"
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "Access and review your personal data at any time",
        "Request correction of inaccurate or incomplete information",
        "Delete your account and associated data",
        "Export your data in a portable format",
        "Opt-out of non-essential communications and analytics"
      ],
      color: "text-cyan-500",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/30"
    }
  ]

  const dataTypes = [
    { type: "Account Information", retention: "Until account deletion", purpose: "Service provision" },
    { type: "Usage Analytics", retention: "24 months", purpose: "Platform improvement" },
    { type: "Security Logs", retention: "12 months", purpose: "Security monitoring" },
    { type: "User Content", retention: "Until user deletion", purpose: "Platform functionality" }
  ]

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-blue-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <main className="app-container py-16 relative">
        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <Badge variant="soft" className="mb-6 animate-fade-in">
            <Shield className="h-3 w-3 mr-1" />
            Privacy & Security
          </Badge>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-balance animate-slide-up" style={{ animationDelay: '200ms' }}>
            Privacy <span className="bg-gradient-to-r from-primary via-green-500 to-blue-500 bg-clip-text text-transparent">Policy</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-serif leading-relaxed animate-slide-up" style={{ animationDelay: '400ms' }}>
            We value your privacy and are committed to protecting your personal information. 
            Learn how we collect, use, and safeguard your data.
          </p>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mt-8 animate-slide-up" style={{ animationDelay: '600ms' }}>
            <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full border">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <span className="text-foreground font-medium">Privacy Policy</span>
            </div>
          </nav>
        </div>

        {/* Last Updated Banner */}
        <Card variant="soft" className="mb-12 p-6 text-center animate-slide-up" style={{ animationDelay: '800ms' }}>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Last Updated: January 2025</span>
          </div>
          <p className="text-sm text-muted-foreground">
            This privacy policy is effective immediately and applies to all users of CampusAxis.
          </p>
        </Card>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-slide-up" style={{ animationDelay: '1000ms' }}>
          <Card variant="glass" className="text-center p-6 hover-lift transition-all duration-300">
            <Shield className="h-8 w-8 mx-auto mb-3 text-green-500" />
            <h3 className="font-semibold mb-2">Secure by Design</h3>
            <p className="text-sm text-muted-foreground">Industry-standard encryption</p>
          </Card>
          <Card variant="glass" className="text-center p-6 hover-lift transition-all duration-300">
            <Lock className="h-8 w-8 mx-auto mb-3 text-blue-500" />
            <h3 className="font-semibold mb-2">Data Minimization</h3>
            <p className="text-sm text-muted-foreground">We collect only what we need</p>
          </Card>
          <Card variant="glass" className="text-center p-6 hover-lift transition-all duration-300">
            <UserCheck className="h-8 w-8 mx-auto mb-3 text-purple-500" />
            <h3 className="font-semibold mb-2">User Control</h3>
            <p className="text-sm text-muted-foreground">You own your data</p>
          </Card>
        </div>

        {/* Privacy Sections */}
        <div className="grid gap-8 max-w-5xl mx-auto mb-16">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <Card 
                key={index} 
                variant="glass" 
                className="hover-lift transition-all duration-500 animate-slide-up"
                style={{ animationDelay: `${1200 + (index * 200)}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${section.bgColor} flex-shrink-0`}>
                      <Icon className={`h-6 w-6 ${section.color}`} />
                    </div>
                    <CardTitle className="text-2xl">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {Array.isArray(section.content) ? (
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                          <span className="text-muted-foreground font-serif leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground font-serif text-lg leading-relaxed">
                      {section.content}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Data Retention Table */}
        <Card variant="elevated" className="mb-16 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Database className="h-5 w-5" />
              </div>
              Data Retention Schedule
            </CardTitle>
            <p className="text-muted-foreground">How long we keep different types of information</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-semibold">Data Type</th>
                    <th className="text-left py-3 font-semibold">Retention Period</th>
                    <th className="text-left py-3 font-semibold">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {dataTypes.map((data, index) => (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className="py-3 font-medium">{data.type}</td>
                      <td className="py-3 text-muted-foreground">{data.retention}</td>
                      <td className="py-3 text-muted-foreground">{data.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card variant="elevated" className="p-8 border-l-4 border-l-primary">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary flex-shrink-0">
              <Mail className="h-6 w-6" />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Questions About This Policy?</h3>
              <p className="text-muted-foreground font-serif leading-relaxed">
                If you have any questions about this privacy policy, how we handle your data, 
                or want to exercise your rights, please don't hesitate to contact us. 
                We're committed to transparency and will respond promptly to your inquiries.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="interactive hover-lift" asChild>
                  <Link href="/contact">
                    Contact Privacy Team
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="interactive hover-lift" asChild>
                  <Link href="/terms">View Terms of Service</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold mb-4">Manage Your Privacy</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/profile" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-accent transition-colors">
              <Settings className="h-4 w-4" />
              Privacy Settings
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-accent transition-colors">
              <Mail className="h-4 w-4" />
              Request Data Export
            </Link>
            <Link href="/help" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-accent transition-colors">
              <Shield className="h-4 w-4" />
              Privacy Help
            </Link>
          </div>
        </div>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy" }])) }}
      />
    </div>
  )
}
