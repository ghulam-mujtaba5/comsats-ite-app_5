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
  Shield
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
  const [selectedBatch, setSelectedBatch] = useState<string>("__all__") // New state for batch filtering
  const [availableBatches, setAvailableBatches] = useState<string[]>([]) // New state for available batches
  const [isFilterOpen, setIsFilterOpen] = useState(false) // State for filter panel
  const [sortBy, setSortBy] = useState('recent') // New state for sorting

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
        if (selectedBatch && selectedBatch !== "__all__") postsParams.set('batch', selectedBatch)
        if (selectedCategory !== "all") postsParams.set('type', selectedCategory)
        if (sortBy) postsParams.set('sort', sortBy)
        
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
  }, [selectedCampus, selectedDepartment, selectedBatch, selectedCategory, sortBy])

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
      if (selectedBatch && selectedBatch !== "__all__") params.set('batch', selectedBatch)
      if (selectedCategory !== "all") params.set('type', selectedCategory)
      if (sortBy) params.set('sort', sortBy)
      
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
    setSelectedBatch("__all__")
    setSearchQuery("")
    setActiveFilters({
      timeRange: 'all',
      sortBy: 'recent',
      postTypes: []
    })
    setSortBy('recent')
  }

  // Apply filters and sorting
  const applyFilters = () => {
    // This will trigger the useEffect that reloads posts
    setIsFilterOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="app-container section py-6 relative z-10">
        {/* Modern Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 to-blue-500/15 border border-primary/30 text-sm font-medium text-primary mb-4 backdrop-blur-sm">
            <Users className="h-4 w-4" />
            <span>Student Community Hub</span>
            <Badge className="ml-2 bg-primary text-primary-foreground text-xs">Beta</Badge>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Connect, Collaborate & <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Grow</span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6 font-medium">
            Join thousands of COMSATS students sharing knowledge, opportunities, and academic journeys.
          </p>
          
          {/* Enhanced Quick Stats - Responsive Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-6">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-200/30 dark:border-blue-700/30">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">2,847</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Students</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-200/30 dark:border-green-700/30">
                  <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{posts.length}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Posts</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-200/30 dark:border-purple-700/30">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{groups.length}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Groups</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-200/30 dark:border-orange-700/30">
                  <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{events.length}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Events</div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Enhanced Call to Action - Responsive Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Button 
              size="lg" 
              className="px-6 py-4 text-base rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md hover:shadow-lg transition-all duration-300 group w-full sm:w-auto"
              onClick={() => setIsCreatePostOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
              Create Post
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="px-6 py-4 text-base rounded-xl border-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 w-full sm:w-auto"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Explore Community
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* View Mode Tabs */}
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 p-1 rounded-2xl">
                <TabsTrigger 
                  value="feed" 
                  className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Community Feed
                </TabsTrigger>
                <TabsTrigger 
                  value="trending" 
                  className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending
                </TabsTrigger>
                <TabsTrigger 
                  value="following" 
                  className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Following
                </TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="space-y-6 mt-6">
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
                      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-primary" />
                            Create New Post
                          </DialogTitle>
                          <DialogDescription className="text-base">
                            Share your thoughts, questions, or achievements with the community. 
                            Use #hashtags to categorize your post and reach the right audience.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                Post Type
                              </label>
                              <Select value={postType} onValueChange={setPostType}>
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select post type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="general">
                                    <div className="flex items-center gap-2">
                                      <MessageSquare className="h-4 w-4" />
                                      General Discussion
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="study">
                                    <div className="flex items-center gap-2">
                                      <BookOpen className="h-4 w-4" />
                                      Study Related
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="achievement">
                                    <div className="flex items-center gap-2">
                                      <Trophy className="h-4 w-4" />
                                      Achievement
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="opportunity">
                                    <div className="flex items-center gap-2">
                                      <Target className="h-4 w-4" />
                                      Opportunity
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="question">
                                    <div className="flex items-center gap-2">
                                      <MessageSquare className="h-4 w-4" />
                                      Question
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                Campus
                              </label>
                              <Select 
                                value={selectedCampus?.id || ""} 
                                onValueChange={(value) => {
                                  const campus = useCampus().campuses.find((c: any) => c.id === value);
                                  if (campus) useCampus().setSelectedCampus(campus);
                                }}
                              >
                                <SelectTrigger className="h-12">
                                  <SelectValue placeholder="Select campus" />
                                </SelectTrigger>
                                <SelectContent>
                                  {useCampus().campuses.map((campus: any) => (
                                    <SelectItem key={campus.id} value={campus.id}>
                                      {campus.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                              Department
                            </label>
                            <Select 
                              value={selectedDepartment?.id || ""} 
                              onValueChange={(value) => {
                                const department = useCampus().departments.find((d: any) => d.id === value);
                                if (department) useCampus().setSelectedDepartment(department);
                              }}
                            >
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                {useCampus().departments.map((department: any) => (
                                  <SelectItem key={department.id} value={department.id}>
                                    {department.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                              Batch (Optional)
                            </label>
                            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select batch" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__all__">All Batches</SelectItem>
                                {availableBatches.map((batch) => (
                                  <SelectItem key={batch} value={batch}>
                                    {batch}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                              Your Post
                            </label>
                            <Textarea
                              placeholder="What's on your mind? Be specific and use #hashtags to categorize your post..."
                              value={newPost}
                              onChange={(e) => setNewPost(e.target.value)}
                              className="min-h-[150px] text-base p-4"
                            />
                            <div className="flex justify-between items-center mt-2">
                              <div className="text-sm text-gray-500">
                                {newPost.length}/1000 characters
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-xs"
                                >
                                  <Hash className="h-3 w-3 mr-1" />
                                  Add Tag
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Shield className="h-4 w-4" />
                              Posts are reviewed by community guidelines
                            </div>
                            <Button 
                              onClick={handleCreatePost} 
                              disabled={!newPost.trim() || newPost.length < 10}
                              className="px-6 py-2.5"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Post to Community
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>

                {/* Enhanced Filter Bar */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl mb-8">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* Search and Main Filters */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="lg:col-span-2">
                          <div className="relative">
                            <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search posts, tags, or people..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10 h-12 text-base"
                            />
                          </div>
                        </div>
                        
                        {/* Category Filter */}
                        <div>
                          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              <SelectItem value="study">Study</SelectItem>
                              <SelectItem value="achievement">Achievement</SelectItem>
                              <SelectItem value="opportunity">Opportunity</SelectItem>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="question">Question</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Batch Filter */}
                        <div>
                          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Batch" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="__all__">All Batches</SelectItem>
                              {availableBatches.map((batch) => (
                                <SelectItem key={batch} value={batch}>
                                  {batch}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {/* Sorting and View Options */}
                      <div className="flex flex-wrap gap-3">
                        {/* Sort By */}
                        <div>
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="h-12 w-40">
                              <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="recent">Most Recent</SelectItem>
                              <SelectItem value="popular">Most Popular</SelectItem>
                              <SelectItem value="liked">Most Liked</SelectItem>
                              <SelectItem value="commented">Most Commented</SelectItem>
                              <SelectItem value="shared">Most Shared</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* View Mode */}
                        <div className="flex rounded-lg border border-border overflow-hidden">
                          <Button
                            variant={viewMode === 'feed' ? "default" : "outline"}
                            size="sm"
                            className="rounded-none border-0"
                            onClick={() => setViewMode('feed')}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={viewMode === 'trending' ? "default" : "outline"}
                            size="sm"
                            className="rounded-none border-0 border-l"
                            onClick={() => setViewMode('trending')}
                          >
                            <TrendingUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={viewMode === 'following' ? "default" : "outline"}
                            size="sm"
                            className="rounded-none border-0 border-l"
                            onClick={() => setViewMode('following')}
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Advanced Filter Button */}
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 h-12"
                          onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                          <SlidersHorizontal className="h-4 w-4" />
                          Filters
                        </Button>
                      </div>
                    </div>
                    
                    {/* Advanced Filters Panel */}
                    {isFilterOpen && (
                      <div className="mt-6 pt-6 border-t border-border">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* Time Range Filter */}
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                              Time Range
                            </label>
                            <Select 
                              value={activeFilters.timeRange} 
                              onValueChange={(value) => setActiveFilters({...activeFilters, timeRange: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Any time" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Any time</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="week">This week</SelectItem>
                                <SelectItem value="month">This month</SelectItem>
                                <SelectItem value="year">This year</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {/* Post Types Filter */}
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                              Post Types
                            </label>
                            <div className="space-y-2">
                              {['general', 'study', 'achievement', 'opportunity', 'question'].map((type) => (
                                <div key={type} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`type-${type}`}
                                    checked={activeFilters.postTypes.includes(type)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setActiveFilters({
                                          ...activeFilters,
                                          postTypes: [...activeFilters.postTypes, type]
                                        })
                                      } else {
                                        setActiveFilters({
                                          ...activeFilters,
                                          postTypes: activeFilters.postTypes.filter(t => t !== type)
                                        })
                                      }
                                    }}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                  />
                                  <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                                    {type}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Tags Filter */}
                          <div className="lg:col-span-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                              Tags
                            </label>
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
                                  className={cn(
                                    "cursor-pointer transition-colors",
                                    selectedTags.includes(tag)
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-secondary text-secondary-foreground hover:bg-primary/20"
                                  )}
                                  onClick={() => {
                                    if (selectedTags.includes(tag)) {
                                      setSelectedTags(selectedTags.filter(t => t !== tag))
                                    } else {
                                      setSelectedTags([...selectedTags, tag])
                                    }
                                  }}
                                >
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Filter Actions */}
                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                          <Button variant="outline" onClick={resetFilters}>
                            Reset Filters
                          </Button>
                          <Button onClick={applyFilters}>
                            Apply Filters
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

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

              <TabsContent value="trending" className="space-y-6 mt-6">
                <div className="space-y-6">
                  {/* Trending Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trending Posts</h2>
                    <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                      <Flame className="h-4 w-4 mr-1" />
                      Hot Right Now
                    </Badge>
                  </div>
                  
                  {/* Trending Posts */}
                  {loading ? (
                    <CenteredLoader message="Loading trending posts..." />
                  ) : error ? (
                    <Card className="p-8 text-center">
                      <div className="flex flex-col items-center gap-2 text-red-600">
                        <AlertCircle className="h-12 w-12" />
                        <h3 className="font-medium text-lg">Error Loading Posts</h3>
                        <p>{error}</p>
                        <Button 
                          onClick={() => window.location.reload()}
                          className="mt-4"
                        >
                          Try Again
                        </Button>
                      </div>
                    </Card>
                  ) : filteredPosts.filter(post => post.likes > 10 || post.comments > 5).length === 0 ? (
                    <Card className="p-8 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <TrendingUp className="h-12 w-12 text-gray-400" />
                        <h3 className="font-medium text-lg">No Trending Posts</h3>
                        <p className="text-gray-500">Check back later for trending content</p>
                      </div>
                    </Card>
                  ) : (
                    filteredPosts
                      .filter(post => post.likes > 10 || post.comments > 5)
                      .sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments))
                      .map((post) => (
                        <Link href={`/community/post/${post.id}`} key={post.id} className="block">
                          <ThreadCard thread={post} handleLike={handleLike} />
                        </Link>
                      ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="following" className="space-y-6 mt-6">
                <div className="space-y-6">
                  {/* Following Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Following</h2>
                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                      <Users className="h-4 w-4 mr-1" />
                      Personalized
                    </Badge>
                  </div>
                  
                  {/* Following Posts */}
                  {loading ? (
                    <CenteredLoader message="Loading your posts..." />
                  ) : error ? (
                    <Card className="p-8 text-center">
                      <div className="flex flex-col items-center gap-2 text-red-600">
                        <AlertCircle className="h-12 w-12" />
                        <h3 className="font-medium text-lg">Error Loading Posts</h3>
                        <p>{error}</p>
                        <Button 
                          onClick={() => window.location.reload()}
                          className="mt-4"
                        >
                          Try Again
                        </Button>
                      </div>
                    </Card>
                  ) : filteredPosts.filter(post => post.author === user?.email?.split('@')[0]).length === 0 ? (
                    <Card className="p-8 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-12 w-12 text-gray-400" />
                        <h3 className="font-medium text-lg">No Posts from You</h3>
                        <p className="text-gray-500">Create your first post to see it here</p>
                        <Button 
                          onClick={() => setIsCreatePostOpen(true)}
                          className="mt-4"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Post
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    filteredPosts
                      .filter(post => post.author === user?.email?.split('@')[0])
                      .map((post) => (
                        <Link href={`/community/post/${post.id}`} key={post.id} className="block">
                          <ThreadCard thread={post} handleLike={handleLike} />
                        </Link>
                      ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Feed Content */}
            {viewMode === 'feed' && (
              <div className="space-y-6">
                {/* ... existing feed content ... */}
              </div>
            )}
          </div>

          {/* Sidebar - Hidden on mobile by default, shown on larger screens */}
          <div className="lg:col-span-1 space-y-6 hidden lg:block">
            {/* Quick Actions */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start h-12 text-base rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                  onClick={() => setIsCreatePostOpen(true)}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Post
                </Button>
                
                <Button 
                  className="w-full justify-start h-12 text-base rounded-xl"
                  variant="outline"
                  onClick={() => {
                    setPostType("study")
                    setIsCreatePostOpen(true)
                  }}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Find Study Partners
                </Button>
                
                <Button 
                  className="w-full justify-start h-12 text-base rounded-xl"
                  variant="outline"
                  onClick={() => {
                    setPostType("question")
                    setIsCreatePostOpen(true)
                  }}
                >
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Ask a Question
                </Button>
                
                <Button 
                  className="w-full justify-start h-12 text-base rounded-xl"
                  variant="outline"
                  onClick={() => {
                    setPostType("achievement")
                    setIsCreatePostOpen(true)
                  }}
                >
                  <Trophy className="h-5 w-5 mr-2" />
                  Share Achievement
                </Button>
                
                <Button 
                  className="w-full justify-start h-12 text-base rounded-xl"
                  variant="outline"
                  onClick={() => {
                    setPostType("opportunity")
                    setIsCreatePostOpen(true)
                  }}
                >
                  <Target className="h-5 w-5 mr-2" />
                  Post Opportunity
                </Button>
              </CardContent>
            </Card>

            {/* Campus and Department Info */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Your Campus & Department
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Campus:</span>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm py-1">
                      {selectedCampus?.name || 'Not selected'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Department:</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm py-1">
                      {selectedDepartment?.name || 'Not selected'}
                    </Badge>
                  </div>
                  
                  {selectedBatch && (
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Batch:</span>
                      <Badge className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 py-1">
                        {selectedBatch}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Campus Stats */}
                  <div className="pt-3 border-t border-border">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Campus Activity</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-lg font-bold text-primary">1,247</div>
                        <div className="text-xs text-gray-500">Students</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-lg font-bold text-green-600">89</div>
                        <div className="text-xs text-gray-500">Posts Today</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Hash className="h-5 w-5 text-primary" />
                  Popular Tags
                </CardTitle>
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
                    "Scholarship",
                    "Research",
                    "Hackathon",
                    "Club",
                    "Event"
                  ].map((tag) => (
                    <Badge
                      key={tag}
                      className="cursor-pointer hover:bg-primary/20 transition-colors bg-secondary text-secondary-foreground border-transparent text-sm py-1.5 px-3"
                      onClick={() => setSearchQuery(`#${tag}`)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* My Groups */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  My Groups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {groups
                    .filter((group) => group.isJoined)
                    .map((group) => (
                      <div
                        key={group.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
                    <div className="text-center py-4">
                      <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No groups joined yet</p>
                      <Button 
                        variant="link" 
                        className="text-primary text-sm mt-1 p-0 h-auto"
                        onClick={() => {}}
                      >
                        Browse Groups
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.length > 0 ? (
                    events.map((event: Event) => (
                      <div key={event.id} className="p-3 border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{event.date} at {event.time}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{event.location}</span>
                        </div>
                        <Button size="sm" className="w-full mt-2 text-xs">
                          Join Event
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No upcoming events</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Gamification - User Progress */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* User Level */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        5
                      </div>
                      <div>
                        <p className="font-medium text-sm">Level 5 Explorer</p>
                        <p className="text-xs text-gray-500">240/500 XP</p>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                      +60 XP
                    </Badge>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '48%'}}></div>
                  </div>
                  
                  {/* Achievements */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Achievements</h4>
                    <div className="flex gap-2">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                          <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <span className="text-xs mt-1 text-center">First Post</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Heart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-xs mt-1 text-center">10 Likes</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-xs mt-1 text-center">5 Comments</span>
                      </div>
                      <div className="flex flex-col items-center opacity-50">
                        <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <Star className="h-4 w-4 text-gray-400" />
                        </div>
                        <span className="text-xs mt-1 text-center">100 Posts</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Weekly Challenge */}
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Weekly Challenge</span>
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">Post 3 questions this week</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className={`h-2 w-2 rounded-full ${i <= 2 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        ))}
                      </div>
                      <Badge className="text-xs bg-blue-500 text-white">2/3</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
