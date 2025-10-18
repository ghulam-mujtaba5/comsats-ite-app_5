"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import layout from "@/app/styles/common.module.css"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ExternalLink, 
  BookOpen,
  Megaphone,
  Star,
  Filter,
  TrendingUp,
  Heart,
  Share2,
  Bookmark,
  Bell,
  ChevronRight,
  CalendarDays,
  Globe,
  MapPin as Location,
  UserCheck,
  AlertCircle,
  CheckCircle2
} from "lucide-react"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import styles from "./news-events.module.css"
import "./news-events.light.module.css"
import "./news-events.dark.module.css"

interface NewsItem {
  id: string
  title: string
  content: string
  category: "academic" | "event" | "announcement" | "deadline"
  publishedAt: string
  author: string
  imageUrl?: string
  isImportant: boolean
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: "academic" | "cultural" | "sports" | "workshop" | "seminar"
  organizer: string
  capacity?: number
  registered?: number
  registrationOpen: boolean
  imageUrl?: string
}

const PROGRESS_WIDTH_CLASSES = [
  "progress-width-0",
  "progress-width-5",
  "progress-width-10",
  "progress-width-15",
  "progress-width-20",
  "progress-width-25",
  "progress-width-30",
  "progress-width-35",
  "progress-width-40",
  "progress-width-45",
  "progress-width-50",
  "progress-width-55",
  "progress-width-60",
  "progress-width-65",
  "progress-width-70",
  "progress-width-75",
  "progress-width-80",
  "progress-width-85",
  "progress-width-90",
  "progress-width-95",
  "progress-width-100",
]

const getProgressWidthClass = (value: number) => {
  if (!Number.isFinite(value)) {
    return PROGRESS_WIDTH_CLASSES[0]
  }
  const clamped = Math.max(0, Math.min(100, Math.round(value / 5) * 5))
  const index = Math.round(clamped / 5)
  return PROGRESS_WIDTH_CLASSES[index] ?? PROGRESS_WIDTH_CLASSES[PROGRESS_WIDTH_CLASSES.length - 1]
}

