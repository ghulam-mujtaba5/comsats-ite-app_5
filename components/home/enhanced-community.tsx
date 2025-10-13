"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, MessageSquare, TrendingUp, Zap, Flame, Star, Calendar, Hash } from "lucide-react"
import { motion } from "framer-motion"
import { StaggerContainer, StaggerItem, AnimatedCard, FadeInScroll } from "@/components/animations/enhanced"
import { useCelebrationAnimations } from "@/hooks/use-celebration-animations"
import { useAnimation } from "@/contexts/animation-context"
import { useMotivationalFeedback } from "@/components/motivational"

type CommunityCard = {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  link_url: string | null
  sort_order: number
}

export function EnhancedCommunity() {
  const [items, setItems] = useState<CommunityCard[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const { triggerConfetti } = useCelebrationAnimations()
  const { isAnimationEnabled } = useAnimation()
  const { triggerFeedback } = useMotivationalFeedback()

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/community-cards')
        const json = await res.json()
        const data: CommunityCard[] = json.data || []
        setItems(data)
      } catch (e) {
        setItems([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const communityStats = [
    { label: "Active Members", value: "2,847", icon: Users, change: "+12%" },
    { label: "Community Posts", value: "1,248", icon: MessageSquare, change: "+8%" },
    { label: "Weekly Engagement", value: "89%", icon: TrendingUp, change: "+5%" },
    { label: "Top Contributors", value: "156", icon: Star, change: "+3%" }
  ]

  const handleJoinCommunity = () => {
    if (isAnimationEnabled) {
      triggerConfetti({
        message: "Welcome to the Community!",
        duration: 3000,
        particleCount: 100
      })
      
      // Trigger motivational feedback
      triggerFeedback({
        type: 'peer_interaction',
        message: "Joined the community!"
      })
    }
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background">
      <div className="app-container max-w-6xl mx-auto">
        {/* Header with enhanced styling and proper spacing */}
        <div className="text-center mb-20">
          <Badge variant="soft" className="mb-6 px-4 py-2 text-base font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30">
            <Flame className="h-4 w-4 mr-2" />
            Student Community
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-balance mb-6">
            Connect with Your{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Academic Community
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join thousands of COMSATS students sharing knowledge, opportunities, and academic journeys. 
            Engage in discussions, share resources, and build meaningful connections.
          </p>
        </div>

        {/* Community Stats with proper spacing */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {communityStats.map((stat, index) => {
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
                  <div className="p-3 rounded-xl bg-purple-500/10">
                    <Icon className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
                <div className="text-xs font-medium text-green-500 flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Community Tabs with proper spacing */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {["all", "discussions", "resources", "events", "projects"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              size="sm"
              className={`rounded-full px-5 py-2 ${activeTab === tab ? '' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {/* Community Items Grid with proper spacing */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16" staggerDelay={0.1}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <StaggerItem key={i}>
                <Card className="border border-white/20 rounded-2xl">
                  <CardHeader>
                    <div className="h-5 bg-muted rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-3"></div>
                    <div className="h-4 bg-muted rounded w-5/6 mb-6"></div>
                    <div className="h-10 bg-muted rounded w-32"></div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))
          ) : items.length > 0 ? (
            items.map((item, index) => (
              <StaggerItem key={item.id}>
                <motion.div
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatedCard 
                    enableHover={true} 
                    className="group h-full border border-white/20 rounded-2xl bg-card/80 backdrop-blur-xl transition-all duration-300 hover:shadow-xl"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center">
                            {item.title}
                            <Zap className="h-4 w-4 ml-2 text-amber-500" />
                          </CardTitle>
                          {item.subtitle && (
                            <div className="text-sm text-muted-foreground mt-2">{item.subtitle}</div>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          <Flame className="h-3 w-3 mr-1" />
                          Hot
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {item.description && (
                        <CardDescription className="text-sm">
                          {item.description}
                        </CardDescription>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>1.2k members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-medium">4.8</span>
                        </div>
                      </div>
                      {item.link_url && (
                        <Button asChild variant="outline" size="sm" className="w-full rounded-xl">
                          <Link href={item.link_url} target={item.link_url.startsWith('http') ? '_blank' : undefined}>
                            Join Community
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </CardContent>
                  </AnimatedCard>
                </motion.div>
              </StaggerItem>
            ))
          ) : (
            <Card className="col-span-full text-center p-16 border border-white/20 rounded-2xl bg-card/80 backdrop-blur-xl">
              <CardContent>
                <Users className="h-14 w-14 text-muted-foreground mx-auto mb-5" />
                <CardTitle className="mb-3">No Community Items Yet</CardTitle>
                <CardDescription className="mb-6">
                  Be the first to create a community discussion!
                </CardDescription>
                <Button onClick={handleJoinCommunity} className="rounded-xl">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Start a Discussion
                </Button>
              </CardContent>
            </Card>
          )}
        </StaggerContainer>

        {/* Enhanced CTA Section with proper spacing */}
        <FadeInScroll className="text-center" delay={0.3}>
          <AnimatedCard 
            enableHover={true} 
            className="p-10 border border-white/20 bg-card/80 backdrop-blur-2xl shadow-2xl rounded-3xl max-w-3xl mx-auto"
          >
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative p-5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl">
                  <Users className="h-12 w-12 text-purple-500" />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">Ready to Join the Community?</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Connect with fellow students, share your knowledge, and be part of the growing COMSATS academic community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button 
                  size="lg" 
                  className="text-base px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                  onClick={handleJoinCommunity}
                  asChild
                >
                  <Link href="/community" className="flex items-center justify-center">
                    Join Community
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    <motion.div 
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base px-8 py-4 rounded-xl border-2 hover:shadow-md transition-all duration-300"
                  asChild
                >
                  <Link href="/community" className="flex items-center justify-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Browse Discussions
                  </Link>
                </Button>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-6">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span>2,847 Active Members</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-amber-500" />
                  <span>1,248 Posts Today</span>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </FadeInScroll>

        {/* Trending Topics with proper spacing */}
        <div className="mt-24">
          <h3 className="text-2xl font-bold text-center mb-10">Trending Topics</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {["#FinalYearProject", "#Internship", "#Career", "#StudyGroup", "#Programming", "#AI", "#Research", "#Scholarship"].map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1 }}
              >
                <Badge 
                  variant="secondary" 
                  className="px-5 py-2.5 text-base cursor-pointer rounded-full"
                >
                  <Hash className="h-4 w-4 mr-1" />
                  {tag}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}