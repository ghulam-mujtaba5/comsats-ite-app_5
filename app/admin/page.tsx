"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Library, MessageSquare, GraduationCap } from "lucide-react"

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
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Admin!</p>
          </div>
          <Button
            variant="outline"
            onClick={async () => {
              await fetch('/api/admin/session', { method: 'DELETE' })
              router.replace('/admin/login')
            }}
          >
            Logout
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats?.totalUsers ?? 'N/A'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats?.totalFaculty ?? 'N/A'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats?.totalReviews ?? 'N/A'}</div>
            </CardContent>
          </Card>
          <Card>
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
          <h2 className="text-2xl font-semibold mb-4">Management Sections</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/admin/dashboard" className="block border rounded-lg p-5 hover:bg-accent">
              <h3 className="text-xl font-semibold">📊 Dashboard</h3>
              <p className="text-muted-foreground">View comprehensive stats and analytics.</p>
            </Link>
            <Link href="/admin/lost-found" className="block border rounded-lg p-5 hover:bg-accent">
              <h3 className="text-xl font-semibold">🔍 Lost & Found</h3>
              <p className="text-muted-foreground">Manage lost and found items.</p>
            </Link>
            <Link href="/admin/news-events" className="block border rounded-lg p-5 hover:bg-accent">
              <h3 className="text-xl font-semibold">📰 News & Events</h3>
              <p className="text-muted-foreground">Create and manage news and events.</p>
            </Link>
            <Link href="/admin/student-support" className="block border rounded-lg p-5 hover:bg-accent">
              <h3 className="text-xl font-semibold">❤️ Student Support</h3>
              <p className="text-muted-foreground">Manage support resources and requests.</p>
            </Link>
            <Link href="/admin/guidance" className="block border rounded-lg p-5 hover:bg-accent">
              <h3 className="text-xl font-semibold">📚 Guidance Portal</h3>
              <p className="text-muted-foreground">Manage guides, policies, and FAQs.</p>
            </Link>
            <Link href="/admin/faculty" className="block border rounded-lg p-5 hover:bg-accent">
              <h3 className="text-xl font-semibold">👨‍🏫 Faculty</h3>
              <p className="text-muted-foreground">Add, edit, and manage faculty members.</p>
            </Link>
            <Link href="/admin/faculty/seed" className="block border rounded-lg p-5 hover:bg-accent">
              <h3 className="text-xl font-semibold">🌱 Seed Faculty</h3>
              <p className="text-muted-foreground">Quickly upsert faculty by ID to resolve profile 404s.</p>
            </Link>
            <Link href="/admin/community" className="block border rounded-lg p-5 hover:bg-accent">
              <h3 className="text-xl font-semibold">💬 Community</h3>
              <p className="text-muted-foreground">Manage student community posts.</p>
            </Link>
            <Link href="/admin/users" className="block border rounded-lg p-5 hover:bg-accent">
              <h3 className="text-xl font-semibold">👥 Users</h3>
              <p className="text-muted-foreground">Manage user accounts and permissions.</p>
            </Link>
            <Link href="/admin/moderation" className="block border rounded-lg p-5 hover:bg-accent">
              <h3 className="text-xl font-semibold">🛡️ Content Moderation</h3>
              <p className="text-muted-foreground">Moderate posts, comments, and reports.</p>
            </Link>
            <Link href="/admin/reviews" className="block border rounded-lg p-5 hover:bg-accent">
              <h3 className="text-xl font-semibold">📝 Review Moderation</h3>
              <p className="text-muted-foreground">Approve or reject faculty reviews.</p>
            </Link>
            <Link href="/admin/resources" className="block border rounded-lg p-5 hover:bg-accent">
              <h3 className="text-xl font-semibold">📁 Resources</h3>
              <p className="text-muted-foreground">Manage downloadable resources and files.</p>
            </Link>
            <Link href="/admin/timetable" className="block border rounded-lg p-5 hover:bg-accent">
              <h3 className="text-xl font-semibold">📅 Timetable</h3>
              <p className="text-muted-foreground">Manage class schedules and timetables.</p>
            </Link>
            <Link href="/admin/issues" className="block border rounded-lg p-5 hover:bg-accent">
              <h3 className="text-xl font-semibold">🐞 Issues</h3>
              <p className="text-muted-foreground">Review public reports and update their status.</p>
            </Link>
            <Link href="/admin/settings" className="block border rounded-lg p-5 hover:bg-accent">
              <h3 className="text-xl font-semibold">⚙️ Site Settings</h3>
              <p className="text-muted-foreground">Configure site-wide settings and preferences.</p>
            </Link>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
