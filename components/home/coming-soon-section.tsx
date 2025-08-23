import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Users, PackageSearch, Newspaper, HelpCircle, LifeBuoy } from "lucide-react"

const betaFeatures = [
  {
    title: "Student Community",
    href: "/community",
    description: "Join discussions, share updates, and connect with peers.",
    icon: Users,
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
  },
]

export function ComingSoonSection() {
  return (
    <section className="py-20 px-4 bg-background border-t">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Beta Testing Area</h2>
          <p className="text-lg text-muted-foreground mt-4 font-serif">Try early versions of upcoming sections. Share feedback while we polish them.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {betaFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Link key={index} href={feature.href} className="block group">
                <Card className="bg-background shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-0.5">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        {feature.title}
                        <Badge variant="secondary" className="text-xs">Beta</Badge>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground font-serif">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
