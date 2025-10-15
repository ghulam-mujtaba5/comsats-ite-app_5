"use client"

import { useState, useEffect } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, 
  Mail, 
  Send, 
  Calendar, 
  User, 
  Users, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Plus,
  Search,
  Filter,
  RefreshCw
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface BatchNotification {
  id: string
  name: string
  description: string
  recipients: string[]
  notification_template: {
    title: string
    message: string
    type: string
    related_id?: string
    related_type?: string
    metadata?: Record<string, any>
  }
  email_template?: {
    subject: string
    html: string
  }
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  scheduled_for: string
  started_at?: string
  completed_at?: string
  failed_at?: string
  error_message?: string
  progress: number
  total_recipients: number
  processed_recipients: number
  created_by: string
  created_at: string
  updated_at: string
}

export default function AdminNotificationsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [batchNotifications, setBatchNotifications] = useState<BatchNotification[]>([])
  const [selectedBatch, setSelectedBatch] = useState<BatchNotification | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  
  // Form state for creating batch notifications
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    recipients: [] as string[],
    notification_template: {
      title: "",
      message: "",
      type: "announcement"
    },
    email_template: {
      subject: "",
      html: ""
    },
    scheduled_for: new Date().toISOString().slice(0, 16),
    send_email: false
  })

  useEffect(() => {
    fetchBatchNotifications()
  }, [])

  const fetchBatchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications/batch')
      if (response.ok) {
        const data = await response.json()
        setBatchNotifications(data.batch_notifications)
      } else {
        throw new Error('Failed to fetch batch notifications')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch batch notifications",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const createBatchNotification = async () => {
    try {
      const payload: any = {
        name: formData.name,
        description: formData.description,
        recipients: formData.recipients,
        notification_template: formData.notification_template,
        scheduled_for: formData.scheduled_for
      }

      if (formData.send_email) {
        payload.email_template = formData.email_template
      }

      const response = await fetch('/api/notifications/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Batch notification created successfully"
        })
        setIsCreating(false)
        setFormData({
          name: "",
          description: "",
          recipients: [],
          notification_template: {
            title: "",
            message: "",
            type: "announcement"
          },
          email_template: {
            subject: "",
            html: ""
          },
          scheduled_for: new Date().toISOString().slice(0, 16),
          send_email: false
        })
        fetchBatchNotifications()
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create batch notification')
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create batch notification",
        variant: "destructive"
      })
    }
  }

  const processBatchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications/batch/process', {
        method: 'POST'
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Batch notifications processing started"
        })
        fetchBatchNotifications()
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Failed to process batch notifications')
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process batch notifications",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><RefreshCw className="h-3 w-3 mr-1 animate-spin" />Processing</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>
    }
  }

  const filteredNotifications = batchNotifications.filter(notification => {
    const matchesSearch = notification.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          notification.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || notification.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notification Management</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  Manage batch notifications and system alerts
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={processBatchNotifications} className="bg-green-600 hover:bg-green-700">
                  <Play className="h-4 w-4 mr-2" />
                  Process Notifications
                </Button>
                <Button onClick={() => setIsCreating(true)} className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Batch
                </Button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search batch notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={fetchBatchNotifications}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Batch Notifications List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Batch Notifications</CardTitle>
                  <CardDescription>
                    Manage scheduled and historical batch notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : filteredNotifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">No batch notifications found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredNotifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className="p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                          onClick={() => setSelectedBatch(notification)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-slate-900 dark:text-white">{notification.name}</h3>
                                {getStatusBadge(notification.status)}
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                {notification.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {notification.recipients.length} recipients
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(notification.scheduled_for), 'MMM d, yyyy h:mm a')}
                                </span>
                                {notification.progress > 0 && (
                                  <span>
                                    {notification.progress}% complete
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Details Panel */}
            <div>
              {selectedBatch ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{selectedBatch.name}</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedBatch(null)}
                      >
                        ✕
                      </Button>
                    </div>
                    <CardDescription>
                      Batch notification details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <div className="mt-1">
                        {getStatusBadge(selectedBatch.status)}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {selectedBatch.description}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Recipients</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {selectedBatch.recipients.length} users
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Notification Template</Label>
                      <div className="mt-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="font-medium text-sm">{selectedBatch.notification_template.title}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {selectedBatch.notification_template.message}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Scheduled For</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {format(new Date(selectedBatch.scheduled_for), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>

                    {selectedBatch.started_at && (
                      <div>
                        <Label className="text-sm font-medium">Started At</Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {format(new Date(selectedBatch.started_at), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    )}

                    {selectedBatch.completed_at && (
                      <div>
                        <Label className="text-sm font-medium">Completed At</Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {format(new Date(selectedBatch.completed_at), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    )}

                    {selectedBatch.failed_at && (
                      <div>
                        <Label className="text-sm font-medium">Failed At</Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {format(new Date(selectedBatch.failed_at), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    )}

                    {selectedBatch.error_message && (
                      <div>
                        <Label className="text-sm font-medium">Error</Label>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {selectedBatch.error_message}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Management</CardTitle>
                    <CardDescription>
                      Select a batch notification to view details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">
                        Select a batch notification from the list to view its details
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Create Batch Notification Modal */}
          {isCreating && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Create Batch Notification
                    </h2>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setIsCreating(false)}
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="name">Batch Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g., Weekly Update"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Description of this batch notification"
                      />
                    </div>

                    <div>
                      <Label htmlFor="recipients">Recipients (User IDs, comma separated)</Label>
                      <Textarea
                        id="recipients"
                        value={formData.recipients.join(', ')}
                        onChange={(e) => setFormData({...formData, recipients: e.target.value.split(',').map(id => id.trim()).filter(id => id)})}
                        placeholder="user-id-1, user-id-2, user-id-3"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Notification Title</Label>
                        <Input
                          id="title"
                          value={formData.notification_template.title}
                          onChange={(e) => setFormData({
                            ...formData, 
                            notification_template: {
                              ...formData.notification_template,
                              title: e.target.value
                            }
                          })}
                          placeholder="Notification title"
                        />
                      </div>

                      <div>
                        <Label htmlFor="type">Notification Type</Label>
                        <Select 
                          value={formData.notification_template.type}
                          onValueChange={(value) => setFormData({
                            ...formData, 
                            notification_template: {
                              ...formData.notification_template,
                              type: value
                            }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="announcement">Announcement</SelectItem>
                            <SelectItem value="maintenance_scheduled">Maintenance Scheduled</SelectItem>
                            <SelectItem value="new_feature">New Feature</SelectItem>
                            <SelectItem value="achievement_unlocked">Achievement Unlocked</SelectItem>
                            <SelectItem value="review_approved">Review Approved</SelectItem>
                            <SelectItem value="resource_approved">Resource Approved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Notification Message</Label>
                      <Textarea
                        id="message"
                        value={formData.notification_template.message}
                        onChange={(e) => setFormData({
                          ...formData, 
                          notification_template: {
                            ...formData.notification_template,
                            message: e.target.value
                          }
                        })}
                        placeholder="Notification message content"
                        rows={3}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Send Email Notification
                        </Label>
                        <Switch
                          checked={formData.send_email}
                          onCheckedChange={(checked) => setFormData({...formData, send_email: checked})}
                        />
                      </div>
                      {formData.send_email && (
                        <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div>
                            <Label htmlFor="subject">Email Subject</Label>
                            <Input
                              id="subject"
                              value={formData.email_template.subject}
                              onChange={(e) => setFormData({
                                ...formData, 
                                email_template: {
                                  ...formData.email_template,
                                  subject: e.target.value
                                }
                              })}
                              placeholder="Email subject"
                            />
                          </div>

                          <div>
                            <Label htmlFor="html">Email HTML Content</Label>
                            <Textarea
                              id="html"
                              value={formData.email_template.html}
                              onChange={(e) => setFormData({
                                ...formData, 
                                email_template: {
                                  ...formData.email_template,
                                  html: e.target.value
                                }
                              })}
                              placeholder="Email HTML content (use {userName} for user name)"
                              rows={4}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="scheduled_for">Schedule For</Label>
                      <Input
                        id="scheduled_for"
                        type="datetime-local"
                        value={formData.scheduled_for}
                        onChange={(e) => setFormData({...formData, scheduled_for: e.target.value})}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button 
                        onClick={createBatchNotification}
                        className="flex-1"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Create Batch Notification
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setIsCreating(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  )
}