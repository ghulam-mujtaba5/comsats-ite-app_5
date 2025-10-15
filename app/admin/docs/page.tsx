"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  BookOpen, 
  FileText, 
  Users, 
  Settings,
  Shield,
  Calendar,
  Heart,
  Compass,
  Search,
  GraduationCap
} from "lucide-react"
import { BrandedBanner } from "@/components/layout/branded-banner"

export default function DocumentationPage() {
  const docs = [
    // Admissions System documentation removed as per user request to delete admissions module
    {
      title: "User Management",
      description: "Managing user accounts and permissions",
      icon: Users,
      href: "#",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Content Moderation",
      description: "Reviewing and moderating user content",
      icon: Shield,
      href: "#",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "News & Events",
      description: "Managing announcements and events",
      icon: Calendar,
      href: "#",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Support System",
      description: "Handling student support requests",
      icon: Heart,
      href: "#",
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Guidance Content",
      description: "Managing academic guidance materials",
      icon: Compass,
      href: "#",
      color: "from-indigo-500 to-blue-500"
    },
    {
      title: "Lost & Found",
      description: "Managing lost and found items",
      icon: Search,
      href: "#",
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "System Configuration",
      description: "Admin settings and configuration",
      icon: Settings,
      href: "#",
      color: "from-blue-500 to-cyan-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <BrandedBanner 
        title="Admin Documentation"
        description="Comprehensive guides and resources for system administrators"
        variant="gradient"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-muted-foreground mb-4">
              Select a documentation topic to get started
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive guides and resources to help you effectively manage the CampusAxis platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {docs.map((doc) => {
              const Icon = doc.icon
              return (
                <Card 
                  key={doc.title} 
                  className="glass-card hover:glass-hover-glow transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${doc.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                    <CardDescription>{doc.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      asChild 
                      variant="outline" 
                      className="w-full glass-button"
                      disabled={doc.href === "#"}
                    >
                      <Link href={doc.href}>
                        View Documentation
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          
          <div className="mt-12 text-center">
            <Card className="glass-card max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>
                  Contact the development team for additional support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you need assistance with any administrative functions not covered in these documents, 
                  please reach out to the technical support team.
                </p>
                <Button asChild>
                  <Link href="/admin/support">
                    Contact Support
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}