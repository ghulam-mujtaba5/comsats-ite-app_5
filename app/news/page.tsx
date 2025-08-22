"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowLeft } from "lucide-react"
import { Footer } from "@/components/layout/footer"

type News = {
  id: string
  title: string
  content: string
  status: "draft" | "published"
  published_at: string | null
  created_at?: string
}

const PAGE_SIZE = 10

export default function NewsListPage() {
  const [items, setItems] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/news')
        const json = await res.json()
        setItems(json.data || [])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return items
    return items.filter(n => n.title.toLowerCase().includes(term) || n.content.toLowerCase().includes(term))
  }, [items, q])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    // reset to page 1 when filter changes
    setPage(1)
  }, [q])

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-10 px-4">
        <div className="container mx-auto max-w-5xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Latest News & Updates</h1>
              <p className="text-muted-foreground">Announcements, schedules, and important updates</p>
            </div>
            <Button asChild variant="outline" className="bg-transparent hidden sm:flex">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="flex gap-3 items-center">
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search news..." className="max-w-sm" />
          </div>

          {loading ? (
            <p>Loading…</p>
          ) : (
            <div className="space-y-4">
              {pageItems.map(n => (
                <Card key={n.id}>
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      {n.published_at ? new Date(n.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Draft'}
                    </div>
                    <CardTitle className="text-xl">{n.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="whitespace-pre-wrap">{n.content}</CardDescription>
                  </CardContent>
                </Card>
              ))}
              {pageItems.length === 0 && (
                <Card><CardContent className="p-6"><CardDescription>No results.</CardDescription></CardContent></Card>
              )}

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <Button variant="outline" className="bg-transparent" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</Button>
                  <div className="text-sm text-muted-foreground">Page {page} of {totalPages}</div>
                  <Button variant="outline" className="bg-transparent" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
