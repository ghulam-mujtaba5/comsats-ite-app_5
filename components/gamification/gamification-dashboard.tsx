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
    <div className="space-y-5">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-2 border-yellow-400/30 glass-card glass-border-light glass-hover glass-depth">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-500">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Your Rank</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  #{leaderboard.findIndex(u => u.userId === user?.id) + 1 || "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/30 glass-card glass-border-light glass-hover glass-depth">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Total Points</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {points.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-400/30 glass-card glass-border-light glass-hover glass-depth">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Badges</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
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
        <TabsList className="grid w-full grid-cols-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl">
          <TabsTrigger value="leaderboard" className="flex items-center gap-2 py-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Leaderboard</span>
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex items-center gap-2 py-2">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Badges</span>
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2 py-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Community</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="mt-0">
          <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 glass-card glass-border-light glass-hover glass-depth">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-purple-600" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {(['overall', 'papers', 'reviews', 'community', 'helpdesk'] as const).map((cat) => (
                  <Button
                    key={cat}
                    variant={category === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory(cat)}
                    className={`h-8 px-3 ${category === cat ? "bg-purple-500 hover:bg-purple-600" : ""}`}
                  >
                    {cat === 'overall' && <Trophy className="h-3 w-3 mr-1" />}
                    {cat === 'papers' && <Star className="h-3 w-3 mr-1" />}
                    {cat === 'reviews' && <Sparkles className="h-3 w-3 mr-1" />}
                    {cat === 'community' && <Users className="h-3 w-3 mr-1" />}
                    {cat === 'helpdesk' && <Shield className="h-3 w-3 mr-1" />}
                    <span className="text-xs">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </span>
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
          <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 glass-card glass-border-light glass-hover glass-depth">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-blue-600" />
                Challenges
              </CardTitle>
            </CardHeader>
            <CardContent className="py-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  Coming Soon
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 px-4">
                  Earn exclusive badges through challenges
                </p>
                <Button asChild size="sm" className="h-8 px-3">
                  <Link href="/community">
                    Explore
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-400/30 glass-card glass-border-light glass-hover glass-depth">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">
                  Set Goals
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Define targets
                </p>
              </div>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                Start
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-400/30 glass-card glass-border-light glass-hover glass-depth">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">
                  Join Core Team
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Apply at Level 9
                </p>
              </div>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}