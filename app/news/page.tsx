"use client"

// Metadata imports removed due to "use client" directive
import { useEffect, useMemo, useState } from "react"
import { jsonLdCollectionPage } from "@/lib/seo"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowLeft, Search, Newspaper, TrendingUp, Clock, User, Eye, ChevronRight, Sparkles } from "lucide-react"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { cn } from "@/lib/utils"

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
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
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
    <div className="min-h-screen bg-mesh overflow-hidden relative">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLdCollectionPage({
              name: 'Campus News',
              description: 'Latest news and updates from CampusAxis / COMSATS.',
              path: '/news',
              items: pageItems.map(n => ({ name: n.title, url: `/news/${n.id}` })),
              itemType: 'NewsArticle'
            })
          )
        }}
      />
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '4s' }} />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-primary/30 rotate-45 animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-20 w-6 h-6 bg-blue-500/30 rounded-full animate-bounce" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-500/30 rotate-45 animate-bounce" style={{ animationDelay: '5s' }} />
      </div>

      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-blue-500/8" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20" />

      <main className="flex-1 py-24 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl space-y-10">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "News" }]} />
          
          {/* Enhanced Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary mb-6 hover:from-primary/20 hover:to-blue-500/20 transition-all duration-300 hover-lift">
              <Newspaper className="h-4 w-4" />
              Latest Updates
            </div>
            <h1 className="text-5xl lg:text-8xl font-bold leading-[0.9] text-balance mb-6">
              News &{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Updates
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-serif max-w-4xl mx-auto mb-4">
              Stay informed with the latest announcements, schedules, and important updates from 
              COMSATS Institute of Information Technology.
            </p>
            <p className="text-lg text-muted-foreground/80 font-light max-w-xl mx-auto">
              Fresh insights and timely information for our academic community
            </p>
            
            {isMock && (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-200/30 text-sm font-medium text-yellow-700">
                <Sparkles className="h-4 w-4" />
                Mock fallback data (non-persistent) is being shown.
              </div>
            )}
            
            <div className="flex justify-center mt-8">
              <Button asChild variant="outline" className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all duration-300 hover-lift">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>

          {/* Enhanced Search Interface */}
          <Card className="card-modern border-0 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 mb-10">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
                <Input 
                  value={q} 
                  onChange={e => setQ(e.target.value)} 
                  placeholder="Search news articles, announcements, and updates..." 
                  className="pl-12 h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 rounded-xl text-base font-medium focus:ring-2 focus:ring-primary/20 transition-all duration-300" 
                />
              </div>
              
              {/* Search Stats */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{filtered.length} articles found</span>
                  </div>
                  {q && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200/30">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Instant search</span>
                    </div>
                  )}
                </div>
                {q && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQ("")}
                    className="text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/50 transition-all duration-200"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div aria-live="polite" className="py-16">
              <CenteredLoader message="Loading latest news..." />
            </div>
          ) : (
            <div className="space-y-8">
              {error && (
                <Card className="card-modern border-0 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div className="max-w-md mx-auto">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                        <Newspaper className="h-8 w-8 text-red-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">Error Loading News</h3>
                      <CardDescription className="text-red-600 font-medium">{error}</CardDescription>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Enhanced News Grid */}
              <div className="grid gap-6">
                {pageItems.map((n, index) => (
                  <Link key={n.id} href={`/news/${n.id}`} className="block group">
                    <Card className="card-modern border-0 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 overflow-hidden hover-lift group-hover:scale-[1.02]">
                      <div className="relative">
                        {/* Article gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <CardHeader className="p-8 pb-4 relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:scale-110 transition-transform duration-300">
                                <Calendar className="h-4 w-4 text-primary" />
                              </div>
                              <span className="font-medium">
                                {n.published_at ? new Date(n.published_at).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric',
                                  weekday: 'short'
                                }) : 'Draft'}
                              </span>
                            </div>
                            <Badge 
                              variant={n.status === 'published' ? 'default' : 'secondary'}
                              className={cn(
                                "text-xs font-medium rounded-xl px-3 py-1",
                                n.status === 'published' 
                                  ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 border-green-200/30" 
                                  : "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 text-yellow-700 border-yellow-200/30"
                              )}
                            >
                              {n.status === 'published' ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                          
                          <CardTitle className="text-2xl lg:text-3xl font-bold leading-tight group-hover:text-primary transition-colors duration-300 mb-3">
                            {n.title}
                          </CardTitle>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span className="font-medium">COMSATS IT</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              <span className="font-medium">Public Article</span>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="p-8 pt-0 relative z-10">
                          <CardDescription className="text-base leading-relaxed font-serif whitespace-pre-wrap line-clamp-3 group-hover:text-foreground/80 transition-colors duration-300">
                            {n.content}
                          </CardDescription>
                          
                          <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:text-primary/80 transition-colors duration-300">
                              <span>Read full article</span>
                              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>2 min read</span>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
              
              {pageItems.length === 0 && !error && (
                <Card className="card-modern border-0 backdrop-blur-sm p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">No Articles Found</h3>
                    <CardDescription className="text-base">
                      {q ? `No articles match "${q}". Try different keywords.` : "No news articles available at the moment."}
                    </CardDescription>
                  </div>
                </Card>
              )}

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <Card className="card-modern border-0 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all duration-300 disabled:opacity-50"
                        disabled={page === 1}
                        aria-label="Go to previous page"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-4" aria-live="polite">
                        <div className="text-sm text-muted-foreground font-medium">
                          Page {page} of {totalPages}
                        </div>
                        <div className="text-xs text-muted-foreground px-3 py-1 rounded-xl bg-muted/50">
                          {filtered.length} total articles
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all duration-300 disabled:opacity-50"
                        disabled={page === totalPages}
                        aria-label="Go to next page"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
      {/* JSON-LD removed due to "use client" directive */}
    </div>
  )
}
