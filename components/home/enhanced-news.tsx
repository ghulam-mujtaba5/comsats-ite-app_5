"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight, Clock, Tag, TrendingUp, Zap, Flame } from "lucide-react"
import { motion } from "framer-motion"
import { StaggerContainer, StaggerItem, AnimatedCard, FadeInScroll } from "@/components/animations/enhanced"
import { useCelebrationAnimations } from "@/hooks/use-celebration-animations"
import { useAnimation } from "@/contexts/animation-context"

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
    }
  }

  const newsStats = [
    { label: "News Published", value: "128", icon: Tag, change: "+12%" },
    { label: "Events This Month", value: "12", icon: Calendar, change: "+3" },
    { label: "Active Readers", value: "2,456", icon: TrendingUp, change: "+18%" },
    { label: "Top Stories", value: "24", icon: Flame, change: "+5" }
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background glass-hero glass-depth">
      <div className="app-container max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <Badge variant="soft" className="mb-6 px-4 py-2 text-base font-medium bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 glass-button glass-border-light glass-depth">
            <Zap className="h-4 w-4 mr-2" />
            Campus Updates
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-balance mb-6">
            Stay Informed with{" "}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Latest News
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Never miss important announcements, events, and updates from COMSATS University. 
            Stay connected with the latest happenings on campus.
          </p>
        </div>

        {/* News Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {newsStats.map((stat, index) => {
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
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Icon className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                <div className="text-xs font-medium text-green-500 flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Mock Data Warning */}
        {isMock && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-full text-sm">
              <Clock className="h-4 w-4" />
              <span>Showing sample data - non-persistent</span>
            </div>
          </div>
        )}

        {/* News Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" staggerDelay={0.1}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <StaggerItem key={i}>
                <Card className="border glass-card glass-border-subtle glass-depth">
                  <div className="aspect-video bg-muted rounded-t-lg" />
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-3 bg-muted rounded w-full mb-2"></div>
                    <div className="h-3 bg-muted rounded w-5/6 mb-4"></div>
                    <div className="h-8 bg-muted rounded w-24"></div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))
          ) : items.length > 0 ? (
            items.slice(0, maxCount).map((item, index) => (
              <StaggerItem key={item.id}>
                <motion.div
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatedCard 
                    enableHover={true} 
                    className="group h-full overflow-hidden border glass-card glass-border-subtle glass-hover glass-depth"
                    data-testid="news-card"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <Badge className="absolute top-4 left-4 bg-amber-500 text-amber-50 text-xs px-2.5 py-1 rounded-full shadow-md glass-button glass-border-light glass-depth">
                        <Flame className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                      <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-2.5 py-1 rounded-full shadow-md glass-button glass-border-light glass-depth">
                        Published
                      </Badge>
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        {item.published_at ? new Date(item.published_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : 'Draft'}
                      </div>
                      <CardTitle className="text-lg group-hover:text-amber-600 transition-colors line-clamp-2">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-3 text-sm">
                        {item.content}
                      </CardDescription>
                      <Button asChild variant="ghost" size="sm" className="mt-4 w-full justify-between glass-button glass-border-subtle glass-hover glass-depth">
                        <Link href={`/news/${item.id}`}>
                          Read Full Story
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </AnimatedCard>
                </motion.div>
              </StaggerItem>
            ))
          ) : (
            <Card className="col-span-full text-center py-12 glass-card glass-border-subtle glass-depth">
              <CardContent>
                <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardDescription className="text-lg mb-2">{error ? error : 'No news yet.'}</CardDescription>
                <p className="text-muted-foreground">Check back later for updates</p>
              </CardContent>
            </Card>
          )}
        </StaggerContainer>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            asChild 
            size="lg" 
            className="px-8 py-3 text-base rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 glass-button glass-border-light glass-hover glass-depth"
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