"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import layout from "@/app/styles/common.module.css"

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
    <section className="py-16 px-4 bg-muted/20">
      <div className={`${layout.section} ${layout.max6xl}`}>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-3">Growing Community</h2>
            <p className="text-base text-muted-foreground">
              Connect with fellow students and share academic experiences
            </p>
          </div>
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {items.map((c) => (
              <Card key={c.id} className="group hover:shadow-md transition-all duration-300 border">
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{c.title}</CardTitle>
                  {c.subtitle && <div className="text-sm text-muted-foreground">{c.subtitle}</div>}
                </CardHeader>
                <CardContent className="space-y-3">
                  {c.description && <CardDescription className="text-sm">{c.description}</CardDescription>}
                  {c.link_url && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={c.link_url} target={c.link_url.startsWith('http') ? '_blank' : undefined}>
                        Learn more
                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
            {items.length === 0 && (
              <Card>
                <CardContent className="p-5">
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