"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit, Trash2, Calendar, MapPin, Users, Clock, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"


interface Event {
  id: string
  title: string
  description: string
  event_date: string
  event_time: string
  location: string
  category: "academic" | "cultural" | "sports" | "workshop" | "seminar"
  organizer: string
  capacity?: number
  registration_open: boolean
  image_url?: string
  created_at: string
  updated_at: string
  registered_count?: number
}

interface EventRegistration {
  id: string
  event_id: string
  user_id: string
  student_name: string
  student_id: string
  registered_at: string
}

export default function AdminEventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [events, setEvents] = useState<Event[]>([])
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showRegistrationsDialog, setShowRegistrationsDialog] = useState(false)
  const [selectedEventRegistrations, setSelectedEventRegistrations] = useState<EventRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      // Include past events so admins can see and manage all entries
      const response = await fetch('/api/news-events/events?includePast=1')
      if (response.ok) {
        const data = await response.json()
        // Map API response (public shape) to admin interface shape
        const mapped: Event[] = (data || []).map((e: any) => ({
          id: e.id,
          title: e.title,
          description: e.description,
          event_date: e.event_date ?? e.date ?? '',
          event_time: e.event_time ?? e.time ?? '',
          location: e.location,
          category: e.category,
          organizer: e.organizer,
          capacity: e.capacity,
          registration_open: e.registration_open ?? e.registrationOpen ?? true,
          image_url: e.image_url ?? e.imageUrl ?? '',
          created_at: e.created_at ?? '',
          updated_at: e.updated_at ?? '',
          registered_count: e.registered_count ?? e.registered ?? 0,
        }))
        setEvents(mapped)
      } else {
        throw new Error('Failed to fetch events')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchEventRegistrations = async (eventId: string) => {
    try {
      const response = await fetch(`/api/news-events/events/${eventId}/registrations`)
      if (response.ok) {
        const data = await response.json()
        setSelectedEventRegistrations(data)
        setShowRegistrationsDialog(true)
      } else {
        throw new Error('Failed to fetch registrations')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load event registrations",
        variant: "destructive"
      })
    }
  }

  const handleSaveEvent = async () => {
    if (!editingEvent) return

    try {
      const method = editingEvent.id ? 'PUT' : 'POST'
      const url = editingEvent.id ? `/api/news-events/events/${editingEvent.id}` : '/api/news-events/events'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEvent)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Event ${editingEvent.id ? 'updated' : 'created'} successfully`
        })
        setShowEventDialog(false)
        setEditingEvent(null)
        fetchEvents()
      } else {
        throw new Error('Failed to save event')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive"
      })
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event? This will also delete all registrations.')) return

    try {
      const response = await fetch(`/api/news-events/events/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event deleted successfully"
        })
        fetchEvents()
      } else {
        throw new Error('Failed to delete event')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive"
      })
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic":
        return "bg-blue-100 text-blue-800"
      case "cultural":
        return "bg-purple-100 text-purple-800"
      case "sports":
        return "bg-green-100 text-green-800"
      case "workshop":
        return "bg-orange-100 text-orange-800"
      case "seminar":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const newEvent = (): Event => ({
    id: '',
    title: '',
    description: '',
    event_date: new Date().toISOString().split('T')[0],
    event_time: '09:00',
    location: '',
    category: 'academic',
    organizer: '',
    capacity: undefined,
    registration_open: true,
    image_url: '',
    created_at: '',
    updated_at: ''
  })

  const formatDateTime = (date: string, time: string) => {
    const eventDate = new Date(`${date}T${time}`)
    return eventDate.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="app-container section" role="main" aria-labelledby="events-heading">
      <div className="mb-8">
        <h1 id="events-heading" className="text-3xl font-bold">Events Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage campus events and track registrations
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="academic">Academic</SelectItem>
            <SelectItem value="cultural">Cultural</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="workshop">Workshop</SelectItem>
            <SelectItem value="seminar">Seminar</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingEvent(newEvent())}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent?.id ? 'Edit Event' : 'Create New Event'}
              </DialogTitle>
              <DialogDescription>
                Fill in the event details
              </DialogDescription>
            </DialogHeader>
            {editingEvent && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                    placeholder="Event title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingEvent.description}
                    onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                    placeholder="Event description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Event Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={editingEvent.event_date}
                      onChange={(e) => setEditingEvent({...editingEvent, event_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Event Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={editingEvent.event_time}
                      onChange={(e) => setEditingEvent({...editingEvent, event_time: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editingEvent.location}
                    onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})}
                    placeholder="Event location"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={editingEvent.category} onValueChange={(value: any) => setEditingEvent({...editingEvent, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="cultural">Cultural</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="seminar">Seminar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="organizer">Organizer</Label>
                    <Input
                      id="organizer"
                      value={editingEvent.organizer}
                      onChange={(e) => setEditingEvent({...editingEvent, organizer: e.target.value})}
                      placeholder="Event organizer"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="capacity">Capacity (optional)</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={editingEvent.capacity || ''}
                      onChange={(e) => setEditingEvent({...editingEvent, capacity: e.target.value ? parseInt(e.target.value) : undefined})}
                      placeholder="Maximum attendees"
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Image URL (optional)</Label>
                    <Input
                      id="image"
                      value={editingEvent.image_url || ''}
                      onChange={(e) => setEditingEvent({...editingEvent, image_url: e.target.value})}
                      placeholder="Event image URL"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="registration"
                    checked={editingEvent.registration_open}
                    onCheckedChange={(checked) => setEditingEvent({...editingEvent, registration_open: checked})}
                  />
                  <Label htmlFor="registration">Registration Open</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEventDialog(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveEvent}>
                <Save className="h-4 w-4 mr-2" />
                Save Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="grid gap-4" aria-live="polite">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`sk-${i}`} className="skeleton p-5 border border-border rounded-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="sk-title w-40 rounded mb-2" />
                  <div className="sk-line w-3/4 rounded mb-1" />
                  <div className="sk-line w-1/2 rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="sk-pill w-24 h-8 rounded" />
                  <div className="sk-icon w-8 h-8 rounded" />
                  <div className="sk-icon w-8 h-8 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} variant="elevated" className="transition-shadow hover:shadow-lg interactive hover-lift slide-up">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Badge className={getCategoryColor(event.category)}>
                        {event.category}
                      </Badge>
                      {!event.registration_open && (
                        <Badge variant="secondary">Registration Closed</Badge>
                      )}
                    </div>
                    <CardDescription className="mb-2">
                      {event.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDateTime(event.event_date, event.event_time)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.registered_count || 0}
                        {event.capacity && ` / ${event.capacity}`} registered
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Organized by: {event.organizer}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => fetchEventRegistrations(event.id)}
                      aria-label={`View registrations for ${event.title}`}
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Registrations
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingEvent(event)
                        setShowEventDialog(true)
                      }}
                      aria-label={`Edit event ${event.title}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteEvent(event.id)}
                      aria-label={`Delete event ${event.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
          {filteredEvents.length === 0 && (
            <Card variant="soft" className="p-8 text-center">
              <div className="text-muted-foreground mb-4">No events found matching your criteria</div>
              <div>
                <Button onClick={() => { setEditingEvent(newEvent()); setShowEventDialog(true) }} aria-label="Create a new event">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Registrations Dialog */}
      <Dialog open={showRegistrationsDialog} onOpenChange={setShowRegistrationsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Event Registrations</DialogTitle>
            <DialogDescription>
              List of students registered for this event
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {selectedEventRegistrations.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No registrations yet</p>
            ) : (
              <div className="space-y-2">
                {selectedEventRegistrations.map((registration) => (
                  <div key={registration.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{registration.student_name}</p>
                      <p className="text-sm text-gray-600">ID: {registration.student_id}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Registered: {new Date(registration.registered_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowRegistrationsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
