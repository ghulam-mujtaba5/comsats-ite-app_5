"use client"

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
import { Separator } from "@/components/ui/separator"
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
  Home,
  Compass,
  User,
  MoreHorizontal,
  Settings,
  LogOut,
  Smile,
  Image as ImageIcon,
  Video,
  PlayCircle,
  Globe,
  Lock,
  UserCheck,
  Camera,
  Edit,
  Trash2,
  Flag,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Check,
  CheckCheck,
  Mic,
  Phone,
  VideoIcon as VideoCallIcon,
  Paperclip,
  ThumbsUp,
  Laugh,
  Frown,
  AngryIcon as Angry,
  EyeOff,
  AtSign,
  Radio,
  Film,
  BarChart3
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import type { Post, Group, Event } from "@/lib/community-data"
import { ThreadCard } from "@/components/community/thread-card"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { cn } from "@/lib/utils"
import { MobileCommunityView } from "@/components/community/mobile-community-view"
import { useIsMobile } from "@/hooks/use-mobile"
import { useRealtimePosts } from "@/hooks/use-realtime-posts"
import { SharingButton } from "@/components/community/sharing-button"
import { EnhancedSharingDialog } from "@/components/community/enhanced-sharing-dialog"
import { PostFilters } from "@/components/community/post-filters"
import { supabase } from "@/lib/supabase"
import { CommentSection } from "@/components/community/comment-section"

