"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { fetchPosts, fetchGroups, toggleLikePerUser } from "@/lib/community"
import type { Post } from "@/lib/community-data"
import { ThreadCard } from "@/components/community/thread-card"

const mockPosts: Post[] = [
  {
    id: "1",
    author: "Ahmad Hassan",
    avatar: "/student-avatar.png",
    department: "Computer Science",
    semester: "8th Semester",
    time: "2 hours ago",
    content:
      "Just finished my final year project on AI-based student performance prediction. Happy to share insights with anyone working on similar projects! The model achieved 94% accuracy using ensemble methods.",
    likes: 24,
    comments: 8,
    shares: 3,
    tags: ["AI", "Final Year Project", "Computer Science", "Machine Learning"],
    liked: false,
    type: "achievement",
  },
  {
    id: "2",
    author: "Fatima Khan",
    avatar: "/female-student-avatar.png",
    department: "Electrical Engineering",
    semester: "6th Semester",
    time: "4 hours ago",
    content:
      "Looking for study partners for Power Systems course. Planning to meet every Tuesday and Thursday at 4 PM in the library. Anyone interested in forming a study group?",
    likes: 15,
    comments: 12,
    shares: 5,
    tags: ["Study Group", "Power Systems", "Electrical Engineering"],
    liked: false,
    type: "study",
  },
  {
    id: "3",
    author: "Ali Raza",
    avatar: "/male-student-avatar.png",
    department: "Business Administration",
    semester: "7th Semester",
    time: "1 day ago",
    content:
      "Internship opportunity at a local startup! They're looking for marketing students with social media experience. Great learning opportunity with potential for full-time offer. DM me for details.",
    likes: 32,
    comments: 18,
    shares: 12,
    tags: ["Internship", "Marketing", "Opportunity", "Social Media"],
    liked: true,
    type: "opportunity",
  },
]

const mockGroups = [
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
  },
  {
    id: 3,
    name: "Study Buddies",
    members: 324,
    description: "Find study partners and form study groups",
    category: "Study",
    isJoined: false,
    recentActivity: "30 minutes ago",
    posts: 67,
  },
  {
    id: 4,
    name: "Programming Help",
    members: 567,
    description: "Get help with coding assignments and projects",
    category: "Academic",
    isJoined: true,
    recentActivity: "15 minutes ago",
    posts: 234,
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: "Tech Talk: AI in Industry",
    date: "Dec 15, 2024",
    time: "2:00 PM",
    location: "Main Auditorium",
    attendees: 45,
  },
  {
    id: 2,
    title: "Career Fair 2024",
    date: "Dec 20, 2024",
    time: "10:00 AM",
    location: "Sports Complex",
    attendees: 234,
  },
  {
    id: 3,
    title: "Study Group: Calculus",
    date: "Dec 12, 2024",
    time: "4:00 PM",
    location: "Library Room 201",
    attendees: 12,
  },
]

