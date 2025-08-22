"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ArrowLeft } from "lucide-react"
import { Footer } from "@/components/layout/footer"

type News = {
  id: string
  title: string
  content: string
  image_url?: string | null
  status: "draft" | "published"
  published_at: string | null
}

export default function NewsDetailPage() {
  const params = useParams() as { id: string }
  const router = useRouter()
  const [item, setItem] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/api/news/${params.id}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Not found')
        setItem(json.data)
      } catch (e: any) {
        setError(e.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    })()
  }, [params.id])

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-10 px-4">
        <div className="container mx-auto max-w-3xl space-y-6">
          <Button variant="outline" className="bg-transparent" asChild>
            <Link href="/news"><ArrowLeft className="h-4 w-4 mr-2" /> Back to News</Link>
          </Button>

          {loading ? (
            <p>Loading…</p>
          ) : error ? (
            <Card><CardContent className="p-6">{error}</CardContent></Card>
          ) : item ? (
            <article className="space-y-4">
              <h1 className="text-3xl font-bold">{item.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Draft'}
              </div>
              {item.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image_url} alt={item.title} className="w-full rounded-lg" />
              )}
              <div className="prose prose-neutral max-w-none whitespace-pre-wrap">
                {item.content}
              </div>
            </article>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  )
}
