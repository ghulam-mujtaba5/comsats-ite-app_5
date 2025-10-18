"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import adminStyles from "@/app/admin/admin-shared.module.css"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
import styles from './page.module.css';
  Users, 
  MessageSquare, 
  Flag, 
  Shield, 
  BarChart3, 
  Settings,
  Eye,
  EyeOff,
  Trash2,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  X,
  Search,
  Filter
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface CommunityPost {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar: string
  }
  createdAt: string
  likes: number
  comments: number
  visibility: string
  status: 'active' | 'hidden' | 'deleted'
  campus: string
  department: string
}

interface CommunityUser {
  id: string
  name: string
  email: string
  role: string
  posts: number
  joinDate: string
  status: 'active' | 'suspended' | 'banned'
  avatar: string
}

interface CommunityReport {
  id: string
  type: string
  content: string
  reporter: {
    id: string
    name: string
    avatar: string
  }
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  createdAt: string
  targetId: string
}

export default function CommunityAdminPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true)
  
  // Check if user is authenticated as admin
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/session')
        if (res.ok) {
          const data = await res.json()
          if (data.ok) {
            setAuthenticated(true)
          } else {
            // Redirect to admin login
            window.location.href = '/admin/auth'
          }
        } else {
          // Redirect to admin login
          window.location.href = '/admin/auth'
        }
      } catch (error) {
        // Redirect to admin login
        window.location.href = '/admin/auth'
      } finally {
        setLoadingAuth(false)
      }
    }
    
    checkAuth()
  }, [])
  
  if (loadingAuth) {
    return (
      <div className={`${adminStyles.section} px-4 py-8`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }
  
  if (!authenticated) {
    return (
      <div className={`${adminStyles.section} px-4 py-8`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">You must be an administrator to access this page.</p>
            <Button onClick={() => router.push('/admin/auth')}>Go to Admin Login</Button>
          </div>
        </div>
      </div>
    )
  }
  
  return <CommunityAdminPageContent />
}

function CommunityAdminPageContent() {
  const [activeTab, setActiveTab] = useState("overview")
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [users, setUsers] = useState<CommunityUser[]>([])
  const [reports, setReports] = useState<CommunityReport[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPosts: 0,
    activeUsers: 0,
    pendingReports: 0,
    engagementRate: 0
  })
  
  // Search and filter states
  const [postSearch, setPostSearch] = useState("")
  const [userSearch, setUserSearch] = useState("")
  const [reportStatusFilter, setReportStatusFilter] = useState("all")
  const [postStatusFilter, setPostStatusFilter] = useState("all")
  const [userStatusFilter, setUserStatusFilter] = useState("all")

  // Fetch data from API
  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === "overview") {
        // Fetch stats
        const [postsRes, usersRes, reportsRes] = await Promise.all([
          fetch('/api/admin/community/posts?limit=100'),
          fetch('/api/admin/community/users?limit=100'),
          fetch('/api/admin/community/reports?limit=100')
        ])
        
        const [postsData, usersData, reportsData] = await Promise.all([
          postsRes.json(),
          usersRes.json(),
          reportsRes.json()
        ])
        
        setPosts(postsData)
        setUsers(usersData)
        setReports(reportsData)
        
        // Calculate stats
        setStats({
          totalPosts: postsData.length,
          activeUsers: usersData.filter((u: any) => u.status === 'active').length,
          pendingReports: reportsData.filter((r: any) => r.status === 'pending').length,
          engagementRate: postsData.length > 0 ? Math.min(100, Math.round((reportsData.length / postsData.length) * 100)) : 0
        })
      } else if (activeTab === "posts") {
        const res = await fetch('/api/admin/community/posts?limit=100')
        const data = await res.json()
        setPosts(data)
      } else if (activeTab === "users") {
        const res = await fetch('/api/admin/community/users?limit=100')
        const data = await res.json()
        setUsers(data)
      } else if (activeTab === "reports") {
        const res = await fetch('/api/admin/community/reports?limit=100')
        const data = await res.json()
        setReports(data)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePostAction = async (postId: string, action: 'active' | 'hidden' | 'deleted') => {
    try {
      const res = await fetch('/api/admin/community/posts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
          // Note: Cookies are automatically included in fetch requests
        },
        body: JSON.stringify({ postId, status: action })
      })
      
      if (res.ok) {
        // Update local state
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, status: action } : post
        ))
        
        toast({
          title: "Success",
          description: `Post ${action} successfully`
        })
      } else {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update post')
      }
    } catch (error: any) {
      console.error("Error updating post:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update post. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleUserAction = async (userId: string, action: 'active' | 'suspended' | 'banned') => {
    try {
      const res = await fetch('/api/admin/community/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, status: action })
      })
      
      if (res.ok) {
        // Update local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: action } : user
        ))
        
        toast({
          title: "Success",
          description: `User ${action} successfully`
        })
      } else {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update user')
      }
    } catch (error: any) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update user. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleReportAction = async (reportId: string, action: 'resolved' | 'dismissed') => {
    try {
      const res = await fetch('/api/admin/community/reports', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reportId, status: action })
      })
      
      if (res.ok) {
        // Update local state
        setReports(reports.map(report => 
          report.id === reportId ? { ...report, status: action } : report
        ))
        
        // Update stats if on overview tab
        if (activeTab === "overview") {
          setStats({
            ...stats,
            pendingReports: stats.pendingReports - 1
          })
        }
        
        toast({
          title: "Success",
          description: `Report ${action} successfully`
        })
      } else {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update report')
      }
    } catch (error: any) {
      console.error("Error updating report:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update report. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Filter posts based on search and status
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(postSearch.toLowerCase()) || 
                          post.author.name.toLowerCase().includes(postSearch.toLowerCase())
    const matchesStatus = postStatusFilter === "all" || post.status === postStatusFilter
    return matchesSearch && matchesStatus
  })

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          user.email.toLowerCase().includes(userSearch.toLowerCase())
    const matchesStatus = userStatusFilter === "all" || user.status === userStatusFilter
    return matchesSearch && matchesStatus
  })

  // Filter reports based on status
  const filteredReports = reports.filter(report => {
    return reportStatusFilter === "all" || report.status === reportStatusFilter
  })

  if (loading) {
    return (
      <div className={`${adminStyles.section} px-4 py-8`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${adminStyles.section} px-4 py-8`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Community Management</h1>
        <p className="text-muted-foreground">
          Manage posts, users, and reports in the community platform
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPosts}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                <Flag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingReports}</div>
                <p className="text-xs text-muted-foreground">-3 from yesterday</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.engagementRate}%</div>
                <p className="text-xs text-muted-foreground">+2% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
                <CardDescription>Latest community activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.slice(0, 3).map((post) => (
                    <div key={post.id} className="flex items-start gap-3">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{post.author.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{post.likes} likes</span>
                          <span>•</span>
                          <span>{post.comments} comments</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Reports</CardTitle>
                <CardDescription>Reports requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.filter(r => r.status === 'pending').slice(0, 3).map((report) => (
                    <div key={report.id} className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{report.type}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {report.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Reported by {report.reporter.name}</span>
                          <span>•</span>
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleReportAction(report.id, 'resolved')}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleReportAction(report.id, 'dismissed')}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Posts</CardTitle>
              <CardDescription>Manage all posts in the community</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search posts..."
                    value={postSearch}
                    onChange={(e) => setPostSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="w-full sm:w-40">
                  <Select value={postStatusFilter} onValueChange={setPostStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="hidden">Hidden</SelectItem>
                      <SelectItem value="deleted">Deleted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="flex items-start gap-3 p-4 rounded-lg border">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{post.author.name}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          post.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : post.status === 'hidden' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {post.status}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{post.likes} likes</span>
                        <span>{post.comments} comments</span>
                        <span>Visibility: {post.visibility}</span>
                        <span>Campus: {post.campus}</span>
                        <span>Department: {post.department}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {post.status === 'active' ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handlePostAction(post.id, 'hidden')}
                        >
                          <EyeOff className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handlePostAction(post.id, 'active')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handlePostAction(post.id, 'deleted')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Users</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="w-full sm:w-40">
                  <Select value={userStatusFilter} onValueChange={setUserStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-4 rounded-lg border">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{user.name}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : user.status === 'suspended' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Role: {user.role}</span>
                        <span>{user.posts} posts</span>
                        <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {user.status === 'active' ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleUserAction(user.id, 'suspended')}
                        >
                          <Lock className="h-4 w-4" />
                        </Button>
                      ) : user.status === 'suspended' ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleUserAction(user.id, 'active')}
                        >
                          <Unlock className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleUserAction(user.id, 'active')}
                        >
                          <Unlock className="h-4 w-4" />
                        </Button>
                      )}
                      {user.status !== 'banned' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleUserAction(user.id, 'banned')}
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Reports</CardTitle>
              <CardDescription>Review and resolve user reports</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="w-full sm:w-40">
                  <Select value={reportStatusFilter} onValueChange={setReportStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
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
              </div>
              
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div key={report.id} className="flex items-start gap-3 p-4 rounded-lg border">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{report.type}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          report.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : report.status === 'reviewed' 
                              ? 'bg-blue-100 text-blue-800' 
                              : report.status === 'resolved' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {report.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Reported by {report.reporter.name}</span>
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleReportAction(report.id, 'resolved')}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleReportAction(report.id, 'dismissed')}
                      >
                        <XCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Settings</CardTitle>
              <CardDescription>Configure community platform policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Auto-moderation</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatically flag content with sensitive keywords
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Report Threshold</h3>
                    <p className="text-sm text-muted-foreground">
                      Number of reports before auto-hiding content
                    </p>
                  </div>
                  <select className="border rounded-md px-3 py-1">
                    <option>3 reports</option>
                    <option>5 reports</option>
                    <option>10 reports</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Moderator Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Email alerts for new reports
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-3">Blocked Words</h3>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Add blocked word..." 
                    className="flex-1 border rounded-md px-3 py-2"
                  />
                  <Button size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {["spam", "offensive", "inappropriate"].map((word) => (
                    <span 
                      key={word} 
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-muted"
                    >
                      {word}
                      <button className="text-muted-foreground hover:text-foreground">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}