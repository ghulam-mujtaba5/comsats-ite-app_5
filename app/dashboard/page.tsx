import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth-server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import layout from '@/app/styles/common.module.css'
import "./dashboard.light.module.css"
import "./dashboard.dark.module.css"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  User, 
  Trophy, 
  BookOpen, 
  MessageSquare, 
  FileText, 
  Star, 
  TrendingUp, 
  Calendar,
  Activity,
  Award,
  Users,
  Calculator,
  GraduationCap
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const { user } = await requireUser()
  if (!user) redirect('/auth?next=%2Fdashboard')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
  <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse animate-delay-2000" />
      </div>

      <div className={`${layout.section} ${layout.max6xl} px-4 py-12 relative z-10`}>
        {/* Hero Section */}
        <div className="mb-12">
          <Card className="glass-card glass-border-light rounded-3xl overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 rounded-2xl blur-lg opacity-50" />
                    <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary to-blue-600">
                      <User className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                      Welcome Back
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 font-medium">
                      {user.email || 'Student'}
                    </p>
                  </div>
                </div>
                <Button asChild className="rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
                  <Link href="/profile">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    View Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="glass-card glass-border-light glass-hover rounded-2xl hover-lift transition-all duration-300 group">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-300/30 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-foreground">0</div>
                <div className="text-xs text-muted-foreground">Your Posts</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card glass-border-light glass-hover rounded-2xl hover-lift transition-all duration-300 group">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-300/30 text-amber-500 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-foreground">0</div>
                <div className="text-xs text-muted-foreground">Reviews Written</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card glass-border-light glass-hover rounded-2xl hover-lift transition-all duration-300 group">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-300/30 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-foreground">0</div>
                <div className="text-xs text-muted-foreground">Points Earned</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card glass-border-light glass-hover rounded-2xl hover-lift transition-all duration-300 group">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-300/30 text-green-500 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-foreground">Level 1</div>
                <div className="text-xs text-muted-foreground">Your Rank</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="glass-card glass-border-light rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>Access your most used features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start rounded-xl">
                <Link href="/past-papers">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Past Papers
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start rounded-xl">
                <Link href="/gpa-calculator">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate GPA
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start rounded-xl">
                <Link href="/community">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Join Discussion
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start rounded-xl">
                <Link href="/faculty">
                  <Star className="h-4 w-4 mr-2" />
                  Review Faculty
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card glass-border-light rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Your Progress
              </CardTitle>
              <CardDescription>Track your achievements and contributions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Account Status</span>
                <Badge className="bg-gradient-to-r from-green-600 to-emerald-600">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Community Level</span>
                <Badge variant="outline">Beginner</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Contributions</span>
                <span className="font-semibold">0</span>
              </div>
              <Button asChild className="w-full rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
                <Link href="/leaderboard">
                  <Trophy className="h-4 w-4 mr-2" />
                  View Leaderboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Explore CampusAxis */}
        <Card className="glass-card glass-border-light rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Explore CampusAxis
            </CardTitle>
            <CardDescription>Discover everything the platform has to offer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/resources">
                <Card className="glass-secondary hover-lift transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
                    <div className="font-medium text-slate-900 dark:text-white">Resources</div>
                    <p className="text-xs text-muted-foreground mt-1">Study materials</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/timetable">
                <Card className="glass-secondary hover-lift transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
                    <div className="font-medium text-slate-900 dark:text-white">Timetable</div>
                    <p className="text-xs text-muted-foreground mt-1">Class schedules</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/news-events">
                <Card className="glass-secondary hover-lift transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
                    <div className="font-medium text-slate-900 dark:text-white">News & Events</div>
                    <p className="text-xs text-muted-foreground mt-1">Campus updates</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
