"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, Library, MessageSquare, GraduationCap, Search, Sparkles, Crown, Zap, Activity, BarChart3, Settings, LogOut } from "lucide-react"

interface DashboardStats {
  totalUsers: number;
  totalFaculty: number;
  totalReviews: number;
  totalResources: number;
}

import styles from "./admin-shared.module.css"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [linkQuery, setLinkQuery] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/dashboard-stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <AdminGuard
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20">
          <div className="flex items-center justify-center min-h-screen p-6">
            <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-8 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 text-center space-y-4 max-w-md">
              <div className="relative mx-auto w-16 h-16 mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-xl opacity-30 animate-pulse" />
                <div className="relative bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-2xl">
                  <Crown className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  Admin Access Required
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">
                  Elevated privileges needed to access this portal
                </p>
                <Link href="/admin/login" className="inline-block mt-4">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    Access Admin Portal
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10 dark:from-slate-950 dark:via-slate-900/20 dark:to-slate-900/10">
        {/* Enhanced Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5 backdrop-blur-2xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
          
          <div className={`relative ${styles.section} px-6 lg:px-10 pt-12 pb-8`}>
            <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
                      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
                        <Crown className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 id="admin-landing-heading" className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                        Administrative Hub
                      </h1>
                      <p className="text-slate-600 dark:text-slate-300 text-lg mt-1">
                        Complete control and oversight of the CampusAxis platform
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-blue-200 dark:border-blue-800">
                      <Activity className="h-3 w-3 mr-1" />
                      Platform Active
                    </Badge>
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-green-200 dark:border-green-800">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Admin Privileges
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/admin/dashboard">
                    <Button variant="outline" className="glass-button bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border-white/40 dark:border-slate-600/40 hover:bg-white/50 dark:hover:bg-slate-700/50 w-full sm:w-auto">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Full Dashboard
                    </Button>
                  </Link>
                  <Link href="/admin/users">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                  </Link>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="glass-button flex-1 sm:flex-none"
                      onClick={async () => {
                        await fetch('/api/admin/session/admin-logout', { method: 'POST' })
                        router.replace('/admin/auth')
                      }}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Admin Logout
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        await fetch('/api/admin/session', { method: 'DELETE' })
                        router.replace('/auth')
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview removed and moved to Analytics Dashboard */}

        {/* Enhanced Management Grid */}
        {(() => {
          interface LinkItem {
            href: string;
            title: string;
            desc: string;
            priority: 'high' | 'medium' | 'low';
          }

          const links: LinkItem[] = [
          { href: "/admin/dashboard", title: "📊 Analytics Dashboard", desc: "Comprehensive stats, insights and system health monitoring.", priority: "high" },
          { href: "/admin/users", title: "👥 User Management", desc: "Manage accounts, permissions and user authentication.", priority: "high" },
          { href: "/admin/emails", title: "📧 Email Management", desc: "Manage user email addresses and verification.", priority: "high" },
          { href: "/admin/moderation", title: "🛡️ Content Moderation", desc: "Review posts, comments and handle user reports.", priority: "high" },
          { href: "/admin/faculty-pending", title: "✅ Pending Faculty", desc: "Review and approve student-submitted faculty members.", priority: "high" },
          { href: "/admin/blog", title: "📝 Blog Management", desc: "Create, edit, and manage blog articles and posts.", priority: "high" },
          { href: "/admin/admissions/moderation", title: "🎓 Admissions Moderation", desc: "Review and moderate admissions-related content.", priority: "medium" },
          { href: "/admin/news-events", title: "📰 News & Events", desc: "Create and manage campus announcements and events.", priority: "medium" },
          { href: "/admin/faq", title: "❓ FAQ Management", desc: "Create, edit, and manage frequently asked questions.", priority: "medium" },
          { href: "/admin/faculty", title: "👨‍🏫 Faculty Directory", desc: "Add, edit and manage faculty member profiles.", priority: "medium" },
          { href: "/admin/past-papers", title: "📄 Academic Resources", desc: "Approve and manage submitted past papers.", priority: "medium" },
          { href: "/admin/community", title: "💬 Community Hub", desc: "Oversee student discussions and forum activity.", priority: "medium" },
          { href: "/admin/support", title: "❤️ Student Support", desc: "Manage support resources and assistance requests.", priority: "medium" },
          { href: "/admin/guidance", title: "📚 Guidance Portal", desc: "Maintain guides, policies and student resources.", priority: "low" },
          { href: "/admin/lost-found", title: "🔍 Lost & Found", desc: "Manage campus lost and found item reports.", priority: "low" },
          { href: "/admin/reviews", title: "📝 Faculty Reviews", desc: "Moderate and approve faculty review submissions.", priority: "low" },
          { href: "/admin/resources", title: "📁 File Resources", desc: "Manage downloadable files and study materials.", priority: "low" },
          { href: "/admin/timetable-docs", title: "📅 Timetable Management", desc: "Upload and organize official timetable documents.", priority: "low" },
          { href: "/admin/issues", title: "🐞 Issue Tracking", desc: "Review public reports and track resolution status.", priority: "low" },
          { href: "/admin/settings", title: "⚙️ System Settings", desc: "Configure platform settings and preferences.", priority: "low" },
          ]

          const q = linkQuery.trim().toLowerCase()
          const filtered = q
            ? links.filter(l => `${l.title} ${l.desc}`.toLowerCase().includes(q))
            : links

          const priorityOrder: Record<'high' | 'medium' | 'low', number> = { high: 0, medium: 1, low: 2 }
          const sorted = filtered.sort((a: LinkItem, b: LinkItem) => priorityOrder[a.priority] - priorityOrder[b.priority])

          return (
            <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${styles.section} px-6 lg:px-10`} aria-live="polite">
              {sorted.map((l: LinkItem, idx: number) => {
                const isHighPriority = l.priority === 'high'
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`group block outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${
                      isHighPriority ? 'order-first' : ''
                    }`}
                    style={{ animationDelay: `${Math.min(idx, 8) * 50}ms` as any }}
                    aria-label={`${l.title} — ${l.desc}`}
                  >
                    <Card className={`relative overflow-hidden border-0 h-full transition-all duration-300 group-hover:shadow-2xl ${
                      isHighPriority 
                        ? 'bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/40 backdrop-blur-xl glass-card border border-blue-200/50 dark:border-blue-800/50 group-hover:shadow-blue-500/20'
                        : 'bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-900/40 backdrop-blur-xl glass-card border border-white/20 dark:border-white/10 group-hover:shadow-slate-500/10'
                    }`}>
                      {isHighPriority && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Priority
                          </Badge>
                        </div>
                      )}
                      
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
                      
                      <CardContent className="relative p-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h3 className={`text-xl font-bold group-hover:scale-105 transition-transform duration-300 ${
                              isHighPriority 
                                ? 'bg-gradient-to-r from-blue-800 to-indigo-800 dark:from-blue-200 dark:to-indigo-200 bg-clip-text text-transparent'
                                : 'text-slate-900 dark:text-white'
                            }`}>
                              {l.title}
                            </h3>
                          </div>
                          <p className={`text-sm leading-relaxed ${
                            isHighPriority
                              ? 'text-slate-700 dark:text-slate-200'
                              : 'text-slate-600 dark:text-slate-300'
                          }`}>
                            {l.desc}
                          </p>
                          
                          <div className="flex items-center gap-2 pt-2">
                            <div className={`w-2 h-2 rounded-full ${
                              isHighPriority ? 'bg-blue-500' : 'bg-green-500'
                            } group-hover:scale-125 transition-transform duration-300`} />
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">
                              {l.priority} Priority
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
              {filtered.length === 0 && (
                <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 p-8 text-center sm:col-span-2 lg:col-span-3">
                  <div className="space-y-2">
                    <div className="text-2xl">🔍</div>
                    <div className="text-slate-600 dark:text-slate-300">No management tools match "{linkQuery}"</div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Try a different search term or browse all available tools.</p>
                  </div>
                </Card>
              )}
            </div>
          )
        })()}
      </div>
    </AdminGuard>
  )
}
