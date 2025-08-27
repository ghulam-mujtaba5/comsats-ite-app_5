"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, Library, MessageSquare, GraduationCap, Search } from "lucide-react"

interface DashboardStats {
  totalUsers: number;
  totalFaculty: number;
  totalReviews: number;
  totalResources: number;
}

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
        <div className="min-h-screen flex items-center justify-center p-6 text-center space-y-3">
          <div>
            <h1 className="text-2xl font-bold">Admin access required</h1>
            <p className="text-muted-foreground">Go to the admin login page to continue.</p>
            <Link href="/admin/login" className="text-primary underline">Admin Login</Link>
          </div>
        </div>
      }
    >
      <div className="app-container section space-y-8 fade-in" role="main" aria-labelledby="admin-landing-heading">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 id="admin-landing-heading" className="text-3xl font-bold text-balance">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Admin!</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/dashboard" className="hidden sm:inline-block">
              <Button variant="outline" className="interactive hover-lift" aria-label="View full analytics dashboard">
                View Dashboard
              </Button>
            </Link>
            <Link href="/admin/users" className="hidden sm:inline-block">
              <Button className="interactive hover-lift" aria-label="Go to User Management">
                Go to Users
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={async () => {
                await fetch('/api/admin/session/admin-logout', { method: 'POST' })
                router.replace('/admin/auth')
              }}
            >
              Admin Logout
            </Button>
            <Button
              variant="secondary"
              onClick={async () => {
                await fetch('/api/admin/session', { method: 'DELETE' })
                router.replace('/auth')
              }}
            >
              Sign out
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card variant="elevated" className="slide-up transition-shadow interactive hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats?.totalUsers ?? 'N/A'}</div>
            </CardContent>
          </Card>
          <Card variant="elevated" className="slide-up transition-shadow interactive hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats?.totalFaculty ?? 'N/A'}</div>
            </CardContent>
          </Card>
          <Card variant="elevated" className="slide-up transition-shadow interactive hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats?.totalReviews ?? 'N/A'}</div>
            </CardContent>
          </Card>
          <Card variant="elevated" className="slide-up transition-shadow interactive hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
              <Library className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats?.totalResources ?? 'N/A'}</div>
            </CardContent>
          </Card>
        </div>

        {/* Management Links */}
        <div>
          <div className="flex items-end justify-between gap-4 mb-3">
            <h2 className="text-2xl font-semibold">Management Sections</h2>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={linkQuery}
                onChange={(e) => setLinkQuery(e.target.value)}
                placeholder="Search sections..."
                className="pl-9"
                aria-label="Search management sections"
              />
            </div>
          </div>

          {/* Management Links Data */}
          {(() => {
            const links = [
              { href: "/admin/dashboard", title: "📊 Dashboard", desc: "View comprehensive stats and analytics." },
              { href: "/admin/lost-found", title: "🔍 Lost & Found", desc: "Manage lost and found items." },
              { href: "/admin/news-events", title: "📰 News & Events", desc: "Create and manage news and events." },
              { href: "/admin/support", title: "❤️ Student Support", desc: "Manage support resources and requests." },
              { href: "/admin/guidance", title: "📚 Guidance Portal", desc: "Manage guides, policies, and FAQs." },
              { href: "/admin/faculty", title: "👨‍🏫 Faculty", desc: "Add, edit, and manage faculty members." },
              { href: "/admin/community", title: "💬 Community", desc: "Manage student community posts." },
              { href: "/admin/users", title: "👥 Users", desc: "Manage user accounts and permissions." },
              { href: "/admin/moderation", title: "🛡️ Content Moderation", desc: "Moderate posts, comments, and reports." },
              { href: "/admin/reviews", title: "📝 Review Moderation", desc: "Approve or reject faculty reviews." },
              { href: "/admin/past-papers", title: "📄 Past Papers Moderation", desc: "Approve/reject submitted past papers." },
              { href: "/admin/resources", title: "📁 Resources", desc: "Manage downloadable resources and files." },
              { href: "/admin/timetable-docs", title: "📅 Timetable PDFs", desc: "Upload and manage official timetable PDF files." },
              { href: "/admin/issues", title: "🐞 Issues", desc: "Review public reports and update their status." },
              { href: "/admin/settings", title: "⚙️ Site Settings", desc: "Configure site-wide settings and preferences." },
            ] as const

            const q = linkQuery.trim().toLowerCase()
            const filtered = q
              ? links.filter(l => `${l.title} ${l.desc}`.toLowerCase().includes(q))
              : links

            return (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
                {filtered.map((l, idx) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block surface-soft rounded-lg p-5 hover:surface transition-all hover-lift slide-up outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    style={{ animationDelay: `${Math.min(idx, 6) * 40}ms` as any }}
                    aria-label={`${l.title} — ${l.desc}`}
                  >
                    <h3 className="text-xl font-semibold">{l.title}</h3>
                    <p className="text-muted-foreground">{l.desc}</p>
                  </Link>
                ))}
                {filtered.length === 0 && (
                  <Card variant="soft" className="p-8 text-center sm:col-span-2 lg:col-span-3">
                    <div className="text-muted-foreground">No sections match “{linkQuery}”.</div>
                  </Card>
                )}
              </div>
            )
          })()}
        </div>
      </div>
    </AdminGuard>
  )
}
