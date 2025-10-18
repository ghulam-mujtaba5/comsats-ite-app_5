"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useCampus } from "@/contexts/campus-context"
import { supabase } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Icons
import {
  Home,
  Compass,
  MessageCircle,
  Bell,
  User,
  Search,
  Plus,
  Heart,
  MessageSquare,
  Send,
  Bookmark,
  Share2,
  MoreHorizontal,
  Smile,
  Image as ImageIcon,
  Video,
  PlayCircle,
  Users,
  TrendingUp,
  Flame,
  Sparkles,
  Globe,
  Lock,
  UserCheck,
  Settings,
  LogOut,
  Camera,
  Edit,
  Trash2,
  Flag,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Check,
  CheckCheck,
  Mic,
  Phone,
  VideoIcon,
  Paperclip,
  ThumbsUp,
  Laugh,
  Frown,
  AngryIcon,
  AlertCircle,
  Eye,
  EyeOff,
  Hash,
  AtSign,
  MapPin,
  Calendar,
  Clock,
  Zap,
  Award,
  Target,
  Activity,
  Radio,
  Film
} from "lucide-react"

// Types
interface Post {
  id: string
  user_id: string
  content: string
  media: Array<{ type: string; url: string; thumbnail?: string }>
  type: string
  visibility: string
  likes_count: number
  comments_count: number
  shares_count: number
  views_count: number
  created_at: string
  updated_at: string
  author: {
    username: string
    full_name: string
    avatar_url: string
    is_verified: boolean
  }
  user_reaction?: string
  is_saved: boolean
}

interface Story {
  id: string
  user_id: string
  media_url: string
  media_type: string
  thumbnail_url: string
  caption: string
  views_count: number
  expires_at: string
  created_at: string
  author: {
    username: string
    avatar_url: string
    is_online: boolean
  }
  viewed_by_user: boolean
}

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  media: any[]
  is_read: boolean
  created_at: string
  sender: {
    username: string
    avatar_url: string
    is_online: boolean
  }
}

interface Conversation {
  id: string
  type: string
  name: string
  avatar_url: string
  last_message: Message
  unread_count: number
  participants: any[]
}

