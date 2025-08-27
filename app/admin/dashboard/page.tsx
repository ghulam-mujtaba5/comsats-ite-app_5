"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
  const [adminRole, setAdminRole] = useState<string | null>(null)
  const [statsError, setStatsError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
    fetchHealth()
    fetchAdminRole()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats')
      if (!response.ok) {
        const msg = `HTTP ${response.status}`
        setStatsError(msg)
      } else {
        const data = await response.json()
        setStatsError(null)
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      setStatsError('Failed to fetch')
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

  // Fetch current admin role for RBAC-aware UI
  const fetchAdminRole = async () => {
    try {
      const res = await fetch('/api/admin/session', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json().catch(() => null)
        if (data && typeof data.role === 'string') {
          setAdminRole(data.role)
        } else {
          setAdminRole(null)
        }
      } else {
        setAdminRole(null)
      }
    } catch {
      setAdminRole(null)
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
      color: "text-primary",
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

  const roleAllows = (roles?: string[]) => {
    if (!roles || roles.length === 0) return true
    return !!adminRole && roles.includes(adminRole)
  }

  const quickActions: Array<{ label: string; href: string; roles?: string[] }> = [
    { label: "📰 Create News Article", href: "/admin/news-events", roles: ["super_admin", "admin", "content"] },
    { label: "📅 Add New Event", href: "/admin/news-events", roles: ["super_admin", "admin", "content"] },
    { label: "📚 Add Guidance Content", href: "/admin/guidance", roles: ["super_admin", "admin", "content"] },
    { label: "🆘 Manage Support Resources", href: "/admin/student-support", roles: ["super_admin", "admin", "support"] },
    { label: "👥 Manage Users", href: "/admin/users", roles: ["super_admin", "admin", "support"] },
    { label: "🧹 Review Moderation Queue", href: "/admin/reviews", roles: ["super_admin", "admin", "moderator"] },
  ]

  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8 fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage all aspects of the CampusAxis portal
          </p>
          {statsError && (
            <div role="alert" className="mt-3 text-sm text-destructive">
              Failed to load KPI stats: {statsError}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8" aria-live="polite">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={`sk-${i}`} className="slide-up">
                <div className="skeleton p-5 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="sk-line w-24 rounded" />
                    <div className="loader-ring sm" />
                  </div>
                  <div className="sk-title w-20 rounded mb-2" />
                  <div className="sk-line w-32 rounded" />
                </div>
              </div>
            ))
          ) : (
            statCards.map((card) => {
              const Icon = card.icon
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  aria-label={`${card.title} — ${card.description}`}
                  className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md slide-up"
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer interactive hover-lift">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {card.title}
                      </CardTitle>
                      <Icon className={`h-4 w-4 ${card.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{statsError ? "—" : card.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {card.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2" aria-live="polite">
          <Card className="slide-up">
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

          <Card className="slide-up">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2" aria-live="polite">
                {quickActions.filter(q => roleAllows(q.roles)).map((qa) => (
                  <Link
                    key={qa.href + qa.label}
                    href={qa.href}
                    className="block p-2 rounded hover:bg-accent transition-colors interactive hover-lift focus-visible:ring-2 focus-visible:ring-ring outline-none"
                  >
                    {qa.label}
                  </Link>
                ))}
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
              <div className="grid gap-4 md:grid-cols-2" aria-live="polite">
                <div>
                  <div className="text-sm font-semibold">Timetable (Postgres)</div>
                  {loadingHealth ? (
                    <div className="text-sm text-muted-foreground">Loading...</div>
                  ) : health.timetable?.ok ? (
                    <div className="text-sm text-green-600">OK {typeof health.timetable?.timetable?.count === 'number' ? `(rows: ${health.timetable.timetable.count})` : ''}</div>
                  ) : (
                    <div className="text-sm text-destructive" role="alert">{health.timetable?.error || 'Not OK'}</div>
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
                    <div className="text-sm text-destructive" role="alert">{health.mongo?.error || 'Not OK'}</div>
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
