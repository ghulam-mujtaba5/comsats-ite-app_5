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
  const [searchQuery, setSearchQuery] = useState("")
  const [newsFilter, setNewsFilter] = useState<string>("all")
  const [eventsFilter, setEventsFilter] = useState<string>("all")
  const [news, setNews] = useState<NewsItem[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [newsResponse, eventsResponse] = await Promise.all([
          fetch('/api/news-events/news'),
          fetch('/api/news-events/events?includePast=1')
        ])
        
        if (newsResponse.ok) {
          const newsData = await newsResponse.json()
          setNews(newsData)
        }
        
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json()
          setEvents(eventsData)
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load news and events")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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
          <p className="text-red-500 mb-4">Error: {error}</p>
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
              <Card key={item.id} className={`hover:shadow-md transition-shadow slide-up ${item.isImportant ? 'border-red-200 bg-red-50/50' : ''}`}>
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
                  <Button 
                    className="w-full interactive hover-lift" 
                    disabled={!event.registrationOpen}
                    variant={event.registrationOpen ? "default" : "secondary"}
                  >
                    {event.registrationOpen ? "Register Now" : "Registration Closed"}
                  </Button>
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: "Home", path: "/" }, { name: "News & Events", path: "/news-events" }])) }}
    />
    </>
  )
}
