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
import { Plus, Calendar, Newspaper, Edit, Trash2, Sparkles, Activity, TrendingUp, Zap, Clock, MapPin, Users, Crown, Save, Eye, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import adminStyles from '../admin-shared.module.css'

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20">
        {/* Hero Section with Glassmorphism */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 backdrop-blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          
          <div className={`relative ${adminStyles.section} pt-12 pb-8`}>
            <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
                      <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 p-3 rounded-2xl">
                        <Newspaper className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-800 dark:from-white dark:via-emerald-200 dark:to-teal-200 bg-clip-text text-transparent">
                        News & Events Management
                      </h1>
                      <p className="text-slate-600 dark:text-slate-300 text-lg">
                        Create and manage campus news articles and events
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-800">
                      <Activity className="h-3 w-3 mr-1" />
                      {news.length} Articles
                    </Badge>
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-teal-200 dark:border-teal-800">
                      <Calendar className="h-3 w-3 mr-1" />
                      {events.length} Events
                    </Badge>
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-blue-200 dark:border-blue-800">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Content Management
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button size="sm" variant="outline" className="glass-button bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border-white/40 dark:border-slate-600/40 hover:bg-white/50 dark:hover:bg-slate-700/50">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Site
                  </Button>
                  <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { resetForm(); setActiveTab("news") }} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl glass-card border border-white/20 dark:border-white/10 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {activeTab === "news" ? <Newspaper className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
                          {editingItem ? 'Edit' : 'Create'} {activeTab === "news" ? "News Article" : "Event"}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-200">Title</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter title..."
                            className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                          />
                        </div>

                        {activeTab === "news" ? (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="content" className="text-sm font-medium text-slate-700 dark:text-slate-200">Content</Label>
                              <Textarea
                                id="content"
                                value={formData.content}
                                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="Enter news content..."
                                rows={6}
                                className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                              />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-white/40 dark:border-slate-600/40">
                              <div className="space-y-1">
                                <Label htmlFor="important" className="text-sm font-medium text-slate-700 dark:text-slate-200">Important News</Label>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Mark as important to highlight this article</p>
                              </div>
                              <input
                                type="checkbox"
                                id="important"
                                checked={formData.isImportant}
                                onChange={(e) => setFormData(prev => ({ ...prev, isImportant: e.target.checked }))}
                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                aria-label="Mark as important"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</Label>
                              <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Enter event description..."
                                rows={4}
                                className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="date" className="text-sm font-medium text-slate-700 dark:text-slate-200">Date</Label>
                                <Input
                                  id="date"
                                  type="date"
                                  value={formData.date}
                                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                  className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                                />
                              </div>
                              <div>
                                <Label htmlFor="time" className="text-sm font-medium text-slate-700 dark:text-slate-200">Time</Label>
                                <Input
                                  id="time"
                                  type="time"
                                  value={formData.time}
                                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                                  className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="location" className="text-sm font-medium text-slate-700 dark:text-slate-200">Location</Label>
                              <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                placeholder="Enter event location..."
                                className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="organizer" className="text-sm font-medium text-slate-700 dark:text-slate-200">Organizer</Label>
                                <Input
                                  id="organizer"
                                  value={formData.organizer}
                                  onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                                  placeholder="Enter organizer..."
                                  className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                                />
                              </div>
                              <div>
                                <Label htmlFor="capacity" className="text-sm font-medium text-slate-700 dark:text-slate-200">Capacity</Label>
                                <Input
                                  id="capacity"
                                  type="number"
                                  value={formData.capacity}
                                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 50 }))}
                                  min="1"
                                  className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-white/40 dark:border-slate-600/40">
                              <div className="space-y-1">
                                <Label htmlFor="registrationOpen" className="text-sm font-medium text-slate-700 dark:text-slate-200">Registration Open</Label>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Allow users to register for this event</p>
                              </div>
                              <input
                                type="checkbox"
                                id="registrationOpen"
                                checked={formData.registrationOpen}
                                onChange={(e) => setFormData(prev => ({ ...prev, registrationOpen: e.target.checked }))}
                                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                aria-label="Registration open"
                              />
                            </div>
                          </div>
                        )}

                        <div>
                          <Label htmlFor="category" className="text-sm font-medium text-slate-700 dark:text-slate-200">Category</Label>
                          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40">
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
                          <Label htmlFor="imageUrl" className="text-sm font-medium text-slate-700 dark:text-slate-200">Image URL (optional)</Label>
                          <Input
                            id="imageUrl"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                            placeholder="https://..."
                            className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                          />
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="glass-button">
                            Cancel
                          </Button>
                          <Button onClick={handleCreate} disabled={submitting} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-0">
                            <Save className="h-4 w-4 mr-2" />
                            {submitting ? "Saving..." : (editingItem ? "Update" : "Create")}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content Management Interface */}
        <div className={`${adminStyles.section} ${adminStyles.spaceY6} pb-12`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Content Management</h2>
              <p className="text-slate-600 dark:text-slate-300">Manage news articles and campus events</p>
            </div>
            <Badge variant="outline" className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
              <TrendingUp className="h-3 w-3 mr-1" />
              Live Content
            </Badge>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="glass-card bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/40 dark:border-slate-600/40 grid w-full lg:w-auto grid-cols-2">
              <TabsTrigger value="news" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg">
                <Newspaper className="h-4 w-4" />
                News Articles
                <Badge variant="outline" className="text-xs ml-1">{news.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg">
                <Calendar className="h-4 w-4" />
                Events
                <Badge variant="outline" className="text-xs ml-1">{events.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="news" className="mt-6 space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 p-8">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                      <span className="text-slate-600 dark:text-slate-300">Loading news articles...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {news.map((item) => (
                    <Card key={item.id} className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 group hover:scale-[1.01] transition-all duration-300 hover:shadow-xl">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
                      
                      <CardHeader className="relative">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                                <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-xl">
                                  <Newspaper className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-lg group-hover:scale-105 transition-transform duration-300 text-slate-900 dark:text-white">
                                  {item.title}
                                </CardTitle>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                                    {item.category}
                                  </Badge>
                                  {item.publishedAt && (
                                    <Badge variant="secondary" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {new Date(item.publishedAt).toLocaleDateString()}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(item)} className="glass-button">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(item.id, 'news')} className="glass-button hover:bg-red-50 dark:hover:bg-red-950/50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="relative">
                        <div className="space-y-3">
                          <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 border border-white/40 dark:border-slate-600/40">
                            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                              {item.content.substring(0, 200)}
                              {item.content.length > 200 && "..."}
                            </p>
                          </div>
                          {item.publishedAt && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <Crown className="h-3 w-3" />
                              <span>Published: {new Date(item.publishedAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {news.length === 0 && (
                    <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 p-12 text-center">
                      <div className="space-y-4">
                        <div className="text-4xl">📰</div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No News Articles Found</h3>
                          <p className="text-slate-600 dark:text-slate-300">Create your first news article to get started.</p>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="events" className="mt-6 space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 p-8">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
                      <span className="text-slate-600 dark:text-slate-300">Loading events...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {events.map((event) => (
                    <Card key={event.id} className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 group hover:scale-[1.01] transition-all duration-300 hover:shadow-xl">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
                      
                      <CardHeader className="relative">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                                <div className="relative bg-gradient-to-r from-teal-500 to-cyan-500 p-2 rounded-xl">
                                  <Calendar className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-lg group-hover:scale-105 transition-transform duration-300 text-slate-900 dark:text-white">
                                  {event.title}
                                </CardTitle>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300">
                                    {event.category}
                                  </Badge>
                                  <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {(event.registered ?? 0)}/{event.capacity ?? 0} registered
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(event)} className="glass-button">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(event.id, 'event')} className="glass-button hover:bg-red-50 dark:hover:bg-red-950/50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="relative">
                        <div className="space-y-4">
                          <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 border border-white/40 dark:border-slate-600/40">
                            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-3">
                              {event.description.substring(0, 150)}
                              {event.description.length > 150 && "..."}
                            </p>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 text-xs">
                              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                <Clock className="h-3 w-3 text-blue-500" />
                                <span>{new Date(event.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                <Zap className="h-3 w-3 text-orange-500" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                <MapPin className="h-3 w-3 text-green-500" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {events.length === 0 && (
                    <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 p-12 text-center">
                      <div className="space-y-4">
                        <div className="text-4xl">📅</div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No Events Found</h3>
                          <p className="text-slate-600 dark:text-slate-300">Create your first event to get started.</p>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminGuard>
  )
}
