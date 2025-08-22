"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, MapPin, Users, Clock, ExternalLink } from "lucide-react"

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

const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Spring 2024 Semester Registration Opens",
    content: "Registration for Spring 2024 semester will begin on January 25th. Students are advised to complete their course selection and fee payment before the deadline.",
    category: "academic",
    publishedAt: "2024-01-20T10:00:00Z",
    author: "Registrar Office",
    isImportant: true,
  },
  {
    id: "2",
    title: "Annual Tech Fest 2024 Announced",
    content: "COMSATS Lahore is excited to announce the Annual Tech Fest 2024. Join us for three days of innovation, competitions, and networking opportunities.",
    category: "event",
    publishedAt: "2024-01-19T14:30:00Z",
    author: "Student Affairs",
    isImportant: false,
  },
  {
    id: "3",
    title: "Library Hours Extended During Exams",
    content: "The main library will remain open 24/7 during the final examination period to support students in their studies.",
    category: "announcement",
    publishedAt: "2024-01-18T09:15:00Z",
    author: "Library Administration",
    isImportant: false,
  },
  {
    id: "4",
    title: "Scholarship Application Deadline Extended",
    content: "The deadline for merit-based scholarship applications has been extended to February 15th, 2024.",
    category: "deadline",
    publishedAt: "2024-01-17T16:45:00Z",
    author: "Financial Aid Office",
    isImportant: true,
  },
]

const mockEvents: Event[] = [
  {
    id: "1",
    title: "AI & Machine Learning Workshop",
    description: "Learn the fundamentals of AI and ML with hands-on projects and industry experts.",
    date: "2024-02-15",
    time: "10:00 AM - 4:00 PM",
    location: "CS Auditorium",
    category: "workshop",
    organizer: "CS Department",
    capacity: 100,
    registered: 75,
    registrationOpen: true,
  },
  {
    id: "2",
    title: "Annual Sports Gala",
    description: "Join us for a day of sports, fun, and competition. Multiple events including cricket, football, and badminton.",
    date: "2024-02-20",
    time: "9:00 AM - 6:00 PM",
    location: "Sports Complex",
    category: "sports",
    organizer: "Sports Society",
    capacity: 500,
    registered: 320,
    registrationOpen: true,
  },
  {
    id: "3",
    title: "Career Fair 2024",
    description: "Meet with top employers and explore career opportunities. Bring your resume and dress professionally.",
    date: "2024-02-25",
    time: "11:00 AM - 5:00 PM",
    location: "Main Hall",
    category: "academic",
    organizer: "Career Services",
    registrationOpen: true,
  },
  {
    id: "4",
    title: "Cultural Night",
    description: "Experience the rich cultural diversity of our campus with performances, food, and traditional displays.",
    date: "2024-03-01",
    time: "7:00 PM - 11:00 PM",
    location: "Open Air Theater",
    category: "cultural",
    organizer: "Cultural Society",
    capacity: 800,
    registered: 450,
    registrationOpen: true,
  },
]

export default function NewsEventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [newsFilter, setNewsFilter] = useState<string>("all")
  const [eventsFilter, setEventsFilter] = useState<string>("all")

  const filteredNews = mockNews.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = newsFilter === "all" || item.category === newsFilter
    return matchesSearch && matchesFilter
  })

  const filteredEvents = mockEvents.filter((event) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
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
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="news" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="news">News & Announcements</TabsTrigger>
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-6">
          {/* News Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={newsFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewsFilter("all")}
            >
              All
            </Button>
            <Button
              variant={newsFilter === "academic" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewsFilter("academic")}
            >
              Academic
            </Button>
            <Button
              variant={newsFilter === "event" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewsFilter("event")}
            >
              Events
            </Button>
            <Button
              variant={newsFilter === "announcement" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewsFilter("announcement")}
            >
              Announcements
            </Button>
            <Button
              variant={newsFilter === "deadline" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewsFilter("deadline")}
            >
              Deadlines
            </Button>
          </div>

          {/* News List */}
          <div className="space-y-4">
            {filteredNews.map((item) => (
              <Card key={item.id} className={`hover:shadow-md transition-shadow ${item.isImportant ? 'border-red-200 bg-red-50/50' : ''}`}>
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
                  <Button variant="outline" size="sm">
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
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={eventsFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setEventsFilter("all")}
            >
              All
            </Button>
            <Button
              variant={eventsFilter === "academic" ? "default" : "outline"}
              size="sm"
              onClick={() => setEventsFilter("academic")}
            >
              Academic
            </Button>
            <Button
              variant={eventsFilter === "cultural" ? "default" : "outline"}
              size="sm"
              onClick={() => setEventsFilter("cultural")}
            >
              Cultural
            </Button>
            <Button
              variant={eventsFilter === "sports" ? "default" : "outline"}
              size="sm"
              onClick={() => setEventsFilter("sports")}
            >
              Sports
            </Button>
            <Button
              variant={eventsFilter === "workshop" ? "default" : "outline"}
              size="sm"
              onClick={() => setEventsFilter("workshop")}
            >
              Workshops
            </Button>
          </div>

          {/* Events Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
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
                    className="w-full" 
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
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items found matching your search.</p>
        </div>
      )}
    </div>
  )
}
