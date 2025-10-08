"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, 
  Star, 
  Award, 
  Crown, 
  Shield, 
  Zap, 
  Flame,
  Lock,
  CheckCircle,
  Sparkles
} from 'lucide-react'
import { BADGES, getRarityColor } from '@/lib/gamification'
import { cn } from '@/lib/utils'

interface RewardsShowcaseProps {
  points: number
  level: number
  earnedBadgeIds: string[]
}

export function RewardsShowcase({ points, level, earnedBadgeIds }: RewardsShowcaseProps) {
  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      Trophy, Star, Award, Crown, Shield, Zap, Flame, CheckCircle
    }
    return icons[iconName] || Star
  }

  const earnedBadges = BADGES.filter(b => earnedBadgeIds.includes(b.id))
  const lockedBadges = BADGES.filter(b => !earnedBadgeIds.includes(b.id))

  return (
    <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Rewards & Badges
          <Badge variant="secondary" className="ml-auto">
            {earnedBadges.length} / {BADGES.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Collection Progress</span>
            <span className="text-purple-600 dark:text-purple-400 font-bold">
              {Math.round((earnedBadges.length / BADGES.length) * 100)}%
            </span>
          </div>
          <Progress value={(earnedBadges.length / BADGES.length) * 100} className="h-2" />
        </div>

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Earned Badges ({earnedBadges.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <AnimatePresence>
                {earnedBadges.map((badge, idx) => {
                  const Icon = getIcon(badge.icon)
                  return (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      transition={{ 
                        delay: idx * 0.05,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="relative group"
                    >
                      <div className={cn(
                        "p-4 rounded-xl border-2 text-center relative overflow-hidden transition-all",
                        badge.rarity === 'mythic' ? 'bg-gradient-to-br from-red-500/20 to-yellow-500/20 border-red-400 shadow-lg shadow-red-500/20' :
                        badge.rarity === 'legendary' ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-400 shadow-lg shadow-yellow-500/20' :
                        badge.rarity === 'epic' ? 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-400 shadow-lg shadow-purple-500/20' :
                        badge.rarity === 'rare' ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-400' :
                        badge.rarity === 'uncommon' ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400' :
                        'bg-gradient-to-br from-slate-500/20 to-gray-500/20 border-slate-400'
                      )}>
                        {/* Shine effect on hover */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                        
                        <Icon className={cn(
                          "h-8 w-8 mx-auto mb-2 relative z-10",
                          badge.rarity === 'mythic' ? 'text-red-600 dark:text-red-400' :
                          badge.rarity === 'legendary' ? 'text-yellow-600 dark:text-yellow-400' :
                          badge.rarity === 'epic' ? 'text-purple-600 dark:text-purple-400' :
                          badge.rarity === 'rare' ? 'text-blue-600 dark:text-blue-400' :
                          badge.rarity === 'uncommon' ? 'text-green-600 dark:text-green-400' :
                          'text-slate-600 dark:text-slate-400'
                        )} />
                        <p className="text-xs font-bold text-slate-900 dark:text-white mb-1 relative z-10">
                          {badge.name}
                        </p>
                        <Badge variant="outline" className={cn(
                          "text-xs py-0 px-2 relative z-10",
                          getRarityColor(badge.rarity)
                        )}>
                          {badge.rarity}
                        </Badge>
                        
                        {/* Check mark */}
                        <div className="absolute top-1 right-1">
                          <div className="bg-green-500 rounded-full p-0.5">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                        {badge.points} points • Level {badge.level}+
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Locked Badges */}
        {lockedBadges.length > 0 && (
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Lock className="h-4 w-4 text-slate-500" />
              Locked Badges ({lockedBadges.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {lockedBadges.slice(0, 8).map((badge, idx) => {
                const Icon = getIcon(badge.icon)
                const canUnlock = points >= badge.points && level >= badge.level
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative group"
                  >
                    <div className={cn(
                      "p-4 rounded-xl border-2 text-center relative overflow-hidden transition-all",
                      canUnlock 
                        ? "bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-400/50 animate-pulse" 
                        : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 opacity-60"
                    )}>
                      <Icon className="h-8 w-8 mx-auto mb-2 text-slate-400 dark:text-slate-600" />
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                        {badge.name}
                      </p>
                      <div className="text-xs text-slate-500 dark:text-slate-500">
                        {canUnlock ? (
                          <span className="text-yellow-600 dark:text-yellow-400 font-bold">
                            Ready to unlock!
                          </span>
                        ) : (
                          <>
                            {badge.points > points && (
                              <div>{(badge.points - points).toLocaleString()} pts needed</div>
                            )}
                            {badge.level > level && (
                              <div>Level {badge.level} required</div>
                            )}
                          </>
                        )}
                      </div>
                      
                      {/* Lock icon */}
                      <div className="absolute top-1 right-1">
                        <Lock className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
            {lockedBadges.length > 8 && (
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-3">
                + {lockedBadges.length - 8} more badges to unlock
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
