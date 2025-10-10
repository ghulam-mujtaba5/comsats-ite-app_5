"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { 
  Trophy, 
  Award, 
  TrendingUp, 
  Users, 
  Star,
  Zap,
  Crown,
  Flame,
  Shield,
  Target,
  Sparkles,
  ChevronRight
} from "lucide-react"
import { EnhancedLeaderboard } from "@/components/gamification/enhanced-leaderboard"
import { EnhancedBadgeShowcase } from "@/components/gamification/enhanced-badge-showcase"
import { EnhancedLevelProgression } from "@/components/gamification/enhanced-level-progression"
import Link from "next/link"

interface GamificationDashboardProps {
  leaderboard: any[]
  loading: boolean
  user?: { id: string }
  points: number
  level: number
  earnedBadgeIds: string[]
}

export function GamificationDashboard({ 
  leaderboard, 
  loading, 
  user, 
  points, 
  level, 
  earnedBadgeIds 
}: GamificationDashboardProps) {
  const [activeTab, setActiveTab] = useState("leaderboard")
  const [category, setCategory] = useState<'overall' | 'papers' | 'reviews' | 'community' | 'helpdesk'>('overall')

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-2 border-yellow-400/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Your Rank</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  #{leaderboard.findIndex(u => u.userId === user?.id) + 1 || "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Points</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {points.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-400/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Badges Earned</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {earnedBadgeIds.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progression */}
      <EnhancedLevelProgression points={points} />

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Community
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="mt-0">
          <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-purple-600" />
                Contribution Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-6">
                {(['overall', 'papers', 'reviews', 'community', 'helpdesk'] as const).map((cat) => (
                  <Button
                    key={cat}
                    variant={category === cat ? "default" : "outline"}
                    onClick={() => setCategory(cat)}
                    className={category === cat ? "bg-purple-500 hover:bg-purple-600" : ""}
                  >
                    {cat === 'overall' && <Trophy className="h-4 w-4 mr-2" />}
                    {cat === 'papers' && <Star className="h-4 w-4 mr-2" />}
                    {cat === 'reviews' && <Sparkles className="h-4 w-4 mr-2" />}
                    {cat === 'community' && <Users className="h-4 w-4 mr-2" />}
                    {cat === 'helpdesk' && <Shield className="h-4 w-4 mr-2" />}
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Button>
                ))}
              </div>
              <EnhancedLeaderboard 
                leaderboard={leaderboard} 
                loading={loading} 
                user={user} 
                category={category} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="mt-0">
          <EnhancedBadgeShowcase 
            points={points} 
            level={level} 
            earnedBadgeIds={earnedBadgeIds} 
          />
        </TabsContent>

        <TabsContent value="community" className="mt-0">
          <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Community Challenges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-6">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Coming Soon
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Participate in community challenges to earn exclusive badges and rewards
                </p>
                <Button asChild>
                  <Link href="/community">
                    Explore Community
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-400/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                  Set Goals
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Define your contribution targets
                </p>
              </div>
              <Button variant="outline" className="bg-white/80 dark:bg-slate-800/80">
                Start
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-400/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                  Join Core Team
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Apply for special roles at Level 9
                </p>
              </div>
              <Button variant="outline" className="bg-white/80 dark:bg-slate-800/80">
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}