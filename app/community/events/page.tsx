"use client"

import layout from "@/app/styles/common.module.css"
import "../community.light.module.css"
import "../community.dark.module.css"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useCampus } from "@/contexts/campus-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MessageSquare,
  Users,
  TrendingUp,
  Plus,
  Search,
  Heart,
  MessageCircle,
  Share2,
  Filter,
  Calendar,
  MapPin,
  Bell,
  Pin,
  Award,
  Clock,
  Eye,
  Star,
  BookOpen,
  Zap,
  Activity,
  Sparkles,
  Hash,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  Send,
  Crown,
  Trophy,
  Target,
  Flame,
  Rocket,
  Grid3X3,
  List,
  SlidersHorizontal,
  ChevronDown,
  X,
  HelpCircle,
  Shield,
  UserPlus,
  Settings,
  Edit3,
  Trash2,
  Clock3,
  CalendarDays,
  Globe,
  Video,
  Users2
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { cn } from "@/lib/utils"

interface CommunityEvent {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location: string
  isOnline: boolean
  meetingLink?: string
  category: string
  attendees: number
  maxAttendees?: number
  isAttending: boolean
  organizer: {
    name: string
    avatar: string
  }
  campusId: string
  departmentId: string
  batch: string
  tags: string[]
  coverUrl: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
}

