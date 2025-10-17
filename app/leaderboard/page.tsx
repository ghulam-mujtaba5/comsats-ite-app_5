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
import { EnhancedLeaderboard } from "@/components/gamification/enhanced-leaderboard"

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
          <div className={`${layout.section} ${layout.max6xl} px-4 py-12`}>
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
        <div className={`${layout.section} ${layout.max6xl} px-4 py-8`}>
          <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-purple-600" />
                Leaderboard Rankings
              </CardTitle>
              <CardDescription>
                See how you rank among other contributors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedLeaderboard 
                leaderboard={leaderboard} 
                loading={loading} 
                user={user ? { id: user.id } : undefined} 
                category={category} 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