export function NewsEventsClient() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [newsFilter, setNewsFilter] = useState<string>("all")
  const [eventsFilter, setEventsFilter] = useState<string>("all")
  const [news, setNews] = useState<NewsItem[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [myRegs, setMyRegs] = useState<{ id: string; event_id: string; registered_at: string; event?: Event }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mockBanner, setMockBanner] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [newsResponse, eventsResponse, regsResponse] = await Promise.all([
          fetch('/api/news-events/news'),
          fetch('/api/news-events/events?includePast=1'),
          fetch('/api/news-events/registrations/me', { cache: 'no-store' }).catch(() => new Response('[]', { status: 200 }))
        ])

        if (!newsResponse.ok || !eventsResponse.ok) {
          const newsStatus = `${newsResponse.status} ${newsResponse.statusText}`
          const eventsStatus = `${eventsResponse.status} ${eventsResponse.statusText}`
          let newsErr = ''
          let eventsErr = ''
          try { newsErr = await newsResponse.text() } catch {}
          try { eventsErr = await eventsResponse.text() } catch {}
          setError(
            `Failed to load data. News: ${newsStatus}${newsErr ? ` - ${newsErr}` : ''}; Events: ${eventsStatus}${eventsErr ? ` - ${eventsErr}` : ''}`
          )
          return
        }

        const mockFlags: string[] = []
        if (newsResponse.headers.get('X-Mock-Data') === '1') mockFlags.push('News')
        if (eventsResponse.headers.get('X-Mock-Data') === '1') mockFlags.push('Events')
        if (mockFlags.length) {
          setMockBanner(`${mockFlags.join(' & ')} are mock fallback data (non-persistent).`)
        } else {
          setMockBanner(null)
        }

        const [newsData, eventsData, regsData] = await Promise.all([
          newsResponse.json(),
          eventsResponse.json(),
          regsResponse.ok ? regsResponse.json() : Promise.resolve([])
        ])
        
        setNews(Array.isArray(newsData) ? newsData : [])
        setEvents(Array.isArray(eventsData) ? eventsData : [])
        
        const regsArray = Array.isArray(regsData) ? regsData : Array.isArray(regsData?.data) ? regsData.data : []
        setMyRegs(
          regsArray.map((r: any) => ({
            id: String(r.id),
            event_id: String(r.event_id),
            registered_at: r.registered_at,
            event: r.events ? {
              id: String(r.event_id),
              title: r.events.title,
              description: '',
              date: r.events.event_date,
              time: r.events.event_time,
              location: r.events.location,
              category: 'academic',
              organizer: '',
              registrationOpen: true,
            } : undefined,
          }))
        )
      } catch (e: any) {
        setError(e?.message || "Failed to load news and events")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const isRegistered = (eventId: string) => myRegs.some((r) => r.event_id === eventId)

  const register = async (eventId: string) => {
    try {
      const res = await fetch(`/api/news-events/events/${eventId}/register`, { method: 'POST' })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'Failed to register')
      toast({ title: 'Registered for event' })
      
      const r = await fetch('/api/news-events/registrations/me', { cache: 'no-store' })
      const data = await r.json().catch(() => ({}))
      const regsArray = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
      setMyRegs(
        regsArray.map((r: any) => ({
          id: String(r.id),
          event_id: String(r.event_id),
          registered_at: r.registered_at,
          event: r.events ? {
            id: String(r.event_id),
            title: r.events.title,
            description: '',
            date: r.events.event_date,
            time: r.events.event_time,
            location: r.events.location,
            category: 'academic',
            organizer: '',
            registrationOpen: true,
          } : undefined,
        }))
      )
      setEvents((prev) => prev.map((ev) => ev.id === eventId ? { ...ev, registered: (ev.registered || 0) + 1 } : ev))
    } catch (e: any) {
      toast({ title: 'Registration failed', description: e?.message || 'Please try again', variant: 'destructive' })
    }
  }

  const cancelRegistration = async (eventId: string) => {
    try {
      const res = await fetch(`/api/news-events/events/${eventId}/register`, { method: 'DELETE' })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'Failed to cancel registration')
      toast({ title: 'Registration cancelled' })
      
      const r = await fetch('/api/news-events/registrations/me', { cache: 'no-store' })
      const data = await r.json().catch(() => ({}))
      const regsArray = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
      setMyRegs(
        regsArray.map((r: any) => ({
          id: String(r.id),
          event_id: String(r.event_id),
          registered_at: r.registered_at,
          event: r.events ? {
            id: String(r.event_id),
            title: r.events.title,
            description: '',
            date: r.events.event_date,
            time: r.events.event_time,
            location: r.events.location,
            category: 'academic',
            organizer: '',
            registrationOpen: true,
          } : undefined,
        }))
      )
      setEvents((prev) => prev.map((ev) => ev.id === eventId ? { ...ev, registered: Math.max(0, (ev.registered || 0) - 1) } : ev))
    } catch (e: any) {
      toast({ title: 'Cancel failed', description: e?.message || 'Please try again', variant: 'destructive' })
    }
  }

  const filteredNews = news.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = newsFilter === "all" || item.category === newsFilter
    return matchesSearch && matchesFilter
  })

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = eventsFilter === "all" || event.category === eventsFilter
    return matchesSearch && matchesFilter
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic": return "default"
      case "event": return "secondary"
      case "announcement": return "outline"
      case "deadline": return "destructive"
      case "cultural": return "secondary"
      case "sports": return "default"
      case "workshop": return "outline"
      case "seminar": return "secondary"
      default: return "default"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-mesh overflow-hidden relative flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse float animate-delay-2000" />
        </div>
        <div className="relative z-10">
          <CenteredLoader message="Loading news and events..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-mesh overflow-hidden relative flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse float animate-delay-2000" />
        </div>
        
        <div className={`${layout.section} ${layout.max2xl} px-4 relative z-10`}>
          <Card className="card-modern border-0 backdrop-blur-sm text-center">
            <CardContent className="p-12">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Failed to Load Content</h2>
              <p className="text-red-600 mb-8 font-medium">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 rounded-xl transition-all duration-300 hover-lift"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(styles.page, "bg-mesh overflow-hidden relative") }>
      <div className={styles.bgDecor}>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse float" />
  <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse float animate-delay-2000" />
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse float animate-delay-4000" />
  <div className="absolute top-20 right-20 w-4 h-4 bg-primary/30 rotate-45 animate-bounce animate-delay-1000" />
  <div className="absolute bottom-32 left-20 w-6 h-6 bg-blue-500/30 rounded-full animate-bounce animate-delay-3000" />
  <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-500/30 rotate-45 animate-bounce animate-delay-5000" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-blue-500/8" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20" />

      <div className={styles.container}>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "News & Events" }]} />
        
        <div className="text-center mb-16">
          <div className={cn(styles.pill, "bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm text-primary mb-6 hover:from-primary/20 hover:to-blue-500/20 hover-lift") }>
            <BookOpen className="h-4 w-4" />
            Campus Hub
          </div>
          <h1 className={cn(styles.pageTitle, "text-5xl lg:text-8xl font-bold leading-[0.9] mb-6") }>
            News &{" "}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Events
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed font-serif max-w-4xl mx-auto mb-4">
            Stay connected with the latest campus news, exciting events, important announcements, 
            and academic deadlines all in one place.
          </p>
          <p className="text-lg text-slate-700 dark:text-slate-300/80 font-light max-w-xl mx-auto">
            Your gateway to campus life and academic excellence
          </p>
          
          {mockBanner && (
            <div className="mt-8 max-w-2xl mx-auto">
              <Card className="card-modern border-0 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <span className="text-sm text-yellow-700 font-medium">{mockBanner}</span>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <Card className="card-modern border-0 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 mb-10">
          <CardContent className="p-8">
            <div className="relative mb-8">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-700 dark:text-slate-300/70" />
              <Input
                placeholder="Search news, events, announcements, and campus updates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-16 h-16 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 rounded-2xl text-lg font-medium focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              />
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span className="font-medium">Live Search</span>
              </div>
            </div>
            
            <div className={styles.statGrid}>
              <Card className="card-modern border-0 backdrop-blur-sm hover-lift transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Megaphone className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{news.length}</div>
                  <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">News Articles</div>
                </CardContent>
              </Card>
              
              <Card className="card-modern border-0 backdrop-blur-sm hover-lift transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <CalendarDays className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{events.length}</div>
                  <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">Events</div>
                </CardContent>
              </Card>
              
              <Card className="card-modern border-0 backdrop-blur-sm hover-lift transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <UserCheck className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{myRegs.length}</div>
                  <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">My Registrations</div>
                </CardContent>
              </Card>
              
              <Card className="card-modern border-0 backdrop-blur-sm hover-lift transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle2 className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{events.filter(e => e.registrationOpen).length}</div>
                  <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">Open Registration</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card className="card-modern border-0 backdrop-blur-sm shadow-xl">
          <CardContent className="p-8">
            <Tabs defaultValue="news" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 bg-muted/30 backdrop-blur-sm rounded-2xl p-2 border border-border/30">
                <TabsTrigger 
                  value="news" 
                  className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-300 py-4 text-base font-medium"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                      <Megaphone className="h-4 w-4 text-primary" />
                    </div>
                    News & Announcements
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="events" 
                  className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-300 py-4 text-base font-medium"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/10 to-green-400/5">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    Upcoming Events
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="news" className="space-y-8">
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: "all", label: "All News", icon: TrendingUp, count: news.length },
                    { id: "academic", label: "Academic", icon: BookOpen, count: news.filter(n => n.category === 'academic').length },
                    { id: "event", label: "Events", icon: Calendar, count: news.filter(n => n.category === 'event').length },
                    { id: "announcement", label: "Announcements", icon: Megaphone, count: news.filter(n => n.category === 'announcement').length },
                    { id: "deadline", label: "Deadlines", icon: AlertCircle, count: news.filter(n => n.category === 'deadline').length }
                  ].map((filter) => {
                    const Icon = filter.icon
                    return (
                      <Button
                        key={filter.id}
                        variant={newsFilter === filter.id ? "default" : "outline"}
                        onClick={() => setNewsFilter(filter.id)}
                        className={cn(
                          "h-12 px-6 rounded-xl transition-all duration-200",
                          newsFilter === filter.id
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                            : "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 dark:border-slate-700/30 hover:bg-primary/10"
                        )}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {filter.label}
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {filter.count}
                        </Badge>
                      </Button>
                    )
                  })}
                </div>

                <div className="space-y-6">
                  {filteredNews.map((item) => (
                    <Card
                      key={item.id}
                      className={cn(
                        "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl",
                        item.isImportant && "ring-2 ring-red-500/20 bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20"
                      )}
                    >
                      <CardHeader className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">{item.title}</CardTitle>
                              {item.isImportant && (
                                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0">
                                  <Star className="h-3 w-3 mr-1" />
                                  Important
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                              <span className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {formatDate(item.publishedAt)}
                              </span>
                              <span className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                {item.author}
                              </span>
                            </div>
                          </div>
                          <Badge 
                            variant={getCategoryColor(item.category)}
                            className="capitalize font-medium"
                          >
                            {item.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{item.content}</p>
                        <div className="flex items-center justify-between">
                          <Button 
                            variant="outline" 
                            className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 dark:border-slate-700/30 hover:bg-primary/10 rounded-xl"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Read More
                          </Button>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="rounded-xl">
                              <Heart className="h-4 w-4 mr-1" />
                              Like
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-xl">
                              <Share2 className="h-4 w-4 mr-1" />
                              Share
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-xl">
                              <Bookmark className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredNews.length === 0 && (
                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 dark:border-slate-700/30 rounded-2xl shadow-lg">
                    <CardContent className="p-12 text-center">
                      <div className="p-4 rounded-full bg-gradient-to-br from-slate-400/20 to-slate-500/20 border border-slate-400/30 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <Search className="h-10 w-10 text-slate-400" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">No News Found</h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-6 font-medium max-w-md mx-auto">
                        Try adjusting your search terms or browse different categories.
                      </p>
                      <Button
                        onClick={() => {
                          setSearchQuery("")
                          setNewsFilter("all")
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3"
                      >
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="events" className="space-y-8">
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: "all", label: "All Events", icon: Calendar, count: events.length },
                    { id: "academic", label: "Academic", icon: BookOpen, count: events.filter(e => e.category === 'academic').length },
                    { id: "cultural", label: "Cultural", icon: Star, count: events.filter(e => e.category === 'cultural').length },
                    { id: "sports", label: "Sports", icon: TrendingUp, count: events.filter(e => e.category === 'sports').length },
                    { id: "workshop", label: "Workshops", icon: Users, count: events.filter(e => e.category === 'workshop').length }
                  ].map((filter) => {
                    const Icon = filter.icon
                    return (
                      <Button
                        key={filter.id}
                        variant={eventsFilter === filter.id ? "default" : "outline"}
                        onClick={() => setEventsFilter(filter.id)}
                        className={cn(
                          "h-12 px-6 rounded-xl transition-all duration-200",
                          eventsFilter === filter.id
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                            : "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 dark:border-slate-700/30 hover:bg-primary/10"
                        )}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {filter.label}
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {filter.count}
                        </Badge>
                      </Button>
                    )
                  })}
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredEvents.map((event) => {
                    const progressPercentage = event.capacity
                      ? ((event.registered || 0) / (event.capacity || 1)) * 100
                      : 0
                    const registrationWidthClass = getProgressWidthClass(progressPercentage)

                    return (
                      <Card key={event.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl group">
                        <CardHeader className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                            {event.title}
                          </CardTitle>
                          <Badge 
                            variant={getCategoryColor(event.category)}
                            className="capitalize font-medium"
                          >
                            {event.category}
                          </Badge>
                        </div>
                        <CardDescription className="text-slate-600 dark:text-slate-400 font-medium">
                          Organized by {event.organizer}
                        </CardDescription>
                      </CardHeader>
                        <CardContent className="p-6 pt-0">
                        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{event.description}</p>
                        
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-200/30">
                              <Calendar className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="font-medium">{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <div className="p-2 rounded-lg bg-green-500/10 border border-green-200/30">
                              <Clock className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="font-medium">{event.time}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-200/30">
                              <MapPin className="h-4 w-4 text-purple-600" />
                            </div>
                            <span className="font-medium">{event.location}</span>
                          </div>
                          {event.capacity && (
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-200/30">
                                <Users className="h-4 w-4 text-orange-600" />
                              </div>
                              <span className="font-medium">{event.registered || 0}/{event.capacity} registered</span>
                              <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2 ml-2">
                                <div 
                                  className={cn(
                                    "bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300",
                                    registrationWidthClass
                                  )}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {isRegistered(event.id) ? (
                          <Button
                            className="w-full h-12 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold"
                            onClick={() => cancelRegistration(event.id)}
                          >
                            <CheckCircle2 className="h-5 w-5 mr-2" />
                            Cancel Registration
                          </Button>
                        ) : (
                          <Button 
                            className={cn(
                              "w-full h-12 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold",
                              event.registrationOpen
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                                : "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                            )}
                            disabled={!event.registrationOpen}
                            onClick={() => register(event.id)}
                          >
                            {event.registrationOpen ? (
                              <>
                                <Calendar className="h-5 w-5 mr-2" />
                                Register Now
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-5 w-5 mr-2" />
                                Registration Closed
                              </>
                            )}
                          </Button>
                        )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {filteredEvents.length === 0 && (
                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 dark:border-slate-700/30 rounded-2xl shadow-lg">
                    <CardContent className="p-12 text-center">
                      <div className="p-4 rounded-full bg-gradient-to-br from-slate-400/20 to-slate-500/20 border border-slate-400/30 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <Calendar className="h-10 w-10 text-slate-400" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">No Events Found</h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-6 font-medium max-w-md mx-auto">
                        Try adjusting your search terms or browse different categories.
                      </p>
                      <Button
                        onClick={() => {
                          setSearchQuery("")
                          setEventsFilter("all")
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3"
                      >
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-700 dark:border-slate-700/30 rounded-3xl shadow-lg">
          <CardHeader className="p-8">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-200/30">
                <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              My Event Registrations
            </CardTitle>
            <p className="text-slate-600 dark:text-slate-300 font-medium">Manage your registered events and track upcoming activities</p>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            {myRegs.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 rounded-full bg-gradient-to-br from-slate-400/20 to-slate-500/20 border border-slate-400/30 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <CalendarDays className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">No Registrations Yet</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6 font-medium max-w-md mx-auto">
                  You haven't registered for any events yet. Explore the events above to find interesting activities.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {myRegs.map((r) => (
                  <Card key={r.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 dark:border-slate-700/30 rounded-xl hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 dark:text-white mb-2">{r.event?.title || r.event_id}</h4>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>Registered: {new Date(r.registered_at).toLocaleDateString()}</span>
                          </div>
                          {r.event && (
                            <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>{r.event.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <span>{r.event.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Location className="h-3 w-3" />
                                <span>{r.event.location}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => cancelRegistration(r.event_id)}
                        className="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 dark:border-slate-700/30 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-600 rounded-xl"
                      >
                        Cancel Registration
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}