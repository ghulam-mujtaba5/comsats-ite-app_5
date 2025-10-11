"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowLeft, User, Clock, Bookmark, Eye, Newspaper, Sparkles } from "lucide-react"
// Footer is provided by the root layout; avoid importing locally to prevent duplicates
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { cn } from "@/lib/utils"
import { ShareButton } from "@/components/share/share-button"
import { SEOMeta } from "@/components/seo/seo-meta"

type News = {
  id: string
  title: string
  content: string
  image_url?: string | null
  status: "draft" | "published"
  published_at: string | null
}

export default function ArticleClient() {
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
    <>
      {item && (
        <SEOMeta
          title={item.title}
          description={item.content?.slice(0, 160)}
          image={item.image_url ?? undefined}
          type="article"
          publishedTime={item.published_at ?? undefined}
        />
      )}
      <div className="min-h-screen bg-mesh overflow-hidden relative">
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
        <div className="container mx-auto max-w-4xl space-y-10">
          {/* Enhanced Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all duration-300 hover-lift" asChild>
              <Link href="/news">
                <ArrowLeft className="h-4 w-4 mr-2" /> 
                Back to News
              </Link>
            </Button>
            
            {/* Article Actions */}
            {item && (
              <div className="flex items-center gap-3">
                <ShareButton
                  title={item.title}
                  text={item.content?.slice(0, 100)}
                  url={`/news/${item.id}`}
                  resourceType="news"
                  resourceId={item.id}
                  className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all duration-300"
                />
                <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all duration-300">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="py-16">
              <CenteredLoader message="Loading article..." />
            </div>
          ) : error ? (
            <Card className="card-modern border-0 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Newspaper className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Article Not Found</h3>
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              </CardContent>
            </Card>
          ) : item ? (
            <article className="space-y-8">
              {/* Enhanced Article Header */}
              <Card className="card-modern border-0 backdrop-blur-sm shadow-xl">
                <CardHeader className="p-10 pb-6">
                  {/* Article Category & Status */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary">
                      <Newspaper className="h-4 w-4" />
                      News Article
                    </div>
                    <Badge 
                      variant={item.status === 'published' ? 'default' : 'secondary'}
                      className={cn(
                        "text-sm font-medium rounded-xl px-4 py-2",
                        item.status === 'published' 
                          ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 border-green-200/30" 
                          : "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 text-yellow-700 border-yellow-200/30"
                      )}
                    >
                      {item.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  
                  {/* Article Title */}
                  <CardTitle className="text-4xl lg:text-6xl font-bold leading-tight text-balance mb-8">
                    {item.title}
                  </CardTitle>
                  
                  {/* Article Meta */}
                  <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-t border-border/30 pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            weekday: 'long'
                          }) : 'Draft'}
                        </div>
                        <div className="text-xs">
                          {item.published_at ? new Date(item.published_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Not published'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-400/5">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">COMSATS IT</div>
                        <div className="text-xs">Official News</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/10 to-green-400/5">
                        <Clock className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">3 min read</div>
                        <div className="text-xs">Estimated time</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-400/5">
                        <Eye className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">Public</div>
                        <div className="text-xs">Visibility</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Featured Image */}
              {item.image_url && (
                <Card className="card-modern border-0 backdrop-blur-sm overflow-hidden shadow-xl">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-64 md:h-96 object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </Card>
              )}

              {/* Enhanced Article Content */}
              <Card className="card-modern border-0 backdrop-blur-sm shadow-xl">
                <CardContent className="p-10">
                  <div className="prose prose-lg prose-neutral max-w-none whitespace-pre-wrap leading-relaxed">
                    <style jsx>{`
                      .prose {
                        font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
                        color: rgb(55 65 81);
                        line-height: 1.75;
                      }
                      .prose p {
                        margin-bottom: 1.5rem;
                        text-align: justify;
                      }
                      .prose p:first-child::first-letter {
                        font-size: 3.5rem;
                        font-weight: bold;
                        line-height: 1;
                        float: left;
                        margin-right: 0.5rem;
                        margin-top: 0.25rem;
                        color: rgb(37 99 235);
                      }
                    `}</style>
                    {item.content}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Article Footer */}
              <Card className="card-modern border-0 backdrop-blur-sm shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Stay Updated</h3>
                        <p className="text-sm text-muted-foreground">Get the latest news and announcements</p>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 rounded-xl transition-all duration-300 hover-lift">
                      Subscribe to News
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </article>
          ) : null}
        </div>
      </main>
      </div>
    </>
  )
}
