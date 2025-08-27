"use client"

import { createMetadata, jsonLdBreadcrumb } from "@/lib/seo"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

// All data now comes from backend - no more mock data

 

export default function NewsEventsPage() {
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

        // If any endpoint fails, show an error with status codes for visibility
        if (!newsResponse.ok || !eventsResponse.ok) {
          const newsStatus = `${newsResponse.status} ${newsResponse.statusText}`
          const eventsStatus = `${eventsResponse.status} ${eventsResponse.statusText}`
          // Try to read error bodies (non-fatal if it fails)
          let newsErr = ''
          let eventsErr = ''
          try { newsErr = await newsResponse.text() } catch {}
          try { eventsErr = await eventsResponse.text() } catch {}
          setError(
            `Failed to load data. News: ${newsStatus}${newsErr ? ` - ${newsErr}` : ''}; Events: ${eventsStatus}${eventsErr ? ` - ${eventsErr}` : ''}`
          )
          // Bail early to avoid attempting to parse JSON from failed responses
          return
        }

        // Detect mock fallback header
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
        const regsArray = Array.isArray(regsData)
          ? regsData
          : Array.isArray(regsData?.data)
            ? regsData.data
            : []
        setMyRegs(
          regsArray.map((r: any) => ({
            id: String(r.id),
            event_id: String(r.event_id),
            registered_at: r.registered_at,
            event: r.events
              ? {
                  id: String(r.event_id),
                  title: r.events.title,
                  description: '',
                  date: r.events.event_date,
                  time: r.events.event_time,
                  location: r.events.location,
                  category: 'academic',
                  organizer: '',
                  registrationOpen: true,
                }
              : undefined,
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
      // refresh my registrations
      const r = await fetch('/api/news-events/registrations/me', { cache: 'no-store' })
      const data = await r.json().catch(() => ({}))
      const regsArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : []
      setMyRegs(
        regsArray.map((r: any) => ({
          id: String(r.id),
          event_id: String(r.event_id),
          registered_at: r.registered_at,
          event: r.events
            ? {
                id: String(r.event_id),
                title: r.events.title,
                description: '',
                date: r.events.event_date,
                time: r.events.event_time,
                location: r.events.location,
                category: 'academic',
                organizer: '',
                registrationOpen: true,
              }
            : undefined,
        }))
      )
      // best-effort increment registered count locally
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
      const regsArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : []
      setMyRegs(
        regsArray.map((r: any) => ({
          id: String(r.id),
          event_id: String(r.event_id),
          registered_at: r.registered_at,
          event: r.events
            ? {
                id: String(r.event_id),
                title: r.events.title,
                description: '',
                date: r.events.event_date,
                time: r.events.event_time,
                location: r.events.location,
                category: 'academic',
                organizer: '',
                registrationOpen: true,
              }
            : undefined,
        }))
      )
      // best-effort decrement registered count locally
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
      case "academic":
        return "default"
      case "event":
        return "secondary"
      case "announcement":
        return "outline"
      case "deadline":
        return "destructive"
      case "cultural":
        return "secondary"
      case "sports":
        return "default"
      case "workshop":
        return "outline"
      case "seminar":
        return "secondary"
      default:
        return "default"
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
    return <CenteredLoader message="Loading news and events..." />
  }

  if (error) {
    return (
      <div className="app-container section fade-in">
        <div className="text-center py-12" role="alert">
          <p className="text-destructive mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="interactive hover-lift">Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className="app-container section py-12">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            <BookOpen className="h-4 w-4" />
            Campus Updates
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            News & <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Events</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 font-medium leading-relaxed">
            Stay updated with the latest campus news, announcements, and exciting upcoming events
          </p>
          
          {mockBanner && (
            <div className="max-w-2xl mx-auto mb-8">
              <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl shadow-lg">
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">{mockBanner}</span>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Enhanced Search and Filter Section */}
        <Card className="mb-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-3xl shadow-lg">
          <CardContent className="p-8">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search news, events, announcements, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/30 dark:border-slate-700/30 rounded-2xl text-lg focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{news.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">News Articles</div>
                </CardContent>
              </Card>
              <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{events.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Events</div>
                </CardContent>
              </Card>
              <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{myRegs.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">My Registrations</div>
                </CardContent>
              </Card>
              <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{events.filter(e => e.registrationOpen).length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Open Registration</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Tabs */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-3xl shadow-lg">
          <CardContent className="p-8">
            <Tabs defaultValue="news" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-1">
                <TabsTrigger 
                  value="news" 
                  className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md transition-all duration-200"
                >
                  <Megaphone className="h-4 w-4 mr-2" />
                  News & Announcements
                </TabsTrigger>
                <TabsTrigger 
                  value="events" 
                  className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md transition-all duration-200"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Upcoming Events
                </TabsTrigger>
              </TabsList>

        <TabsContent value="news" className="space-y-8">
          {/* Enhanced News Filter */}
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
                      : "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/30 dark:border-slate-700/30 hover:bg-primary/10"
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

          {/* Enhanced News List */}
          <div className="space-y-6">
            {filteredNews.map((item) => (
              <Card
                key={item.id}
                className={cn(
                  "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl",
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
                      className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/30 dark:border-slate-700/30 hover:bg-primary/10 rounded-xl"
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
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-2xl shadow-lg">
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
          {/* Enhanced Events Filter */}
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
                      : "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/30 dark:border-slate-700/30 hover:bg-primary/10"
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

          {/* Enhanced Events Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl group">
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
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, ((event.registered || 0) / event.capacity) * 100)}%` }}
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
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-2xl shadow-lg">
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

        <TabsContent value="events" className="space-y-6">
          {/* Events Filter */}
          <div className="flex gap-2 flex-wrap" aria-live="polite">
            <Button
              variant={eventsFilter === "all" ? "default" : "soft"}
              size="sm"
              onClick={() => setEventsFilter("all")}
              aria-pressed={eventsFilter === "all"}
              className="interactive hover-lift"
            >
              All
            </Button>
            <Button
              variant={eventsFilter === "academic" ? "default" : "soft"}
              size="sm"
              onClick={() => setEventsFilter("academic")}
              aria-pressed={eventsFilter === "academic"}
              className="interactive hover-lift"
            >
              Academic
            </Button>
            <Button
              variant={eventsFilter === "cultural" ? "default" : "soft"}
              size="sm"
              onClick={() => setEventsFilter("cultural")}
              aria-pressed={eventsFilter === "cultural"}
              className="interactive hover-lift"
            >
              Cultural
            </Button>
            <Button
              variant={eventsFilter === "sports" ? "default" : "soft"}
              size="sm"
              onClick={() => setEventsFilter("sports")}
              aria-pressed={eventsFilter === "sports"}
              className="interactive hover-lift"
            >
              Sports
            </Button>
            <Button
              variant={eventsFilter === "workshop" ? "default" : "soft"}
              size="sm"
              onClick={() => setEventsFilter("workshop")}
              aria-pressed={eventsFilter === "workshop"}
              className="interactive hover-lift"
            >
              Workshops
            </Button>
          </div>

          {/* Events Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-live="polite">
            {filteredEvents.map((event) => (
              <Card key={event.id} variant="elevated" className="transition-shadow slide-up">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <Badge variant={getCategoryColor(event.category)}>
                      {event.category}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    Organized by {event.organizer}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{event.description}</p>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    {event.capacity && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{event.registered || 0}/{event.capacity} registered</span>
                      </div>
                    )}
                  </div>
                  {isRegistered(event.id) ? (
                    <Button
                      className="w-full interactive hover-lift"
                      variant="secondary"
                      onClick={() => cancelRegistration(event.id)}
                    >
                      Cancel Registration
                    </Button>
                  ) : (
                    <Button 
                      className="w-full interactive hover-lift" 
                      disabled={!event.registrationOpen}
                      variant={event.registrationOpen ? "default" : "secondary"}
                      onClick={() => register(event.id)}
                    >
                      {event.registrationOpen ? "Register Now" : "Registration Closed"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>

        {/* My Registrations Section */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-3xl shadow-lg">
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
                  <Card key={r.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-xl hover:shadow-lg transition-all duration-300">
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
                        className="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/30 dark:border-slate-700/30 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-600 rounded-xl"
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
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: "Home", path: "/" }, { name: "News & Events", path: "/news-events" }])) }}
      />
    </div>
  )
}
