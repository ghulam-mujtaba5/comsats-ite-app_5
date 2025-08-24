import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
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

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/news')
        if (!res.ok) {
          const body = await res.text().catch(() => '')
          setError(`Failed to load news: ${res.status} ${res.statusText}${body ? ` - ${body}` : ''}`)
          setItems([])
          return
        }
        setIsMock(res.headers.get('X-Mock-Data') === '1')
        const json = await res.json()
        const data: News[] = json.data || []
        // Only show up to 4 latest
        setItems(data.slice(0, 4))
      } catch (e: any) {
        setError(e?.message || 'Failed to load news')
        setItems([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Latest News & Updates</h2>
            <p className="text-lg text-muted-foreground font-serif">
              Stay informed about important announcements and events
            </p>
            {isMock && (
              <div className="mt-3 text-xs border border-yellow-300 bg-yellow-50 text-yellow-900 rounded px-3 py-2">
                Mock fallback data (non-persistent) is being shown.
              </div>
            )}
          </div>
          <Button variant="outline" asChild className="hidden sm:flex bg-transparent">
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
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="sk-thumb skeleton" />
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="loader-ring sm" />
                      <div className="sk-line w-24 rounded" />
                    </div>
                    <div className="sk-title w-3/4 rounded" />
                    <div className="sk-line w-full rounded" />
                    <div className="sk-line w-5/6 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`} className="block">
              <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">Published</Badge>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    {item.published_at ? new Date(item.published_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : 'Draft'}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="font-serif line-clamp-3">{item.content}</CardDescription>
                </CardContent>
              </Card>
              </Link>
            ))}
            {items.length === 0 && (
              <Card>
                <CardContent className="p-6">
                  <CardDescription>{error ? error : 'No news yet.'}</CardDescription>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="text-center mt-8 sm:hidden">
          <Button variant="outline" asChild>
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
