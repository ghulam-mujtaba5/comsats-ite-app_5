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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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
  Menu,
  Home,
  User,
  Settings,
  BellRing,
  LogOut,
  BarChart3
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import type { Post } from "@/lib/community-data"
import { ThreadCard } from "@/components/community/thread-card"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

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

export function MobileCommunityView({ 
  posts, 
  groups, 
  events, 
  loading, 
  error,
  selectedCategory,
  setSelectedCategory,
  selectedBatch,
  setSelectedBatch,
  availableBatches,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  isCreatePostOpen,
  setIsCreatePostOpen,
  newPost,
  setNewPost,
  postType,
  setPostType,
  handleCreatePost,
  handleLike,
  handleJoinGroup,
  loadMorePosts,
  hasMorePosts,
  loadingMorePosts
}: {
  posts: Post[]
  groups: Group[]
  events: Event[]
  loading: boolean
  error: string | null
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedBatch: string
  setSelectedBatch: (batch: string) => void
  availableBatches: string[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  viewMode: 'feed' | 'trending' | 'following'
  setViewMode: (mode: 'feed' | 'trending' | 'following') => void
  isCreatePostOpen: boolean
  setIsCreatePostOpen: (open: boolean) => void
  newPost: string
  setNewPost: (post: string) => void
  postType: string
  setPostType: (type: string) => void
  handleCreatePost: (content: string, type: string, tags: string[], media: File[]) => Promise<void>
  handleLike: (postId: string) => void
  handleJoinGroup: (groupId: number) => void
  loadMorePosts: () => void
  hasMorePosts: boolean
  loadingMorePosts: boolean
}) {
  const { user } = useAuth()
  const { selectedCampus, selectedDepartment } = useCampus()
  const isMobile = useIsMobile()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    timeRange: 'all',
    sortBy: 'recent',
    postTypes: [] as string[]
  })
  const [selectedTags, setSelectedTags] = useState<string[]>([])

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

  if (!isMobile) {
    return null
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || post.type === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Community Menu</SheetTitle>
                  <SheetDescription>
                    Navigate through community features
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <Link href="/community" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  <Link href="/community/groups" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <Users className="h-5 w-5" />
                    <span>Groups</span>
                  </Link>
                  <Link href="/community/events" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <Calendar className="h-5 w-5" />
                    <span>Events</span>
                  </Link>
                  <Link href="/community/polls" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <BarChart3 className="h-5 w-5" />
                    <span>Polls</span>
                  </Link>
                  <Link href="/community/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                  <Link href="/community/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                  <Link href="/community/notifications" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <BellRing className="h-5 w-5" />
                    <span>Notifications</span>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start gap-3 p-3">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold">Community</h1>
          </div>
          <Button 
            size="icon" 
            className="h-10 w-10 rounded-full"
            onClick={() => setIsCreatePostOpen(true)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        </div>
      </div>

      {/* Mobile Quick Actions */}
      <div className="grid grid-cols-4 gap-2 p-4">
        <Button 
          variant="outline" 
          size="sm"
          className="flex flex-col h-16 gap-1"
          onClick={() => {
            setPostType("study")
            setIsCreatePostOpen(true)
          }}
        >
          <BookOpen className="h-4 w-4" />
          <span className="text-xs">Study</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex flex-col h-16 gap-1"
          onClick={() => {
            setPostType("question")
            setIsCreatePostOpen(true)
          }}
        >
          <HelpCircle className="h-4 w-4" />
          <span className="text-xs">Question</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex flex-col h-16 gap-1"
          onClick={() => {
            setPostType("achievement")
            setIsCreatePostOpen(true)
          }}
        >
          <Trophy className="h-4 w-4" />
          <span className="text-xs">Achievement</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex flex-col h-16 gap-1"
          onClick={() => {
            setPostType("opportunity")
            setIsCreatePostOpen(true)
          }}
        >
          <Target className="h-4 w-4" />
          <span className="text-xs">Opportunity</span>
        </Button>
      </div>

      {/* Mobile View Mode Tabs */}
      <div className="px-4">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="feed">
              <MessageSquare className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="trending">
              <TrendingUp className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="following">
              <Users className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile Filters */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-8 w-24">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="study">Study</SelectItem>
              <SelectItem value="achievement">Achievement</SelectItem>
              <SelectItem value="opportunity">Opportunity</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="question">Question</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
            <SelectTrigger className="h-8 w-20">
              <SelectValue placeholder="Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All</SelectItem>
              {availableBatches.map((batch) => (
                <SelectItem key={batch} value={batch}>
                  {batch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsFilterOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Posts Feed */}
      <div className="space-y-4 p-4">
        {loading ? (
          <CenteredLoader message="Loading community posts..." />
        ) : error ? (
          <Card className="p-4 text-center text-destructive">{error}</Card>
        ) : filteredPosts.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <MessageSquare className="h-12 w-12 text-muted-foreground" />
              <h3 className="font-medium">No posts found</h3>
              <p className="text-muted-foreground text-sm">
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
              <ThreadCard post={post} onLike={handleLike} />
            </Link>
          ))
        )}
        {hasMorePosts && (
          <div className="flex justify-center pt-4">
            <Button onClick={loadMorePosts} disabled={loadingMorePosts} variant="outline">
              {loadingMorePosts ? 'Loading...' : 'Load more'}
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Filter Sheet */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>
              Customize your community feed
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            {/* Time Range Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">
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
            
            {/* Sort By */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Sort By
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
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
            
            {/* Post Types Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">
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
                    <label htmlFor={`type-${type}`} className="ml-2 text-sm capitalize">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tags Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">
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
          <div className="flex justify-between gap-3 mt-8 pt-4 border-t border-border">
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
            <Button onClick={applyFilters}>
              Apply
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Create Post Dialog */}
      <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Create New Post
            </DialogTitle>
            <DialogDescription>
              Share your thoughts with the community
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Post Type
              </label>
              <Select value={postType} onValueChange={setPostType}>
                <SelectTrigger>
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
              <label className="text-sm font-medium mb-2 block">
                Campus
              </label>
              <Select 
                value={selectedCampus?.id || ""} 
                onValueChange={(value) => {
                  const campus = useCampus().campuses.find((c: any) => c.id === value);
                  if (campus) useCampus().setSelectedCampus(campus);
                }}
              >
                <SelectTrigger>
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
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Department
              </label>
              <Select 
                value={selectedDepartment?.id || ""} 
                onValueChange={(value) => {
                  const department = useCampus().departments.find((d: any) => d.id === value);
                  if (department) useCampus().setSelectedDepartment(department);
                }}
              >
                <SelectTrigger>
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
              <label className="text-sm font-medium mb-2 block">
                Batch (Optional)
              </label>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger>
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
              <label className="text-sm font-medium mb-2 block">
                Your Post
              </label>
              <Textarea
                placeholder="What's on your mind? Be specific and use #hashtags..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[120px]"
              />
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs text-muted-foreground">
                  {newPost.length}/1000 characters
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                Posts are reviewed
              </div>
              <Button 
                onClick={() => handleCreatePost(newPost, postType, selectedTags, [])} 
                disabled={!newPost.trim() || newPost.length < 10}
              >
                <Send className="h-4 w-4 mr-2" />
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}