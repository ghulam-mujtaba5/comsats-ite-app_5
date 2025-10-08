"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Trophy, 
  Star, 
  Award, 
  Crown, 
  Shield, 
  Zap,
  FileText,
  MessageSquare,
  Heart,
  Users,
  TrendingUp,
  ArrowRight,
  Info,
  Calculator,
  Target,
  Sparkles
} from "lucide-react"
import { LEVELS, BADGES, TEAM_ROLES } from "@/lib/gamification"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { motion } from "framer-motion"

export default function GamificationInfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-300 dark:border-blue-700 mb-4">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-bold text-blue-700 dark:text-blue-300">Gamification System</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            How Points & Levels Work
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6">
            Learn how to earn points, unlock badges, level up, and join the Core Team
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/leaderboard">
                <Trophy className="h-5 w-5 mr-2" />
                View Leaderboard
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/profile">
                <Users className="h-5 w-5 mr-2" />
                My Progress
              </Link>
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="points" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="points">
              <Calculator className="h-4 w-4 mr-2" />
              Points
            </TabsTrigger>
            <TabsTrigger value="levels">
              <TrendingUp className="h-4 w-4 mr-2" />
              Levels
            </TabsTrigger>
            <TabsTrigger value="badges">
              <Award className="h-4 w-4 mr-2" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="team">
              <Shield className="h-4 w-4 mr-2" />
              Core Team
            </TabsTrigger>
          </TabsList>

          {/* Points Tab */}
          <TabsContent value="points" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-primary" />
                  Point Calculation System
                </CardTitle>
                <CardDescription>
                  Points are awarded for contributions (creating content) and engagement, NOT for consumption (downloads, likes)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Past Papers */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-300/30">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Past Papers</h3>
                  </div>
                  <div className="ml-11 space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <span className="text-slate-700 dark:text-slate-300">Upload paper</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-400">
                        +50 points
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <span className="text-slate-700 dark:text-slate-300">Per "helpful" vote received</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-400">
                        +10 points
                      </Badge>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        💡 <strong>Example:</strong> Upload a paper (50 pts) + 5 helpful votes (50 pts) = <strong>100 points total</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reviews */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-yellow-500/20 border border-yellow-300/30">
                      <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Faculty Reviews</h3>
                  </div>
                  <div className="ml-11 space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <span className="text-slate-700 dark:text-slate-300">Write review</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-400">
                        +25 points
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <span className="text-slate-700 dark:text-slate-300">Per "helpful" vote received</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-400">
                        +5 points
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <span className="text-slate-700 dark:text-slate-300">Quality bonus (200+ characters)</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-400">
                        +15 points
                      </Badge>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        💡 <strong>Example:</strong> Detailed review (25 pts) + quality bonus (15 pts) + 3 helpful votes (15 pts) = <strong>55 points total</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Community Posts */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-300/30">
                      <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Community Posts</h3>
                  </div>
                  <div className="ml-11 space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <span className="text-slate-700 dark:text-slate-300">Create post</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-400">
                        +15 points
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <span className="text-slate-700 dark:text-slate-300">Per comment received</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-400">
                        +5 points
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <span className="text-slate-700 dark:text-slate-300">Popular post (10+ comments)</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-400">
                        +20 points
                      </Badge>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        💡 <strong>Example:</strong> Create post (15 pts) + 12 comments (60 pts) + popular bonus (20 pts) = <strong>95 points total</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* What Doesn't Give Points */}
                <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-red-700 dark:text-red-300 mb-2 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      What DOESN'T Give Points
                    </h4>
                    <ul className="space-y-1 text-sm text-red-600 dark:text-red-400">
                      <li>❌ Downloads of your papers (consumption)</li>
                      <li>❌ Likes on your posts (passive engagement)</li>
                      <li>❌ Views of your content (passive metric)</li>
                      <li>❌ Bookmarks or saves (personal action)</li>
                    </ul>
                    <p className="mt-3 text-sm text-red-700 dark:text-red-300 font-semibold">
                      💡 Focus on quality contributions and helping others!
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Levels Tab */}
          <TabsContent value="levels" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Level Progression System
                </CardTitle>
                <CardDescription>
                  Progress through 10 levels from Newcomer to Core Team Member
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {LEVELS.map((level, idx) => {
                    const Icon = level.icon === 'Shield' ? Shield :
                                level.icon === 'Crown' ? Crown :
                                level.icon === 'Trophy' ? Trophy :
                                level.icon === 'Zap' ? Zap :
                                level.icon === 'Award' ? Award :
                                level.icon === 'Users' ? Users :
                                level.icon === 'BookOpen' ? FileText :
                                level.icon === 'Heart' ? Heart :
                                level.icon === 'UserPlus' ? Users : Users

                    return (
                      <motion.div
                        key={level.level}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Card className={cn(
                          "border-2 transition-all hover:shadow-lg",
                          level.level >= 9 ? "bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 border-red-400/50" :
                          level.level >= 7 ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-400/50" :
                          level.level >= 5 ? "bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-400/50" :
                          level.level >= 3 ? "bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-purple-400/50" :
                          "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-400/50"
                        )}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "p-3 rounded-xl bg-gradient-to-br flex-shrink-0",
                                level.gradient
                              )}>
                                <Icon className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Level {level.level}: {level.name}
                                  </h3>
                                  {level.level === 9 && (
                                    <Sparkles className="h-5 w-5 text-yellow-500" />
                                  )}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                  {level.title}
                                </p>
                                <div className="flex items-center gap-4 mb-2">
                                  <Badge variant="outline">
                                    {level.minPoints.toLocaleString()} - {level.maxPoints.toLocaleString()} pts
                                  </Badge>
                                  <Badge variant="outline" className={cn(
                                    "bg-gradient-to-r",
                                    level.gradient,
                                    "text-white border-transparent"
                                  )}>
                                    {level.color}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {level.perks.map((perk, perkIdx) => (
                                    <div key={perkIdx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                      <div className={cn(
                                        "mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0",
                                        `bg-${level.color}-500`
                                      )} />
                                      {perk}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-primary" />
                  Badge Collection System
                </CardTitle>
                <CardDescription>
                  Earn 16 badges across 6 rarity levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Badge Rarity Explanation */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'].map((rarity) => (
                      <div key={rarity} className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <Badge variant="outline" className={cn(
                          "mb-2",
                          rarity === 'mythic' ? 'bg-red-500/20 text-red-700 border-red-400' :
                          rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-700 border-yellow-400' :
                          rarity === 'epic' ? 'bg-purple-500/20 text-purple-700 border-purple-400' :
                          rarity === 'rare' ? 'bg-blue-500/20 text-blue-700 border-blue-400' :
                          rarity === 'uncommon' ? 'bg-green-500/20 text-green-700 border-green-400' :
                          'bg-slate-500/20 text-slate-700 border-slate-400'
                        )}>
                          {rarity}
                        </Badge>
                        <p className="text-xs text-slate-600 dark:text-slate-400 capitalize">{rarity}</p>
                      </div>
                    ))}
                  </div>

                  {/* Badge List by Rarity */}
                  {['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'].map((rarity) => {
                    const badgesInRarity = BADGES.filter(b => b.rarity === rarity)
                    if (badgesInRarity.length === 0) return null

                    return (
                      <div key={rarity}>
                        <h3 className={cn(
                          "text-lg font-bold mb-3 capitalize",
                          rarity === 'mythic' ? 'text-red-600 dark:text-red-400' :
                          rarity === 'legendary' ? 'text-yellow-600 dark:text-yellow-400' :
                          rarity === 'epic' ? 'text-purple-600 dark:text-purple-400' :
                          rarity === 'rare' ? 'text-blue-600 dark:text-blue-400' :
                          rarity === 'uncommon' ? 'text-green-600 dark:text-green-400' :
                          'text-slate-600 dark:text-slate-400'
                        )}>
                          {rarity} Badges ({badgesInRarity.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {badgesInRarity.map((badge) => (
                            <Card key={badge.id} className={cn(
                              "border-2",
                              rarity === 'mythic' ? 'bg-gradient-to-br from-red-500/10 to-yellow-500/10 border-red-400/50' :
                              rarity === 'legendary' ? 'bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-400/50' :
                              rarity === 'epic' ? 'bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-400/50' :
                              rarity === 'rare' ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-400/50' :
                              rarity === 'uncommon' ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-400/50' :
                              'bg-gradient-to-br from-slate-500/10 to-gray-500/10 border-slate-400/50'
                            )}>
                              <CardContent className="p-4">
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{badge.name}</h4>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                  <Badge variant="outline" className="text-xs">
                                    {badge.points} pts
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    Level {badge.level}+
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Core Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Core Team Roles (Level 9 Required)
                </CardTitle>
                <CardDescription>
                  Become an official platform contributor at 12,000+ points
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {TEAM_ROLES.map((role, idx) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className={cn(
                      "border-2",
                      `bg-gradient-to-br from-${role.color}-500/10 to-${role.color}-600/10 border-${role.color}-400/50`
                    )}>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{role.name}</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">{role.description}</p>
                        
                        <div className="mb-4">
                          <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-2">Requirements:</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Level {role.requiredLevel}</Badge>
                            <Badge variant="outline">{role.requiredPoints.toLocaleString()} points</Badge>
                            {role.requiredBadges.map(badge => (
                              <Badge key={badge} variant="outline">{badge}</Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-2">Perks:</h4>
                          <ul className="space-y-1">
                            {role.perks.map((perk, perkIdx) => (
                              <li key={perkIdx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <div className={cn(
                                  "mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0",
                                  `bg-${role.color}-500`
                                )} />
                                {perk}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                <Card className="border-2 border-yellow-400/50 bg-gradient-to-r from-yellow-500/10 to-amber-500/10">
                  <CardContent className="p-6 text-center">
                    <Trophy className="h-12 w-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Ready to Join the Core Team?
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Reach Level 9 (12,000 points) and apply for your preferred role
                    </p>
                    <Button asChild size="lg">
                      <Link href="/contribute/team">
                        View Team Roles
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Trophy className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Leaderboard</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                See where you rank among all contributors
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/leaderboard">View Rankings</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Users className="h-10 w-10 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">My Profile</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Track your progress and earned badges
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/profile">View Profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <FileText className="h-10 w-10 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Start Contributing</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Upload papers, write reviews, help others
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/past-papers">Upload Paper</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
