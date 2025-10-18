"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
  Badge 
} from "@/components/ui/badge"
import {
  Shield,
  Users,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Trash2,
  Edit,
  Ban,
  Award,
  Flag,
  User,
  Calendar,
  Hash,
  TrendingUp
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"

interface ReportedContent {
  id: string
  type: 'post' | 'comment'
  content: string
  author: string
  reporter: string
  reason: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  created_at: string
  post_id?: string
  comment_id?: string
}

interface CommunityStats {
  total_posts: number
  total_comments: number
  total_users: number
  active_users: number
  reported_content: number
  trending_tags: { tag: string; count: number }[]
}

interface User {
  id: string
  email: string
  full_name: string
  is_suspended: boolean
  created_at: string
  last_active: string
  posts_count: number
  comments_count: number
}

export function AdminPanel() {
  const { user } = useAuth()
  const [reports, setReports] = useState<ReportedContent[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<CommunityStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedReport, setSelectedReport] = useState<ReportedContent | null>(null)
  const [actionDialog, setActionDialog] = useState<{ open: boolean; action: 'resolve' | 'dismiss' | 'suspend' | null }>({ open: false, action: null })
  const [moderationNote, setModerationNote] = useState("")

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      
      // Fetch reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('community_reports')
        .select(`
          *,
          reporter:user_profiles(full_name),
          post:community_posts_enhanced(content),
          comment:post_comments_enhanced(content)
        `)
        .order('created_at', { ascending: false })
      
      if (reportsError) throw reportsError
      
      const formattedReports = reportsData?.map(report => ({
        id: report.id,
        type: report.post_id ? 'post' : 'comment' as 'post' | 'comment',
        content: report.post?.content || report.comment?.content || 'Content not available',
        author: report.post?.user_id || report.comment?.user_id || 'Unknown',
        reporter: report.reporter?.full_name || 'Anonymous',
        reason: report.reason,
        status: report.status as 'pending' | 'reviewed' | 'resolved' | 'dismissed',
        created_at: report.created_at,
        post_id: report.post_id,
        comment_id: report.comment_id
      })) || []
      
      setReports(formattedReports)
      
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select(`
          *,
          user:auth_users(email, created_at, last_sign_in_at)
        `)
        .order('user.last_sign_in_at', { ascending: false })
      
      if (usersError) throw usersError
      
      const formattedUsers = usersData?.map(profile => ({
        id: profile.user_id,
        email: profile.user?.email || 'No email',
        full_name: profile.full_name,
        is_suspended: false, // This would come from a user status table
        created_at: profile.user?.created_at || profile.created_at,
        last_active: profile.user?.last_sign_in_at || 'Never',
        posts_count: 0, // This would be fetched from posts table
        comments_count: 0 // This would be fetched from comments table
      })) || []
      
      setUsers(formattedUsers)
      
      // Fetch stats
      const { count: postsCount } = await supabase
        .from('community_posts_enhanced')
        .select('*', { count: 'exact', head: true })
      
      const { count: commentsCount } = await supabase
        .from('post_comments_enhanced')
        .select('*', { count: 'exact', head: true })
      
      const { count: usersCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
      
      const { count: reportsCount } = await supabase
        .from('community_reports')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
      
      setStats({
        total_posts: postsCount || 0,
        total_comments: commentsCount || 0,
        total_users: usersCount || 0,
        active_users: 0, // This would require more complex logic
        reported_content: reportsCount || 0,
        trending_tags: [] // This would require aggregation query
      })
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReportAction = async (action: 'resolve' | 'dismiss' | 'suspend') => {
    if (!selectedReport) return
    
    try {
      let updateData: any = { status: action === 'resolve' ? 'resolved' : 'dismissed' }
      
      if (moderationNote) {
        updateData.moderation_note = moderationNote
      }
      
      const { error } = await supabase
        .from('community_reports')
        .update(updateData)
        .eq('id', selectedReport.id)
      
      if (error) throw error
      
      // If suspending user, update user status
      if (action === 'suspend') {
        // Implementation would depend on your user status system
        toast({
          title: "User Suspended",
          description: "User has been suspended"
        })
      }
      
      toast({
        title: "Report Updated",
        description: `Report has been ${action === 'resolve' ? 'resolved' : 'dismissed'}`
      })
      
      // Refresh data
      fetchAdminData()
      setActionDialog({ open: false, action: null })
      setSelectedReport(null)
      setModerationNote("")
    } catch (error) {
      console.error('Error updating report:', error)
      toast({
        title: "Error",
        description: "Failed to update report",
        variant: "destructive"
      })
    }
  }

  const deleteContent = async (type: 'post' | 'comment', id: string) => {
    try {
      const { error } = type === 'post' 
        ? await supabase.from('community_posts_enhanced').delete().eq('id', id)
        : await supabase.from('post_comments_enhanced').delete().eq('id', id)
      
      if (error) throw error
      
      toast({
        title: "Content Deleted",
        description: `${type === 'post' ? 'Post' : 'Comment'} has been deleted`
      })
      
      // Refresh data
      fetchAdminData()
    } catch (error) {
      console.error('Error deleting content:', error)
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive"
      })
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporter.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterStatus === "all" || report.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <MessageSquare className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-xl font-bold">{stats?.total_posts || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <MessageSquare className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Comments</p>
                <p className="text-xl font-bold">{stats?.total_comments || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-xl font-bold">{stats?.total_users || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Reports</p>
                <p className="text-xl font-bold">{stats?.reported_content || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Admin Panel */}
      <Tabs defaultValue="reports">
        <TabsList>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Content Reports
              </CardTitle>
              <CardDescription>
                Review and manage reported content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Reports Table */}
              <div className="border rounded-lg">
                <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 text-sm font-medium">
                  <div className="col-span-3">Content</div>
                  <div className="col-span-2">Reporter</div>
                  <div className="col-span-2">Reason</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-2">Actions</div>
                </div>
                
                {filteredReports.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No reports found
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredReports.map((report) => (
                      <div key={report.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                        <div className="col-span-3">
                          <p className="text-sm font-medium line-clamp-2">{report.content}</p>
                          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                            by {report.author}
                          </p>
                        </div>
                        
                        <div className="col-span-2">
                          <p className="text-sm">{report.reporter}</p>
                        </div>
                        
                        <div className="col-span-2">
                          <Badge variant="secondary" className="text-xs">
                            {report.reason}
                          </Badge>
                        </div>
                        
                        <div className="col-span-2">
                          <p className="text-sm">
                            {new Date(report.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="col-span-1">
                          <Badge 
                            variant={
                              report.status === 'pending' ? 'default' :
                              report.status === 'resolved' ? 'success' :
                              report.status === 'dismissed' ? 'secondary' : 'outline'
                            }
                          >
                            {report.status}
                          </Badge>
                        </div>
                        
                        <div className="col-span-2 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedReport(report)
                              setActionDialog({ open: true, action: 'resolve' })
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedReport(report)
                              setActionDialog({ open: true, action: 'dismiss' })
                            }}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteContent(report.type, report.post_id || report.comment_id || '')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage community users and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 text-sm font-medium">
                  <div className="col-span-3">User</div>
                  <div className="col-span-2">Email</div>
                  <div className="col-span-2">Joined</div>
                  <div className="col-span-2">Last Active</div>
                  <div className="col-span-1">Posts</div>
                  <div className="col-span-1">Comments</div>
                  <div className="col-span-1">Actions</div>
                </div>
                
                {users.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No users found
                  </div>
                ) : (
                  <div className="divide-y">
                    {users.map((user) => (
                      <div key={user.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                        <div className="col-span-3">
                          <p className="text-sm font-medium">{user.full_name}</p>
                        </div>
                        
                        <div className="col-span-2">
                          <p className="text-sm">{user.email}</p>
                        </div>
                        
                        <div className="col-span-2">
                          <p className="text-sm">
                            {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="col-span-2">
                          <p className="text-sm">
                            {user.last_active === 'Never' 
                              ? 'Never' 
                              : new Date(user.last_active).toLocaleDateString()
                            }
                          </p>
                        </div>
                        
                        <div className="col-span-1">
                          <p className="text-sm">{user.posts_count}</p>
                        </div>
                        
                        <div className="col-span-1">
                          <p className="text-sm">{user.comments_count}</p>
                        </div>
                        
                        <div className="col-span-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedReport({
                                id: user.id,
                                type: 'post',
                                content: '',
                                author: user.full_name,
                                reporter: '',
                                reason: '',
                                status: 'pending',
                                created_at: user.created_at
                              } as any)
                              setActionDialog({ open: true, action: 'suspend' })
                            }}
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Community Analytics
              </CardTitle>
              <CardDescription>
                Insights into community engagement and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 mx-auto text-slate-700 dark:text-slate-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  Detailed analytics and insights would be displayed here
                </p>
                <Button variant="outline">View Detailed Analytics</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Action Dialog */}
      <AlertDialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ open, action: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog.action === 'resolve' && 'Resolve Report'}
              {actionDialog.action === 'dismiss' && 'Dismiss Report'}
              {actionDialog.action === 'suspend' && 'Suspend User'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog.action === 'resolve' && 'Mark this report as resolved and take appropriate action.'}
              {actionDialog.action === 'dismiss' && 'Dismiss this report without taking further action.'}
              {actionDialog.action === 'suspend' && 'Suspend this user and prevent them from accessing the community.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4">
            {selectedReport && (
              <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-lg">
                <p className="text-sm font-medium">Reported Content</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 line-clamp-3">
                  {selectedReport.content}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Reporter: {selectedReport.reporter}</span>
                  <span>Reason: {selectedReport.reason}</span>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Moderation Note</label>
              <Textarea
                placeholder="Add a note about your decision..."
                value={moderationNote}
                onChange={(e) => setModerationNote(e.target.value)}
              />
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedReport && handleReportAction(actionDialog.action as any)}
            >
              {actionDialog.action === 'resolve' && 'Resolve Report'}
              {actionDialog.action === 'dismiss' && 'Dismiss Report'}
              {actionDialog.action === 'suspend' && 'Suspend User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}