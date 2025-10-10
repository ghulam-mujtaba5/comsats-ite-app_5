import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Users, PackageSearch, Newspaper, HelpCircle, LifeBuoy, Sparkles, Clock, Zap } from "lucide-react"

const betaFeatures = [
  {
    title: "Student Community",
    href: "/community",
    description: "Join discussions, share updates, and connect with peers.",
    icon: Users,
    isBeta: false, // Mark as fully functional
  },
  {
    title: "Lost & Found",
    href: "/lost-found",
    description: "Report lost items or help others by posting found items.",
    icon: PackageSearch,
  },
  {
    title: "News & Events",
    href: "/news-events",
    description: "Preview campus news and upcoming events in one place.",
    icon: Newspaper,
  },
  {
    title: "Guidance Portal",
    href: "/guidance",
    description: "Explore academic guidance and FAQs. Content is evolving.",
    icon: HelpCircle,
  },
  {
    title: "Student Support",
    href: "/student-support",
    description: "Access support resources for your academic journey.",
    icon: LifeBuoy,
    isBeta: false, // Mark as fully functional
  },
]

export function ComingSoonSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative p-4 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-2xl">
              <Zap className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Beta Testing Area</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Try early versions of upcoming sections. Share feedback while we polish them to perfection.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
            <Sparkles className="h-4 w-4" />
            Your feedback helps us build better features
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {betaFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Link key={index} href={feature.href} className="block group">
                <Card className="bg-card/80 border rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1 h-full backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-xl">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl font-semibold flex items-center gap-2">
                          {feature.title}
                          {feature.isBeta !== false && (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Beta
                            </Badge>
                          )}
                          {feature.isBeta === false && (
                            <Badge className="text-xs bg-green-500/20 text-green-700 dark:text-green-300">
                              Live
                            </Badge>
                          )}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
        
        {/* Feedback CTA */}
        <div className="text-center mt-12">
          <Card className="inline-block p-6 border bg-card/80 backdrop-blur-sm max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                  <Sparkles className="h-7 w-7 text-amber-500" />
                </div>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h3 className="text-xl font-semibold mb-1">Have ideas for new features?</h3>
                <p className="text-muted-foreground">We're always looking for ways to improve CampusAxis. Share your suggestions with us!</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <a href="/report-issue" className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground rounded-xl hover:from-primary/90 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl">
                  Share Feedback
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}