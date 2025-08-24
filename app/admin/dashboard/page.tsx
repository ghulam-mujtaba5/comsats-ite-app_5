"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Users, MessageSquare, Search, HelpCircle, Newspaper, Heart, FileText, AlertTriangle, Server } from "lucide-react"

interface DashboardStats {
  lostFoundItems: number
  newsItems: number
  events: number
  supportRequests: number
  guidanceContent: number
  totalUsers: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    lostFoundItems: 0,
    newsItems: 0,
    events: 0,
    supportRequests: 0,
    guidanceContent: 0,
    totalUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [loadingHealth, setLoadingHealth] = useState(true)
  const [health, setHealth] = useState<{ timetable?: any; mongo?: any }>({})

  useEffect(() => {
    fetchStats()
    fetchHealth()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchHealth = async () => {
    try {
      const [ttRes, mgRes] = await Promise.all([
        fetch('/api/health/timetable'),
        fetch('/api/health/mongo'),
      ])
      const [tt, mg] = await Promise.all([
        ttRes.ok ? ttRes.json() : Promise.resolve({ ok: false, error: `HTTP ${ttRes.status}` }),
        mgRes.ok ? mgRes.json() : Promise.resolve({ ok: false, error: `HTTP ${mgRes.status}` }),
      ])
      setHealth({ timetable: tt, mongo: mg })
    } catch (err) {
      setHealth({ timetable: { ok: false, error: 'Failed to fetch' }, mongo: { ok: false, error: 'Failed to fetch' } })
    } finally {
      setLoadingHealth(false)
    }
  }

  const statCards = [
    {
      title: "Lost & Found Items",
      value: stats.lostFoundItems,
      description: "Active items reported",
      icon: Search,
      color: "text-blue-600",
      href: "/admin/lost-found"
    },
    {
      title: "News & Events",
      value: stats.newsItems + stats.events,
      description: "Published content",
      icon: Newspaper,
      color: "text-green-600",
      href: "/admin/news-events"
    },
    {
      title: "Support Requests",
      value: stats.supportRequests,
      description: "Student support requests",
      icon: Heart,
      color: "text-red-600",
      href: "/admin/student-support"
    },
    {
      title: "Guidance Content",
      value: stats.guidanceContent,
      description: "Published guides & FAQs",
      icon: FileText,
      color: "text-purple-600",
      href: "/admin/guidance"
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "Registered students",
      icon: Users,
      color: "text-indigo-600",
      href: "/admin/users"
    }
  ]

  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage all aspects of the CampusAxis portal
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <Card key={card.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "..." : card.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">New support request</span>
                  <Badge variant="outline">2 min ago</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lost item reported</span>
                  <Badge variant="outline">15 min ago</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Event registration</span>
                  <Badge variant="outline">1 hour ago</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <a href="/admin/news-events" className="block p-2 rounded hover:bg-accent transition-colors">
                  📰 Create News Article
                </a>
                <a href="/admin/news-events" className="block p-2 rounded hover:bg-accent transition-colors">
                  📅 Add New Event
                </a>
                <a href="/admin/guidance" className="block p-2 rounded hover:bg-accent transition-colors">
                  📚 Add Guidance Content
                </a>
                <a href="/admin/student-support" className="block p-2 rounded hover:bg-accent transition-colors">
                  🆘 Manage Support Resources
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <div className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-sm font-semibold">Timetable (Postgres)</div>
                  {loadingHealth ? (
                    <div className="text-sm text-muted-foreground">Loading...</div>
                  ) : health.timetable?.ok ? (
                    <div className="text-sm text-green-600">OK {typeof health.timetable?.timetable?.count === 'number' ? `(rows: ${health.timetable.timetable.count})` : ''}</div>
                  ) : (
                    <div className="text-sm text-red-600">{health.timetable?.error || 'Not OK'}</div>
                  )}
                  {health.timetable?.hint && (
                    <div className="text-xs text-muted-foreground mt-1">Hint: {health.timetable.hint}</div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold">MongoDB</div>
                  {loadingHealth ? (
                    <div className="text-sm text-muted-foreground">Loading...</div>
                  ) : health.mongo?.ok ? (
                    <div className="text-sm text-green-600">OK</div>
                  ) : (
                    <div className="text-sm text-red-600">{health.mongo?.error || 'Not OK'}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGuard>
  )
}
