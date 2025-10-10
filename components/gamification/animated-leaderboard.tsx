"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Sparkles,
  Flame,
  Zap,
  Shield,
  UserCheck
} from "lucide-react"
import { cn } from "@/lib/utils"

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
  isAdmin?: boolean
  isAdminRole?: string | null
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

interface AnimatedLeaderboardProps {
  leaderboard: LeaderboardEntry[]
  loading: boolean
  user?: { id: string }
  category: 'overall' | 'papers' | 'reviews' | 'community' | 'helpdesk'
}

export function AnimatedLeaderboard({ leaderboard, loading, user, category }: AnimatedLeaderboardProps) {
  const [animatedEntries, setAnimatedEntries] = useState<LeaderboardEntry[]>([])
  const [prevEntries, setPrevEntries] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    // Animate entries when leaderboard changes
    if (leaderboard && leaderboard.length > 0) {
      setAnimatedEntries(leaderboard)
      setPrevEntries(leaderboard)
    }
  }, [leaderboard])

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 via-yellow-500 to-amber-500'
    if (rank === 2) return 'from-slate-300 via-slate-400 to-slate-500'
    if (rank === 3) return 'from-orange-500 via-orange-600 to-red-600'
    if (rank <= 10) return 'from-blue-400 via-blue-500 to-indigo-500'
    return 'from-purple-400 via-purple-500 to-pink-500'
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500 animate-pulse" />
    if (rank === 2) return <Medal className="h-6 w-6 text-slate-400" />
    if (rank === 3) return <Medal className="h-6 w-6 text-orange-500" />
    if (rank <= 10) return <Star className="h-5 w-5 text-blue-500" />
    return <Sparkles className="h-4 w-4 text-purple-500" />
  }

  const getGamificationRoleBadge = (role: string | null | undefined) => {
    if (!role) return null
    
    const roles: Record<string, { icon: string; label: string; color: string }> = {
      'content-curator': { icon: '🎯', label: 'Content Curator', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
      'community-moderator': { icon: '👥', label: 'Community Mod', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
      'tech-support': { icon: '🛠️', label: 'Tech Support', color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
      'campus-ambassador': { icon: '🎓', label: 'Ambassador', color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
    }
    
    return roles[role] || null
  }

  const getCategoryIcon = () => {
    switch (category) {
      case 'papers': return <FileText className="h-5 w-5 text-blue-500" />
      case 'reviews': return <Star className="h-5 w-5 text-yellow-500" />
      case 'community': return <MessageSquare className="h-5 w-5 text-purple-500" />
      case 'helpdesk': return <HelpCircle className="h-5 w-5 text-green-500" />
      default: return <Trophy className="h-5 w-5 text-amber-500" />
    }
  }

  const getCategoryColor = () => {
    switch (category) {
      case 'papers': return 'from-blue-500/20 to-cyan-500/20'
      case 'reviews': return 'from-yellow-500/20 to-amber-500/20'
      case 'community': return 'from-purple-500/20 to-pink-500/20'
      case 'helpdesk': return 'from-green-500/20 to-emerald-500/20'
      default: return 'from-amber-500/20 to-orange-500/20'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-primary" />
        </motion.div>
      </div>
    )
  }

  if (leaderboard.length === 0) {
    return (
      <Card className="text-center py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardContent>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">No Data Yet</h3>
          <p className="text-muted-foreground">
            Be the first to contribute and climb the leaderboard!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            whileHover={{ y: -10 }}
            className="relative"
          >
            <Card className="relative overflow-hidden border-2 border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-400/10 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-center justify-center mb-3">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <div className="text-5xl">🥈</div>
                  </motion.div>
                </div>
                <CardTitle className="text-center text-lg font-bold">{leaderboard[1].studentId}</CardTitle>
                <CardDescription className="text-center text-sm">
                  {leaderboard[1].departmentCode} • {leaderboard[1].campusCode}
                </CardDescription>
                <div className="flex justify-center mt-2 gap-1 flex-wrap">
                  {leaderboard[1].gamificationRole && (
                    <Badge className={`${getGamificationRoleBadge(leaderboard[1].gamificationRole)?.color} text-white border-0 text-xs`}>
                      {getGamificationRoleBadge(leaderboard[1].gamificationRole)?.icon} {getGamificationRoleBadge(leaderboard[1].gamificationRole)?.label}
                    </Badge>
                  )}
                  {leaderboard[1].isAdminRole === 'super_admin' && (
                    <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0 text-xs">
                      👑 Super Admin
                    </Badge>
                  )}
                  {leaderboard[1].isAdmin && leaderboard[1].isAdminRole !== 'super_admin' && (
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-xs">
                      Admin
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="text-center relative z-10">
                <div className="text-3xl font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {leaderboard[1].totalPoints.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">points</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ y: -15 }}
            className="relative -mt-6 z-10"
          >
            <Card className="relative overflow-hidden border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 shadow-2xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/10 rounded-full -mr-20 -mt-20" />
              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-center justify-center mb-3">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 3,
                      times: [0, 0.5, 1]
                    }}
                  >
                    <div className="text-6xl relative">
                      🏆
                      <motion.div
                        className="absolute -top-2 -right-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-6 w-6 text-yellow-500" />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
                <CardTitle className="text-center text-xl font-bold">{leaderboard[0].studentId}</CardTitle>
                <CardDescription className="text-center text-sm">
                  {leaderboard[0].departmentCode} • {leaderboard[0].campusCode}
                </CardDescription>
                <div className="flex justify-center mt-2 gap-1 flex-wrap">
                  {leaderboard[0].gamificationRole && (
                    <Badge className={`${getGamificationRoleBadge(leaderboard[0].gamificationRole)?.color} text-white border-0`}>
                      {getGamificationRoleBadge(leaderboard[0].gamificationRole)?.icon} {getGamificationRoleBadge(leaderboard[0].gamificationRole)?.label}
                    </Badge>
                  )}
                  {leaderboard[0].isAdminRole === 'super_admin' && (
                    <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0">
                      👑 Super Admin
                    </Badge>
                  )}
                  {leaderboard[0].isAdmin && leaderboard[0].isAdminRole !== 'super_admin' && (
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                      Admin
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="text-center relative z-10">
                <motion.div
                  className="text-4xl font-bold text-yellow-700 dark:text-yellow-400 mb-1"
                  animate={{ 
                    textShadow: [
                      "0 0 0px rgba(251, 191, 36, 0)",
                      "0 0 10px rgba(251, 191, 36, 0.5)",
                      "0 0 0px rgba(251, 191, 36, 0)"
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {leaderboard[0].totalPoints.toLocaleString()}
                </motion.div>
                <p className="text-sm text-muted-foreground">points</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            whileHover={{ y: -10 }}
            className="relative"
          >
            <Card className="relative overflow-hidden border-2 border-orange-400 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/10 rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-center justify-center mb-3">
                  <motion.div
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <div className="text-5xl">🥉</div>
                  </motion.div>
                </div>
                <CardTitle className="text-center text-lg font-bold">{leaderboard[2].studentId}</CardTitle>
                <CardDescription className="text-center text-sm">
                  {leaderboard[2].departmentCode} • {leaderboard[2].campusCode}
                </CardDescription>
                <div className="flex justify-center mt-2 gap-1 flex-wrap">
                  {leaderboard[2].gamificationRole && (
                    <Badge className={`${getGamificationRoleBadge(leaderboard[2].gamificationRole)?.color} text-white border-0 text-xs`}>
                      {getGamificationRoleBadge(leaderboard[2].gamificationRole)?.icon} {getGamificationRoleBadge(leaderboard[2].gamificationRole)?.label}
                    </Badge>
                  )}
                  {leaderboard[2].isAdminRole === 'super_admin' && (
                    <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0 text-xs">
                      👑 Super Admin
                    </Badge>
                  )}
                  {leaderboard[2].isAdmin && leaderboard[2].isAdminRole !== 'super_admin' && (
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-xs">
                      Admin
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="text-center relative z-10">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  {leaderboard[2].totalPoints.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">points</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Rest of Leaderboard */}
      <div className="space-y-4">
        <AnimatePresence>
          {leaderboard.slice(3).map((entry, index) => (
            <motion.div
              key={entry.userId}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <Card className={cn(
                "overflow-hidden transition-all duration-300 border-2",
                entry.userId === user?.id 
                  ? "ring-4 ring-primary/50 border-primary bg-gradient-to-r from-primary/5 to-blue-500/5" 
                  : "border-muted hover:border-primary/50"
              )}>
                {/* Animated background effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0"
                  whileHover={{ opacity: 100 }}
                  transition={{ duration: 0.3 }}
                />
                
                <CardContent className="flex items-center gap-4 p-4 relative z-10">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-16">
                    <motion.div
                      className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${getRankColor(entry.rank)}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-white font-bold text-lg">#{entry.rank}</span>
                    </motion.div>
                  </div>

                  {/* Rank Icon */}
                  <div className="flex-shrink-0">
                    <motion.div
                      whileHover={{ rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {getRankIcon(entry.rank)}
                    </motion.div>
                  </div>

                  {/* Student Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">
                        {entry.studentId}
                      </h3>
                      {entry.userId === user?.id && (
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <Badge variant="default" className="bg-gradient-to-r from-primary to-blue-600">
                            You
                          </Badge>
                        </motion.div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {entry.departmentCode} • {entry.campusCode}
                    </p>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <motion.div
                      className="text-2xl font-bold text-primary"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {entry.totalPoints.toLocaleString()}
                    </motion.div>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>

                  {/* Badges */}
                  <div className="flex-shrink-0 flex flex-col gap-1">
                    <div className="flex gap-1 flex-wrap">
                      {entry.gamificationRole && (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Badge className={`${getGamificationRoleBadge(entry.gamificationRole)?.color} text-white border-0 text-xs`}>
                            {getGamificationRoleBadge(entry.gamificationRole)?.icon} {getGamificationRoleBadge(entry.gamificationRole)?.label}
                          </Badge>
                        </motion.div>
                      )}
                      {entry.isAdminRole === 'super_admin' && (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0 text-xs">
                            👑 Super Admin
                          </Badge>
                        </motion.div>
                      )}
                      {entry.isAdmin && entry.isAdminRole !== 'super_admin' && (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-xs">
                            Admin
                          </Badge>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}