"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  Medal,
  Star,
  Flame,
  Target,
  Zap,
  Crown,
  Award,
  Users,
  TrendingUp,
  CheckCircle2,
  Lock,
  Sparkles
} from "lucide-react"
import { useAchievements } from "@/hooks/use-achievements"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { cn } from "@/lib/utils"

export default function CommunityGamificationPage() {
  const { 
    achievements, 
    userAchievements, 
    leaderboard, 
    loading, 
    error, 
    getTotalPoints,
    getRarityColor,
    getRarityBg
  } = useAchievements()
  const [activeTab, setActiveTab] = useState("achievements")

  const totalPoints = getTotalPoints()
  const unlockedAchievements = userAchievements.length
  const totalAchievements = achievements.length
  const completionPercentage = totalAchievements > 0 
    ? Math.round((unlockedAchievements / totalAchievements) * 100) 
    : 0

  const getUserRank = () => {
    const userEntry = leaderboard.find(entry => 
      entry.userId === "current-user-id" // This would be the actual user ID
    )
    return userEntry ? userEntry.rank : "-"
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star className="h-4 w-4" />
      case 'uncommon': return <Star className="h-4 w-4" />
      case 'rare': return <Star className="h-4 w-4" />
      case 'epic': return <Star className="h-4 w-4" />
      case 'legendary': return <Star className="h-4 w-4" />
      default: return <Star className="h-4 w-4" />
    }
  }

  const getRarityName = (rarity: string) => {
    return rarity.charAt(0).toUpperCase() + rarity.slice(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className="app-container section py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 to-blue-500/15 border border-primary/30 text-sm font-medium text-primary mb-4 backdrop-blur-sm">
            <Trophy className="h-4 w-4" />
            <span>Gamification Center</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Level Up Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Community</span>
          </h1>
          
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
            Earn achievements, climb the leaderboard, and showcase your contributions to the community.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border border-yellow-200/30 dark:border-yellow-700/30">
                <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {totalPoints}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Total Points</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-200/30 dark:border-green-700/30">
                <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {unlockedAchievements}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Achievements</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-200/30 dark:border-blue-700/30">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {getUserRank()}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Rank</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-200/30 dark:border-purple-700/30">
                <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {completionPercentage}%
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Completion</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 p-1 rounded-2xl mb-6">
            <TabsTrigger 
              value="achievements" 
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Award className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger 
              value="leaderboard" 
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="mt-6">
            {loading ? (
              <CenteredLoader message="Loading achievements..." />
            ) : error ? (
              <Card className="p-8 text-center text-destructive">
                <div className="flex flex-col items-center gap-2">
                  <Lock className="h-12 w-12" />
                  <h3 className="font-medium text-lg">Error Loading Achievements</h3>
                  <p>{error}</p>
                  <Button 
                    onClick={() => window.location.reload()}
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => {
                  const isUnlocked = userAchievements.some(
                    ua => ua.achievementId === achievement.id
                  )
                  
                  return (
                    <Card 
                      key={achievement.id} 
                      className={cn(
                        "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden",
                        isUnlocked 
                          ? "border-l-4 border-l-primary" 
                          : "opacity-70"
                      )}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "p-2 rounded-lg",
                              getRarityBg(achievement.rarity),
                              isUnlocked ? "" : "grayscale"
                            )}>
                              {getRarityIcon(achievement.rarity)}
                            </div>
                            <div>
                              <CardTitle className="text-lg line-clamp-1">
                                {achievement.title}
                              </CardTitle>
                              <Badge 
                                className={cn(
                                  "text-xs mt-1",
                                  getRarityColor(achievement.rarity)
                                )}
                              >
                                {getRarityName(achievement.rarity)}
                              </Badge>
                            </div>
                          </div>
                          {isUnlocked && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <CardDescription>
                          {achievement.description}
                        </CardDescription>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{achievement.points} pts</span>
                          </div>
                          
                          <Badge 
                            className={cn(
                              "text-xs capitalize",
                              achievement.category === "participation" && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                              achievement.category === "contribution" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                              achievement.category === "exploration" && "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
                              achievement.category === "milestone" && "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
                              achievement.category === "special" && "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
                            )}
                          >
                            {achievement.category}
                          </Badge>
                        </div>
                        
                        {!isUnlocked && (
                          <div className="pt-2 border-t border-border">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Lock className="h-4 w-4" />
                              <span>Locked</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-6">
            {loading ? (
              <CenteredLoader message="Loading leaderboard..." />
            ) : error ? (
              <Card className="p-8 text-center text-destructive">
                <div className="flex flex-col items-center gap-2">
                  <Lock className="h-12 w-12" />
                  <h3 className="font-medium text-lg">Error Loading Leaderboard</h3>
                  <p>{error}</p>
                  <Button 
                    onClick={() => window.location.reload()}
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl">
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {leaderboard.slice(0, 20).map((entry, index) => (
                      <div 
                        key={entry.userId} 
                        className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <div className="flex items-center gap-4 w-full">
                          <div className="flex items-center gap-3 w-full">
                            {index < 3 ? (
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold">
                                {index + 1}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-medium">
                                {index + 1}
                              </div>
                            )}
                            
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={entry.userAvatar} />
                              <AvatarFallback>
                                {entry.userName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white truncate">
                                {entry.userName}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Trophy className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium">
                                {entry.totalPoints}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Your Progress
                </CardTitle>
                <CardDescription>
                  Track your journey through community achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Achievement Completion</span>
                    <span className="text-sm text-muted-foreground">
                      {unlockedAchievements} of {totalAchievements}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full" 
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium">Current Streak</span>
                      </div>
                      <div className="text-2xl font-bold">7 days</div>
                      <div className="text-xs text-muted-foreground">Keep it up!</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">This Week</span>
                      </div>
                      <div className="text-2xl font-bold">142 pts</div>
                      <div className="text-xs text-muted-foreground">+25% from last week</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h3 className="font-medium mb-3">Recent Achievements</h3>
                  <div className="space-y-3">
                    {userAchievements.slice(0, 5).map((userAchievement) => (
                      <div 
                        key={userAchievement.id} 
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <div className={cn(
                          "p-2 rounded-lg",
                          getRarityBg(userAchievement.achievement.rarity)
                        )}>
                          {getRarityIcon(userAchievement.achievement.rarity)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {userAchievement.achievement.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(userAchievement.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs font-medium">
                            {userAchievement.achievement.points}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}