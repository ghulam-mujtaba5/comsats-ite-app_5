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
  published: boolean
  created_at: string
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  capacity: number
  registration_count: number
  published: boolean
  created_at: string
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
    title: "",
    content: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    capacity: 50,
    published: true
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
      content: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "",
      capacity: 50,
      published: true
    })
    setEditingItem(null)
  }

  const handleCreate = async () => {
    setSubmitting(true)
    try {
      const endpoint = activeTab === "news" ? '/api/news-events/news' : '/api/news-events/events'
      const payload = activeTab === "news" 
        ? {
            title: formData.title,
            content: formData.content,
            category: formData.category,
            published: formData.published
          }
        : {
            title: formData.title,
            description: formData.description,
            date: formData.date,
            time: formData.time,
            location: formData.location,
            category: formData.category,
            capacity: formData.capacity,
            published: formData.published
          }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const newItem = await response.json()
        if (activeTab === "news") {
          setNews(prev => [newItem, ...prev])
        } else {
          setEvents(prev => [newItem, ...prev])
        }
        resetForm()
        setShowCreateDialog(false)
        toast({
          title: "Success",
          description: `${activeTab === "news" ? "News article" : "Event"} created successfully`
        })
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
        content: item.content,
        category: item.category,
        published: item.published,
        description: "",
        date: "",
        time: "",
        location: "",
        capacity: 50
      })
    } else {
      // Event
      setFormData({
        title: item.title,
        description: item.description,
        date: item.date,
        time: item.time,
        location: item.location,
        category: item.category,
        capacity: item.capacity,
        published: item.published,
        content: ""
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">News & Events Management</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage campus news and events
            </p>
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
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 50 }))}
                        min="1"
                      />
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

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  />
                  <Label htmlFor="published">Published</Label>
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
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <div className="flex gap-2 mt-2">
                            <Badge variant={item.published ? "default" : "secondary"}>
                              {item.published ? "Published" : "Draft"}
                            </Badge>
                            <Badge variant="outline">{item.category}</Badge>
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
                      <p className="text-xs text-muted-foreground mt-2">
                        Created: {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
                {news.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No news articles found
                  </div>
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
                  <Card key={event.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <div className="flex gap-2 mt-2">
                            <Badge variant={event.published ? "default" : "secondary"}>
                              {event.published ? "Published" : "Draft"}
                            </Badge>
                            <Badge variant="outline">{event.category}</Badge>
                            <Badge variant="outline">
                              {event.registration_count}/{event.capacity} registered
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
                  <div className="text-center py-8 text-muted-foreground">
                    No events found
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminGuard>
  )
}
