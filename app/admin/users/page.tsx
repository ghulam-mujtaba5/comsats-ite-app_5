"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Users, Shield, Ban, CheckCircle, AlertTriangle, Mail, Calendar, Settings } from "lucide-react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { useToast } from "@/hooks/use-toast"
import { CenteredLoader } from "@/components/ui/loading-spinner"

interface User {
  id: string
  email: string
  created_at: string
  last_sign_in_at?: string
  email_confirmed_at?: string
  banned_until?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
  app_metadata?: {
    provider?: string
    providers?: string[]
  }
}

interface AdminUser {
  id: string
  user_id: string
  role: string
  permissions: string[]
  created_at: string
  user?: User
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(20)
  const [sort, setSort] = useState<'created_at' | 'email' | 'last_sign_in_at'>('created_at')
  const [dir, setDir] = useState<'asc' | 'desc'>('desc')
  const [hasMore, setHasMore] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false)
  const [newAdminRole, setNewAdminRole] = useState("admin")
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
    fetchAdminUsers()
  }, [])

  // Refetch when filters/pagination change
  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filterStatus, page, perPage, sort, dir])

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('q', searchQuery)
      if (filterStatus) params.set('status', filterStatus)
      params.set('page', String(page))
      params.set('perPage', String(perPage))
      params.set('sort', sort)
      params.set('dir', dir)
      const response = await fetch(`/api/admin/users?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
        if (typeof data.hasMore === 'boolean') setHasMore(data.hasMore)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    const ok = typeof window !== 'undefined' ? window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.') : true
    if (!ok) return
    try {
      const response = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
      if (response.ok) {
        toast({ title: 'Success', description: 'User deleted successfully' })
        // Refresh both user and admin lists in case the user was an admin
        fetchUsers()
        fetchAdminUsers()
      } else {
        const err = await response.json().catch(() => ({} as any))
        throw new Error(err?.error || 'Failed to delete user')
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete user', variant: 'destructive' })
    }
  }

  const fetchAdminUsers = async () => {
    try {
      const response = await fetch('/api/admin/admin-users')
      if (response.ok) {
        const data = await response.json()
        setAdminUsers(data)
      }
    } catch (error) {
      console.error('Error fetching admin users:', error)
    }
  }

  const handleBanUser = async (userId: string, ban: boolean) => {
    try {
      const response = await fetch('/api/admin/users/ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ban })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `User ${ban ? 'banned' : 'unbanned'} successfully`
        })
        fetchUsers()
      } else {
        throw new Error('Failed to update user status')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      })
    }
  }

  const handlePromoteToAdmin = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch('/api/admin/admin-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          role: newAdminRole,
          permissions: getDefaultPermissions(newAdminRole)
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User promoted to admin successfully"
        })
        setIsPromoteDialogOpen(false)
        setSelectedUser(null)
        fetchAdminUsers()
      } else {
        throw new Error('Failed to promote user')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to promote user to admin",
        variant: "destructive"
      })
    }
  }

  const handleRevokeAdmin = async (adminUserId: string) => {
    try {
      const response = await fetch(`/api/admin/admin-users/${adminUserId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Admin privileges revoked successfully"
        })
        fetchAdminUsers()
      } else {
        throw new Error('Failed to revoke admin privileges')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke admin privileges",
        variant: "destructive"
      })
    }
  }

  const getDefaultPermissions = (role: string): string[] => {
    switch (role) {
      case 'super_admin':
        return ['all']
      case 'admin':
        return ['manage_content', 'moderate_community', 'manage_events', 'view_analytics']
      case 'moderator':
        return ['moderate_community', 'manage_lost_found']
      default:
        return []
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.user_metadata?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchesStatus = true
    if (filterStatus === 'active') {
      matchesStatus = !user.banned_until && !!user.email_confirmed_at
    } else if (filterStatus === 'banned') {
      matchesStatus = !!user.banned_until
    } else if (filterStatus === 'unconfirmed') {
      matchesStatus = !user.email_confirmed_at
    } else if (filterStatus === 'admin') {
      matchesStatus = adminUsers.some(admin => admin.user_id === user.id)
    }

    return matchesSearch && matchesStatus
  })

  const getUserStatus = (user: User) => {
    if (user.banned_until) return { status: 'banned', color: 'destructive' }
    if (!user.email_confirmed_at) return { status: 'unconfirmed', color: 'secondary' }
    if (adminUsers.some(admin => admin.user_id === user.id)) return { status: 'admin', color: 'default' }
    return { status: 'active', color: 'outline' }
  }

  const isUserAdmin = (userId: string) => {
    return adminUsers.some(admin => admin.user_id === userId)
  }

  if (loading) {
    return <CenteredLoader message="Loading users..." />
  }

  return (
    <AdminGuard>
      <div className="app-container section">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts, permissions, and admin roles
          </p>
        </div>
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">All Users</TabsTrigger>
            <TabsTrigger value="admins">Admin Users</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-wrap gap-4 mb-6 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users by email or name..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1) }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                  <SelectItem value="unconfirmed">Unconfirmed</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
              <Select value={String(perPage)} onValueChange={(v) => { setPerPage(parseInt(v)); setPage(1) }}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <Select value={`${sort}:${dir}`} onValueChange={(v) => { const [s,d]=v.split(':') as any; setSort(s); setDir(d); setPage(1) }}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at:desc">Newest</SelectItem>
                  <SelectItem value="created_at:asc">Oldest</SelectItem>
                  <SelectItem value="last_sign_in_at:desc">Last Active ↓</SelectItem>
                  <SelectItem value="last_sign_in_at:asc">Last Active ↑</SelectItem>
                  <SelectItem value="email:asc">Email A-Z</SelectItem>
                  <SelectItem value="email:desc">Email Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users List */}
            <div className="grid gap-4">
              {filteredUsers.map((user) => {
                const userStatus = getUserStatus(user)
                return (
                  <Card key={user.id} variant="elevated">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {user.email}
                          </CardTitle>
                          <CardDescription>
                            {user.user_metadata?.full_name && (
                              <span className="font-medium">{user.user_metadata.full_name} • </span>
                            )}
                            Joined {new Date(user.created_at).toLocaleDateString()}
                            {user.last_sign_in_at && (
                              <span> • Last active {new Date(user.last_sign_in_at).toLocaleDateString()}</span>
                            )}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={userStatus.color as "default" | "destructive" | "outline" | "secondary"}>
                            {userStatus.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        {!isUserAdmin(user.id) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsPromoteDialogOpen(true)
                            }}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            Promote to Admin
                          </Button>
                        )}
                        {user.banned_until ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBanUser(user.id, false)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Unban User
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleBanUser(user.id, true)}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Ban User
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Delete User
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              {filteredUsers.length === 0 && (
                <Card variant="soft" className="p-8 text-center">
                  <div className="text-muted-foreground">No users match the current filters</div>
                </Card>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-muted-foreground">Page {page}</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={!hasMore}>
                  Next
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admins" className="space-y-6">
            <div className="grid gap-4">
              {adminUsers.map((adminUser) => (
                <Card key={adminUser.id} variant="elevated">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          {adminUser.user?.email || 'Unknown User'}
                        </CardTitle>
                        <CardDescription>
                          Role: {adminUser.role} • Added {new Date(adminUser.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant="default">{adminUser.role}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Permissions:</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {adminUser.permissions.map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRevokeAdmin(adminUser.id)}
                      >
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Revoke Admin Access
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {adminUsers.length === 0 && (
                <Card variant="soft" className="p-8 text-center">
                  <div className="text-muted-foreground">No admin users yet</div>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Promote to Admin Dialog */}
        <Dialog open={isPromoteDialogOpen} onOpenChange={setIsPromoteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Promote User to Admin</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>User Email</Label>
                <Input value={selectedUser?.email || ''} disabled />
              </div>
              <div>
                <Label>Admin Role</Label>
                <Select value={newAdminRole} onValueChange={setNewAdminRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Default Permissions</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {getDefaultPermissions(newAdminRole).map((permission) => (
                    <Badge key={permission} variant="outline" className="text-xs">
                      {permission.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsPromoteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePromoteToAdmin}>
                  Promote to Admin
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  )
}