export default function CommunityEventsPage() {
  const [events, setEvents] = useState<CommunityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false)
  const [newEventTitle, setNewEventTitle] = useState("")
  const [newEventDescription, setNewEventDescription] = useState("")
  const [newEventStartDate, setNewEventStartDate] = useState("")
  const [newEventEndDate, setNewEventEndDate] = useState("")
  const [newEventLocation, setNewEventLocation] = useState("")
  const [newEventIsOnline, setNewEventIsOnline] = useState(false)
  const [newEventMeetingLink, setNewEventMeetingLink] = useState("")
  const [newEventCategory, setNewEventCategory] = useState("academic")
  const { user } = useAuth()
  const { selectedCampus, selectedDepartment } = useCampus()

  // Load events
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (selectedCampus?.id) params.set('campus_id', selectedCampus.id)
        if (selectedDepartment?.id) params.set('department_id', selectedDepartment.id)
        
        const res = await fetch(`/api/community/events?${params.toString()}`)
        if (!res.ok) throw new Error("Failed to load events")
        const data = await res.json()
        setEvents(data)
      } catch (e: any) {
        setError(e?.message || "Failed to load events")
      } finally {
        setLoading(false)
      }
    }
    
    loadEvents()
  }, [selectedCampus, selectedDepartment])

  const handleCreateEvent = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create an event.",
        variant: "destructive",
      })
      return
    }

    if (newEventTitle.trim().length < 3) {
      toast({
        title: "Event title too short",
        description: "Please enter an event title with at least 3 characters.",
        variant: "destructive",
      })
      return
    }

    if (newEventDescription.trim().length < 10) {
      toast({
        title: "Description too short",
        description: "Please write a description with at least 10 characters.",
        variant: "destructive",
      })
      return
    }

    if (!newEventStartDate || !newEventEndDate) {
      toast({
        title: "Date required",
        description: "Please select both start and end dates.",
        variant: "destructive",
      })
      return
    }

    const startDate = new Date(newEventStartDate)
    const endDate = new Date(newEventEndDate)
    
    if (startDate >= endDate) {
      toast({
        title: "Invalid dates",
        description: "End date must be after start date.",
        variant: "destructive",
      })
      return
    }

    if (!newEventIsOnline && !newEventLocation.trim()) {
      toast({
        title: "Location required",
        description: "Please enter a location for in-person events.",
        variant: "destructive",
      })
      return
    }

    if (newEventIsOnline && !newEventMeetingLink.trim()) {
      toast({
        title: "Meeting link required",
        description: "Please enter a meeting link for online events.",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch("/api/community/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newEventTitle.trim(),
          description: newEventDescription.trim(),
          startDate: newEventStartDate,
          endDate: newEventEndDate,
          location: newEventLocation.trim(),
          isOnline: newEventIsOnline,
          meetingLink: newEventMeetingLink.trim(),
          category: newEventCategory,
          campusId: selectedCampus?.id,
          departmentId: selectedDepartment?.id,
        }),
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error?.error || "Failed to create event")
      }
      
      const newEvent = await res.json()
      setEvents(prev => [newEvent, ...prev])
      setNewEventTitle("")
      setNewEventDescription("")
      setNewEventStartDate("")
      setNewEventEndDate("")
      setNewEventLocation("")
      setNewEventIsOnline(false)
      setNewEventMeetingLink("")
      setIsCreateEventOpen(false)
      toast({ title: "Event created successfully!", description: "Your event has been created." })
    } catch (err: any) {
      toast({ title: "Failed to create event", description: err.message ?? "Unknown error", variant: "destructive" })
    }
  }

  const handleAttendEvent = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to attend events.",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch(`/api/community/events/${eventId}/attend`, { method: "POST" })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error?.error || "Failed to attend event")
      }
      
      const { isAttending, attendees } = await res.json()
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, isAttending, attendees } 
          : event
      ))
      
      toast({ 
        title: isAttending ? "Attending event" : "Cancelled attendance", 
        description: isAttending 
          ? `You're now attending ${events.find(e => e.id === eventId)?.title}!` 
          : `You're no longer attending ${events.find(e => e.id === eventId)?.title}` 
      })
    } catch (err: any) {
      toast({ title: "Failed to update event attendance", description: err.message ?? "Unknown error", variant: "destructive" })
    }
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || event.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = Array.from(new Set(events.map(event => event.category)))
  const statuses = Array.from(new Set(events.map(event => event.status)))

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'ongoing':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className={`${layout.section} py-6`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 to-blue-500/15 border border-primary/30 text-sm font-medium text-primary mb-4 backdrop-blur-sm">
            <Calendar className="h-4 w-4" />
            <span>Community Events</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Discover <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Events</span>
          </h1>
          
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
            Join workshops, study sessions, and networking events organized by your fellow students.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="px-6 py-4 text-base rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md hover:shadow-lg transition-all duration-300 group"
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    Create New Event
                  </DialogTitle>
                  <DialogDescription>
                    Organize an event for your community.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Event Title
                    </label>
                    <Input
                      placeholder="e.g., Machine Learning Workshop"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Description
                    </label>
                    <textarea
                      placeholder="Describe what this event is about..."
                      value={newEventDescription}
                      onChange={(e) => setNewEventDescription(e.target.value)}
                      className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Start Date & Time
                      </label>
                      <Input
                        type="datetime-local"
                        value={newEventStartDate}
                        onChange={(e) => setNewEventStartDate(e.target.value)}
                        className="h-12"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        End Date & Time
                      </label>
                      <Input
                        type="datetime-local"
                        value={newEventEndDate}
                        onChange={(e) => setNewEventEndDate(e.target.value)}
                        className="h-12"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isOnline"
                      checked={newEventIsOnline}
                      onChange={(e) => setNewEventIsOnline(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="isOnline" className="text-sm font-medium">
                      This is an online event
                    </label>
                  </div>
                  
                  {newEventIsOnline ? (
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Meeting Link
                      </label>
                      <Input
                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                        value={newEventMeetingLink}
                        onChange={(e) => setNewEventMeetingLink(e.target.value)}
                        className="h-12"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Location
                      </label>
                      <Input
                        placeholder="e.g., Room 301, Main Building"
                        value={newEventLocation}
                        onChange={(e) => setNewEventLocation(e.target.value)}
                        className="h-12"
                      />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Category
                      </label>
                      <Select value={newEventCategory} onValueChange={setNewEventCategory}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="career">Career</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="competition">Competition</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreateEventOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateEvent}
                      disabled={!newEventTitle.trim() || !newEventDescription.trim() || !newEventStartDate || !newEventEndDate}
                    >
                      Create Event
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              size="lg" 
              variant="outline"
              className="px-6 py-4 text-base rounded-xl border-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Explore Events
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12 w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="h-12 w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-12"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="space-y-6">
          {loading ? (
            <CenteredLoader message="Loading events..." />
          ) : error ? (
            <Card className="p-8 text-center text-destructive">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" />
              <h3 className="font-medium text-lg">Error Loading Events</h3>
              <p className="mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </Card>
          ) : filteredEvents.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <Calendar className="h-12 w-12 text-gray-400" />
                <h3 className="font-medium text-gray-900 dark:text-white">No events found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your filters or create a new event
                </p>
                <Button 
                  onClick={() => setIsCreateEventOpen(true)}
                  className="mt-2"
                >
                  Create Event
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredEvents.map((event) => (
                <Card 
                  key={event.id} 
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden"
                >
                  <div className="md:flex">
                    <div className="md:w-1/3 p-6 border-r border-border">
                      <div className="flex flex-col items-center justify-center h-full">
                        <CalendarDays className="h-12 w-12 text-primary mb-4" />
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            {new Date(event.startDate).getDate()}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-300">
                            {new Date(event.startDate).toLocaleString('default', { month: 'short' })}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {new Date(event.startDate).getFullYear()}
                          </div>
                        </div>
                        <Badge className={cn("mt-4", getStatusBadge(event.status))}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="md:w-2/3">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-xl line-clamp-1">
                            {event.title}
                          </CardTitle>
                          <Badge 
                            className={cn(
                              "text-xs capitalize",
                              event.category === "academic" && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                              event.category === "career" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                              event.category === "social" && "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
                              event.category === "workshop" && "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
                              event.category === "competition" && "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
                            )}
                          >
                            {event.category}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {event.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Clock3 className="h-4 w-4" />
                          <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          {event.isOnline ? (
                            <>
                              <Video className="h-4 w-4" />
                              <span>Online Event</span>
                              {event.meetingLink && (
                                <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                                  <Link href={event.meetingLink} target="_blank">
                                    Join Meeting
                                  </Link>
                                </Button>
                              )}
                            </>
                          ) : (
                            <>
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Users2 className="h-4 w-4" />
                            <span>{event.attendees} attending</span>
                            {event.maxAttendees && (
                              <span>of {event.maxAttendees}</span>
                            )}
                          </div>
                          
                          <div className="flex -space-x-2">
                            <Avatar className="h-8 w-8 border-2 border-white dark:border-slate-800">
                              <AvatarImage src={event.organizer.avatar} />
                              <AvatarFallback className="text-xs">
                                {event.organizer.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="h-8 w-8 rounded-full bg-muted border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs">
                              +{Math.max(0, event.attendees - 1)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {event.tags.slice(0, 4).map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="secondary" 
                              className="text-xs py-0.5 px-2"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => handleAttendEvent(event.id)}
                            variant={event.isAttending ? "default" : "outline"}
                            className="flex-1"
                          >
                            {event.isAttending ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Attending
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Attend
                              </>
                            )}
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/community/events/${event.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}