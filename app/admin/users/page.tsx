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
import { Search, Plus, Users, Shield, Ban, CheckCircle, AlertTriangle, Mail, Calendar, Settings, Filter, SortAsc, MoreHorizontal, UserCheck, UserX, Crown, Sparkles, Activity, TrendingUp, Loader2, Trash2, Edit } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminActionCard } from "@/components/admin/admin-action-card"
import { AdminLoading } from "@/components/admin/admin-loading"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"

// Permission options available for admin role customization
const PERMISSION_OPTIONS = [
  'manage_content',
  'moderate_community',
  'manage_events',
  'view_analytics',
  'manage_lost_found',
  'manage_past_papers',
  'manage_faculty',
  'manage_timetable',
  'manage_support',
]

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
  gamification_role?: string | null
  created_at: string
  user?: User
}

interface CustomRole {
  id: string
  name: string
  display_name: string
  description: string
  permissions: Record<string, boolean>
  is_system_role: boolean
  created_at: string
}

const AVAILABLE_PERMISSIONS = [
  { key: "manage_users", label: "Manage Users", description: "Create, edit, and delete users" },
  { key: "manage_roles", label: "Manage Roles", description: "Create and modify custom roles" },
  { key: "view_analytics", label: "View Analytics", description: "Access analytics and reports" },
  { key: "manage_content", label: "Manage Content", description: "Create, edit, and delete content" },
  { key: "moderate_community", label: "Moderate Community", description: "Moderate community posts and comments" },
  { key: "manage_events", label: "Manage Events", description: "Create and manage events" },
  { key: "manage_news", label: "Manage News", description: "Create and manage news articles" },
  { key: "manage_faculty", label: "Manage Faculty", description: "Add and manage faculty members" },
  { key: "manage_timetable", label: "Manage Timetable", description: "Upload and manage timetables" },
  { key: "manage_resources", label: "Manage Resources", description: "Upload and manage resources" },
  { key: "manage_support", label: "Manage Support", description: "Handle support tickets" },
  { key: "send_emails", label: "Send Emails", description: "Send emails to users" },
  { key: "view_logs", label: "View Activity Logs", description: "View system activity logs" }
]

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
  const [newGamificationRole, setNewGamificationRole] = useState<string | null>(null)
  const { toast } = useToast()
  // Manage access (edit existing admin)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null)
  const [editRole, setEditRole] = useState<string>("admin")
  const [editPermissions, setEditPermissions] = useState<string[]>([])
  const [editGamificationRole, setEditGamificationRole] = useState<string | null>(null)
  
  // Role management state
  const [roles, setRoles] = useState<CustomRole[]>([])
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [newRole, setNewRole] = useState({
    name: "",
    display_name: "",
    description: "",
    permissions: {} as Record<string, boolean>
  })

  useEffect(() => {
    fetchUsers()
    fetchAdminUsers()
    fetchRoles()
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
          permissions: getDefaultPermissions(newAdminRole),
          gamification_role: newGamificationRole
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

  // Manage Access helpers
  const openManageAccess = (admin: AdminUser) => {
    setEditingAdmin(admin)
    setEditRole(admin.role)
    setEditPermissions(Array.isArray(admin.permissions) ? admin.permissions : [])
    setEditGamificationRole(admin.gamification_role || null)
    setIsEditDialogOpen(true)
  }

  const handleRoleChangeInEdit = (role: string) => {
    setEditRole(role)
    // Apply default permissions when role is changed; can be adjusted by toggles below
    setEditPermissions(getDefaultPermissions(role))
  }

  const togglePermission = (perm: string) => {
    setEditPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    )
  }

  const handleUpdateAccess = async () => {
    if (!editingAdmin) return
    try {
      const res = await fetch(`/api/admin/admin-users/${editingAdmin.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          role: editRole, 
          permissions: editPermissions,
          gamification_role: editGamificationRole 
        })
      })
      if (!res.ok) throw new Error('Failed to update admin access')
      toast({ title: 'Updated', description: 'Admin access updated successfully' })
      setIsEditDialogOpen(false)
      setEditingAdmin(null)
      fetchAdminUsers()
    } catch (e) {
      toast({ title: 'Error', description: 'Could not update admin access', variant: 'destructive' })
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

  // Role management functions
  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/roles")
      if (!response.ok) throw new Error("Failed to fetch roles")
      const data = await response.json()
      setRoles(data.data || [])
    } catch (error) {
      console.error("Error fetching roles:", error)
    }
  }

  const handleCreateRole = async () => {
    try {
      setProcessing(true)
      const response = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRole)
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create role")
      }
      toast({
        title: "Success",
        description: "Role created successfully"
      })
      setShowCreateRoleDialog(false)
      setNewRole({ name: "", display_name: "", description: "", permissions: {} })
      fetchRoles()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create role",
        variant: "destructive"
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleDeleteRole = async (roleId: string, roleName: string) => {
    if (!confirm(`Are you sure you want to delete the role "${roleName}"? This action cannot be undone.`)) {
      return
    }
    try {
      setProcessing(true)
      const response = await fetch(`/api/roles`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role_id: roleId })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete role")
      }
      toast({
        title: "Success",
        description: "Role deleted successfully"
      })
      fetchRoles()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete role",
        variant: "destructive"
      })
    } finally {
      setProcessing(false)
    }
  }

  const toggleRolePermission = (key: string) => {
    setNewRole(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key]
      }
    }))
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

  return (
    <AdminGuard>
      <AdminPageHeader
        title="User Management"
        description="Comprehensive user account administration and control"
        icon={Users}
        iconGradient="from-blue-600 to-purple-600"
        badges={[
          {
            label: "Total Users",
            value: users.length,
            icon: Activity,
            color: "border-blue-200 dark:border-blue-800"
          },
          {
            label: "Admins",
            value: adminUsers.length,
            icon: Shield,
            color: "border-green-200 dark:border-green-800"
          }
        ]}
      />
        
        {/* Enhanced User Management Interface */}
        <div className="app-container space-y-8 pb-12">
          <Tabs defaultValue="users" className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <TabsList className="glass-card bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/40 dark:border-slate-600/40 grid w-full lg:w-auto grid-cols-3">
                <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg">
                  <Users className="h-4 w-4" />
                  All Users
                </TabsTrigger>
                <TabsTrigger value="admins" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg">
                  <Crown className="h-4 w-4" />
                  Admin Users
                </TabsTrigger>
                <TabsTrigger value="roles" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg">
                  <Shield className="h-4 w-4" />
                  Custom Roles
                </TabsTrigger>
              </TabsList>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <Input
                    placeholder="Search users by email or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 w-full sm:w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                    <SelectItem value="unconfirmed">Unconfirmed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

          <TabsContent value="users" className="space-y-6">
            {/* Enhanced Users List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Users</h2>
                  <p className="text-slate-600 dark:text-slate-300">Manage all registered user accounts</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {filteredUsers.length} Results
                  </Badge>
                </div>
              </div>
              
              <div className="grid gap-4">
                {loading ? (
                  <AdminLoading message="Loading users..." />
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const userStatus = getUserStatus(user)
                    const actions = []
                    
                    // Add promote action if not admin
                    if (!isUserAdmin(user.id)) {
                      actions.push({
                        label: "Promote",
                        icon: Shield,
                        onClick: () => {
                          setSelectedUser(user)
                          setIsPromoteDialogOpen(true)
                        },
                        variant: "outline" as const
                      })
                    }
                    
                    // Add ban/unban action
                    if (user.banned_until) {
                      actions.push({
                        label: "Unban",
                        icon: UserCheck,
                        onClick: () => handleBanUser(user.id, false),
                        className: "bg-green-600 hover:bg-green-700 text-white"
                      })
                    } else {
                      actions.push({
                        label: "Ban",
                        icon: Ban,
                        onClick: () => handleBanUser(user.id, true),
                        variant: "destructive" as const
                      })
                    }
                    
                    // Add delete action
                    actions.push({
                      label: "Delete",
                      icon: UserX,
                      onClick: () => handleDeleteUser(user.id),
                      variant: "destructive" as const
                    })
                    
                    const badges = []
                    if (user.banned_until) {
                      badges.push({
                        label: "Banned",
                        variant: "destructive" as const
                      })
                    }
                    
                    return (
                      <AdminActionCard
                        key={user.id}
                        title={user.user_metadata?.full_name || 'Unnamed User'}
                        description={user.email}
                        icon={user.email_confirmed_at ? CheckCircle : Mail}
                        badges={badges}
                        actions={actions}
                        metadata={`Joined ${new Date(user.created_at).toLocaleDateString()}`}
                        isProblematic={!!user.banned_until}
                      />
                    )
                  })
                ) : (
                  <AdminEmptyState
                    title="No Users Found"
                    description="No users match your search criteria."
                    emoji="👥"
                  />
                )}  
              </div>           
            
            {/* Pagination */}
            {hasMore && (
              <div className="flex justify-center">
                <Button
                  onClick={() => setPage(p => p + 1)}
                  variant="outline"
                  className="glass-button"
                >
                  Load More Users
                </Button>
              </div>
            )}
            </div>
          </TabsContent>

          <TabsContent value="admins" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Administrative Users</h2>
                <p className="text-slate-600 dark:text-slate-300">Manage admin privileges and permissions</p>
              </div>
              <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300">
                <Crown className="h-3 w-3 mr-1" />
                {adminUsers.length} Administrators
              </Badge>
            </div>

            <div className="grid gap-4">
              {adminUsers.map((adminUser) => (
                <AdminActionCard
                  key={adminUser.id}
                  title={adminUser.user?.user_metadata?.full_name || 'Admin User'}
                  description={adminUser.user?.email || 'No email available'}
                  icon={Crown}
                  badges={[
                    {
                      label: adminUser.role === 'super_admin' ? 'Super Admin' : adminUser.role,
                      className: adminUser.role === 'super_admin' 
                        ? "bg-gradient-to-r from-red-600 to-orange-600 text-white border-0" 
                        : "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"
                    },
                    ...(adminUser.gamification_role ? [{
                      label: adminUser.gamification_role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                      className: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0"
                    }] : [])
                  ]}
                  actions={[
                    {
                      label: "Revoke Access",
                      icon: UserX,
                      onClick: () => handleRevokeAdmin(adminUser.id),
                      variant: "outline"
                    },
                    {
                      label: "Manage Access",
                      icon: Settings,
                      onClick: () => openManageAccess(adminUser),
                    }
                  ]}
                  metadata={`Admin since ${new Date(adminUser.created_at).toLocaleDateString()}`}
                />
              ))}
              
              {adminUsers.length === 0 && (
                <AdminEmptyState
                  title="No Admin Users"
                  description="No administrative users have been configured yet."
                  emoji="👑"
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Custom Roles</h2>
                <p className="text-slate-600 dark:text-slate-300">Create and manage custom roles with specific permissions</p>
              </div>
              <Dialog open={showCreateRoleDialog} onOpenChange={setShowCreateRoleDialog}>
                <Button onClick={() => setShowCreateRoleDialog(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom Role
                </Button>
                <DialogContent className="glass-card border border-white/20 dark:border-white/10 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Create Custom Role
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Role Name (lowercase, underscores)</Label>
                      <Input
                        placeholder="content_manager"
                        value={newRole.name}
                        onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value.toLowerCase().replace(/\s+/g, "_") }))}
                      />
                    </div>
                    <div>
                      <Label>Display Name</Label>
                      <Input
                        placeholder="Content Manager"
                        value={newRole.display_name}
                        onChange={(e) => setNewRole(prev => ({ ...prev, display_name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Manages all content across the platform"
                        value={newRole.description}
                        onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label className="mb-4 block">Permissions</Label>
                      <div className="space-y-3 max-h-64 overflow-y-auto p-2 border rounded glass-card">
                        {AVAILABLE_PERMISSIONS.map(perm => (
                          <div key={perm.key} className="flex items-start space-x-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                            <Checkbox
                              checked={newRole.permissions[perm.key] || false}
                              onCheckedChange={() => toggleRolePermission(perm.key)}
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{perm.label}</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">{perm.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowCreateRoleDialog(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCreateRole} 
                        disabled={processing || !newRole.name || !newRole.display_name}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Role
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {loading ? (
                <AdminLoading message="Loading roles..." />
              ) : roles.length > 0 ? (
                roles.map((role) => (
                  <Card key={role.id} className="glass-card border border-white/20 dark:border-white/10">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <CardTitle>{role.display_name}</CardTitle>
                            {role.is_system_role && (
                              <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800">System Role</Badge>
                            )}
                          </div>
                          <CardDescription className="mt-2">{role.description}</CardDescription>
                        </div>
                        {!role.is_system_role && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteRole(role.id, role.display_name)}
                            disabled={processing}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <h4 className="font-semibold mb-2 text-sm text-slate-700 dark:text-slate-300">Permissions:</h4>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(role.permissions || {}).map(([key, value]) => 
                            value && (
                              <Badge key={key} variant="secondary" className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                                {AVAILABLE_PERMISSIONS.find(p => p.key === key)?.label || key}
                              </Badge>
                            )
                          )}
                          {Object.keys(role.permissions || {}).filter(k => role.permissions[k]).length === 0 && (
                            <span className="text-sm text-slate-500 dark:text-slate-400">No permissions assigned</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <AdminEmptyState
                  title="No Custom Roles"
                  description="Create custom roles to assign specific permissions to users."
                  emoji="🛡️"
                />
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Enhanced Promote Dialog */}
        <Dialog open={isPromoteDialogOpen} onOpenChange={setIsPromoteDialogOpen}>
          <DialogContent className="glass-card border border-white/20 dark:border-white/10 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Promote User to Admin
              </DialogTitle>
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
              <div>
                <Label>Gamification Role (Optional)</Label>
                <Select value={newGamificationRole || 'none'} onValueChange={(val) => setNewGamificationRole(val === 'none' ? null : val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="content-curator">🎯 Content Curator</SelectItem>
                    <SelectItem value="community-moderator">👥 Community Moderator</SelectItem>
                    <SelectItem value="tech-support">🛠️ Tech Support</SelectItem>
                    <SelectItem value="campus-ambassador">🎓 Campus Ambassador</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Displays on profile and leaderboard alongside earned level
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsPromoteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePromoteToAdmin} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Crown className="h-4 w-4 mr-1" />
                  Promote to Admin
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Manage Access Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="glass-card border border-white/20 dark:border-white/10 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Manage Admin Access
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>User</Label>
                <Input value={editingAdmin?.user?.email || ''} disabled />
              </div>
              <div>
                <Label>Role</Label>
                <Select value={editRole} onValueChange={handleRoleChangeInEdit}>
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
                <Label>Permissions</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {PERMISSION_OPTIONS.map((perm) => (
                    <label key={perm} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={editPermissions.includes(perm)}
                        onCheckedChange={() => togglePermission(perm)}
                      />
                      <span className="capitalize">{perm.replaceAll('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label>Gamification Role</Label>
                <Select value={editGamificationRole || 'none'} onValueChange={(val) => setEditGamificationRole(val === 'none' ? null : val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="content-curator">🎯 Content Curator</SelectItem>
                    <SelectItem value="community-moderator">👥 Community Moderator</SelectItem>
                    <SelectItem value="tech-support">🛠️ Tech Support</SelectItem>
                    <SelectItem value="campus-ambassador">🎓 Campus Ambassador</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Shows in profile, leaderboard, and badges
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateAccess} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  )
}
