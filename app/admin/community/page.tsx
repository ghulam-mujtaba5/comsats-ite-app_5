"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
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
  X  // Add the missing X import
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface CommunityPost {
  id: string
  content: string
  author: string
  createdAt: string
  likes: number
  comments: number
  visibility: string
  status: 'active' | 'hidden' | 'deleted'
}

interface CommunityUser {
  id: string
  name: string
  email: string
  role: string
  posts: number
  joinDate: string
  status: 'active' | 'suspended' | 'banned'
}

interface CommunityReport {
  id: string
  type: string
  content: string
  reporter: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  createdAt: string
}

export default function CommunityAdminPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [users, setUsers] = useState<CommunityUser[]>([])
  const [reports, setReports] = useState<CommunityReport[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would fetch from API
    const mockPosts: CommunityPost[] = [
      {
        id: "1",
        content: "This is a sample post about campus life...",
        author: "student123",
        createdAt: "2025-10-09T10:30:00Z",
        likes: 24,
        comments: 8,
        visibility: "public",
        status: "active"
      },
      {
        id: "2",
        content: "Question about upcoming exams...",
        author: "user456",
        createdAt: "2025-10-09T09:15:00Z",
        likes: 12,
        comments: 15,
        visibility: "department",
        status: "active"
      }
    ]

    const mockUsers: CommunityUser[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@campus.edu",
        role: "student",
        posts: 42,
        joinDate: "2025-09-15",
        status: "active"
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@campus.edu",
        role: "student",
        posts: 28,
        joinDate: "2025-09-20",
        status: "suspended"
      }
    ]

    const mockReports: CommunityReport[] = [
      {
        id: "1",
        type: "post",
        content: "Inappropriate content in post...",
        reporter: "user789",
        status: "pending",
        createdAt: "2025-10-09T08:45:00Z"
      },
      {
        id: "2",
        type: "comment",
        content: "Harassment in comment...",
        reporter: "moderator123",
        status: "reviewed",
        createdAt: "2025-10-08T14:20:00Z"
      }
    ]

    setPosts(mockPosts)
    setUsers(mockUsers)
    setReports(mockReports)
    setLoading(false)
  }, [])

  const handlePostAction = (postId: string, action: 'hide' | 'delete' | 'restore') => {
    // In a real app, this would call an API
    toast({
      title: `Post ${action}d`,
      description: `Post ${postId} has been ${action}d`
    })
  }

  const handleUserAction = (userId: string, action: 'suspend' | 'ban' | 'activate') => {
    // In a real app, this would call an API
    toast({
      title: `User ${action}d`,
      description: `User ${userId} has been ${action}d`
    })
  }

  const handleReportAction = (reportId: string, action: 'resolve' | 'dismiss') => {
    // In a real app, this would call an API
    toast({
      title: `Report ${action}d`,
      description: `Report ${reportId} has been ${action}d`
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div>
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
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">856</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                <Flag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">-3 from yesterday</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
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
                        <p className="text-sm font-medium">{post.author}</p>
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
                  {reports.filter(r => r.status === 'pending').map((report) => (
                    <div key={report.id} className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{report.type}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {report.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Reported by {report.reporter}</span>
                          <span>•</span>
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button variant="ghost" size="sm">
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
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="flex items-start gap-3 p-4 rounded-lg border">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{post.author}</p>
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
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {post.status === 'active' ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handlePostAction(post.id, 'hide')}
                        >
                          <EyeOff className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handlePostAction(post.id, 'restore')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handlePostAction(post.id, 'delete')}
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
              <div className="space-y-4">
                {users.map((user) => (
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
                        <span>Joined: {user.joinDate}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {user.status === 'active' ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleUserAction(user.id, 'suspend')}
                        >
                          <Lock className="h-4 w-4" />
                        </Button>
                      ) : user.status === 'suspended' ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleUserAction(user.id, 'activate')}
                        >
                          <Unlock className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleUserAction(user.id, 'activate')}
                        >
                          <Unlock className="h-4 w-4" />
                        </Button>
                      )}
                      {user.status !== 'banned' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleUserAction(user.id, 'ban')}
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
              <div className="space-y-4">
                {reports.map((report) => (
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
                        <span>Reported by {report.reporter}</span>
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleReportAction(report.id, 'resolve')}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleReportAction(report.id, 'dismiss')}
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
                        <X className="h-3 w-3" /> {/* Fixed the X reference error */}
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