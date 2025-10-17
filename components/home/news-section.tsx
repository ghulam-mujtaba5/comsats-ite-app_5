"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight, Clock, Tag } from "lucide-react"
import Link from "next/link"
import layout from "@/app/styles/common.module.css"
import { useEffect, useState } from "react"

type News = {
  id: string
  title: string
  content: string
  image_url?: string | null
  status: "draft" | "published"
  published_at: string | null
}

export function NewsSection() {
  const [items, setItems] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMock, setIsMock] = useState(false)
  const [maxCount, setMaxCount] = useState(4)

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

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background glass-primary">
      <div className={`${layout.section} ${layout.max6xl}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center glass-interactive">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Latest News & Updates</h2>
            </div>
            <p className="text-base text-muted-foreground max-w-2xl">
              Stay informed about important announcements and events happening at COMSATS University
            </p>
            {isMock && (
              <div className="mt-3 text-sm border border-yellow-300 bg-yellow-50 text-yellow-900 rounded-lg px-4 py-2 inline-flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Mock fallback data (non-persistent) is being shown.
              </div>
            )}
          </div>
          <Button variant="outline" size="lg" className="hidden sm:flex px-6 py-3 text-base rounded-xl border-2 glass-interactive" asChild>
            <Link href="/news-events">
              View All News
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`nsk-${i}`} className="slide-up">
                <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
                  <div className="sk-thumb skeleton aspect-video" />
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="loader-ring sm" />
                      <div className="sk-line w-24 rounded" />
                    </div>
                    <div className="sk-title w-3/4 rounded h-6" />
                    <div className="sk-line w-full rounded" />
                    <div className="sk-line w-5/6 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.slice(0, maxCount).map((item) => (
              <Link key={item.id} href={`/news/${item.id}`} className="block group">
              <Card className="group hover:shadow-xl transition-all duration-500 overflow-hidden border bg-card/80 backdrop-blur-sm hover:-translate-y-1 glass-interactive">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full shadow-md glass-interactive">Published</Badge>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    {item.published_at ? new Date(item.published_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : 'Draft'}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3 text-base">
                    {item.content}
                  </CardDescription>
                </CardContent>
              </Card>
              </Link>
            ))}
            {items.length === 0 && (
              <Card className="col-span-full glass-subtle">
                <CardContent className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center py-8">
                    <Tag className="h-12 w-12 text-muted-foreground mb-4" />
                    <CardDescription className="text-lg mb-2">{error ? error : 'No news yet.'}</CardDescription>
                    <p className="text-muted-foreground">Check back later for updates</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="text-center mt-8 sm:hidden">
          <Button variant="outline" size="lg" className="px-6 py-3 text-base rounded-xl border-2 glass-interactive" asChild>
            <Link href="/news-events">
              View All News
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}