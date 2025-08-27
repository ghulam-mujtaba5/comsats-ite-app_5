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
import { Search, AlertTriangle, CheckCircle, X, Eye, MessageSquare, Users, Flag, Ban, Shield } from "lucide-react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { useToast } from "@/hooks/use-toast"
import { CenteredLoader } from "@/components/ui/loading-spinner"

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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Content Moderation</h1>
          <p className="text-muted-foreground mt-2">
            Manage community posts, comments, and reports
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search content, authors, or reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
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
          <TabsList>
            <TabsTrigger value="posts">
              <MessageSquare className="h-4 w-4 mr-2" />
              Posts ({posts.length})
            </TabsTrigger>
            <TabsTrigger value="comments">
              <Users className="h-4 w-4 mr-2" />
              Comments ({comments.length})
            </TabsTrigger>
            <TabsTrigger value="reports">
              <Flag className="h-4 w-4 mr-2" />
              Reports ({reports.filter(r => r.status === 'pending').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <CardDescription>
                        By {post.author_name} • {new Date(post.created_at).toLocaleDateString()} • 
                        {post.likes_count} likes • {post.comments_count} comments
                        {post.reports_count > 0 && (
                          <span className="text-destructive font-medium"> • {post.reports_count} reports</span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(post.status)}
                      <Badge variant="outline">{post.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.content}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedContent(post)
                        setIsActionDialogOpen(true)
                      }}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Moderate
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View Full
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            {filteredComments.map((comment) => (
              <Card key={comment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">Comment on: {comment.post_title}</CardTitle>
                      <CardDescription>
                        By {comment.author_name} • {new Date(comment.created_at).toLocaleDateString()}
                        {comment.reports_count > 0 && (
                          <span className="text-destructive font-medium"> • {comment.reports_count} reports</span>
                        )}
                      </CardDescription>
                    </div>
                    {getStatusBadge(comment.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {comment.content}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedContent(comment)
                        setIsActionDialogOpen(true)
                      }}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Moderate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Flag className="h-4 w-4" />
                        Report: {report.content_title}
                      </CardTitle>
                      <CardDescription>
                        Reported by {report.reporter_email} • {new Date(report.created_at).toLocaleDateString()} • 
                        Type: {report.content_type}
                      </CardDescription>
                    </div>
                    {getStatusBadge(report.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Reason:</Label>
                      <p className="text-sm text-muted-foreground">{report.reason}</p>
                    </div>
                    {report.description && (
                      <div>
                        <Label className="text-sm font-medium">Description:</Label>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                    )}
                    {report.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReportAction(report.id, 'approve')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve Report
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReportAction(report.id, 'dismiss')}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Dismiss Report
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Moderation Action Dialog */}
        <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Moderate Content</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Content Title</Label>
                <Input 
                  value={selectedContent?.title || selectedContent?.post_title || 'Comment'} 
                  disabled 
                />
              </div>
              <div>
                <Label>Moderation Action</Label>
                <Select value={moderationAction} onValueChange={setModerationAction}>
                  <SelectTrigger>
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
                <Label>Reason (Optional)</Label>
                <Textarea
                  placeholder="Explain the reason for this action..."
                  value={moderationReason}
                  onChange={(e) => setModerationReason(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleModerationAction} disabled={!moderationAction}>
                  Apply Action
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  )
}
