"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useCampus } from "@/contexts/campus-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  Send
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import type { Post } from "@/lib/community-data"
import { ThreadCard } from "@/components/community/thread-card"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { cn } from "@/lib/utils"

interface Group {
  id: number
  name: string
  members: number
  description: string
  category: string
  isJoined: boolean
  recentActivity: string
  posts: number
  isPrivate?: boolean
  pinnedPosts?: number
  onlineMembers?: number
}

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  attendees: number
  isOnline?: boolean
  category?: string
  status?: 'upcoming' | 'ongoing' | 'completed'
}

export default function CommunityPage() {
  const [newPost, setNewPost] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [postType, setPostType] = useState("general")
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const { user } = useAuth()
  const { selectedCampus, selectedDepartment, departments } = useCampus()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [postLimit] = useState(20)
  const [postOffset, setPostOffset] = useState(0)
  const [hasMorePosts, setHasMorePosts] = useState(true)
  const [loadingMorePosts, setLoadingMorePosts] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'feed' | 'trending' | 'following'>('feed')
  const [showPinned, setShowPinned] = useState(true)
  const [activeFilters, setActiveFilters] = useState({
    timeRange: 'all', // all, today, week, month
    sortBy: 'recent', // recent, popular, most-liked, most-commented
    postTypes: [] as string[]
  })
  const [selectedBatch, setSelectedBatch] = useState<string>("") // New state for batch filtering
  const [availableBatches, setAvailableBatches] = useState<string[]>([]) // New state for available batches
  const [isFilterOpen, setIsFilterOpen] = useState(false) // State for filter panel

  // Load available batches when campus and department change
  useEffect(() => {
    const loadBatches = async () => {
      if (!selectedCampus?.id || !selectedDepartment?.id) return
      
      try {
        const params = new URLSearchParams()
        params.set('campus_id', selectedCampus.id)
        params.set('department_id', selectedDepartment.id)
        
        const res = await fetch(`/api/community/posts?${params.toString()}`)
        if (res.ok) {
          const postsData = await res.json()
          const batches = Array.from(new Set(postsData.map((post: any) => post.batch).filter(Boolean))) as string[]
          setAvailableBatches(batches)
        }
      } catch (e) {
        console.error("Failed to load batches:", e)
      }
    }
    
    loadBatches()
  }, [selectedCampus, selectedDepartment])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        // Build URL with all filters
        const postsParams = new URLSearchParams()
        postsParams.set('limit', postLimit.toString())
        postsParams.set('offset', '0')
        postsParams.set('meta', '1')
        if (selectedCampus?.id) postsParams.set('campus_id', selectedCampus.id)
        if (selectedDepartment?.id) postsParams.set('department_id', selectedDepartment.id)
        if (selectedBatch) postsParams.set('batch', selectedBatch)
        if (selectedCategory !== "all") postsParams.set('type', selectedCategory)
        
        const [postsResponse, eventsResponse] = await Promise.all([
          fetch(`/api/community/posts?${postsParams.toString()}`),
          fetch('/api/news-events/events')
        ])
        
        if (postsResponse.ok) {
          const postsData = await postsResponse.json()
          const rows = Array.isArray(postsData) ? postsData : Array.isArray(postsData?.data) ? postsData.data : []
          const meta = postsData && postsData.meta ? postsData.meta : { hasMore: rows.length === postLimit, nextOffset: rows.length }
          setPosts(rows)
          setHasMorePosts(!!meta.hasMore)
          setPostOffset(Number.isFinite(meta.nextOffset) ? meta.nextOffset : rows.length)
        }
        
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json()
          setEvents(eventsData.slice(0, 3)) // Show only 3 upcoming events
        }
        
        // Load groups from static data for now (can be converted to backend later)
        setGroups([
          {
            id: 1,
            name: "CS Final Year Projects",
            members: 156,
            description: "Share and discuss final year project ideas and progress",
            category: "Academic",
            isJoined: false,
            recentActivity: "2 hours ago",
            posts: 45,
          },
          {
            id: 2,
            name: "COMSATS Job Board",
            members: 892,
            description: "Job opportunities and career guidance for students",
            category: "Career",
            isJoined: true,
            recentActivity: "1 hour ago",
            posts: 123,
          }
        ])
      } catch (e: any) {
        setError(e?.message || "Failed to load community data")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [selectedCampus, selectedDepartment, selectedBatch, selectedCategory])

  const loadMorePosts = async () => {
    if (loadingMorePosts || !hasMorePosts) return
    setLoadingMorePosts(true)
    try {
      const params = new URLSearchParams()
      params.set('limit', postLimit.toString())
      params.set('offset', postOffset.toString())
      params.set('meta', '1')
      if (selectedCampus?.id) params.set('campus_id', selectedCampus.id)
      if (selectedDepartment?.id) params.set('department_id', selectedDepartment.id)
      if (selectedBatch) params.set('batch', selectedBatch)
      if (selectedCategory !== "all") params.set('type', selectedCategory)
      
      const res = await fetch(`/api/community/posts?${params.toString()}`, { cache: 'no-store' })
      const data = await res.json().catch(() => ({}))
      const rows = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
      const meta = data && data.meta ? data.meta : { hasMore: rows.length === postLimit, nextOffset: postOffset + rows.length }
      setPosts((prev) => [...prev, ...rows])
      setPostOffset(Number.isFinite(meta.nextOffset) ? meta.nextOffset : postOffset + rows.length)
      setHasMorePosts(!!meta.hasMore)
    } catch {}
    finally {
      setLoadingMorePosts(false)
    }
  }

  const handleCreatePost = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a post.",
        variant: "destructive",
      })
      return
    }

    if (newPost.trim().length < 10) {
      toast({
        title: "Post too short",
        description: "Please write at least 10 characters.",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newPost,
          type: postType,
          tags: extractTags(newPost),
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to create post")
      const inserted: Post = json
      setPosts((prev) => [inserted, ...prev])
      setNewPost("")
      setIsCreatePostOpen(false)
      toast({ title: "Post created successfully!", description: "Your post has been shared with the community." })
    } catch (err: any) {
      toast({ title: "Failed to create post", description: err.message ?? "Unknown error", variant: "destructive" })
    }
  }

  const extractTags = (content: string) => {
    const hashtags = content.match(/#\w+/g) || []
    return hashtags.map((tag) => tag.substring(1))
  }

  const handleLike = async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like posts.",
        variant: "destructive",
      })
      return
    }

    // optimistic update
    let optimisticPrev: Post[] = []
    setPosts((prevPosts) => {
      optimisticPrev = prevPosts
      return prevPosts.map((post) =>
        post.id === postId
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post,
      )
    })

    try {
      const res = await fetch(`/api/community/posts/${postId}/like`, { method: "POST" })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to like")
      const { count, liked } = json as { count: number; liked: boolean }
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes: count, liked } : p))
      )
    } catch (e: any) {
      // revert on failure
      setPosts((_) => optimisticPrev)
      toast({ title: "Failed to update like", description: e?.message || "Please try again.", variant: "destructive" })
    }
  }

  const handleJoinGroup = (groupId: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join groups.",
        variant: "destructive",
      })
      return
    }

    setGroups((prevGroups: Group[]) =>
      prevGroups.map((group: Group) =>
        group.id === groupId
          ? {
              ...group,
              isJoined: !group.isJoined,
              members: group.isJoined ? group.members - 1 : group.members + 1,
            }
          : group,
      ),
    )

    const group = groups.find((g: Group) => g.id === groupId)
    toast({
      title: group?.isJoined ? "Left group" : "Joined group",
      description: group?.isJoined ? `You left ${group.name}` : `Welcome to ${group?.name}!`,
    })
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || post.type === selectedCategory

    return matchesSearch && matchesCategory
  })

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("all")
    setSelectedBatch("")
    setSearchQuery("")
    setActiveFilters({
      timeRange: 'all',
      sortBy: 'recent',
      postTypes: []
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className="app-container section py-12">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            <Users className="h-4 w-4" />
            Student Community Hub
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            Connect & <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Collaborate</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 font-medium leading-relaxed">
            Join thousands of COMSATS students sharing knowledge, opportunities, and academic journeys
          </p>
          
          {/* Quick Stats with Glassmorphism */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-200/30 dark:border-blue-700/30">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">2,847</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Active Students</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-200/30 dark:border-green-700/30">
                  <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{posts.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Recent Posts</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-200/30 dark:border-purple-700/30">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{groups.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Study Groups</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-200/30 dark:border-orange-700/30">
                  <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{events.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Upcoming Events</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="feed" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="feed">Community Feed</TabsTrigger>
                <TabsTrigger value="groups">Study Groups</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="space-y-6">
                <Card variant="elevated">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Share with Community
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsFilterOpen(!isFilterOpen)}
                          className="flex items-center gap-2"
                        >
                          <Filter className="h-4 w-4" />
                          Filters
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full" variant="soft">
                          <Plus className="h-4 w-4 mr-2" />
                          Create New Post
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                          <DialogTitle>Create New Post</DialogTitle>
                          <DialogDescription>
                            Share your thoughts, questions, or achievements with the community.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Select value={postType} onValueChange={setPostType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select post type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Discussion</SelectItem>
                              <SelectItem value="study">Study Related</SelectItem>
                              <SelectItem value="achievement">Achievement</SelectItem>
                              <SelectItem value="opportunity">Opportunity</SelectItem>
                            </SelectContent>
                          </Select>
                          <Textarea
                            placeholder="What's on your mind? Use #hashtags to categorize your post..."
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            className="min-h-[120px]"
                          />
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">{newPost.length}/500 characters</div>
                            <Button onClick={handleCreatePost} disabled={!newPost.trim() || newPost.length < 10}>
                              Post
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>

                {/* Advanced Filters Panel */}
                {isFilterOpen && (
                  <Card variant="soft">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-900 dark:text-white">Filters</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={resetFilters}
                          className="text-sm"
                        >
                          Reset All
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Category Filter */}
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                            Category
                          </label>
                          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              <SelectItem value="study">Study</SelectItem>
                              <SelectItem value="achievement">Achievement</SelectItem>
                              <SelectItem value="opportunity">Opportunity</SelectItem>
                              <SelectItem value="general">General</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Batch Filter */}
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                            Batch
                          </label>
                          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select batch" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Batches</SelectItem>
                              {availableBatches.map((batch) => (
                                <SelectItem key={batch} value={batch}>
                                  {batch}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {/* Search Filter */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                          Search
                        </label>
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-6">
                  {loading ? (
                    <CenteredLoader message="Loading community posts..." />
                  ) : error ? (
                    <Card variant="soft" className="p-8 text-center text-blue-600">{error}</Card>
                  ) : filteredPosts.length === 0 ? (
                    <Card variant="soft" className="p-8 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <MessageSquare className="h-12 w-12 text-gray-400" />
                        <h3 className="font-medium text-gray-900 dark:text-white">No posts found</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Try adjusting your filters or create a new post
                        </p>
                        <Button 
                          onClick={() => setIsCreatePostOpen(true)}
                          className="mt-2"
                        >
                          Create Post
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    filteredPosts.map((post) => (
                      <Link href={`/community/post/${post.id}`} key={post.id} className="block">
                        <ThreadCard thread={post} handleLike={handleLike} />
                      </Link>
                    ))
                  )}
                  {hasMorePosts && (
                    <div className="flex justify-center pt-4">
                      <Button onClick={loadMorePosts} disabled={loadingMorePosts} variant="soft">
                        {loadingMorePosts ? 'Loading...' : 'Load more'}
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="groups" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredGroups.map((group) => (
                    <Card key={group.id} variant="elevated" className="transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                              {group.name}
                              {group.isJoined && (
                                <Badge className="text-xs bg-primary text-primary-foreground border-transparent">
                                  Joined
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="mt-2">{group.description}</CardDescription>
                          </div>
                          <Badge className="border text-foreground">{group.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm text-gray-500">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {group.members} members
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              {group.posts} posts
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">Last activity: {group.recentActivity}</div>
                          <Button
                            onClick={() => handleJoinGroup(group.id)}
                            className="w-full text-sm"
                            variant={group.isJoined ? "outline" : "default"}
                          >
                            {group.isJoined ? "Leave Group" : "Join Group"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="events" className="space-y-6">
                <div className="space-y-4">
                  {events.map((event: Event) => (
                    <Card key={event.id} variant="elevated" className="transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                              <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                                {event.title}
                              </h3>
                              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  {event.date} at {event.time}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  {event.location}
                                </div>
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-2" />
                                  {event.attendees} attending
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button className="text-sm" variant="soft">Join Event</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            {/* Search */}
            <Card variant="soft">
              <CardHeader>
                <CardTitle className="text-lg">Search Community</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search posts, groups, or people..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Campus and Department Info */}
            <Card variant="soft">
              <CardHeader>
                <CardTitle className="text-lg">Your Campus & Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Campus:</span>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {selectedCampus?.name || 'Not selected'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Department:</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {selectedDepartment?.name || 'Not selected'}
                    </Badge>
                  </div>
                  {selectedBatch && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Batch:</span>
                      <Badge className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {selectedBatch}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card variant="soft">
              <CardHeader>
                <CardTitle className="text-lg">Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Final Year Project",
                    "Study Group",
                    "Internship",
                    "Career",
                    "Programming",
                    "Mathematics",
                    "Physics",
                    "Business",
                    "AI",
                    "Machine Learning",
                  ].map((tag) => (
                    <Badge
                      key={tag}
                      className="cursor-pointer hover:bg-blue-100 transition-colors bg-secondary text-secondary-foreground border-transparent"
                      onClick={() => setSearchQuery(tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card variant="soft">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="soft" onClick={() => setIsCreatePostOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
                <Button className="w-full justify-start" variant="soft" onClick={() => {
                    setPostType("study")
                    setIsCreatePostOpen(true)
                  }}>
                  <Users className="h-4 w-4 mr-2" />
                  Find Study Partners
                </Button>
                <Button className="w-full justify-start" variant="soft" onClick={() => {
                    setPostType("general")
                    setIsCreatePostOpen(true)
                  }}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask a Question
                </Button>
                <Button className="w-full justify-start" variant="soft" onClick={() => {
                    setPostType("achievement")
                    setIsCreatePostOpen(true)
                  }}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Share Achievement
                </Button>
              </CardContent>
            </Card>

            <Card variant="soft">
              <CardHeader>
                <CardTitle className="text-lg">My Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {groups
                    .filter((group) => group.isJoined)
                    .map((group) => (
                      <div
                        key={group.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <div>
                          <p className="font-medium text-sm">{group.name}</p>
                          <p className="text-xs text-gray-500">{group.members} members</p>
                        </div>
                        <Badge className="text-xs border text-foreground">
                          {group.category}
                        </Badge>
                      </div>
                    ))}
                  {groups.filter((group) => group.isJoined).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No groups joined yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
