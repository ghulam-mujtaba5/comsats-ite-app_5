import type { Metadata } from "next"
import { createMetadata, jsonLdBreadcrumb } from "@/lib/seo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Shield, Users, AlertTriangle, Mail, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = createMetadata({
  title: "Terms of Service — CampusAxis",
  description: "The rules and conditions for using CampusAxis.",
  path: "/terms",
  keywords: ["terms", "tos", "conditions", "CampusAxis"],
})

export default function TermsPage() {
  const sections = [
    {
      icon: CheckCircle,
      title: "Acceptance of Terms",
      content: "By accessing or using CampusAxis, you agree to these terms and all applicable policies. These terms constitute a legally binding agreement between you and CampusAxis.",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/30"
    },
    {
      icon: Users,
      title: "User Responsibilities",
      content: [
        "Follow community guidelines and respect others at all times",
        "Do not post prohibited, unlawful, or harmful content",
        "Use the platform for academic support purposes only",
        "Maintain the confidentiality of your account credentials",
        "Report any violations or suspicious activities promptly"
      ],
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30"
    },
    {
      icon: Shield,
      title: "Content Moderation",
      content: "Administrators reserve the right to remove content and restrict features to protect the community. We maintain zero tolerance for harassment, spam, or inappropriate behavior.",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/30"
    },
    {
      icon: AlertTriangle,
      title: "Prohibited Activities",
      content: [
        "Sharing copyrighted material without permission",
        "Creating fake accounts or impersonating others",
        "Attempting to bypass security measures or hack the platform",
        "Posting spam, advertisements, or irrelevant content",
        "Engaging in any form of harassment or discrimination"
      ],
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/30"
    },
    {
      icon: FileText,
      title: "Intellectual Property",
      content: "All content on CampusAxis, including but not limited to text, graphics, logos, and software, is protected by intellectual property laws. Users retain rights to their own content but grant CampusAxis a license to use it on the platform.",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/30"
    },
    {
      icon: Mail,
      title: "Contact & Support",
      content: "Questions about these terms? Contact us at campusaxis0@gmail.com. We're committed to transparency and will address any concerns promptly.",
      color: "text-cyan-500",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/30"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <main className="app-container py-16 relative">
        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <Badge variant="soft" className="mb-6 animate-fade-in">
            <FileText className="h-3 w-3 mr-1" />
            Legal Information
          </Badge>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-balance animate-slide-up" style={{ animationDelay: '200ms' }}>
            Terms of <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">Service</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-serif leading-relaxed animate-slide-up" style={{ animationDelay: '400ms' }}>
            Please read these terms carefully before using CampusAxis. 
            By using our platform, you agree to abide by these conditions.
          </p>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mt-8 animate-slide-up" style={{ animationDelay: '600ms' }}>
            <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full border">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <span className="text-foreground font-medium">Terms of Service</span>
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
            We may update these terms from time to time. Continued use of the platform constitutes acceptance of any changes.
          </p>
        </Card>

        {/* Terms Sections */}
        <div className="grid gap-8 max-w-5xl mx-auto">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <Card 
                key={index} 
                variant="glass" 
                className="hover-lift transition-all duration-500 animate-slide-up"
                style={{ animationDelay: `${1000 + (index * 200)}ms` }}
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

        {/* Important Notice */}
        <Card variant="elevated" className="mt-16 p-8 border-l-4 border-l-primary">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary flex-shrink-0">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Important Notice</h3>
              <p className="text-muted-foreground font-serif leading-relaxed">
                These terms are effective immediately upon posting. If you do not agree with these terms, 
                please discontinue use of CampusAxis. We reserve the right to modify these terms at any time, 
                and such modifications will be effective immediately upon posting.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="interactive hover-lift" asChild>
                  <Link href="/contact">
                    Have Questions?
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="interactive hover-lift" asChild>
                  <Link href="/privacy">View Privacy Policy</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Related Links */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold mb-4">Related Information</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/privacy" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-accent transition-colors">
              <Shield className="h-4 w-4" />
              Privacy Policy
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-accent transition-colors">
              <Mail className="h-4 w-4" />
              Contact Support
            </Link>
            <Link href="/help" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-accent transition-colors">
              <FileText className="h-4 w-4" />
              Help Center
            </Link>
          </div>
        </div>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: "Home", path: "/" }, { name: "Terms of Service", path: "/terms" }])) }}
      />
    </div>
  )
}
