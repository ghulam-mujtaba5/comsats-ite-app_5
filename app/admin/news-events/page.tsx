"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Plus, Calendar, Newspaper, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NewsItem {
  id: string
  title: string
  content: string
  category: string
  publishedAt?: string
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  capacity?: number
  registered?: number
}

export default function AdminNewsEventsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("news")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<NewsItem | Event | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  // Form states
  const [formData, setFormData] = useState({
    // common
    title: "",
    category: "",
    // news
    content: "",
    isImportant: false,
    imageUrl: "",
    // events
    description: "",
    date: "",
    time: "",
    location: "",
    organizer: "Admin",
    capacity: 50,
    registrationOpen: true,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [newsResponse, eventsResponse] = await Promise.all([
        fetch('/api/news-events/news'),
        fetch('/api/news-events/events')
      ])

      if (newsResponse.ok) {
        const newsData = await newsResponse.json()
        setNews(newsData)
      }

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json()
        setEvents(eventsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch news and events",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      content: "",
      isImportant: false,
      imageUrl: "",
      description: "",
      date: "",
      time: "",
      location: "",
      organizer: "Admin",
      capacity: 50,
      registrationOpen: true,
    })
    setEditingItem(null)
  }

  const handleCreate = async () => {
    setSubmitting(true)
    try {
      const isNews = activeTab === "news"
      const endpoint = isNews 
        ? (editingItem ? `/api/news-events/news/${(editingItem as any).id}` : '/api/news-events/news')
        : (editingItem ? `/api/news-events/events/${(editingItem as any).id}` : '/api/news-events/events')

      const payload = isNews 
        ? {
            title: formData.title,
            content: formData.content,
            category: formData.category,
            is_important: formData.isImportant,
            image_url: formData.imageUrl || null,
          }
        : {
            title: formData.title,
            description: formData.description,
            event_date: formData.date,
            event_time: formData.time,
            location: formData.location,
            category: formData.category,
            organizer: formData.organizer || 'Admin',
            capacity: formData.capacity,
            registration_open: formData.registrationOpen,
            image_url: formData.imageUrl || null,
          }

      const response = await fetch(endpoint, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const raw = await response.json()
        // Normalize server response to UI shape
        const saved = isNews
          ? {
              id: raw.id,
              title: raw.title,
              content: raw.content,
              category: raw.category,
              publishedAt: raw.publishedAt ?? raw.published_at ?? new Date().toISOString(),
            }
          : {
              id: raw.id,
              title: raw.title,
              description: raw.description,
              date: raw.date ?? raw.event_date,
              time: raw.time ?? raw.event_time,
              location: raw.location,
              category: raw.category,
              capacity: raw.capacity,
              registered: raw.registered ?? 0,
            }

        if (isNews) {
          setNews(prev => editingItem ? prev.map(n => n.id === (editingItem as any).id ? saved : n) : [saved as any, ...prev])
        } else {
          setEvents(prev => editingItem ? prev.map(e => e.id === (editingItem as any).id ? (saved as any) : e) : [saved as any, ...prev])
        }
        resetForm()
        setShowCreateDialog(false)
        toast({
          title: "Success",
          description: `${isNews ? (editingItem ? 'News article updated' : 'News article created') : (editingItem ? 'Event updated' : 'Event created')}`
        })
      } else {
        let msg = 'Failed to create item'
        try {
          const err = await response.json()
          msg = err?.error || msg
        } catch {}
        toast({ title: 'Error', description: msg, variant: 'destructive' })
      }
    } catch (error) {
      console.error('Error creating item:', error)
      toast({
        title: "Error",
        description: "Failed to create item",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (item: NewsItem | Event) => {
    setEditingItem(item)
    if ('content' in item) {
      // News item
      setFormData({
        title: item.title,
        category: item.category,
        content: item.content,
        isImportant: false,
        imageUrl: "",
        // clear event fields
        description: "",
        date: "",
        time: "",
        location: "",
        organizer: "Admin",
        capacity: 50,
        registrationOpen: true,
      })
    } else {
      // Event
      setFormData({
        title: item.title,
        category: item.category,
        // event fields
        description: item.description,
        date: item.date,
        time: item.time,
        location: item.location,
        organizer: "Admin",
        capacity: item.capacity ?? 50,
        registrationOpen: true,
        // clear news fields
        content: "",
        isImportant: false,
        imageUrl: "",
      })
    }
    setShowCreateDialog(true)
  }

  const handleDelete = async (id: string, type: 'news' | 'event') => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return

    try {
      const endpoint = type === 'news' ? `/api/news-events/news/${id}` : `/api/news-events/events/${id}`
      const response = await fetch(endpoint, { method: 'DELETE' })

      if (response.ok) {
        if (type === 'news') {
          setNews(prev => prev.filter(item => item.id !== id))
        } else {
          setEvents(prev => prev.filter(item => item.id !== id))
        }
        toast({
          title: "Success",
          description: `${type === 'news' ? 'News article' : 'Event'} deleted successfully`
        })
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive"
      })
    }
  }

  return (
    <AdminGuard>
      <div className="app-container section space-y-6 fade-in">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-balance">News & Events Management</h1>
            <p className="text-muted-foreground">Create and manage campus news and events</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setActiveTab("news") }}>
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Edit' : 'Create'} {activeTab === "news" ? "News Article" : "Event"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter title..."
                  />
                </div>

                {activeTab === "news" ? (
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Enter news content..."
                      rows={6}
                    />
                    <div className="mt-4 flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="important"
                        checked={formData.isImportant}
                        onChange={(e) => setFormData(prev => ({ ...prev, isImportant: e.target.checked }))}
                        aria-label="Mark as important"
                      />
                      <Label htmlFor="important">Mark as important</Label>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter event description..."
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter event location..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="organizer">Organizer</Label>
                      <Input
                        id="organizer"
                        value={formData.organizer}
                        onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                        placeholder="Enter organizer..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 50 }))}
                        min="1"
                      />
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="registrationOpen"
                        checked={formData.registrationOpen}
                        onChange={(e) => setFormData(prev => ({ ...prev, registrationOpen: e.target.checked }))}
                        aria-label="Registration open"
                      />
                      <Label htmlFor="registrationOpen">Registration open</Label>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeTab === "news" ? (
                        <>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="campus">Campus</SelectItem>
                          <SelectItem value="announcement">Announcement</SelectItem>
                          <SelectItem value="achievement">Achievement</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="cultural">Cultural</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="imageUrl">Image URL (optional)</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} disabled={submitting}>
                    {submitting ? "Saving..." : (editingItem ? "Update" : "Create")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="news">News Articles</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="mt-6">
            {loading ? (
              <div className="text-center py-8">Loading news...</div>
            ) : (
              <div className="grid gap-4">
                {news.map((item) => (
                  <Card key={item.id} variant="elevated">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{item.category}</Badge>
                            {item.publishedAt && (
                              <Badge variant="secondary">{new Date(item.publishedAt).toLocaleDateString()}</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(item.id, 'news')}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {item.content.substring(0, 200)}
                        {item.content.length > 200 && "..."}
                      </p>
                      {item.publishedAt && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Published: {new Date(item.publishedAt).toLocaleDateString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {news.length === 0 && (
                  <Card variant="soft" className="p-8 text-center">
                    <div className="text-muted-foreground">No news articles found</div>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            {loading ? (
              <div className="text-center py-8">Loading events...</div>
            ) : (
              <div className="grid gap-4">
                {events.map((event) => (
                  <Card key={event.id} variant="elevated">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{event.category}</Badge>
                            <Badge variant="outline">
                              {(event.registered ?? 0)}/{event.capacity ?? 0} registered
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(event.id, 'event')}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        {event.description.substring(0, 150)}
                        {event.description.length > 150 && "..."}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                        <span>🕒 {event.time}</span>
                        <span>📍 {event.location}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {events.length === 0 && (
                  <Card variant="soft" className="p-8 text-center">
                    <div className="text-muted-foreground">No events found</div>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminGuard>
  )
}
