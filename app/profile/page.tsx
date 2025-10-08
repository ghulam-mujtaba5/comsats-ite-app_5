"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { useCampus } from "@/contexts/campus-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DeleteAccountButton } from "@/components/auth/delete-account-button"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  BookOpen, 
  MessageSquare, 
  Download, 
  Star,
  Trophy,
  Target,
  Activity,
  Clock,
  TrendingUp,
  FileText,
  Users,
  ChevronRight,
  Settings,
  Bell,
  Shield,
  Edit3,
  Bookmark,
  Heart,
  Eye,
  Share2,
  MapPin,
  GraduationCap,
  Building2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

export default function ProfilePage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const { selectedCampus } = useCampus()
  const [activeTab, setActiveTab] = useState('overview')
  const [userStats, setUserStats] = useState({
    postsCreated: 0,
    reviewsWritten: 0,
    ticketsCreated: 0,
    papersUploaded: 0,
    totalLikes: 0,
    helpfulVotes: 0,
    campusName: 'COMSATS Lahore',
    departmentName: 'Computer Science',
    semester: null as number | null,
    studentId: null as string | null,
    fullName: 'Student',
    joinDate: new Date().toISOString().split('T')[0],
    lastActive: new Date().toISOString().split('T')[0],
    profileComplete: false,
  })
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)

  // Fetch user stats when component mounts and user is available
  useEffect(() => {
    if (user && isAuthenticated) {
      fetchUserStats()
    }
  }, [user, isAuthenticated])

  const fetchUserStats = async () => {
    try {
      setStatsLoading(true)
      setStatsError(null)
      const response = await fetch('/api/profile/stats')
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`)
      }
      const data = await response.json()
      setUserStats(data)
    } catch (error) {
      console.error('Error fetching user stats:', error)
      setStatsError(error instanceof Error ? error.message : 'Failed to load stats')
      // Keep default values on error
    } finally {
      setStatsLoading(false)
    }
  }

  const achievements = [
    { id: 1, title: 'Early Adopter', description: 'Joined in the first month', icon: Trophy, earned: true, rarity: 'rare' },
    { id: 2, title: 'Knowledge Seeker', description: 'Downloaded 50+ resources', icon: BookOpen, earned: false, progress: 94, rarity: 'common' },
    { id: 3, title: 'Community Helper', description: 'Received 100+ helpful votes', icon: Heart, earned: true, rarity: 'epic' },
    { id: 4, title: 'Active Contributor', description: 'Posted 10+ times', icon: MessageSquare, earned: false, progress: 80, rarity: 'uncommon' },
    { id: 5, title: 'Review Master', description: 'Written 20+ faculty reviews', icon: Star, earned: false, progress: 60, rarity: 'rare' },
    { id: 6, title: 'Popular Profile', description: 'Profile viewed 100+ times', icon: Eye, earned: false, progress: 89, rarity: 'epic' }
  ]

  const recentActivity = [
    { id: 1, type: 'download', title: 'Downloaded Data Structures Notes', time: '2 hours ago', icon: Download },
    { id: 2, type: 'review', title: 'Reviewed Dr. Ahmed (Computer Science)', time: '1 day ago', icon: Star },
    { id: 3, type: 'post', title: 'Posted in CS Study Group', time: '3 days ago', icon: MessageSquare },
    { id: 4, type: 'bookmark', title: 'Bookmarked Machine Learning Resources', time: '5 days ago', icon: Bookmark },
    { id: 5, type: 'share', title: 'Shared Algorithm Tutorial', time: '1 week ago', icon: Share2 }
  ]

  const getAchievementColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-slate-500/20 text-slate-700 border-slate-300'
      case 'uncommon': return 'bg-green-500/20 text-green-700 border-green-300'
      case 'rare': return 'bg-blue-500/20 text-blue-700 border-blue-300'
      case 'epic': return 'bg-purple-500/20 text-purple-700 border-purple-300'
      case 'legendary': return 'bg-yellow-500/20 text-yellow-700 border-yellow-300'
      default: return 'bg-slate-500/20 text-slate-700 border-slate-300'
    }
  }

  return (
    <AuthGuard
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center p-6">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-2xl shadow-lg max-w-md w-full">
            <CardContent className="p-8 text-center space-y-4">
              <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 border border-primary/30 w-16 h-16 mx-auto flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in required</h1>
              <p className="text-slate-600 dark:text-slate-300">Please sign in to view your profile and dashboard.</p>
              <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                <Link href="/auth">Go to Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      }
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary mb-6">
              <User className="h-4 w-4" />
              Student Dashboard
            </div>
            <div className="mb-8">
              <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-white/20 dark:ring-slate-700/30 shadow-lg">
                <AvatarImage src={(user as any)?.user_metadata?.avatar_url || "/male-student-avatar.png"} alt={user?.email || "Profile"} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  {(user?.email || "").slice(0,2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-6 font-medium">
                {user?.email || 'Student'}
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button 
                  onClick={logout} 
                  disabled={isLoading || !isAuthenticated}
                  variant="outline"
                  className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/30 dark:border-slate-700/30 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-600 rounded-xl"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
                <DeleteAccountButton />
                <Button variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/30 dark:border-slate-700/30 hover:bg-primary/10 rounded-xl">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {statsError && (
              <div className="col-span-2 md:col-span-4 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-center">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  Failed to load stats: {statsError}
                </p>
              </div>
            )}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-200/30 dark:border-blue-700/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {statsLoading ? '...' : userStats.papersUploaded}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Papers Uploaded</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-200/30 dark:border-green-700/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Star className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {statsLoading ? '...' : userStats.reviewsWritten}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Reviews Written</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-200/30 dark:border-purple-700/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {statsLoading ? '...' : userStats.postsCreated}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Posts Created</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-600/20 border border-red-200/30 dark:border-red-700/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {statsLoading ? '...' : userStats.totalLikes}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Likes</div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Info Card */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Your academic profile and campus details</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Full Name</p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {statsLoading ? 'Loading...' : userStats.fullName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Email</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{user?.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Student ID</p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {statsLoading ? 'Loading...' : (userStats.studentId || 'Not set')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <Building2 className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Campus</p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {statsLoading ? 'Loading...' : userStats.campusName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <GraduationCap className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Department</p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {statsLoading ? 'Loading...' : userStats.departmentName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
                    <Calendar className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Semester</p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {statsLoading ? 'Loading...' : (userStats.semester ? `Semester ${userStats.semester}` : 'Not set')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Dashboard Tabs */}
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-3xl shadow-lg">
            <CardContent className="p-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-1 mb-8">
                  <TabsTrigger 
                    value="overview" 
                    className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="achievements" 
                    className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Achievements
                  </TabsTrigger>
                  <TabsTrigger 
                    value="activity" 
                    className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Activity
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-8">
                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Link href="/past-papers">
                        <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group">
                          <CardContent className="p-6 text-center">
                            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
                            <div className="font-medium text-slate-900 dark:text-white">Past Papers</div>
                          </CardContent>
                        </Card>
                      </Link>
                      <Link href="/faculty">
                        <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group">
                          <CardContent className="p-6 text-center">
                            <Star className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
                            <div className="font-medium text-slate-900 dark:text-white">Review Faculty</div>
                          </CardContent>
                        </Card>
                      </Link>
                      <Link href="/community">
                        <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group">
                          <CardContent className="p-6 text-center">
                            <Users className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
                            <div className="font-medium text-slate-900 dark:text-white">Join Discussion</div>
                          </CardContent>
                        </Card>
                      </Link>
                      <Link href="/resources">
                        <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group">
                          <CardContent className="p-6 text-center">
                            <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
                            <div className="font-medium text-slate-900 dark:text-white">Learn Resources</div>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  </div>

                  {/* Recent Activity Preview */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                      <Button variant="ghost" onClick={() => setActiveTab('activity')} className="text-primary hover:bg-primary/10 rounded-xl">
                        View All <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {recentActivity.slice(0, 3).map((activity) => {
                        const Icon = activity.icon
                        return (
                          <Card key={activity.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-xl">
                            <CardContent className="p-4 flex items-center gap-4">
                              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
                                <Icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-slate-900 dark:text-white">{activity.title}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">{activity.time}</div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="achievements" className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Achievements</h3>
                    <p className="text-slate-600 dark:text-slate-300">Track your progress and unlock new milestones</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {achievements.map((achievement) => {
                      const Icon = achievement.icon
                      return (
                        <Card key={achievement.id} className={cn(
                          "bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-xl transition-all duration-300",
                          achievement.earned ? "ring-2 ring-yellow-500/20 shadow-lg" : "opacity-75"
                        )}>
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className={cn(
                                "p-3 rounded-xl border",
                                achievement.earned ? getAchievementColor(achievement.rarity) : "bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                              )}>
                                <Icon className={cn(
                                  "h-8 w-8",
                                  achievement.earned ? "" : "text-slate-400 dark:text-slate-500"
                                )} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-bold text-slate-900 dark:text-white">{achievement.title}</h4>
                                  {achievement.earned && (
                                    <Badge className={cn("text-xs capitalize", getAchievementColor(achievement.rarity))}>
                                      {achievement.rarity}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{achievement.description}</p>
                                {!achievement.earned && achievement.progress && (
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                                      <span>Progress</span>
                                      <span>{achievement.progress}%</span>
                                    </div>
                                    <Progress value={achievement.progress} className="h-2" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Activity History</h3>
                    <p className="text-slate-600 dark:text-slate-300">Your recent actions and contributions</p>
                  </div>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => {
                      const Icon = activity.icon
                      return (
                        <Card key={activity.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-xl hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700">
                              <Icon className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-slate-900 dark:text-white mb-1">{activity.title}</div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">{activity.time}</div>
                            </div>
                            <Badge variant="outline" className="capitalize">{activity.type}</Badge>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-8">
                  {/* Account Details */}
                  <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-xl">
                    <CardHeader className="p-6">
                      <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-200/30">
                          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        Account Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Email Address</label>
                          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-medium text-slate-900 dark:text-white">
                            {user?.email ?? "—"}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">User ID</label>
                          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-sm text-slate-900 dark:text-white truncate">
                            {user?.id ?? "—"}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Member Since</label>
                          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-medium text-slate-900 dark:text-white">
                            {statsLoading ? 'Loading...' : new Date(userStats.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Last Active</label>
                          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-medium text-slate-900 dark:text-white">
                            {statsLoading ? 'Loading...' : new Date(userStats.lastActive).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Preferences */}
                  <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-xl">
                    <CardHeader className="p-6">
                      <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-200/30">
                          <Settings className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">Email Notifications</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Receive updates about new content</div>
                          </div>
                          <Button variant="outline" size="sm" className="rounded-xl">
                            <Bell className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">Privacy Settings</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Control who can see your activity</div>
                          </div>
                          <Button variant="outline" size="sm" className="rounded-xl">
                            <Shield className="h-4 w-4 mr-2" />
                            Manage
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
