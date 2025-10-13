"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Users, PackageSearch, Newspaper, HelpCircle, LifeBuoy, Sparkles, Clock, Zap, Rocket, Flame, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { StaggerContainer, StaggerItem, AnimatedCard } from "@/components/animations/enhanced"
import { useCelebrationAnimations } from "@/hooks/use-celebration-animations"
import { useAnimation } from "@/contexts/animation-context"
import { useMotivationalFeedback } from "@/components/motivational"

export function EnhancedComingSoon() {
  const { triggerConfetti } = useCelebrationAnimations()
  const { isAnimationEnabled } = useAnimation()
  const { triggerFeedback } = useMotivationalFeedback()

  const betaFeatures = [
    {
      title: "AI Study Assistant",
      description: "Personalized study recommendations powered by artificial intelligence",
      icon: Sparkles,
      status: "beta",
      popularity: 92,
      href: "/ai-assistant"
    },
    {
      title: "Virtual Study Groups",
      description: "Connect with classmates for collaborative learning sessions",
      icon: Users,
      status: "beta",
      popularity: 78,
      href: "/study-groups"
    },
    {
      title: "Career Path Explorer",
      description: "Discover career opportunities based on your academic interests",
      icon: PackageSearch,
      status: "beta",
      popularity: 85,
      href: "/career-explorer"
    },
    {
      title: "Campus News Hub",
      description: "Stay updated with the latest campus announcements and events",
      icon: Newspaper,
      status: "live",
      popularity: 95,
      href: "/news"
    },
    {
      title: "Peer Support Network",
      description: "Connect with mentors and get help from senior students",
      icon: HelpCircle,
      status: "live",
      popularity: 88,
      href: "/peer-support"
    },
    {
      title: "Emergency Support",
      description: "Quick access to campus emergency contacts and resources",
      icon: LifeBuoy,
      status: "beta",
      popularity: 70,
      href: "/emergency"
    }
  ]

  const handleFeatureClick = (title: string) => {
    if (isAnimationEnabled) {
      triggerConfetti({
        message: `Exploring ${title}!`,
        duration: 2000,
        particleCount: 50
      })
      
      // Trigger motivational feedback
      triggerFeedback({
        type: 'challenge_completed',
        message: `Exploring ${title}!`
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
    <section className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background">
      <div className="app-container max-w-6xl mx-auto">
        {/* Enhanced Header with proper spacing */}
        <div className="text-center mb-20">
          <Badge variant="soft" className="mb-6 px-4 py-2 text-base font-medium bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-600 dark:text-violet-400 border border-violet-500/30">
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

        {/* Feature Stats with proper spacing */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {featureStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-5 rounded-2xl bg-card/80 backdrop-blur-lg border border-white/20 text-center transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-xl bg-violet-500/10">
                    <Icon className="h-6 w-6 text-violet-500" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Beta Features Grid with proper spacing */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16" staggerDelay={0.1}>
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
                    className="group h-full bg-card/80 border border-white/20 rounded-2xl shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 p-3 rounded-2xl">
                          <Icon className="h-7 w-7 text-violet-500" />
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
                      <p className="text-muted-foreground mb-5">{feature.description}</p>
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
        
        {/* Feedback CTA with proper spacing */}
        <StaggerContainer className="text-center" staggerDelay={0.1}>
          <StaggerItem>
            <Card className="inline-block p-8 border border-white/20 bg-card/80 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-amber-500" />
                  </div>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl font-semibold mb-2">Have ideas for new features?</h3>
                  <p className="text-muted-foreground">We're always looking for ways to improve CampusAxis. Share your suggestions with us!</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Link 
                    href="/report-issue" 
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-primary-foreground rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
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