export default function CommunityPage() {
  const [newPost, setNewPost] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [groups, setGroups] = useState(mockGroups)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [postType, setPostType] = useState("general")
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [p, g] = await Promise.all([fetchPosts(100), fetchGroups()])
        if (p.length) setPosts(p)
        if (g.length) setGroups(g)
      } catch (e: any) {
        setError(e?.message || "Failed to load community data")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

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
      const payload = {
        content: newPost,
        type: postType,
        tags: extractTags(newPost),
        user_id: user.id,
        author_name: user.email?.split("@")[0] ?? "Anonymous",
        avatar_url: "/student-avatar.png",
      }
      const { data, error } = await supabase.from("community_posts").insert(payload).select("*").single()
      if (error) throw error
      const inserted: Post = {
        id: String(data.id),
        author: data.author_name,
        avatar: data.avatar_url,
        department: data.department || "",
        semester: data.semester || "",
        time: data.created_at ? new Date(data.created_at).toLocaleString() : "Just now",
        content: data.content,
        likes: Number(data.likes ?? 0),
        comments: Number(data.comments_count ?? 0),
        shares: Number(data.shares ?? 0),
        tags: Array.isArray(data.tags) ? data.tags : [],
        liked: false,
        type: data.type || "general",
      }
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
      const current = (list: typeof posts) => list.find((x) => x.id === postId)
      const after = current(
        optimisticPrev.map((post) =>
          post.id === postId
            ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
            : post,
        ),
      )
      // Try per-user like first
      await toggleLikePerUser(postId, user.id, !(after?.liked === true ? true : false))
    } catch (e1: any) {
      try {
        // Fallback to column-based update
        const current = (list: typeof posts) => list.find((x) => x.id === postId)
        const after = current(
          optimisticPrev.map((post) =>
            post.id === postId
              ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
              : post,
          ),
        )
        const { error } = await supabase
          .from("community_posts")
          .update({ likes: after?.likes, liked: after?.liked })
          .eq("id", postId)
        if (error) throw error
      } catch (e2: any) {
        // revert on failure
        setPosts((_) => optimisticPrev)
        toast({ title: "Failed to update like", description: e2?.message || "Please try again.", variant: "destructive" })
      }
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

    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              isJoined: !group.isJoined,
              members: group.isJoined ? group.members - 1 : group.members + 1,
            }
          : group,
      ),
    )

    const group = groups.find((g) => g.id === groupId)
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Student Community</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with fellow COMSATS students and share your academic journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">2,847</p>
                  <p className="text-gray-600 dark:text-gray-400">Active Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
                  <p className="text-gray-600 dark:text-gray-400">Recent Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{groups.length}</p>
                  <p className="text-gray-600 dark:text-gray-400">Study Groups</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingEvents.length}</p>
                  <p className="text-gray-600 dark:text-gray-400">Upcoming Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Share with Community
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-32">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Posts</SelectItem>
                            <SelectItem value="study">Study</SelectItem>
                            <SelectItem value="achievement">Achievement</SelectItem>
                            <SelectItem value="opportunity">Opportunity</SelectItem>
                            <SelectItem value="general">General</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-transparent border">
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

                <div className="space-y-6">
                  {loading ? (
                    <Card className="p-8 text-center text-gray-500">Loading posts...</Card>
                  ) : error ? (
                    <Card className="p-8 text-center text-blue-600">{error}</Card>
                  ) : filteredPosts.length === 0 ? (
                    <Card className="p-8 text-center">No posts found.</Card>
                  ) : (
                    filteredPosts.map((post) => (
                      <Link href={`/community/post/${post.id}`} key={post.id} className="block">
                        <ThreadCard thread={post} handleLike={handleLike} />
                      </Link>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="groups" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredGroups.map((group) => (
                    <Card key={group.id} className="hover:shadow-lg transition-shadow">
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
                            className={`w-full text-sm ${group.isJoined ? "border" : "bg-primary text-primary-foreground"}`}
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
                  {upcomingEvents.map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow">
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
                          <Button className="text-sm">Join Event</Button>
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
            <Card>
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

            {/* Popular Tags */}
            <Card>
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start bg-transparent hover:bg-blue-50 border"
                  onClick={() => setIsCreatePostOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
                <Button
                  className="w-full justify-start bg-transparent hover:bg-green-50 border"
                  onClick={() => {
                    setPostType("study")
                    setIsCreatePostOpen(true)
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Find Study Partners
                </Button>
                <Button
                  className="w-full justify-start bg-transparent hover:bg-purple-50 border"
                  onClick={() => {
                    setPostType("general")
                    setIsCreatePostOpen(true)
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask a Question
                </Button>
                <Button
                  className="w-full justify-start bg-transparent hover:bg-orange-50 border"
                  onClick={() => {
                    setPostType("achievement")
                    setIsCreatePostOpen(true)
                  }}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Share Achievement
                </Button>
              </CardContent>
            </Card>

            <Card>
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
