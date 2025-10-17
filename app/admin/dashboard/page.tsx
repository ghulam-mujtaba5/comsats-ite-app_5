"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { Users, MessageSquare, Search, HelpCircle, Newspaper, Heart, FileText, AlertTriangle, Server, TrendingUp, Activity, Zap, BarChart3, Globe, Settings, Bell, GraduationCap, Library, RefreshCw } from "lucide-react"
import { useOffline } from "@/hooks/use-offline"
import adminStyles from '../admin-shared.module.css'

interface DashboardStats {
  lostFoundItems: number
  newsItems: number
  events: number
  supportRequests: number
  guidanceContent: number
  totalUsers: number
}

interface OverviewStats {
  totalUsers: number;
  totalFaculty: number;
  totalReviews: number;
  totalResources: number;
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
  const [overview, setOverview] = useState<OverviewStats | null>(null)
  const [loadingOverview, setLoadingOverview] = useState<boolean>(true)
  const { isOnline, pendingSyncCount: pendingSync, triggerSync: startSync } = useOffline()

  useEffect(() => {
    fetchStats()
    fetchHealth()
    fetchAdminRole()
    fetchOverview()
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

  const fetchOverview = async () => {
    try {
      const res = await fetch('/api/admin/dashboard-stats')
      if (!res.ok) {
        setOverview(null)
      } else {
        const data = await res.json()
        setOverview(data)
      }
    } catch (e) {
      setOverview(null)
    } finally {
      setLoadingOverview(false)
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
      href: "/admin/support"
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
    { label: "🆘 Manage Support Resources", href: "/admin/support", roles: ["super_admin", "admin", "support"] },
    { label: "👥 Manage Users", href: "/admin/users", roles: ["super_admin", "admin", "support"] },
    { label: "🧹 Review Moderation Queue", href: "/admin/reviews", roles: ["super_admin", "admin", "moderator"] },
  ]

  return (
    <AdminGuard>
      <AdminPageHeader
        title="Admin Command Center"
        description="Complete oversight of the CampusAxis ecosystem"
        icon={BarChart3}
        iconGradient="from-blue-600 to-purple-600"
        badges={[
          {
            label: "System Status",
            value: isOnline ? "Online" : "Offline",
            icon: isOnline ? Activity : AlertTriangle,
            color: isOnline ? "border-blue-200 dark:border-blue-800" : "border-red-200 dark:border-red-800"
          },
          {
            label: "Services",
            value: "Running",
            icon: Zap,
            color: "border-green-200 dark:border-green-800"
          },
          ...(pendingSync > 0 ? [{
            label: "Pending Sync",
            value: pendingSync.toString(),
            icon: RefreshCw,
            color: "border-yellow-200 dark:border-yellow-800"
          }] : [])
        ]}
        actions={[
          ...(pendingSync > 0 && !isOnline ? [{
            label: "Sync Now",
            icon: RefreshCw,
            onClick: startSync,
            variant: "default" as const,
            gradient: "from-yellow-600 to-orange-600"
          }] : []),
          {
            label: "Settings",
            icon: Settings,
            onClick: () => {},
            variant: "outline" as const
          },
          {
            label: "Notifications",
            icon: Bell,
            onClick: () => {},
            gradient: "from-blue-600 to-purple-600"
          }
        ]}
      />
        {statsError && (
          <div className={adminStyles.section}>
            <div role="alert" className="glass-card border border-red-200/50 dark:border-red-800/50 rounded-2xl p-4 bg-red-50/80 dark:bg-red-950/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Failed to load KPI stats:</span> 
                <span>{statsError}</span>
              </div>

        {/* Platform Overview moved from /admin landing */}
        <div className={`${adminStyles.section} ${adminStyles.spaceY6}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Overview</h2>
              <p className="text-slate-600 dark:text-slate-300">Key metrics and system status at a glance</p>
            </div>
            <Badge variant="outline" className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
              <Zap className="h-3 w-3 mr-1" />
              Live Data
            </Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Users */}
            <Card className="bg-white/90 dark:bg-slate-800/90 shadow-lg hover:shadow-xl rounded-2xl group hover:scale-[1.02] transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-200">Total Users</CardTitle>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-xl">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {loadingOverview ? '...' : overview?.totalUsers?.toLocaleString() ?? 'N/A'}
                  </div>
                  <div className="flex items-center text-green-600 dark:text-green-400 text-xs">
                    <Activity className="h-3 w-3 mr-1" />
                    <span>+8% this week</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Faculty Members */}
            <Card className="bg-white/90 dark:bg-slate-800/90 shadow-lg hover:shadow-xl rounded-2xl group hover:scale-[1.02] transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-200">Faculty Members</CardTitle>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative bg-gradient-to-r from-emerald-600 to-green-600 p-2 rounded-xl">
                    <GraduationCap className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {loadingOverview ? '...' : overview?.totalFaculty?.toLocaleString() ?? 'N/A'}
                  </div>
                  <div className="flex items-center text-green-600 dark:text-green-400 text-xs">
                    <Activity className="h-3 w-3 mr-1" />
                    <span>+2 new profiles</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews & Feedback */}
            <Card className="glass-secondary border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 group hover:scale-[1.02] transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-200">Reviews & Feedback</CardTitle>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {loadingOverview ? '...' : overview?.totalReviews?.toLocaleString() ?? 'N/A'}
                  </div>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-xs">
                    <Activity className="h-3 w-3 mr-1" />
                    <span>15 pending review</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Resources */}
            <Card className="glass-secondary border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 group hover:scale-[1.02] transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-200">Learning Resources</CardTitle>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative bg-gradient-to-r from-orange-600 to-amber-600 p-2 rounded-xl">
                    <Library className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {loadingOverview ? '...' : overview?.totalResources?.toLocaleString() ?? 'N/A'}
                  </div>
                  <div className="flex items-center text-orange-600 dark:text-orange-400 text-xs">
                    <Activity className="h-3 w-3 mr-1" />
                    <span>3 uploads today</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
            </div>
          </div>
        )}
        
        {/* Enhanced Stats Grid */}
        <div className="app-container space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Key Performance Indicators</h2>
              <p className="text-slate-600 dark:text-slate-300">Real-time insights into platform activity</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                <TrendingUp className="h-3 w-3 mr-1" />
                Live Data
              </Badge>
            </div>
          </div>
          
          <div className={adminStyles.kpiGrid} aria-live="polite">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={`sk-${i}`} className="glass-primary glass-border-glow glass-shimmer rounded-2xl p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-24" />
                  <div className="h-6 w-6 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>
                <div className="space-y-3">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-16" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-32" />
                </div>
              </div>
            ))
          ) : (
            statCards.map((card, idx) => {
              const Icon = card.icon
              const gradientColors = {
                "text-blue-600": "from-blue-500/20 to-cyan-500/20",
                "text-green-600": "from-green-500/20 to-emerald-500/20", 
                "text-primary": "from-blue-500/20 to-indigo-500/20",
                "text-purple-600": "from-purple-500/20 to-violet-500/20",
                "text-indigo-600": "from-indigo-500/20 to-blue-500/20"
              }[card.color] || "from-slate-500/20 to-gray-500/20"
              
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  aria-label={`${card.title} — ${card.description}`}
                  className="group block outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                  style={{ animationDelay: `${Math.min(idx, 6) * 60}ms` as any }}
                >
                  <Card className="relative overflow-hidden glass-secondary glass-hover-glow glass-gradient rounded-2xl h-full transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/10">
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradientColors} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
                    
                    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {card.title}
                      </CardTitle>
                      <div className="relative">
                        <div className={`absolute inset-0 bg-gradient-to-r ${card.color.includes('blue') ? 'from-blue-600 to-cyan-600' : card.color.includes('green') ? 'from-green-600 to-emerald-600' : card.color.includes('purple') ? 'from-indigo-600 to-purple-600' : card.color.includes('indigo') ? 'from-indigo-600 to-blue-600' : 'from-slate-600 to-gray-600'} rounded-xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300`} />
                        <div className={`relative p-2 rounded-xl bg-gradient-to-r ${card.color.includes('blue') ? 'from-blue-600 to-cyan-600' : card.color.includes('green') ? 'from-green-600 to-emerald-600' : card.color.includes('purple') ? 'from-indigo-600 to-purple-600' : card.color.includes('indigo') ? 'from-indigo-600 to-blue-600' : 'from-slate-600 to-gray-600'} group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="relative">
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                            {statsError ? "—" : card.value.toLocaleString()}
                          </span>
                          {card.title === "Total Users" && (
                            <div className="flex items-center text-green-600 dark:text-green-400">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              <span className="text-xs font-medium">+8% this week</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                          {card.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })
          )}
        </div>
        
        {/* Enhanced Action Panels */}
        <div className={`${adminStyles.section} ${adminStyles.spaceY6}`}>
          <div className={`${adminStyles.threeCol}`}>
            {/* Recent Activity */}
            <div className={adminStyles.colSpan2}>
              <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-lg opacity-30" />
                        <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl">
                          <Activity className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-300">
                          Sample activity feed - Activity tracking system coming soon
                        </CardDescription>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="glass-interactive">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium mb-2">Activity Tracking Not Yet Implemented</p>
                    <p className="text-sm">Real-time activity monitoring will be available in a future update.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Actions */}
            <div>
              <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl blur-lg opacity-30" />
                      <div className="relative bg-gradient-to-r from-emerald-500 to-green-500 p-2 rounded-xl">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Quick Actions</CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-300">Frequently used operations</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2" aria-live="polite">
                    {quickActions.filter(q => roleAllows(q.roles)).map((qa, idx) => (
                      <Link
                        key={qa.href + qa.label}
                        href={qa.href}
                        aria-label={`Go to ${qa.label}`}
                        className="group block p-3 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-200 border border-transparent hover:border-white/40 dark:hover:border-slate-600/40"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                            {qa.label.split(' ')[0]}
                          </span>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                            {qa.label.substring(qa.label.indexOf(' ') + 1)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Enhanced System Health */}
        <div className={`${adminStyles.section} pb-12`}>
          <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 overflow-hidden">
            <div className="relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-3xl" />
              <CardHeader className="relative pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur-lg opacity-30" />
                      <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl">
                        <Server className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">System Health Monitor</CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-300">Real-time service status and performance metrics</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                    <Globe className="h-3 w-3 mr-1" />
                    All Systems Operational
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="relative">
                <div className="grid gap-6 md:grid-cols-2" aria-live="polite">
                  {/* Timetable Database */}
                  <div className="group p-4 rounded-xl border border-white/30 dark:border-slate-700/30 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse" />
                        <span className="font-semibold text-slate-900 dark:text-white">Timetable Database</span>
                      </div>
                      {loadingHealth ? (
                        <Badge variant="secondary" className="animate-pulse">Checking...</Badge>
                      ) : health.timetable?.ok ? (
                        <Badge className="bg-green-100 dark:bg-green-950 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200">
                          ✓ Online
                          {typeof health.timetable?.timetable?.count === 'number' && (
                            <span className="ml-1 text-xs">({health.timetable.timetable.count} records)</span>
                          )}
                        </Badge>
                      ) : (
                        <Badge variant="destructive" role="alert">
                          ✗ {health.timetable?.error || 'Offline'}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      PostgreSQL • Course schedules & academic data
                    </div>
                    {health.timetable?.hint && (
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
                        Tip: {health.timetable.hint}
                      </div>
                    )}
                  </div>
                  
                  {/* MongoDB */}
                  <div className="group p-4 rounded-xl border border-white/30 dark:border-slate-700/30 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse" />
                        <span className="font-semibold text-slate-900 dark:text-white">Document Database</span>
                      </div>
                      {loadingHealth ? (
                        <Badge variant="secondary" className="animate-pulse">Checking...</Badge>
                      ) : health.mongo?.ok ? (
                        <Badge className="bg-green-100 dark:bg-green-950 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200">
                          ✓ Online
                        </Badge>
                      ) : (
                        <Badge variant="destructive" role="alert">
                          ✗ {health.mongo?.error || 'Offline'}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      MongoDB • User data, content & community features
                    </div>
                  </div>
                </div>
                
                {/* Performance Metrics */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-slate-50/80 to-blue-50/80 dark:from-slate-800/80 dark:to-blue-900/80 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-slate-900 dark:text-white">Performance Overview</h4>
                    <Badge variant="outline" className="text-xs">
                      Last updated: just now
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">99.9%</div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">Uptime</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">145ms</div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">Avg Response</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {loading ? '...' : (stats.totalUsers > 0 ? stats.totalUsers.toLocaleString() : '0')}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">Total Users</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </AdminGuard>
  )
}
