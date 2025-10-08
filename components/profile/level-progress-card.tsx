"use client"

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Trophy, 
  Zap, 
  Crown, 
  Shield, 
  Star, 
  TrendingUp,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { getLevelForPoints, getProgressToNextLevel, LEVELS } from '@/lib/gamification'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LevelProgressCardProps {
  points: number
  className?: string
}

export function LevelProgressCard({ points, className }: LevelProgressCardProps) {
  const { currentLevel, nextLevel, progress, pointsToNext, pointsInLevel } = getProgressToNextLevel(points)
  
  const LevelIcon = currentLevel.level >= 9 ? Shield :
                    currentLevel.level >= 7 ? Crown :
                    currentLevel.level >= 5 ? Trophy :
                    currentLevel.level >= 3 ? Star : Zap

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className={cn(
        "border-2 relative overflow-hidden",
        currentLevel.level >= 9 ? "border-red-400/50 bg-gradient-to-br from-red-500/10 via-orange-500/10 to-yellow-500/10" :
        currentLevel.level >= 7 ? "border-indigo-400/50 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" :
        currentLevel.level >= 5 ? "border-yellow-400/50 bg-gradient-to-br from-yellow-500/10 to-amber-500/10" :
        currentLevel.level >= 3 ? "border-purple-400/50 bg-gradient-to-br from-purple-500/10 to-indigo-500/10" :
        "border-blue-400/50 bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
      )}>
        {/* Animated background effect */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className={cn(
              "absolute inset-0 bg-gradient-to-r",
              `from-${currentLevel.color}-500 to-transparent`
            )}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "linear"
            }}
          />
        </div>

        <CardContent className="p-6 relative z-10">
          {/* Level Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className={cn(
                  "p-3 rounded-xl bg-gradient-to-br shadow-lg",
                  currentLevel.gradient
                )}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <LevelIcon className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Level {currentLevel.level}
                  </h3>
                  {currentLevel.level >= 9 && (
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    >
                      <Sparkles className="h-5 w-5 text-yellow-500" />
                    </motion.div>
                  )}
                </div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {currentLevel.name}
                </p>
              </div>
            </div>
            
            <Badge 
              variant="outline" 
              className={cn(
                "px-3 py-1 font-bold text-sm border-2",
                currentLevel.level >= 9 ? "bg-red-500/20 text-red-700 border-red-400" :
                currentLevel.level >= 7 ? "bg-indigo-500/20 text-indigo-700 border-indigo-400" :
                currentLevel.level >= 5 ? "bg-yellow-500/20 text-yellow-700 border-yellow-400" :
                currentLevel.level >= 3 ? "bg-purple-500/20 text-purple-700 border-purple-400" :
                "bg-blue-500/20 text-blue-700 border-blue-400"
              )}
            >
              {currentLevel.title}
            </Badge>
          </div>

          {/* Points Display */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2 mb-2">
              <motion.span 
                className="text-4xl font-bold text-slate-900 dark:text-white"
                key={points}
                initial={{ scale: 1.5, color: '#fbbf24' }}
                animate={{ scale: 1, color: 'currentColor' }}
                transition={{ duration: 0.5 }}
              >
                {points.toLocaleString()}
              </motion.span>
              <span className="text-lg text-slate-600 dark:text-slate-400">points</span>
            </div>
            
            {nextLevel ? (
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>{pointsInLevel.toLocaleString()} points in this level</span>
                <span className="font-semibold text-primary">
                  {pointsToNext.toLocaleString()} to Level {nextLevel.level}
                </span>
              </div>
            ) : (
              <p className="text-sm font-bold text-red-600 dark:text-red-400">
                🎉 Maximum Level Reached! You're a Core Team Member! 🎉
              </p>
            )}
          </div>

          {/* Progress Bar */}
          {nextLevel && (
            <div className="space-y-2 mb-4">
              <div className="relative">
                <Progress value={progress} className="h-3" />
                <motion.div
                  className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  style={{ width: '30%' }}
                  animate={{
                    x: ['-100%', '400%'],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "linear"
                  }}
                />
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-400">
                  {currentLevel.name}
                </span>
                <span className="text-primary">
                  {progress.toFixed(1)}%
                </span>
                <span className="text-slate-600 dark:text-slate-400">
                  {nextLevel.name}
                </span>
              </div>
            </div>
          )}

          {/* Perks */}
          <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Level Perks:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentLevel.perks.map((perk, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                >
                  <div className={cn(
                    "h-1.5 w-1.5 rounded-full bg-gradient-to-r",
                    currentLevel.gradient
                  )} />
                  {perk}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Next Level Preview */}
          {nextLevel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Next: {nextLevel.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Unlock {nextLevel.perks.length} new perks
                  </p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/leaderboard">
                    View Ranking
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Core Team Invitation */}
          {currentLevel.level >= 9 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 p-4 rounded-xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white"
            >
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-6 w-6" />
                <h4 className="font-bold text-lg">Welcome to Core Team!</h4>
              </div>
              <p className="text-sm mb-3 opacity-90">
                You've reached the highest level! Explore team roles and become an official platform contributor.
              </p>
              <Button variant="secondary" size="sm" asChild className="w-full">
                <Link href="/contribute/team">
                  Explore Team Roles
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
