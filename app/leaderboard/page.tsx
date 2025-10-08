"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { useCampus } from "@/contexts/campus-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Trophy, 
  Award, 
  Star, 
  TrendingUp, 
  Medal, 
  FileText, 
  MessageSquare, 
  Users, 
  HelpCircle,
  Loader2,
  Crown,
  Sparkles
} from "lucide-react"
import { motion } from "framer-motion"

interface LeaderboardEntry {
  userId: string
  studentId: string
  campusName: string
  campusCode: string
  departmentName: string
  departmentCode: string
  totalPoints: number
  rank: number
  gamificationRole?: string | null
  breakdown: {
    papers: number
    reviews: number
    community: number
    helpdesk: number
  }
  stats: {
    papersUploaded: number
    reviewsWritten: number
    postsCreated: number
    ticketsCreated: number
  }
  badge: {
    icon: string
    color: string
    label: string
  }
}

export default function LeaderboardPage() {
  const { user } = useAuth()
  const { selectedCampus } = useCampus()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<'overall' | 'papers' | 'reviews' | 'community' | 'helpdesk'>('overall')
  const [scope, setScope] = useState<'campus' | 'all'>('campus')

  useEffect(() => {
    fetchLeaderboard()
  }, [category, scope, selectedCampus])

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        category,
        limit: '50',
      })
      
      if (scope === 'campus' && selectedCampus?.id) {
        params.append('campus_id', selectedCampus.id)
      }

      const response = await fetch(`/api/contributions/leaderboard?${params}`)
      const data = await response.json()
      setLeaderboard(data.leaderboard || [])
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500 to-amber-500'
    if (rank === 2) return 'from-slate-400 to-slate-500'
    if (rank === 3) return 'from-orange-600 to-orange-700'
    if (rank <= 10) return 'from-blue-500 to-blue-600'
    return 'from-purple-500 to-purple-600'
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-slate-400" />
    if (rank === 3) return <Medal className="h-6 w-6 text-orange-600" />
    if (rank <= 10) return <Star className="h-5 w-5 text-blue-500" />
    return <Sparkles className="h-4 w-4 text-purple-500" />
  }

  const getGamificationRoleBadge = (role: string | null | undefined) => {
    if (!role) return null
    
    const roles: Record<string, { icon: string; label: string; color: string }> = {
      'content-curator': { icon: '🎯', label: 'Content Curator', color: 'bg-blue-500' },
      'community-moderator': { icon: '👥', label: 'Community Mod', color: 'bg-purple-500' },
      'tech-support': { icon: '🛠️', label: 'Tech Support', color: 'bg-green-500' },
      'campus-ambassador': { icon: '🎓', label: 'Ambassador', color: 'bg-yellow-500' },
    }
    
    return roles[role] || null
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-2xl">
                <Trophy className="h-10 w-10 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Contribution Leaderboard
                </h1>
                <p className="text-muted-foreground text-lg mt-1">
                  Recognizing top contributors across COMSATS campuses
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mt-6">
              <Select value={scope} onValueChange={(val: 'campus' | 'all') => setScope(val)}>
                <SelectTrigger className="w-[200px] bg-background/50 backdrop-blur">
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="campus">My Campus</SelectItem>
                  <SelectItem value="all">All Campuses</SelectItem>
                </SelectContent>
              </Select>

              <Tabs value={category} onValueChange={(val: any) => setCategory(val)} className="flex-1">
                <TabsList className="bg-background/50 backdrop-blur">
                  <TabsTrigger value="overall" className="gap-2">
                    <Trophy className="h-4 w-4" />
                    Overall
                  </TabsTrigger>
                  <TabsTrigger value="papers" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Papers
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="gap-2">
                    <Star className="h-4 w-4" />
                    Reviews
                  </TabsTrigger>
                  <TabsTrigger value="community" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Community
                  </TabsTrigger>
                  <TabsTrigger value="helpdesk" className="gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Help Desk
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Leaderboard Content */}
        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : leaderboard.length === 0 ? (
            <Card className="text-center py-20">
              <CardContent>
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Data Yet</h3>
                <p className="text-muted-foreground">
                  Be the first to contribute and climb the leaderboard!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Top 3 Podium */}
              {leaderboard.length >= 3 && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {/* 2nd Place */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="relative overflow-hidden border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-400/20 rounded-full -mr-12 -mt-12" />
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-center mb-2">
                          <div className="text-6xl">🥈</div>
                        </div>
                        <CardTitle className="text-center text-lg">{leaderboard[1].studentId}</CardTitle>
                        <CardDescription className="text-center">
                          {leaderboard[1].departmentCode} • {leaderboard[1].campusCode}
                        </CardDescription>
                        {leaderboard[1].gamificationRole && (
                          <div className="flex justify-center mt-2">
                            <Badge className={`${getGamificationRoleBadge(leaderboard[1].gamificationRole)?.color} text-white border-0 text-xs`}>
                              {getGamificationRoleBadge(leaderboard[1].gamificationRole)?.icon} {getGamificationRoleBadge(leaderboard[1].gamificationRole)?.label}
                            </Badge>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="text-center">
                        <div className="text-3xl font-bold text-slate-600 dark:text-slate-300">
                          {leaderboard[1].totalPoints.toLocaleString()}
                        </div>
                        <p className="text-sm text-muted-foreground">points</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* 1st Place */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="-mt-4"
                  >
                    <Card className="relative overflow-hidden border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 shadow-xl">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full -mr-16 -mt-16" />
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-center mb-2">
                          <div className="text-7xl relative">
                            🏆
                            <div className="absolute -top-2 -right-2">
                              <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-center text-xl">{leaderboard[0].studentId}</CardTitle>
                        <CardDescription className="text-center">
                          {leaderboard[0].departmentCode} • {leaderboard[0].campusCode}
                        </CardDescription>
                        {leaderboard[0].gamificationRole && (
                          <div className="flex justify-center mt-2">
                            <Badge className={`${getGamificationRoleBadge(leaderboard[0].gamificationRole)?.color} text-white border-0`}>
                              {getGamificationRoleBadge(leaderboard[0].gamificationRole)?.icon} {getGamificationRoleBadge(leaderboard[0].gamificationRole)?.label}
                            </Badge>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="text-center">
                        <div className="text-4xl font-bold text-yellow-700 dark:text-yellow-400">
                          {leaderboard[0].totalPoints.toLocaleString()}
                        </div>
                        <p className="text-sm text-muted-foreground">points</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* 3rd Place */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="relative overflow-hidden border-orange-400 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-400/20 rounded-full -mr-12 -mt-12" />
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-center mb-2">
                          <div className="text-6xl">🥉</div>
                        </div>
                        <CardTitle className="text-center text-lg">{leaderboard[2].studentId}</CardTitle>
                        <CardDescription className="text-center">
                          {leaderboard[2].departmentCode} • {leaderboard[2].campusCode}
                        </CardDescription>
                        {leaderboard[2].gamificationRole && (
                          <div className="flex justify-center mt-2">
                            <Badge className={`${getGamificationRoleBadge(leaderboard[2].gamificationRole)?.color} text-white border-0 text-xs`}>
                              {getGamificationRoleBadge(leaderboard[2].gamificationRole)?.icon} {getGamificationRoleBadge(leaderboard[2].gamificationRole)?.label}
                            </Badge>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="text-center">
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                          {leaderboard[2].totalPoints.toLocaleString()}
                        </div>
                        <p className="text-sm text-muted-foreground">points</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              )}

              {/* Rest of Leaderboard */}
              <div className="space-y-3">
                {leaderboard.slice(3).map((entry, index) => (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`hover:shadow-lg transition-all duration-300 ${
                      entry.userId === user?.id ? 'ring-2 ring-primary' : ''
                    }`}>
                      <CardContent className="flex items-center gap-4 p-4">
                        {/* Rank */}
                        <div className="flex items-center justify-center w-16">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${getRankColor(entry.rank)}`}>
                            <span className="text-white font-bold text-lg">#{entry.rank}</span>
                          </div>
                        </div>

                        {/* Rank Icon */}
                        <div className="flex-shrink-0">
                          {getRankIcon(entry.rank)}
                        </div>

                        {/* Student Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            {entry.studentId}
                            {entry.userId === user?.id && (
                              <Badge variant="secondary">You</Badge>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {entry.departmentCode} • {entry.campusCode}
                          </p>
                        </div>

                        {/* Points */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {entry.totalPoints.toLocaleString()}
                          </div>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>

                        {/* Badge */}
                        <div className="flex-shrink-0 flex flex-col gap-1">
                          <Badge variant="outline" className="gap-1">
                            <span>{entry.badge.icon}</span>
                            {entry.badge.label}
                          </Badge>
                          {entry.gamificationRole && (
                            <Badge className={`${getGamificationRoleBadge(entry.gamificationRole)?.color} text-white border-0 text-xs`}>
                              {getGamificationRoleBadge(entry.gamificationRole)?.icon} {getGamificationRoleBadge(entry.gamificationRole)?.label}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
