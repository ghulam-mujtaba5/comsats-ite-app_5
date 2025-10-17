"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import adminStyles from "@/app/admin/admin-shared.module.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Activity, TrendingUp, Users, Calendar, Filter } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ActivityLog {
  id: string
  action: string
  resource_type: string
  resource_id: string
  user_id: string
  ip_address?: string
  user_agent?: string
  metadata?: any
  created_at: string
  user: {
    email: string
    full_name?: string
  }
}

interface Analytics {
  total_activities: number
  unique_users: number
  period_start: string
  period_end: string
  top_users: Array<{
    user_id: string
    email: string
    full_name?: string
    activity_count: number
  }>
  timeline: Array<{
    date: string
    count: number
  }>
  by_action: Record<string, number>
  by_resource_type: Record<string, number>
}

const ACTIONS = [
  "create", "update", "delete", "view", "approve", "reject",
  "assign", "unassign", "login", "logout", "upload", "download"
]

const RESOURCE_TYPES = [
  "user", "role", "ticket", "email", "blog", "guidance",
  "event", "news", "faculty", "resource", "timetable"
]

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [filters, setFilters] = useState({
    action: "",
    resource_type: "",
    user_id: "",
    date_from: "",
    date_to: ""
  })
  const [analyticsConfig, setAnalyticsConfig] = useState({
    period: "week",
    start_date: "",
    end_date: ""
  })
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchLogs()
  }, [filters])

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchLogs = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams()
      if (filters.action) params.append("action", filters.action)
      if (filters.resource_type) params.append("resource_type", filters.resource_type)
      if (filters.user_id) params.append("user_id", filters.user_id)
      if (filters.date_from) params.append("date_from", filters.date_from)
      if (filters.date_to) params.append("date_to", filters.date_to)
      params.append("limit", "100")

      const response = await fetch(`/api/activity-logs?${params}`)

      if (!response.ok) throw new Error("Failed to fetch activity logs")

      const data = await response.json()
      setLogs(data.data || [])
    } catch (error) {
      console.error("Error fetching logs:", error)
      toast({
        title: "Error",
        description: "Failed to load activity logs",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true)

      const body: any = {
        period: analyticsConfig.period
      }
      if (analyticsConfig.start_date) body.start_date = analyticsConfig.start_date
      if (analyticsConfig.end_date) body.end_date = analyticsConfig.end_date

      const response = await fetch("/api/activity-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) throw new Error("Failed to fetch analytics")

      const data = await response.json()
      setAnalytics(data.data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
      toast({
        title: "Error",
        description: "Failed to load analytics",
        variant: "destructive"
      })
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      action: "",
      resource_type: "",
      user_id: "",
      date_from: "",
      date_to: ""
    })
  }

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      create: "bg-green-500",
      update: "bg-blue-500",
      delete: "bg-red-500",
      approve: "bg-green-500",
      reject: "bg-red-500",
      view: "bg-gray-500"
    }
    return colors[action] || "bg-gray-500"
  }

  return (
    <div className={`${adminStyles.section} p-6 space-y-6`}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Activity Logs</h1>
          <p className="text-muted-foreground">Monitor system activity and user actions</p>
        </div>
        <Button onClick={fetchLogs} variant="outline">
          <Loader2 className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Filters</CardTitle>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <Label>Action</Label>
                  <Select value={filters.action} onValueChange={(value) => handleFilterChange("action", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Actions</SelectItem>
                      {ACTIONS.map(action => (
                        <SelectItem key={action} value={action}>{action.toUpperCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Resource Type</Label>
                  <Select value={filters.resource_type} onValueChange={(value) => handleFilterChange("resource_type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      {RESOURCE_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type.toUpperCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>User Email</Label>
                  <Input
                    placeholder="Filter by email"
                    value={filters.user_id}
                    onChange={(e) => handleFilterChange("user_id", e.target.value)}
                  />
                </div>
                <div>
                  <Label>From Date</Label>
                  <Input
                    type="date"
                    value={filters.date_from}
                    onChange={(e) => handleFilterChange("date_from", e.target.value)}
                  />
                </div>
                <div>
                  <Label>To Date</Label>
                  <Input
                    type="date"
                    value={filters.date_to}
                    onChange={(e) => handleFilterChange("date_to", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logs List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Activity className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-xl font-semibold">No activity logs found</p>
                <p className="text-muted-foreground">Try adjusting your filters</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <Card key={log.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getActionColor(log.action)}>
                            {log.action.toUpperCase()}
                          </Badge>
                          <span className="font-semibold">{log.resource_type}</span>
                          <span className="text-muted-foreground">#{log.resource_id.substring(0, 8)}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span>by <strong>{log.user.full_name || log.user.email}</strong></span>
                          {log.ip_address && <span className="ml-4">IP: {log.ip_address}</span>}
                        </div>
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <div className="mt-2 text-xs bg-gray-50 p-2 rounded">
                            <pre className="whitespace-pre-wrap">{JSON.stringify(log.metadata, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>{new Date(log.created_at).toLocaleDateString()}</div>
                        <div>{new Date(log.created_at).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Analytics Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Analytics Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Period</Label>
                  <Select value={analyticsConfig.period} onValueChange={(value) => setAnalyticsConfig(prev => ({ ...prev, period: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Start Date (optional)</Label>
                  <Input
                    type="date"
                    value={analyticsConfig.start_date}
                    onChange={(e) => setAnalyticsConfig(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>End Date (optional)</Label>
                  <Input
                    type="date"
                    value={analyticsConfig.end_date}
                    onChange={(e) => setAnalyticsConfig(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={fetchAnalytics} disabled={analyticsLoading} className="w-full">
                    {analyticsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {analyticsLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : analytics ? (
            <>
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">{analytics.total_activities}</span>
                      <Activity className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">{analytics.unique_users}</span>
                      <Users className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Period</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <div>{new Date(analytics.period_start).toLocaleDateString()}</div>
                        <div>to {new Date(analytics.period_end).toLocaleDateString()}</div>
                      </div>
                      <Calendar className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Timeline Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                  <CardDescription>Activities over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.timeline}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Users */}
              <Card>
                <CardHeader>
                  <CardTitle>Top 10 Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.top_users.map((user, index) => (
                      <div key={user.user_id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <div>
                            <p className="font-semibold">{user.full_name || user.email}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <Badge>{user.activity_count} activities</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* By Action & Resource Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Activities by Action</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={Object.entries(analytics.by_action).map(([action, count]) => ({ action, count }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="action" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Activities by Resource Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={Object.entries(analytics.by_resource_type).map(([type, count]) => ({ type, count }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <TrendingUp className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-xl font-semibold">No analytics data</p>
                <p className="text-muted-foreground">Generate analytics to view insights</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
