"use client"

import { createMetadata, jsonLdBreadcrumb } from "@/lib/seo"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, MapPin, Users, Clock, ExternalLink } from "lucide-react"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { useToast } from "@/hooks/use-toast"


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
      <div className="container mx-auto px-4 py-8 fade-in">
        <div className="text-center py-12" role="alert">
          <p className="text-destructive mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="interactive hover-lift">Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <>
    <div className="container mx-auto px-4 py-8 fade-in">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "News & Events" }]} className="mb-4" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold">News & Events</h1>
        <p className="text-muted-foreground mt-2">
          Stay updated with the latest campus news, announcements, and upcoming events
        </p>
        {mockBanner && (
          <div className="mt-3 text-sm border border-yellow-300 bg-yellow-50 text-yellow-900 rounded p-3">
            {mockBanner}
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search news and events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 interactive"
        />
      </div>

      <Tabs defaultValue="news" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="news">News & Announcements</TabsTrigger>
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-6">
          {/* News Filter */}
          <div className="flex gap-2 flex-wrap" aria-live="polite">
            <Button
              variant={newsFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewsFilter("all")}
              aria-pressed={newsFilter === "all"}
              className="interactive hover-lift"
            >
              All
            </Button>
            <Button
              variant={newsFilter === "academic" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewsFilter("academic")}
              aria-pressed={newsFilter === "academic"}
              className="interactive hover-lift"
            >
              Academic
            </Button>
            <Button
              variant={newsFilter === "event" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewsFilter("event")}
              aria-pressed={newsFilter === "event"}
              className="interactive hover-lift"
            >
              Events
            </Button>
            <Button
              variant={newsFilter === "announcement" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewsFilter("announcement")}
              aria-pressed={newsFilter === "announcement"}
              className="interactive hover-lift"
            >
              Announcements
            </Button>
            <Button
              variant={newsFilter === "deadline" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewsFilter("deadline")}
              aria-pressed={newsFilter === "deadline"}
              className="interactive hover-lift"
            >
              Deadlines
            </Button>
          </div>

          {/* News List */}
          <div className="space-y-4" aria-live="polite">
            {filteredNews.map((item) => (
              <Card key={item.id} className={`hover:shadow-md transition-shadow slide-up ${item.isImportant ? 'border-destructive/30 bg-destructive/10' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        {item.isImportant && (
                          <Badge variant="destructive" className="text-xs">
                            Important
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(item.publishedAt)} at {formatTime(item.publishedAt)}
                        </span>
                        <span>{item.author}</span>
                      </div>
                    </div>
                    <Badge variant={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{item.content}</p>
                  <Button variant="outline" size="sm" className="interactive hover-lift">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          {/* Events Filter */}
          <div className="flex gap-2 flex-wrap" aria-live="polite">
            <Button
              variant={eventsFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setEventsFilter("all")}
              aria-pressed={eventsFilter === "all"}
              className="interactive hover-lift"
            >
              All
            </Button>
            <Button
              variant={eventsFilter === "academic" ? "default" : "outline"}
              size="sm"
              onClick={() => setEventsFilter("academic")}
              aria-pressed={eventsFilter === "academic"}
              className="interactive hover-lift"
            >
              Academic
            </Button>
            <Button
              variant={eventsFilter === "cultural" ? "default" : "outline"}
              size="sm"
              onClick={() => setEventsFilter("cultural")}
              aria-pressed={eventsFilter === "cultural"}
              className="interactive hover-lift"
            >
              Cultural
            </Button>
            <Button
              variant={eventsFilter === "sports" ? "default" : "outline"}
              size="sm"
              onClick={() => setEventsFilter("sports")}
              aria-pressed={eventsFilter === "sports"}
              className="interactive hover-lift"
            >
              Sports
            </Button>
            <Button
              variant={eventsFilter === "workshop" ? "default" : "outline"}
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
              <Card key={event.id} className="hover:shadow-lg transition-shadow slide-up">
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

      {filteredNews.length === 0 && filteredEvents.length === 0 && (
        <div className="text-center py-12 fade-in" aria-live="polite">
          <p className="text-muted-foreground">No items found matching your search.</p>
        </div>
      )}
    </div>
    {/* My Registrations */}
    <div className="container mx-auto px-4 pb-12">
      <h2 className="text-xl font-semibold mb-4">My Registrations</h2>
      {myRegs.length === 0 ? (
        <p className="text-muted-foreground">You have not registered for any events yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {myRegs.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.event?.title || r.event_id}</div>
                  <div className="text-xs text-muted-foreground">Registered: {new Date(r.registered_at).toLocaleString()}</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => cancelRegistration(r.event_id)}>Cancel</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: "Home", path: "/" }, { name: "News & Events", path: "/news-events" }])) }}
    />
    </>
  )
}
