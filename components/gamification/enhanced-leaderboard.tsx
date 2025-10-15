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
  UserCheck,
  ChevronUp,
  ChevronDown,
  ChevronRight
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

interface EnhancedLeaderboardProps {
  leaderboard: LeaderboardEntry[]
  loading: boolean
  user?: { id: string }
  category: 'overall' | 'papers' | 'reviews' | 'community' | 'helpdesk'
}

export function EnhancedLeaderboard({ leaderboard, loading, user, category }: EnhancedLeaderboardProps) {
  const [animatedEntries, setAnimatedEntries] = useState<LeaderboardEntry[]>([])
  const [prevEntries, setPrevEntries] = useState<LeaderboardEntry[]>([])
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'rank' | 'points' | 'papers' | 'reviews' | 'community' | 'helpdesk'>('rank')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

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
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-500" />
    if (rank <= 10) return <Star className="h-4 w-4 text-blue-500" />
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
      case 'papers': return <FileText className="h-4 w-4 text-blue-500" />
      case 'reviews': return <Star className="h-4 w-4 text-yellow-500" />
      case 'community': return <MessageSquare className="h-4 w-4 text-purple-500" />
      case 'helpdesk': return <HelpCircle className="h-4 w-4 text-green-500" />
      default: return <Trophy className="h-4 w-4 text-amber-500" />
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

  const toggleExpand = (userId: string) => {
    setExpandedEntry(expandedEntry === userId ? null : userId)
  }

  const handleSort = (field: 'rank' | 'points' | 'papers' | 'reviews' | 'community' | 'helpdesk') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy) {
      case 'rank':
        aValue = a.rank
        bValue = b.rank
        break
      case 'points':
        aValue = a.totalPoints
        bValue = b.totalPoints
        break
      case 'papers':
        aValue = a.breakdown.papers
        bValue = b.breakdown.papers
        break
      case 'reviews':
        aValue = a.breakdown.reviews
        bValue = b.breakdown.reviews
        break
      case 'community':
        aValue = a.breakdown.community
        bValue = b.breakdown.community
        break
      case 'helpdesk':
        aValue = a.breakdown.helpdesk
        bValue = b.breakdown.helpdesk
        break
      default:
        aValue = a.rank
        bValue = b.rank
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-8 w-8 text-primary" />
        </motion.div>
      </div>
    )
  }

  if (leaderboard.length === 0) {
    return (
      <Card className="text-center py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardContent>
          <Trophy className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No Leaders Yet
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Be the first to earn points!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      <div className="hidden md:grid grid-cols-12 gap-2 px-2 text-xs font-medium text-slate-600 dark:text-slate-400">
        <div 
          className="col-span-1 flex items-center gap-1 cursor-pointer hover:text-slate-900 dark:hover:text-white"
          onClick={() => handleSort('rank')}
        >
          Rank
          {sortBy === 'rank' && (
            sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
          )}
        </div>
        <div className="col-span-4">Student</div>
        <div 
          className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-slate-900 dark:hover:text-white"
          onClick={() => handleSort('points')}
        >
          Points
          {sortBy === 'points' && (
            sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
          )}
        </div>
        <div 
          className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-slate-900 dark:hover:text-white"
          onClick={() => handleSort(category as any)}
        >
          <div className="flex items-center gap-1">
            {getCategoryIcon()}
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </div>
          {sortBy === category && (
            sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
          )}
        </div>
        <div className="col-span-3">Badges</div>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
        <AnimatePresence>
          {sortedLeaderboard.map((entry, index) => {
            const isCurrentUser = user?.id === entry.userId
            const isExpanded = expandedEntry === entry.userId
            const roleBadge = getGamificationRoleBadge(entry.gamificationRole)
            
            return (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "grid grid-cols-12 gap-2 p-3 rounded-xl border transition-all duration-200",
                  isCurrentUser 
                    ? "bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30" 
                    : "bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:shadow-md",
                  "glass-card glass-border-light glass-hover glass-depth"
                )}
              >
                {/* Rank */}
                <div className="col-span-1 flex items-center">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br ${getRankColor(entry.rank)}`}>
                    {getRankIcon(entry.rank)}
                  </div>
                </div>

                {/* Student Info */}
                <div className="col-span-4 flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm truncate">
                        {entry.studentId}
                      </span>
                      {entry.isAdmin && (
                        <Shield className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                      <span className="truncate">{entry.campusCode}</span>
                      <span>•</span>
                      <span className="truncate">{entry.departmentCode}</span>
                    </div>
                  </div>
                </div>

                {/* Points */}
                <div className="col-span-2 flex items-center">
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span className="font-medium text-sm">{entry.totalPoints.toLocaleString()}</span>
                  </div>
                </div>

                {/* Category Specific */}
                <div className="col-span-2 flex items-center">
                  <div className="flex items-center gap-1">
                    {getCategoryIcon()}
                    <span className="font-medium text-sm">
                      {category === 'overall' && entry.totalPoints}
                      {category === 'papers' && entry.breakdown.papers}
                      {category === 'reviews' && entry.breakdown.reviews}
                      {category === 'community' && entry.breakdown.community}
                      {category === 'helpdesk' && entry.breakdown.helpdesk}
                    </span>
                  </div>
                </div>

                {/* Badges */}
                <div className="col-span-3 flex items-center gap-1">
                  {roleBadge && (
                    <div className={`flex items-center justify-center w-5 h-5 rounded-full text-xs ${roleBadge.color} text-white`}>
                      {roleBadge.icon}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs">{entry.rank}</span>
                  </div>
                  <button 
                    onClick={() => toggleExpand(entry.userId)}
                    className="ml-auto p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <ChevronRight className={`h-4 w-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="col-span-12 pt-3 mt-3 border-t border-slate-200 dark:border-slate-700"
                    >
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                          <div className="text-sm font-medium">{entry.breakdown.papers}</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">Papers</div>
                        </div>
                        <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                          <div className="text-sm font-medium">{entry.breakdown.reviews}</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">Reviews</div>
                        </div>
                        <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <MessageSquare className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                          <div className="text-sm font-medium">{entry.breakdown.community}</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">Posts</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <HelpCircle className="h-5 w-5 text-green-500 mx-auto mb-1" />
                          <div className="text-sm font-medium">{entry.breakdown.helpdesk}</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">Help</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}