export default function AdvancedCommunityPage() {
  const { user } = useAuth()
  const { selectedCampus, selectedDepartment } = useCampus()
  const isMobile = useIsMobile()
  
  // State Management
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'messages' | 'notifications' | 'profile'>('home')
  const [posts, setPosts] = useState<Post[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostMedia, setNewPostMedia] = useState<File[]>([])
  const [newPostVisibility, setNewPostVisibility] = useState<'public' | 'followers' | 'private'>('public')
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<'feed' | 'trending'>('feed')
  
  // Real-time subscriptions
  useEffect(() => {
    if (!user) return
    
    // Subscribe to new posts
    const postsSubscription = supabase
      .channel('posts-channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'community_posts_enhanced'
      }, (payload) => {
        // Reload posts or add new post to the beginning
        loadPosts()
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'community_posts_enhanced'
      }, (payload) => {
        // Update specific post
        setPosts(prev => prev.map(p => 
          p.id === payload.new.id ? { ...p, ...payload.new } : p
        ))
      })
      .subscribe()
    
    // Subscribe to notifications
    const notificationsSubscription = supabase
      .channel('notifications-channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications_enhanced',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev])
        // Show toast notification
        toast({
          title: "New notification",
          description: payload.new.content
        })
      })
      .subscribe()
    
    // Subscribe to messages
    const messagesSubscription = supabase
      .channel('messages-channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        loadConversations()
      })
      .subscribe()
    
    return () => {
      supabase.removeChannel(postsSubscription)
      supabase.removeChannel(notificationsSubscription)
      supabase.removeChannel(messagesSubscription)
    }
  }, [user])
  
  // Load initial data
  useEffect(() => {
    if (user) {
      loadPosts()
      loadStories()
      loadConversations()
      loadNotifications()
    }
  }, [user, selectedCampus, selectedDepartment, viewMode])
  
  // Load posts
  const loadPosts = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('community_posts_enhanced')
        .select(`
          *,
          author:user_profiles!user_id(username, full_name, avatar_url, is_verified),
          reactions:post_reactions(reaction_type, user_id),
          saved:saved_posts(id)
        `)
        .order('created_at', { ascending: false })
        .limit(20)
      
      if (selectedCampus?.id) {
        query = query.eq('campus_id', selectedCampus.id)
      }
      
      if (selectedDepartment?.id) {
        query = query.eq('department_id', selectedDepartment.id)
      }
      
      if (viewMode === 'trending') {
        // Get trending posts using custom function
        const { data, error } = await supabase.rpc('get_trending_posts', {
          p_limit: 20,
          p_hours: 24
        })
        
        if (error) throw error
        setPosts(data || [])
      } else {
        // Get feed posts (from followed users + own posts)
        const { data, error } = await supabase.rpc('get_user_feed', {
          p_user_id: user?.id,
          p_limit: 20,
          p_offset: 0
        })
        
        if (error) throw error
        setPosts(data || [])
      }
    } catch (error) {
      console.error('Error loading posts:', error)
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  // Load stories
  const loadStories = async () => {
    try {
      const { data, error } = await supabase
        .from('user_stories')
        .select(`
          *,
          author:user_profiles!user_id(username, avatar_url, is_online),
          views:story_views(viewer_id)
        `)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      const transformedStories = data?.map((story: any) => ({
        ...story,
        viewed_by_user: story.views?.some((v: any) => v.viewer_id === user?.id)
      })) || []
      
      setStories(transformedStories)
    } catch (error) {
      console.error('Error loading stories:', error)
    }
  }
  
  // Load conversations
  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participants:conversation_participants(
            user:user_profiles(username, avatar_url, is_online),
            last_read_at
          ),
          last_message:messages(
            content,
            created_at,
            sender:user_profiles(username)
          )
        `)
        .order('last_message_at', { ascending: false })
      
      if (error) throw error
      setConversations(data || [])
    } catch (error) {
      console.error('Error loading conversations:', error)
    }
  }
  
  // Load notifications
  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase.rpc('get_user_notifications', {
        p_user_id: user?.id,
        p_limit: 50,
        p_offset: 0
      })
      
      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }
  
  // Create post
  const handleCreatePost = async () => {
    if (!user || !newPostContent.trim()) {
      toast({
        title: "Error",
        description: "Please write something to post",
        variant: "destructive"
      })
      return
    }
    
    try {
      // Upload media if any
      const mediaUrls: any[] = []
      for (const file of newPostMedia) {
        const fileName = `${user.id}/${Date.now()}-${file.name}`
        const { data, error } = await supabase.storage
          .from('community-media')
          .upload(fileName, file)
        
        if (error) throw error
        
        const { data: { publicUrl } } = supabase.storage
          .from('community-media')
          .getPublicUrl(fileName)
        
        mediaUrls.push({
          type: file.type.startsWith('image/') ? 'image' : 'video',
          url: publicUrl,
          thumbnail: publicUrl
        })
      }
      
      // Extract hashtags
      const hashtags = newPostContent.match(/#\w+/g) || []
      
      const { data, error } = await supabase
        .from('community_posts_enhanced')
        .insert({
          user_id: user.id,
          content: newPostContent,
          media: mediaUrls,
          type: 'general',
          visibility: newPostVisibility,
          campus_id: selectedCampus?.id,
          department_id: selectedDepartment?.id
        })
        .select()
        .single()
      
      if (error) throw error
      
      // Insert hashtags
      for (const tag of hashtags) {
        const tagName = tag.substring(1).toLowerCase()
        
        // Upsert hashtag
        const { data: hashtag } = await supabase
          .from('hashtags')
          .upsert({ tag: tagName }, { onConflict: 'tag' })
          .select()
          .single()
        
        if (hashtag) {
          // Link post to hashtag
          await supabase
            .from('post_hashtags')
            .insert({
              post_id: data.id,
              hashtag_id: hashtag.id
            })
        }
      }
      
      setNewPostContent("")
      setNewPostMedia([])
      setIsCreatePostOpen(false)
      
      toast({
        title: "Success",
        description: "Post created successfully"
      })
      
      loadPosts()
    } catch (error) {
      console.error('Error creating post:', error)
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      })
    }
  }
  
  // React to post
  const handleReactToPost = async (postId: string, reactionType: string) => {
    if (!user) return
    
    try {
      // Check if user already reacted
      const { data: existing } = await supabase
        .from('post_reactions')
        .select()
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single()
      
      if (existing) {
        if (existing.reaction_type === reactionType) {
          // Remove reaction
          await supabase
            .from('post_reactions')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', user.id)
        } else {
          // Update reaction
          await supabase
            .from('post_reactions')
            .update({ reaction_type: reactionType })
            .eq('post_id', postId)
            .eq('user_id', user.id)
        }
      } else {
        // Add new reaction
        await supabase
          .from('post_reactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            reaction_type: reactionType
          })
      }
      
      loadPosts()
    } catch (error) {
      console.error('Error reacting to post:', error)
    }
  }
  
  // Save/unsave post
  const handleSavePost = async (postId: string, isSaved: boolean) => {
    if (!user) return
    
    try {
      if (isSaved) {
        await supabase
          .from('saved_posts')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)
      } else {
        await supabase
          .from('saved_posts')
          .insert({
            post_id: postId,
            user_id: user.id
          })
      }
      
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, is_saved: !isSaved } : p
      ))
    } catch (error) {
      console.error('Error saving post:', error)
    }
  }
  
  // View story
  const handleViewStory = async (story: Story) => {
    setSelectedStory(story)
    
    // Mark as viewed
    if (user && !story.viewed_by_user) {
      await supabase
        .from('story_views')
        .insert({
          story_id: story.id,
          viewer_id: user.id
        })
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop Layout */}
      {!isMobile ? (
        <div className="flex h-screen overflow-hidden">
          {/* Left Sidebar - Navigation */}
          <aside className="w-64 border-r border-border bg-white dark:bg-gray-900 flex flex-col">
            <div className="p-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                COMSATS Social
              </h1>
            </div>
            
            <nav className="flex-1 px-3">
              <Button
                variant={activeTab === 'home' ? 'default' : 'ghost'}
                className="w-full justify-start mb-1"
                onClick={() => setActiveTab('home')}
              >
                <Home className="h-5 w-5 mr-3" />
                Home
              </Button>
              
              <Button
                variant={activeTab === 'explore' ? 'default' : 'ghost'}
                className="w-full justify-start mb-1"
                onClick={() => setActiveTab('explore')}
              >
                <Compass className="h-5 w-5 mr-3" />
                Explore
              </Button>
              
              <Button
                variant={activeTab === 'messages' ? 'default' : 'ghost'}
                className="w-full justify-start mb-1"
                onClick={() => setActiveTab('messages')}
              >
                <MessageCircle className="h-5 w-5 mr-3" />
                Messages
                {conversations.some(c => c.unread_count > 0) && (
                  <Badge className="ml-auto" variant="destructive">
                    {conversations.reduce((acc, c) => acc + c.unread_count, 0)}
                  </Badge>
                )}
              </Button>
              
              <Button
                variant={activeTab === 'notifications' ? 'default' : 'ghost'}
                className="w-full justify-start mb-1"
                onClick={() => setActiveTab('notifications')}
              >
                <Bell className="h-5 w-5 mr-3" />
                Notifications
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <Badge className="ml-auto" variant="destructive">
                    {notifications.filter(n => !n.is_read).length}
                  </Badge>
                )}
              </Button>
              
              <Button
                variant={activeTab === 'profile' ? 'default' : 'ghost'}
                className="w-full justify-start mb-1"
                onClick={() => setActiveTab('profile')}
              >
                <User className="h-5 w-5 mr-3" />
                Profile
              </Button>
              
              <Separator className="my-4" />
              
              <Button
                className="w-full"
                onClick={() => setIsCreatePostOpen(true)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Post
              </Button>
            </nav>
            
            {/* User Profile */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.email?.split('@')[0]}</p>
                  <p className="text-xs text-muted-foreground">@{user?.email?.split('@')[0]}</p>
                </div>
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {activeTab === 'home' && (
              <div className="max-w-2xl mx-auto p-6">
                {/* Stories */}
                {stories.length > 0 && (
                  <div className="mb-6">
                    <ScrollArea className="w-full">
                      <div className="flex gap-4 pb-4">
                        {/* Add Story Button */}
                        <div className="flex flex-col items-center gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            className="h-20 w-20 rounded-full p-0 border-2 border-dashed relative"
                          >
                            <Plus className="h-6 w-6" />
                          </Button>
                          <span className="text-xs font-medium">Add Story</span>
                        </div>
                        
                        {/* Story Items */}
                        {stories.map((story) => (
                          <div
                            key={story.id}
                            className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer"
                            onClick={() => handleViewStory(story)}
                          >
                            <div className={cn(
                              "h-20 w-20 rounded-full p-1",
                              story.viewed_by_user
                                ? "bg-gray-300"
                                : "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500"
                            )}>
                              <Avatar className="h-full w-full border-4 border-white dark:border-gray-900">
                                <AvatarImage src={story.author.avatar_url} />
                                <AvatarFallback>{story.author.username[0]}</AvatarFallback>
                              </Avatar>
                              {story.author.is_online && (
                                <div className="absolute bottom-1 right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                              )}
                            </div>
                            <span className="text-xs font-medium truncate w-20 text-center">
                              {story.author.username}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
                
                {/* View Mode Toggle */}
                <div className="flex items-center justify-between mb-6">
                  <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="feed" className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        For You
                      </TabsTrigger>
                      <TabsTrigger value="trending" className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Trending
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                {/* Posts Feed */}
                <div className="space-y-6">
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : posts.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                        <p className="text-slate-700 dark:text-slate-300 mb-4">
                          Be the first to share something with your community
                        </p>
                        <Button onClick={() => setIsCreatePostOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Post
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    posts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onReact={handleReactToPost}
                        onSave={handleSavePost}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'explore' && (
              <div className="max-w-6xl mx-auto p-6">
                <ExplorePage />
              </div>
            )}
            
            {activeTab === 'messages' && (
              <MessagesPage
                conversations={conversations}
                selectedConversation={selectedConversation}
                setSelectedConversation={setSelectedConversation}
              />
            )}
            
            {activeTab === 'notifications' && (
              <NotificationsPage notifications={notifications} />
            )}
            
            {activeTab === 'profile' && (
              <ProfilePage />
            )}
          </main>
          
          {/* Right Sidebar - Trending & Suggestions */}
          <aside className="w-80 border-l border-border bg-white dark:bg-gray-900 p-6 overflow-y-auto">
            <TrendingSidebar />
          </aside>
        </div>
      ) : (
        <MobileView
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          posts={posts}
          stories={stories}
          conversations={conversations}
          notifications={notifications}
          loading={loading}
          onReact={handleReactToPost}
          onSave={handleSavePost}
          onViewStory={handleViewStory}
        />
      )}
      
      {/* Create Post Dialog */}
      <CreatePostDialog
        open={isCreatePostOpen}
        onOpenChange={setIsCreatePostOpen}
        content={newPostContent}
        setContent={setNewPostContent}
        media={newPostMedia}
        setMedia={setNewPostMedia}
        visibility={newPostVisibility}
        setVisibility={setNewPostVisibility}
        onSubmit={handleCreatePost}
      />
      
      {/* Story Viewer */}
      {selectedStory && (
        <StoryViewer
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
          stories={stories}
        />
      )}
    </div>
  )
}

// Post Card Component
function PostCard({
  post,
  onReact,
  onSave
}: {
  post: Post
  onReact: (postId: string, reaction: string) => void
  onSave: (postId: string, isSaved: boolean) => void
}) {
  const [showReactions, setShowReactions] = useState(false)
  const [showComments, setShowComments] = useState(false)
  
  const reactions = [
    { type: 'like', icon: <ThumbsUp className="h-5 w-5" />, color: 'text-blue-500' },
    { type: 'love', icon: <Heart className="h-5 w-5" />, color: 'text-red-500' },
    { type: 'laugh', icon: <Laugh className="h-5 w-5" />, color: 'text-yellow-500' },
    { type: 'wow', icon: <AlertCircle className="h-5 w-5" />, color: 'text-purple-500' },
    { type: 'sad', icon: <Frown className="h-5 w-5" />, color: 'text-gray-500' },
    { type: 'angry', icon: <AngryIcon className="h-5 w-5" />, color: 'text-orange-500' }
  ]
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar_url} />
              <AvatarFallback>{post.author.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{post.author.username}</p>
                {post.author.is_verified && (
                  <CheckCheck className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(post.created_at).toLocaleDateString()} • {post.visibility === 'public' ? <Globe className="h-3 w-3 inline" /> : <Lock className="h-3 w-3 inline" />}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="mb-4">
          <p className="text-sm whitespace-pre-wrap">{post.content}</p>
        </div>
        
        {/* Media */}
        {post.media && post.media.length > 0 && (
          <div className={cn(
            "grid gap-2 mb-4 rounded-lg overflow-hidden",
            post.media.length === 1 ? "grid-cols-1" :
            post.media.length === 2 ? "grid-cols-2" :
            post.media.length === 3 ? "grid-cols-2" :
            "grid-cols-2"
          )}>
            {post.media.map((media, idx) => (
              <div key={idx} className={cn(
                "relative aspect-square bg-gray-100 dark:bg-gray-800",
                post.media.length === 3 && idx === 0 ? "row-span-2" : ""
              )}>
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video src={media.url} className="w-full h-full object-cover" controls />
                    <PlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-white opacity-75" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300 mb-3">
          <div className="flex items-center gap-4">
            <span>{post.likes_count} reactions</span>
            <span>{post.comments_count} comments</span>
            <span>{post.shares_count} shares</span>
          </div>
          <span>{post.views_count} views</span>
        </div>
        
        <Separator className="mb-3" />
        
        {/* Actions */}
        <div className="flex items-center justify-around">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className={cn(post.user_reaction && "text-primary")}
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
              onClick={() => onReact(post.id, 'like')}
            >
              <Heart className={cn("h-5 w-5 mr-2", post.user_reaction && "fill-current")} />
              React
            </Button>
            
            {/* Reaction Picker */}
            {showReactions && (
              <div
                className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 shadow-lg rounded-full px-3 py-2 flex gap-2"
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
              >
                {reactions.map((reaction) => (
                  <button
                    key={reaction.type}
                    className={cn(
                      "hover:scale-125 transition-transform",
                      reaction.color
                    )}
                    onClick={() => onReact(post.id, reaction.type)}
                  >
                    {reaction.icon}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Comment
          </Button>
          
          <Button variant="ghost" size="sm">
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSave(post.id, post.is_saved)}
          >
            <Bookmark className={cn("h-5 w-5", post.is_saved && "fill-current")} />
          </Button>
        </div>
        
        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-border">
            <CommentsSection postId={post.id} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Placeholder components (implement these fully based on requirements)
function ExplorePage() {
  return <div>Explore Page - Discover new content, trending topics, and suggested users</div>
}

function MessagesPage({ conversations, selectedConversation, setSelectedConversation }: any) {
  return <div>Messages Page - Real-time chat interface</div>
}

function NotificationsPage({ notifications }: any) {
  return <div>Notifications Page - All user notifications</div>
}

function ProfilePage() {
  return <div>Profile Page - User profile and settings</div>
}

function TrendingSidebar() {
  return <div>Trending Sidebar - Trending topics, suggested users, upcoming events</div>
}

function MobileView(props: any) {
  return <div>Mobile View - Mobile-optimized interface</div>
}

function CreatePostDialog(props: any) {
  return null // Implement dialog
}

function StoryViewer(props: any) {
  return null // Implement story viewer
}

function CommentsSection({ postId }: { postId: string }) {
  return <div>Comments for post {postId}</div>
}
