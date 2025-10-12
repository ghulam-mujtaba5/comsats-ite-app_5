"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Users, PackageSearch, Newspaper, HelpCircle, LifeBuoy, Sparkles, Clock, Zap, Rocket, Flame, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { StaggerContainer, StaggerItem, AnimatedCard } from "@/components/animations/enhanced"
import { useCelebrationAnimations } from "@/hooks/use-celebration-animations"
import { useAnimation } from "@/contexts/animation-context"

const betaFeatures = [
  {
    title: "Student Community",
    href: "/community",
    description: "Join discussions, share updates, and connect with peers.",
    icon: Users,
    isBeta: false, // Mark as fully functional
    status: "live",
    popularity: 92
  },
  {
    title: "Lost & Found",
    href: "/lost-found",
    description: "Report lost items or help others by posting found items.",
    icon: PackageSearch,
    status: "beta",
    popularity: 75
  },
  {
    title: "News & Events",
    href: "/news-events",
    description: "Preview campus news and upcoming events in one place.",
    icon: Newspaper,
    status: "beta",
    popularity: 88
  },
  {
    title: "Guidance Portal",
    href: "/guidance",
    description: "Explore academic guidance and FAQs. Content is evolving.",
    icon: HelpCircle,
    status: "beta",
    popularity: 81
  },
  {
    title: "Student Support",
    href: "/student-support",
    description: "Access support resources for your academic journey.",
    icon: LifeBuoy,
    isBeta: false, // Mark as fully functional
    status: "live",
    popularity: 95
  },
]

export function EnhancedComingSoon() {
  const { triggerConfetti } = useCelebrationAnimations()
  const { isAnimationEnabled } = useAnimation()

  const handleFeatureClick = (title: string) => {
    if (isAnimationEnabled) {
      triggerConfetti({
        message: `Exploring ${title}!`,
        duration: 2000,
        particleCount: 50
      })
    }
  }

  const featureStats = [
    { label: "Features in Beta", value: "3", icon: Rocket },
    { label: "Live Features", value: "2", icon: Flame },
    { label: "Avg. Satisfaction", value: "87%", icon: TrendingUp },
    { label: "Feedback Received", value: "142", icon: Sparkles }
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background glass-hero glass-depth">
      <div className="app-container max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <Badge variant="soft" className="mb-6 px-4 py-2 text-base font-medium bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-600 dark:text-violet-400 border border-violet-500/30 glass-button glass-border-light glass-depth">
            <Zap className="h-4 w-4 mr-2" />
            Beta Testing Area
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-balance mb-6">
            Upcoming{" "}
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Features
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Try early versions of upcoming sections. Share feedback while we polish them to perfection. 
            Your input helps shape the future of CampusAxis!
          </p>
          
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 bg-violet-500/10 px-4 py-2 rounded-full">
            <Sparkles className="h-4 w-4" />
            Your feedback helps us build better features
          </div>
        </div>

        {/* Feature Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {featureStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-4 rounded-xl glass-card glass-border-subtle glass-hover glass-depth text-center"
              >
                <div className="flex justify-center mb-2">
                  <div className="p-2 rounded-lg bg-violet-500/10">
                    <Icon className="h-5 w-5 text-violet-500" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Beta Features Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16" staggerDelay={0.1}>
          {betaFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleFeatureClick(feature.title)}
                >
                  <AnimatedCard 
                    enableHover={true} 
                    className="group h-full bg-card/80 border rounded-2xl shadow-lg backdrop-blur-sm glass-card glass-border-subtle glass-hover glass-depth"
                    data-testid="beta-feature-card"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 p-3 rounded-xl glass-button glass-border-light glass-depth">
                          <Icon className="h-6 w-6 text-violet-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl font-semibold flex items-center gap-2">
                            {feature.title}
                            {feature.status === "beta" && (
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                Beta
                              </Badge>
                            )}
                            {feature.status === "live" && (
                              <Badge className="text-xs bg-green-500/20 text-green-700 dark:text-green-300">
                                Live
                              </Badge>
                            )}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{feature.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          <span>{feature.popularity}% popular</span>
                        </div>
                        <Link 
                          href={feature.href} 
                          className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline flex items-center"
                        >
                          Explore
                          <Rocket className="h-3 w-3 ml-1" />
                        </Link>
                      </div>
                    </CardContent>
                  </AnimatedCard>
                </motion.div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
        
        {/* Feedback CTA */}
        <StaggerContainer className="text-center" staggerDelay={0.1}>
          <StaggerItem>
            <Card className="inline-block p-6 border bg-card/80 backdrop-blur-sm max-w-3xl mx-auto glass-card-premium glass-border-glow glass-depth">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 flex items-center justify-center glass-button glass-border-light glass-depth">
                    <Sparkles className="h-7 w-7 text-amber-500" />
                  </div>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl font-semibold mb-1">Have ideas for new features?</h3>
                  <p className="text-muted-foreground">We're always looking for ways to improve CampusAxis. Share your suggestions with us!</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Link 
                    href="/report-issue" 
                    className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-primary-foreground rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl glass-button glass-border-light glass-hover glass-depth"
                  >
                    Share Feedback
                  </Link>
                </div>
              </div>
            </Card>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  )
}