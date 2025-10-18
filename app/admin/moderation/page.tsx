"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, AlertTriangle, CheckCircle, X, Eye, MessageSquare, Users, Flag, Ban, Shield, Activity, Clock, Sparkles, Crown, Filter, MoreHorizontal, TrendingUp, Zap } from "lucide-react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { useToast } from "@/hooks/use-toast"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import styles from "@/app/admin/admin-shared.module.css"

interface CommunityPost {
  id: string
  title: string
  content: string
  author_name: string
  author_email: string
  created_at: string
  status: 'active' | 'flagged' | 'hidden' | 'deleted'
  reports_count: number
  likes_count: number
  comments_count: number
  category: string
}

interface Comment {
  id: string
  content: string
  author_name: string
  author_email: string
  post_title: string
  created_at: string
  status: 'active' | 'flagged' | 'hidden' | 'deleted'
  reports_count: number
}

interface Report {
  id: string
  content_type: 'post' | 'comment'
  content_id: string
  content_title: string
  reason: string
  description: string
  reporter_email: string
  created_at: string
  status: 'pending' | 'reviewed' | 'dismissed'
}

export default function AdminModerationPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const [moderationAction, setModerationAction] = useState<string>("")
  const [moderationReason, setModerationReason] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchModerationData()
  }, [])

  const fetchModerationData = async () => {
    setLoading(true)
    try {
      const [postsRes, commentsRes, reportsRes] = await Promise.all([
        fetch('/api/admin/moderation/posts'),
        fetch('/api/admin/moderation/comments'),
        fetch('/api/admin/moderation/reports')
      ])

      if (postsRes.ok) {
        const postsData = await postsRes.json()
        setPosts(postsData)
      }

      if (commentsRes.ok) {
        const commentsData = await commentsRes.json()
        setComments(commentsData)
      }

      if (reportsRes.ok) {
        const reportsData = await reportsRes.json()
        setReports(reportsData)
      }
    } catch (error) {
      console.error('Error fetching moderation data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch moderation data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleModerationAction = async () => {
    if (!selectedContent || !moderationAction) return

    try {
      const endpoint = selectedContent.post_title 
        ? '/api/admin/moderation/comments' 
        : '/api/admin/moderation/posts'

      const response = await fetch(`${endpoint}/${selectedContent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: moderationAction,
          reason: moderationReason
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Content ${moderationAction} successfully`
        })
        setIsActionDialogOpen(false)
        setSelectedContent(null)
        setModerationAction("")
        setModerationReason("")
        fetchModerationData()
      } else {
        throw new Error('Failed to perform moderation action')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform moderation action",
        variant: "destructive"
      })
    }
  }

  const handleReportAction = async (reportId: string, action: 'dismiss' | 'approve') => {
    try {
      const response = await fetch(`/api/admin/moderation/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Report ${action}d successfully`
        })
        fetchModerationData()
      } else {
        throw new Error('Failed to update report')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update report",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline">Active</Badge>
      case 'flagged':
        return <Badge variant="destructive">Flagged</Badge>
      case 'hidden':
        return <Badge variant="secondary">Hidden</Badge>
      case 'deleted':
        return <Badge variant="destructive">Deleted</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'reviewed':
        return <Badge variant="outline">Reviewed</Badge>
      case 'dismissed':
        return <Badge variant="outline">Dismissed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author_name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || post.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const filteredComments = comments.filter((comment) => {
    const matchesSearch = comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comment.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comment.post_title.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || comment.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.content_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.reporter_email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || report.status === filterStatus

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <CenteredLoader message="Loading moderation data..." />
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20">
        {/* Hero Section with Glassmorphism */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 backdrop-blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          
          <div className={`relative ${styles.section} pt-12 pb-8`}>
            <div className="glass-card border border-slate-200 dark:border-slate-700 dark:border-slate-200 dark:border-slate-700 rounded-3xl p-8 mb-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
                      <div className="relative bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-2xl">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-orange-800 to-red-800 dark:from-white dark:via-orange-200 dark:to-red-200 bg-clip-text text-transparent">
                        Content Moderation
                      </h1>
                      <p className="text-slate-600 dark:text-slate-300 text-lg">
                        Comprehensive community content oversight and management
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-orange-200 dark:border-orange-800">
                      <Activity className="h-3 w-3 mr-1" />
                      {posts.length} Posts
                    </Badge>
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-blue-200 dark:border-blue-800">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      {comments.length} Comments
                    </Badge>
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-red-200 dark:border-red-800">
                      <Flag className="h-3 w-3 mr-1" />
                      {reports.filter(r => r.status === 'pending').length} Pending Reports
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button size="sm" variant="outline" className="glass-button bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border-white/40 dark:border-slate-600/40 hover:bg-white/50 dark:hover:bg-slate-700/50">
                    <Clock className="h-4 w-4 mr-2" />
                    Auto-Moderate
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className={`${styles.section} ${styles.spaceY6}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Moderation Queue</h2>
              <p className="text-slate-600 dark:text-slate-300">Review and manage community content</p>
            </div>
            <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300">
              <Sparkles className="h-3 w-3 mr-1" />
              Live Updates
            </Badge>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search content, authors, or reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 w-full lg:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="glass-card bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/40 dark:border-slate-600/40 grid w-full lg:w-auto grid-cols-3">
              <TabsTrigger value="posts" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg">
                <MessageSquare className="h-4 w-4" />
                Posts
                <Badge variant="outline" className="text-xs ml-1">{posts.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg">
                <Users className="h-4 w-4" />
                Comments
                <Badge variant="outline" className="text-xs ml-1">{comments.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg">
                <Flag className="h-4 w-4" />
                Reports
                <Badge variant="destructive" className="text-xs ml-1">{reports.filter(r => r.status === 'pending').length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-4">
              {filteredPosts.map((post) => {
                const hasReports = post.reports_count > 0
                const isProblematic = post.status === 'flagged' || hasReports
                
                return (
                  <Card key={post.id} className={`glass-card rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-xl group ${
                    isProblematic 
                      ? 'bg-gradient-to-br from-red-50/80 to-orange-50/80 dark:from-red-950/40 dark:to-orange-950/40 border border-red-200/50 dark:border-red-800/50 hover:shadow-red-500/20'
                      : 'bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-900/40 border border-slate-200 dark:border-slate-700 dark:border-slate-200 dark:border-slate-700 hover:shadow-blue-500/10'
                  }`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
                    
                    <CardHeader className="relative">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                              isProblematic 
                                ? 'bg-gradient-to-br from-red-500 to-orange-500'
                                : 'bg-gradient-to-br from-blue-500 to-purple-500'
                            }`}>
                              {post.author_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <CardTitle className={`text-lg group-hover:scale-105 transition-transform duration-300 ${
                                isProblematic
                                  ? 'bg-gradient-to-r from-red-800 to-orange-800 dark:from-red-200 dark:to-orange-200 bg-clip-text text-transparent'
                                  : 'text-slate-900 dark:text-white'
                              }`}>
                                {post.title}
                              </CardTitle>
                              <CardDescription className="flex flex-wrap items-center gap-2 text-sm">
                                <span className="flex items-center gap-1">
                                  <Crown className="h-3 w-3" />
                                  {post.author_name}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(post.created_at).toLocaleDateString()}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Activity className="h-3 w-3" />
                                  {post.likes_count} likes, {post.comments_count} comments
                                </span>
                                {hasReports && (
                                  <>
                                    <span>•</span>
                                    <span className="text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                                      <AlertTriangle className="h-3 w-3" />
                                      {post.reports_count} reports
                                    </span>
                                  </>
                                )}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {getStatusBadge(post.status)}
                          <Badge variant="outline" className="text-xs">{post.category}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="space-y-4">
                        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                          {post.content}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="glass-button"
                            onClick={() => {
                              setSelectedContent(post)
                              setIsActionDialogOpen(true)
                            }}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            Moderate
                          </Button>
                          <Button size="sm" variant="outline" className="glass-button">
                            <Eye className="h-4 w-4 mr-1" />
                            View Full
                          </Button>
                          <Button size="sm" variant="outline" className="glass-button">
                            <MoreHorizontal className="h-4 w-4 mr-1" />
                            Actions
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              {filteredPosts.length === 0 && (
                <Card className="glass-card border border-slate-200 dark:border-slate-700 dark:border-slate-200 dark:border-slate-700 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 p-12 text-center">
                  <div className="space-y-4">
                    <div className="text-4xl">📝</div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No Posts Found</h3>
                      <p className="text-slate-600 dark:text-slate-300">No posts match your current filters.</p>
                    </div>
                  </div>
                </Card>
              )}
          </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              {filteredComments.map((comment) => {
                const hasReports = comment.reports_count > 0
                const isProblematic = comment.status === 'flagged' || hasReports
                
                return (
                  <Card key={comment.id} className={`glass-card rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-xl group ${
                    isProblematic 
                      ? 'bg-gradient-to-br from-yellow-50/80 to-orange-50/80 dark:from-yellow-950/40 dark:to-orange-950/40 border border-yellow-200/50 dark:border-yellow-800/50 hover:shadow-yellow-500/20'
                      : 'bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-900/40 border border-slate-200 dark:border-slate-700 dark:border-slate-200 dark:border-slate-700 hover:shadow-blue-500/10'
                  }`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
                    
                    <CardHeader className="relative">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                              isProblematic 
                                ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                                : 'bg-gradient-to-br from-green-500 to-teal-500'
                            }`}>
                              {comment.author_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <CardTitle className={`text-lg group-hover:scale-105 transition-transform duration-300 ${
                                isProblematic
                                  ? 'bg-gradient-to-r from-yellow-800 to-orange-800 dark:from-yellow-200 dark:to-orange-200 bg-clip-text text-transparent'
                                  : 'text-slate-900 dark:text-white'
                              }`}>
                                Comment on: {comment.post_title}
                              </CardTitle>
                              <CardDescription className="flex flex-wrap items-center gap-2 text-sm">
                                <span className="flex items-center gap-1">
                                  <Crown className="h-3 w-3" />
                                  {comment.author_name}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                                {hasReports && (
                                  <>
                                    <span>•</span>
                                    <span className="text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                                      <AlertTriangle className="h-3 w-3" />
                                      {comment.reports_count} reports
                                    </span>
                                  </>
                                )}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {getStatusBadge(comment.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="space-y-4">
                        <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 border border-white/40 dark:border-slate-600/40">
                          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
                            "{comment.content}"
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="glass-button"
                            onClick={() => {
                              setSelectedContent(comment)
                              setIsActionDialogOpen(true)
                            }}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            Moderate
                          </Button>
                          <Button size="sm" variant="outline" className="glass-button">
                            <Eye className="h-4 w-4 mr-1" />
                            View Post
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              {filteredComments.length === 0 && (
                <Card className="glass-card border border-slate-200 dark:border-slate-700 dark:border-slate-200 dark:border-slate-700 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 p-12 text-center">
                  <div className="space-y-4">
                    <div className="text-4xl">💬</div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No Comments Found</h3>
                      <p className="text-slate-600 dark:text-slate-300">No comments match your current filters.</p>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              {filteredReports.map((report) => {
                const isPending = report.status === 'pending'
                
                return (
                  <Card key={report.id} className={`glass-card rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-xl group ${
                    isPending 
                      ? 'bg-gradient-to-br from-red-50/80 to-pink-50/80 dark:from-red-950/40 dark:to-pink-950/40 border border-red-200/50 dark:border-red-800/50 hover:shadow-red-500/20'
                      : 'bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-900/40 border border-slate-200 dark:border-slate-700 dark:border-slate-200 dark:border-slate-700 hover:shadow-blue-500/10'
                  }`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
                    
                    <CardHeader className="relative">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                              isPending 
                                ? 'bg-gradient-to-br from-red-500 to-pink-500'
                                : 'bg-gradient-to-br from-slate-500 to-gray-500'
                            }`}>
                              <Flag className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className={`text-lg group-hover:scale-105 transition-transform duration-300 flex items-center gap-2 ${
                                isPending
                                  ? 'bg-gradient-to-r from-red-800 to-pink-800 dark:from-red-200 dark:to-pink-200 bg-clip-text text-transparent'
                                  : 'text-slate-900 dark:text-white'
                              }`}>
                                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                                Report: {report.content_title}
                              </CardTitle>
                              <CardDescription className="flex flex-wrap items-center gap-2 text-sm">
                                <span className="flex items-center gap-1">
                                  <Crown className="h-3 w-3" />
                                  Reported by {report.reporter_email}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(report.created_at).toLocaleDateString()}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Activity className="h-3 w-3" />
                                  Type: {report.content_type}
                                </span>
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {getStatusBadge(report.status)}
                          {isPending && (
                            <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white border-0 text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="space-y-4">
                        <div className="grid gap-3">
                          <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 border border-white/40 dark:border-slate-600/40">
                            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Reason:</Label>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{report.reason}</p>
                          </div>
                          {report.description && (
                            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 border border-white/40 dark:border-slate-600/40">
                              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Description:</Label>
                              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 italic">"{report.description}"</p>
                            </div>
                          )}
                        </div>
                        {isPending && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 border-0"
                              onClick={() => handleReportAction(report.id, 'approve')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve Report
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="glass-button"
                              onClick={() => handleReportAction(report.id, 'dismiss')}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Dismiss Report
                            </Button>
                            <Button size="sm" variant="outline" className="glass-button">
                              <Eye className="h-4 w-4 mr-1" />
                              View Content
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              {filteredReports.length === 0 && (
                <Card className="glass-card border border-slate-200 dark:border-slate-700 dark:border-slate-200 dark:border-slate-700 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 p-12 text-center">
                  <div className="space-y-4">
                    <div className="text-4xl">🚩</div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No Reports Found</h3>
                      <p className="text-slate-600 dark:text-slate-300">No reports match your current filters.</p>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Enhanced Moderation Action Dialog */}
          <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
            <DialogContent className="glass-card border border-slate-200 dark:border-slate-700 dark:border-slate-200 dark:border-slate-700 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Moderate Content
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Content Title</Label>
                  <Input 
                    value={selectedContent?.title || selectedContent?.post_title || 'Comment'} 
                    disabled 
                    className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Moderation Action</Label>
                  <Select value={moderationAction} onValueChange={setModerationAction}>
                    <SelectTrigger className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approve">Approve</SelectItem>
                      <SelectItem value="hide">Hide</SelectItem>
                      <SelectItem value="delete">Delete</SelectItem>
                      <SelectItem value="flag">Flag for Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Reason (Optional)</Label>
                  <Textarea
                    placeholder="Explain the reason for this action..."
                    value={moderationReason}
                    onChange={(e) => setModerationReason(e.target.value)}
                    className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsActionDialogOpen(false)} className="glass-button">
                    Cancel
                  </Button>
                  <Button onClick={handleModerationAction} disabled={!moderationAction} className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 border-0">
                    <Shield className="h-4 w-4 mr-1" />
                    Apply Action
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AdminGuard>
  )
}
