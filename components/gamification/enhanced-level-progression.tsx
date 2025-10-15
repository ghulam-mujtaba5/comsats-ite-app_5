"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  Trophy, 
  Star, 
  Award, 
  Crown, 
  Shield, 
  Zap, 
  Flame,
  Users,
  BookOpen,
  Heart,
  UserPlus,
  TrendingUp,
  Target,
  Sparkles
} from "lucide-react"
import { LEVELS, getProgressToNextLevel } from "@/lib/gamification"
import { cn } from "@/lib/utils"

interface EnhancedLevelProgressionProps {
  points: number
  className?: string
}

export function EnhancedLevelProgression({ points, className }: EnhancedLevelProgressionProps) {
  const progressData = getProgressToNextLevel(points)
  const currentLevel = progressData.currentLevel
  const nextLevel = progressData.nextLevel

  const getLevelIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      Trophy, Star, Award, Crown, Shield, Zap, Flame, Users,
      BookOpen, Heart, UserPlus, TrendingUp, Target
    }
    return icons[iconName] || Star
  }

  const LevelIcon = getLevelIcon(currentLevel.icon)

  return (
    <Card className={cn(
      "border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 glass-card glass-border-light glass-hover glass-depth",
      className
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <LevelIcon className="h-5 w-5 text-purple-600" />
          </motion.div>
          Level Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Current Level */}
        <div className="text-center">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br mb-3"
            style={{
              background: `linear-gradient(135deg, ${currentLevel.gradient})`
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LevelIcon className="h-8 w-8 text-white" />
          </motion.div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {currentLevel.name}
          </h3>
          <div className="mt-1">
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              Level {currentLevel.level}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {points.toLocaleString()} pts
            </span>
            {nextLevel ? (
              <span className="text-slate-600 dark:text-slate-400">
                {progressData.pointsToNext.toLocaleString()} to go
              </span>
            ) : (
              <span className="text-green-600 dark:text-green-400 font-medium">
                Max Level!
              </span>
            )}
          </div>
          
          <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className={cn(
                "absolute top-0 left-0 h-full rounded-full",
                `bg-gradient-to-r ${currentLevel.gradient}`
              )}
              initial={{ width: 0 }}
              animate={{ width: `${progressData.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span>{currentLevel.minPoints.toLocaleString()}</span>
            {nextLevel ? (
              <span>{nextLevel.minPoints.toLocaleString()}</span>
            ) : (
              <span>∞</span>
            )}
          </div>
        </div>

        {/* Next Level Preview */}
        {nextLevel && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br"
                style={{ background: `linear-gradient(135deg, ${nextLevel.gradient})` }}
              >
                {(() => {
                  const NextLevelIcon = getLevelIcon(nextLevel.icon)
                  return <NextLevelIcon className="h-4 w-4 text-white" />
                })()}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Next: {nextLevel.name}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Level {nextLevel.level}
                </p>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex flex-wrap gap-1">
                {nextLevel.perks.slice(0, 2).map((perk, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                    <Sparkles className="h-2.5 w-2.5" />
                    {perk}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Level Milestones */}
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-2">
            Milestones
          </h4>
          <div className="space-y-2">
            {LEVELS.filter(level => level.level <= currentLevel.level + 1 || level.level === 0).map((level, idx) => {
              const LevelMilestoneIcon = getLevelIcon(level.icon)
              const isCurrent = level.level === currentLevel.level
              const isCompleted = level.level < currentLevel.level
              
              return (
                <div 
                  key={level.level}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg",
                    isCurrent 
                      ? "bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700" 
                      : "bg-white/50 dark:bg-slate-800/50"
                  )}
                >
                  <div 
                    className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-full",
                      isCompleted 
                        ? "bg-gradient-to-br from-green-500 to-emerald-500" 
                        : isCurrent 
                          ? `bg-gradient-to-br ${level.gradient}`
                          : "bg-slate-200 dark:bg-slate-700"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-3 w-3 text-white" />
                    ) : (
                      <LevelMilestoneIcon 
                        className={cn(
                          "h-3 w-3",
                          isCurrent ? "text-white" : "text-slate-500 dark:text-slate-400"
                        )} 
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className={cn(
                        "text-xs font-medium truncate",
                        isCurrent ? "text-purple-700 dark:text-purple-300" : "text-slate-700 dark:text-slate-300"
                      )}>
                        {level.name}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        ({level.minPoints.toLocaleString()}+ pts)
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}