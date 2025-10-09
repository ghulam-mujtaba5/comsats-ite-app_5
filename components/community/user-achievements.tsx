"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Trophy, Award } from "lucide-react"
import { useAchievements } from "@/hooks/use-achievements"
import { cn } from "@/lib/utils"

interface UserAchievementsProps {
  userId: string
}

export function UserAchievements({ userId }: UserAchievementsProps) {
  const { 
    userAchievements, 
    loading, 
    error,
    getRarityColor,
    getRarityBg
  } = useAchievements()

  // Filter achievements for this specific user
  const userSpecificAchievements = userAchievements.filter(
    ua => ua.userId === userId
  )

  if (loading) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements
          </CardTitle>
          <CardDescription>Loading achievements...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements
          </CardTitle>
          <CardDescription>Error loading achievements</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (userSpecificAchievements.length === 0) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements
          </CardTitle>
          <CardDescription>
            This user hasn't unlocked any achievements yet.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Group achievements by rarity
  const achievementsByRarity = userSpecificAchievements.reduce((acc, ua) => {
    const rarity = ua.achievement.rarity
    if (!acc[rarity]) {
      acc[rarity] = []
    }
    acc[rarity].push(ua)
    return acc
  }, {} as Record<string, typeof userSpecificAchievements>)

  const totalPoints = userSpecificAchievements.reduce(
    (total, ua) => total + (ua.achievement?.points || 0), 
    0
  )

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Achievements
          <Badge variant="secondary" className="ml-2">
            {totalPoints} pts
          </Badge>
        </CardTitle>
        <CardDescription>
          {userSpecificAchievements.length} achievements unlocked
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(achievementsByRarity).map(([rarity, achievements]) => (
          <div key={rarity}>
            <h3 className={cn(
              "text-sm font-medium mb-3 capitalize flex items-center gap-2",
              getRarityColor(rarity)
            )}>
              <Award className="h-4 w-4" />
              {rarity} ({achievements.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {achievements.map((userAchievement) => (
                <div 
                  key={userAchievement.id}
                  className={cn(
                    "flex flex-col items-center p-3 rounded-lg border",
                    getRarityBg(rarity),
                    "border-border"
                  )}
                >
                  <div className="p-2 rounded-full bg-background/50 mb-2">
                    <Award className={cn("h-5 w-5", getRarityColor(rarity))} />
                  </div>
                  <h4 className="text-xs font-medium text-center line-clamp-2">
                    {userAchievement.achievement.title}
                  </h4>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs font-medium">
                      {userAchievement.achievement.points}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}