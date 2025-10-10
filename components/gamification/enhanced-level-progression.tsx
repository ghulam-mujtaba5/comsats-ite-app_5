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
      "border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20",
      className
    )}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <LevelIcon className="h-5 w-5 text-purple-600" />
          </motion.div>
          Level Progression
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Level */}
        <div className="text-center">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br mb-4"
            style={{
              background: `linear-gradient(135deg, ${currentLevel.gradient})`
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <LevelIcon className="h-10 w-10 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {currentLevel.name}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {currentLevel.title}
          </p>
          <div className="mt-2">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              Level {currentLevel.level}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {points.toLocaleString()} points
            </span>
            {nextLevel ? (
              <span className="text-slate-600 dark:text-slate-400">
                {progressData.pointsToNext.toLocaleString()} to go
              </span>
            ) : (
              <span className="text-green-600 dark:text-green-400 font-medium">
                Max Level Achieved!
              </span>
            )}
          </div>
          
          <div className="relative h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className={cn(
                "absolute top-0 left-0 h-full rounded-full",
                `bg-gradient-to-r ${currentLevel.gradient}`
              )}
              initial={{ width: 0 }}
              animate={{ width: `${progressData.progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            
            {/* Animated particles */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full"
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{
                backgroundImage: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)`,
                backgroundSize: '200% 100%'
              }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{currentLevel.minPoints.toLocaleString()} pts</span>
            {nextLevel ? (
              <span>{nextLevel.minPoints.toLocaleString()} pts</span>
            ) : (
              <span>∞</span>
            )}
          </div>
        </div>

        {/* Next Level Preview */}
        {nextLevel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br"
                style={{ background: `linear-gradient(135deg, ${nextLevel.gradient})` }}
              >
                {(() => {
                  const NextLevelIcon = getLevelIcon(nextLevel.icon)
                  return <NextLevelIcon className="h-6 w-6 text-white" />
                })()}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Next: {nextLevel.name}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Level {nextLevel.level}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Perks you'll unlock:
              </h5>
              <ul className="space-y-1">
                {nextLevel.perks.slice(0, 3).map((perk, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              {nextLevel.perks.length > 3 && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  + {nextLevel.perks.length - 3} more perks
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Level Milestones */}
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
            Level Milestones
          </h4>
          <div className="space-y-3">
            {LEVELS.filter(level => level.level <= currentLevel.level + 2 || level.level === 0).map((level, idx) => {
              const LevelMilestoneIcon = getLevelIcon(level.icon)
              const isCurrent = level.level === currentLevel.level
              const isCompleted = level.level < currentLevel.level
              
              return (
                <motion.div
                  key={level.level}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border",
                    isCurrent 
                      ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-400/50 shadow-sm" 
                      : isCompleted
                      ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-400/50"
                      : "bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                  )}
                >
                  <div 
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0",
                      isCurrent || isCompleted
                        ? `bg-gradient-to-br ${level.gradient}`
                        : "bg-slate-200 dark:bg-slate-700"
                    )}
                  >
                    <LevelMilestoneIcon 
                      className={cn(
                        "h-5 w-5",
                        isCurrent || isCompleted ? "text-white" : "text-slate-400"
                      )} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className={cn(
                        "font-medium truncate",
                        isCurrent 
                          ? "text-purple-700 dark:text-purple-300" 
                          : isCompleted
                          ? "text-green-700 dark:text-green-300"
                          : "text-slate-700 dark:text-slate-300"
                      )}>
                        {level.name}
                      </h5>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500 text-white">
                          Current
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-green-500 text-white">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                      {level.minPoints.toLocaleString()}+ points
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      Lvl {level.level}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}