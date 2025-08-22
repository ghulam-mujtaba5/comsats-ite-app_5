"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

type CommunityCard = {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  link_url: string | null
  sort_order: number
}

export function CommunitySection() {
  const [items, setItems] = useState<CommunityCard[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Growing Community</h2>
            <p className="text-lg text-muted-foreground font-serif">
              Connect with fellow students and share academic experiences
            </p>
          </div>
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((c) => (
              <Card key={c.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{c.title}</CardTitle>
                  {c.subtitle && <div className="text-sm text-muted-foreground">{c.subtitle}</div>}
                </CardHeader>
                <CardContent className="space-y-3">
                  {c.description && <CardDescription className="font-serif">{c.description}</CardDescription>}
                  {c.link_url && (
                    <Button asChild variant="outline" className="bg-transparent">
                      <Link href={c.link_url} target={c.link_url.startsWith('http') ? '_blank' : undefined}>
                        Learn more
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
            {items.length === 0 && (
              <Card>
                <CardContent className="p-6">
                  <CardDescription>No community items yet.</CardDescription>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