export default function CommunityPage() {
  const [newPost, setNewPost] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [groups, setGroups] = useState<Group[]>([
    // Mock data for groups
    {
      id: "1",
      name: "Computer Science Students",
      description: "Discussion group for CS students",
      members_count: 1247,
      posts_count: 42,
      is_joined: true,
      category: "Academic",
      is_private: false,
      created_at: "2023-01-15T10:30:00Z"
    },
    {
      id: "2",
      name: "Final Year Project Hub",
      description: "FYP collaboration and resources",
      members_count: 892,
      posts_count: 28,
      is_joined: false,
      category: "Academic",
      is_private: false,
      created_at: "2023-02-20T14:15:00Z"
    },
    {
      id: "3",
      name: "Sports Club",
      description: "Campus sports activities",
      members_count: 563,
      posts_count: 15,
      is_joined: true,
      category: "Recreation",
      is_private: false,
      created_at: "2023-03-10T09:45:00Z"
    }
  ])
  const [events, setEvents] = useState<Event[]>([
    // Mock data for events
    {
      id: "1",
      title: "AI Workshop",
      description: "Learn about the latest AI technologies and applications",
      date: "2023-12-15",
      time: "10:00 AM",
      location: "CS Building, Room 201",
      attendees_count: 42,
      category: "Workshop",
      status: "upcoming",
      image_url: "/events/ai-workshop.jpg",
      created_by: "user123",
      created_at: "2023-11-01T08:00:00Z"
    },
    {
      id: "2",
      title: "Career Fair",
      description: "Meet potential employers and explore career opportunities",
      date: "2023-12-20",
      time: "9:00 AM",
      location: "Main Auditorium",
      attendees_count: 120,
      category: "Career",
      status: "upcoming",
      image_url: "/events/career-fair.jpg",
      created_by: "admin456",
      created_at: "2023-11-15T12:30:00Z"
    },
    {
      id: "3",
      title: "Hackathon",
      description: "48-hour coding competition with exciting prizes",
      date: "2024-01-10",
      time: "8:00 AM",
      location: "Engineering Block",
      attendees_count: 85,
      category: "Competition",
      status: "upcoming",
      image_url: "/events/hackathon.jpg",
      created_by: "student789",
      created_at: "2023-12-01T16:45:00Z"
    }
  ])
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
  const [availableBatches, setAvailableBatches] = useState<string[]>([
    "FA22-BSE", "SP23-BSCS", "FA23-BSE", "SP24-BSCS"
  ]) // New state for available batches
  const [isFilterOpen, setIsFilterOpen] = useState(false) // State for filter panel
  const [sortBy, setSortBy] = useState('recent') // New state for sorting
  const isMobile = useIsMobile()
  const [newPostMedia, setNewPostMedia] = useState<File[]>([])
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false)
  
  // Use real-time posts instead of manual fetching
  const { posts: realtimePosts, loading: realtimeLoading, error: realtimeError } = useRealtimePosts(
    selectedCampus?.id, 
    selectedDepartment?.id, 
    selectedBatch
  )
  
  // Use real-time data when available
  const postsToDisplay = realtimePosts.length > 0 ? realtimePosts : posts
  const isLoading = realtimeLoading || loading
  const displayError = realtimeError || error

  // Load batches when campus and department change
  useEffect(() => {
    // In a real implementation, this would fetch from the API
    // For now, we're using mock data
    if (selectedCampus?.id && selectedDepartment?.id) {
      // Simulate API call
      setTimeout(() => {
        setAvailableBatches([
          "FA22-BSE", "SP23-BSCS", "FA23-BSE", "SP24-BSCS", 
          "FA22-BSCS", "SP23-BSE", "FA23-BSCS", "SP24-BSE"
        ])
      }, 500)
    }
  }, [selectedCampus, selectedDepartment])

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
      
      // Use force-cache to reduce function invocations on Vercel free tier
      const res = await fetch(`/api/community/posts?${params.toString()}`, { cache: 'force-cache' })
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

  const handleCreatePost = async (sharingContent: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a post.",
        variant: "destructive",
      })
      return
    }

    try {
      // Handle media upload first
      let mediaUrls: string[] = []
      if (sharingContent.media && sharingContent.media.length > 0) {
        // Upload media files and get URLs
        // This would typically involve uploading to a storage service
        // For now, we'll just log the files
        console.log("Uploading media files:", sharingContent.media)
        // mediaUrls = await uploadMediaFiles(media)
      }

      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: sharingContent.description,
          type: sharingContent.type,
          tags: sharingContent.tags,
          media: mediaUrls
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to create post")
      const inserted: Post = json
      setPosts((prev) => [inserted, ...prev])
      
      toast({ 
        title: "Post created successfully!", 
        description: "Your post has been shared with the community." 
      })
    } catch (err: any) {
      toast({ 
        title: "Failed to create post", 
        description: err.message ?? "Unknown error", 
        variant: "destructive" 
      })
      throw new Error(err.message ?? "Unknown error")
    }
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

  const handleComment = (postId: string) => {
    setSelectedPostId(postId)
    setIsCommentSectionOpen(true)
  }

  const handleShare = (postId: string) => {
    // In a real implementation, this would open a share dialog
    toast({
      title: "Share Post",
      description: "Share functionality would be implemented here"
    })
  }

  const handleJoinGroup = (groupId: string) => {
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
              is_joined: !group.is_joined,
              members_count: group.is_joined ? group.members_count - 1 : group.members_count + 1,
            }
          : group,
      )
    )

    const group = groups.find((g: Group) => g.id === groupId)
    toast({
      title: group?.is_joined ? "Left group" : "Joined group",
      description: group?.is_joined ? `You left ${group.name}` : `Welcome to ${group?.name}!`,
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

  if (isMobile) {
    return (
      <MobileCommunityView
        posts={posts}
        groups={groups}
        events={events}
        loading={loading}
        error={error}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedBatch={selectedBatch}
        setSelectedBatch={setSelectedBatch}
        availableBatches={availableBatches}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isCreatePostOpen={isCreatePostOpen}
        setIsCreatePostOpen={setIsCreatePostOpen}
        newPost={newPost}
        setNewPost={setNewPost}
        postType={postType}
        setPostType={setPostType}
        handleCreatePost={handleCreatePost}
        handleLike={handleLike}
        handleJoinGroup={handleJoinGroup}
        loadMorePosts={loadMorePosts}
        hasMorePosts={hasMorePosts}
        loadingMorePosts={loadingMorePosts}
      />
    )
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="app-container section py-6 max-w-7xl mx-auto">
        {/* Modern Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-muted text-sm font-medium text-foreground mb-4">
            <Users className="h-4 w-4" />
            <span>Student Community Hub</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Connect, Collaborate & <span className="text-primary">Grow</span>
          </h1>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Join thousands of COMSATS students sharing knowledge, opportunities, and academic journeys.
          </p>
          
          {/* Enhanced Quick Stats - Responsive Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-6">
            <Card className="border">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold tracking-tight text-foreground">2,847</div>
                  <div className="text-xs text-muted-foreground">Students</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="p-2 rounded-xl bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold tracking-tight text-foreground">{posts.length}</div>
                  <div className="text-xs text-muted-foreground">Posts</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="p-2 rounded-xl bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold tracking-tight text-foreground">{groups.length}</div>
                  <div className="text-xs text-muted-foreground">Groups</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold tracking-tight text-foreground">{events.length}</div>
                  <div className="text-xs text-muted-foreground">Events</div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Enhanced Call to Action - Responsive Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Button 
              size="lg" 
              className="px-6 py-4 text-base rounded-xl"
              onClick={() => setIsCreatePostOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="px-6 py-4 text-base rounded-xl"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Explore Community
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* View Mode Tabs */}
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted p-1 rounded-2xl">
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
                <Card>
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
                    <Button className="w-full" variant="outline" onClick={() => setIsCreatePostOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Post
                    </Button>
                  </CardContent>
                </Card>

                {/* Enhanced Filter Bar */}
                <PostFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  selectedBatch={selectedBatch}
                  onBatchChange={setSelectedBatch}
                  availableBatches={availableBatches}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  isFilterOpen={isFilterOpen}
                  onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
                  activeFilters={activeFilters}
                  onActiveFiltersChange={setActiveFilters}
                  selectedTags={selectedTags}
                  onSelectedTagsChange={setSelectedTags}
                  onResetFilters={resetFilters}
                  onApplyFilters={applyFilters}
                />

                {/* Posts List */}
                <div className="space-y-6">
                  {isLoading ? (
                    <CenteredLoader message="Loading posts..." />
                  ) : displayError ? (
                    <Card className="p-8 text-center text-destructive">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                      <h3 className="font-medium text-lg">Error Loading Posts</h3>
                      <p className="mb-4">{displayError}</p>
                      <Button onClick={() => window.location.reload()}>
                        Try Again
                      </Button>
                    </Card>
                  ) : postsToDisplay.length === 0 ? (
                    <Card className="p-8 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <MessageSquare className="h-12 w-12 text-gray-400" />
                        <h3 className="font-medium text-gray-900 dark:text-white">No posts yet</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Be the first to share something with the community
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
                    <>
                      {postsToDisplay.map((post) => (
                        <ThreadCard
                          key={post.id}
                          post={post}
                          onLike={handleLike}
                          onComment={handleComment}
                          onShare={handleShare}
                          currentUser={user}
                        />
                      ))}
                      {hasMorePosts && (
                        <div className="text-center">
                          <Button
                            onClick={loadMorePosts}
                            disabled={loadingMorePosts}
                            variant="outline"
                            className="mx-auto"
                          >
                            {loadingMorePosts ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                              </>
                            ) : (
                              "Load More Posts"
                            )}
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="trending" className="space-y-6 mt-6">
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-foreground mb-2">Trending Posts</h3>
                  <p className="text-muted-foreground mb-6">
                    See what's popular in the community right now
                  </p>
                  <Button onClick={() => setViewMode('feed')}>
                    View All Posts
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="following" className="space-y-6 mt-6">
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-foreground mb-2">Following</h3>
                  <p className="text-muted-foreground mb-6">
                    See posts from people and groups you follow
                  </p>
                  <Button onClick={() => setViewMode('feed')}>
                    View All Posts
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Quick Actions */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start"
                  variant="ghost"
                  onClick={() => setIsCreatePostOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
                <Button 
                  className="w-full justify-start"
                  variant="ghost"
                  asChild
                >
                  <Link href="/community/groups">
                    <Users className="h-4 w-4 mr-2" />
                    Join Groups
                  </Link>
                </Button>
                <Button 
                  className="w-full justify-start"
                  variant="ghost"
                  asChild
                >
                  <Link href="/community/events">
                    <Calendar className="h-4 w-4 mr-2" />
                    Find Events
                  </Link>
                </Button>
                <Button 
                  className="w-full justify-start"
                  variant="ghost"
                  asChild
                >
                  <Link href="/community/polls">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Vote in Polls
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Trending Tags */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5" />
                  Trending Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["#FinalYearProject", "#Internship", "#Career", "#StudyGroup", "#Programming", "#AI"].map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => {
                        setSearchQuery(tag.replace('#', ''));
                        setViewMode('feed');
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {events.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">{event.title}</h4>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                ))}
                {events.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No upcoming events
                  </p>
                )}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/community/events">
                    View All Events
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Popular Groups */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Popular Groups
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {groups.slice(0, 3).map((group) => (
                  <div key={group.id} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/avatars/group-${group.id}.png`} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {group.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">{group.name}</h4>
                      <p className="text-xs text-muted-foreground">{group.members_count} members</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant={group.is_joined ? "default" : "outline"}
                      onClick={() => handleJoinGroup(group.id)}
                    >
                      {group.is_joined ? "Joined" : "Join"}
                    </Button>
                  </div>
                ))}
                {groups.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No popular groups yet
                  </p>
                )}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/community/groups">
                    View All Groups
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Enhanced Sharing Dialog */}
      <EnhancedSharingDialog
        open={isCreatePostOpen}
        onOpenChange={setIsCreatePostOpen}
        onShare={handleCreatePost}
      />
      
      {/* Comment Section Dialog */}
      {selectedPostId && (
        <Dialog open={isCommentSectionOpen} onOpenChange={setIsCommentSectionOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Comments</DialogTitle>
              <DialogDescription>
                Join the conversation
              </DialogDescription>
            </DialogHeader>
            <CommentSection postId={selectedPostId} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}