"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UnifiedGlassCard } from "@/components/shared/UnifiedGlassCard"
import { Calendar, ArrowRight, Clock, Tag, TrendingUp, Zap, Flame } from "lucide-react"
import { motion } from "framer-motion"
import { StaggerContainer, StaggerItem, AnimatedCard, FadeInScroll } from "@/components/animations/enhanced"
import { useCelebrationAnimations } from "@/hooks/use-celebration-animations"
import { useAnimation } from "@/contexts/animation-context"
import { useMotivationalFeedback } from "@/components/motivational/unified-feedback-system"
import layout from "@/app/styles/common.module.css"

type News = {
  id: string
  title: string
  content: string
  image_url?: string | null
  status: "draft" | "published"
  published_at: string | null
}

export function EnhancedNews() {
  const [items, setItems] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMock, setIsMock] = useState(false)
  const [maxCount, setMaxCount] = useState(4)
  const { triggerConfetti } = useCelebrationAnimations()
  const { isAnimationEnabled } = useAnimation()
  const { triggerFeedback } = useMotivationalFeedback()

  useEffect(() => {
    ;(async () => {
      try {
        // Use the same source as /news-events page for consistency
        const res = await fetch('/api/news-events/news')
        if (!res.ok) {
          const body = await res.text().catch(() => '')
          setError(`Failed to load news: ${res.status} ${res.statusText}${body ? ` - ${body}` : ''}`)
          setItems([])
          return
        }
        setIsMock(res.headers.get('X-Mock-Data') === '1')
        const json = await res.json()
        // The /api/news-events/news endpoint returns an array of items with fields: id, title, content, imageUrl, publishedAt
        const arr: any[] = Array.isArray(json) ? json : []
        const mapped: News[] = arr.map((n) => ({
          id: n.id,
          title: n.title,
          content: n.content,
          image_url: n.imageUrl ?? null,
          status: 'published',
          published_at: n.publishedAt ?? null,
        }))
        // Items will be further sliced by maxCount effect
        setItems(mapped)
      } catch (e: any) {
        setError(e?.message || 'Failed to load news')
        setItems([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Responsively limit count: 2 on small screens, 4 on md+
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)')
    const apply = () => setMaxCount(mql.matches ? 4 : 2)
    apply()
    mql.addEventListener('change', apply)
    return () => mql.removeEventListener('change', apply)
  }, [])

  const handleViewAllNews = () => {
    if (isAnimationEnabled) {
      triggerConfetti({
        message: "Stay Updated!",
        duration: 3000,
        particleCount: 100
      })
      
      // Trigger motivational feedback
      triggerFeedback({
        type: 'content_created',
        message: "Staying informed!"
      })
    }
  }

  const newsStats = [
    { label: "News Published", value: "128", icon: Tag, change: "+12%" },
    { label: "Events This Month", value: "12", icon: Calendar, change: "+3" },
    { label: "Active Readers", value: "2,456", icon: TrendingUp, change: "+18%" },
    { label: "Top Stories", value: "24", icon: Flame, change: "+5" }
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background/80 glass-primary">
      <div className="max-w-7xl mx-auto w-full">
        {/* Enhanced Header with proper spacing */}
        <div className="text-center mb-16 md:mb-20">
          <Badge variant="soft" className="mb-4 md:mb-6 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-medium bg-gradient-to-r from-amber-600/30 to-orange-600/30 text-amber-700 dark:text-amber-300 border border-amber-600/40 glass-secondary">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            Campus Updates
          </Badge>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-balance mb-4 sm:mb-6">
            Stay Informed with{" "}
            <span className="bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
              Latest News
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-700 dark:text-slate-300/90 max-w-3xl mx-auto leading-relaxed">
            Never miss important announcements, events, and updates from COMSATS University. 
            Stay connected with the latest happenings on campus.
          </p>
        </div>

        {/* News Stats with proper spacing */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {newsStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 text-center transition-all duration-300 hover:shadow-xl glass-primary"
              >
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="p-2 sm:p-3 rounded-xl bg-amber-500/10">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300/90 mb-1 sm:mb-2">{stat.label}</div>
                <div className="text-[10px] sm:text-xs font-semibold text-green-600 flex items-center justify-center">
                  <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                  {stat.change}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Mock Data Warning with proper spacing */}
        {isMock && (
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-full text-sm">
              <Clock className="h-4 w-4" />
              <span>Showing sample data - non-persistent</span>
            </div>
          </div>
        )}

        {/* News Grid with proper spacing */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16" staggerDelay={0.1}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <StaggerItem key={i}>
                <UnifiedGlassCard className="border border-slate-200 dark:border-slate-700 rounded-2xl p-0">
                  <div className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-t-2xl" />
                  <div className="p-6">
                    <div className="h-4 sm:h-5 bg-slate-100 dark:bg-slate-900 rounded w-3/4 mb-2 sm:mb-3"></div>
                    <div className="h-3 sm:h-4 bg-slate-100 dark:bg-slate-900 rounded w-1/2"></div>
                    <div className="mt-4">
                      <div className="h-3 sm:h-4 bg-slate-100 dark:bg-slate-900 rounded w-full mb-2 sm:mb-3"></div>
                      <div className="h-3 sm:h-4 bg-slate-100 dark:bg-slate-900 rounded w-5/6 mb-4 sm:mb-6"></div>
                      <div className="h-8 sm:h-10 bg-slate-100 dark:bg-slate-900 rounded w-28 sm:w-32"></div>
                    </div>
                  </div>
                </UnifiedGlassCard>
              </StaggerItem>
            ))
          ) : items.length > 0 ? (
            items.slice(0, maxCount).map((item, index) => (
              <StaggerItem key={item.id}>
                <motion.div
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <UnifiedGlassCard 
                    variant="medium" 
                    interactive 
                    glow
                    className="group h-full overflow-hidden border border-slate-200 dark:border-slate-700 rounded-2xl transition-all duration-300 hover:border-amber-400 dark:hover:border-amber-600"
                  >
                    <div className="aspect-video relative overflow-hidden rounded-t-2xl">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <Badge className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-amber-500 text-amber-50 text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-md">
                        <Flame className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                        Featured
                      </Badge>
                      <Badge className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-primary text-primary-foreground text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-md">
                        Published
                      </Badge>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        {item.published_at ? new Date(item.published_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : 'Draft'}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold group-hover:text-amber-700 transition-colors line-clamp-2 mb-3">
                        {item.title}
                      </h3>
                      <p className="line-clamp-3 text-xs sm:text-sm mb-4 sm:mb-5 text-slate-700 dark:text-slate-300/90">
                        {item.content}
                      </p>
                      <Button asChild variant="ghost" size="sm" className="w-full justify-between rounded-lg sm:rounded-xl text-xs sm:text-sm px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-amber-700">
                        <Link href={`/news/${item.id}`}>
                          Read Full Story
                          <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                        </Link>
                      </Button>
                    </div>
                  </UnifiedGlassCard>
                </motion.div>
              </StaggerItem>
            ))
          ) : (
            <UnifiedGlassCard className="col-span-full text-center py-12 sm:py-16 border border-slate-200 dark:border-slate-700 rounded-2xl">
              <div>
                <Tag className="h-10 w-10 sm:h-14 sm:w-14 text-slate-700 dark:text-slate-300 mx-auto mb-4 sm:mb-5" />
                <p className="text-base sm:text-lg mb-2 sm:mb-3">{error ? error : 'No news yet.'}</p>
                <p className="text-sm sm:text-base text-muted-foreground">Check back later for updates</p>
              </div>
            </UnifiedGlassCard>
          )}
        </StaggerContainer>

        {/* View All Button with proper spacing */}
        <div className="text-center">
          <Button 
            asChild 
            size="lg" 
            className="px-8 py-4 text-base rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleViewAllNews}
          >
            <Link href="/news-events">
              View All News & Events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}