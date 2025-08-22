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

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/news')
        const json = await res.json()
        const data: News[] = json.data || []
        // Only show up to 4 latest
        setItems(data.slice(0, 4))
      } catch (e) {
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
          </div>
          <Button variant="outline" asChild className="hidden sm:flex bg-transparent">
            <Link href="/news">
              View All News
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        {loading ? (
          <p>Loading…</p>
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
                  <CardDescription>No news yet.</CardDescription>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="text-center mt-8 sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/news">
              View All News
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
