"use client"

import { Badge } from "@/components/ui/badge"
import { UnifiedGlassCard } from "@/components/shared/UnifiedGlassCard"
import Link from "next/link"
import { Users, PackageSearch, Newspaper, HelpCircle, LifeBuoy, Sparkles, Clock, Zap, Rocket, Flame, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { StaggerContainer, StaggerItem, AnimatedCard } from "@/components/animations/enhanced"
import layout from "@/app/styles/common.module.css"
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
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background/80 glass-primary">
      <div className="max-w-7xl mx-auto w-full">
        {/* Enhanced Header with proper spacing */}
        <div className="text-center mb-10">
          <Badge variant="soft" className="mb-4 md:mb-6 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-medium bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 text-violet-700 dark:text-violet-300 border border-violet-600/40 glass-secondary">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            Beta Testing Area
          </Badge>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-balance mb-4 sm:mb-6">
            Upcoming{" "}
            <span className="bg-gradient-to-r from-violet-700 to-fuchsia-700 bg-clip-text text-transparent">
              Features
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-700 dark:text-slate-300/90 max-w-3xl mx-auto leading-relaxed">
            Try early versions of upcoming sections. Share feedback while we polish them to perfection. 
            Your input helps shape the future of CampusAxis!
          </p>
          
          <div className="mt-4 sm:mt-6 inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-violet-700 dark:text-violet-300 bg-violet-600/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            Your feedback helps us build better features
          </div>
        </div>

        {/* Feature Stats with proper spacing */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {featureStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <UnifiedGlassCard 
                  variant="medium" 
                  interactive
                  className="p-4 rounded-xl h-full border border-slate-200 dark:border-slate-700 text-center transition-all duration-300 hover:shadow-xl"
                >
                  <div className="flex justify-center mb-2">
                    <div className="p-2 rounded-lg bg-violet-500/10">
                      <Icon className="h-5 w-5 text-violet-500" />
                    </div>
                  </div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300/90">{stat.label}</div>
                </UnifiedGlassCard>
              </motion.div>
            )
          })}
        </div>

        {/* Beta Features Grid with proper spacing */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto mb-10" staggerDelay={0.1}>
          {betaFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleFeatureClick(feature.title)}
                >
                  <UnifiedGlassCard 
                    variant="medium" 
                    interactive 
                    glow
                    className="group h-full border border-slate-200 dark:border-slate-700 rounded-2xl transition-all duration-300 hover:border-violet-400 dark:hover:border-violet-600"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 p-2.5 sm:p-3 rounded-2xl">
                          <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-violet-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-1.5 sm:gap-2 mb-3">
                            {feature.title}
                            {feature.status === "beta" && (
                              <Badge variant="secondary" className="text-[10px] sm:text-xs px-2 py-0.5">
                                <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                                Beta
                              </Badge>
                            )}
                            {feature.status === "live" && (
                              <Badge className="text-[10px] sm:text-xs px-2 py-0.5 bg-green-500/20 text-green-700 dark:text-green-300">
                                Live
                              </Badge>
                            )}
                          </h3>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300/90 mb-4 sm:mb-5">{feature.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground">
                            <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                            <span>{feature.popularity}% popular</span>
                          </div>
                          <Link 
                            href={feature.href} 
                            className="text-[10px] sm:text-xs font-medium text-violet-700 dark:text-violet-300 hover:underline flex items-center"
                          >
                            Explore
                            <Rocket className="h-2.5 w-2.5 sm:h-3 sm:w-3 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </UnifiedGlassCard>
                </motion.div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
        
        {/* Feedback CTA with proper spacing */}
        <StaggerContainer className="text-center" staggerDelay={0.1}>
          <StaggerItem>
            <UnifiedGlassCard 
              variant="strong" 
              className="inline-block p-6 sm:p-8 border border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl shadow-2xl max-w-3xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                    <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-amber-500" />
                  </div>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold mb-1.5 sm:mb-2">Have ideas for new features?</h3>
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300/90">We're always looking for ways to improve CampusAxis. Share your suggestions with us!</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Link 
                    href="/report-issue" 
                    className="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-primary-foreground rounded-xl sm:rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    Share Feedback
                  </Link>
                </div>
              </div>
            </UnifiedGlassCard>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  )
}