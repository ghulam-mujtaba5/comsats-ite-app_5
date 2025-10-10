"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Sparkles,
  Medal,
  UserCheck,
  Target,
  Heart,
  FileText,
  MessageSquare,
  Users,
  Filter,
  Search
} from "lucide-react"
import { BADGES, getRarityColor } from "@/lib/gamification"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface EnhancedBadgeShowcaseProps {
  points: number
  level: number
  earnedBadgeIds: string[]
}

export function EnhancedBadgeShowcase({ points, level, earnedBadgeIds }: EnhancedBadgeShowcaseProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRarity, setFilterRarity] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"rarity" | "points" | "name">("rarity")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null)

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      Trophy, Star, Award, Crown, Shield, Zap, Flame, CheckCircle,
      Medal, UserCheck, Target, Heart, FileText, MessageSquare, Users
    }
    return icons[iconName] || Star
  }

  const earnedBadges = BADGES.filter(b => earnedBadgeIds.includes(b.id))
  const lockedBadges = BADGES.filter(b => !earnedBadgeIds.includes(b.id))

  // Sort badges by rarity for better display
  const sortedEarnedBadges = [...earnedBadges].sort((a, b) => {
    const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic']
    return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity)
  })

  const getRarityGlow = (rarity: string) => {
    const glows = {
      mythic: 'shadow-lg shadow-red-500/50',
      legendary: 'shadow-lg shadow-yellow-500/50',
      epic: 'shadow-lg shadow-purple-500/50',
      rare: 'shadow-lg shadow-blue-500/50',
      uncommon: 'shadow-lg shadow-green-500/50',
      common: 'shadow-md shadow-slate-500/30'
    }
    return glows[rarity as keyof typeof glows] || glows.common
  }

  const getRarityPulse = (rarity: string) => {
    const pulses = {
      mythic: 'animate-pulse',
      legendary: 'animate-pulse',
      epic: '',
      rare: '',
      uncommon: '',
      common: ''
    }
    return pulses[rarity as keyof typeof pulses] || ''
  }

  // Filter and sort badges
  const filteredBadges = [...earnedBadges, ...lockedBadges].filter(badge => {
    const matchesSearch = badge.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRarity = filterRarity === "all" || badge.rarity === filterRarity
    return matchesSearch && matchesRarity
  }).sort((a, b) => {
    if (sortBy === "rarity") {
      const rarityOrder = ['mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common']
      return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity)
    } else if (sortBy === "points") {
      return b.points - a.points
    } else {
      return a.name.localeCompare(b.name)
    }
  })

  return (
    <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-5 w-5 text-purple-600" />
          </motion.div>
          Rewards & Badges
          <Badge variant="secondary" className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            {earnedBadges.length} / {BADGES.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-8 relative z-10">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search badges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 dark:bg-slate-800/80"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 text-sm"
            >
              <option value="all">All Rarities</option>
              <option value="mythic">Mythic</option>
              <option value="legendary">Legendary</option>
              <option value="epic">Epic</option>
              <option value="rare">Rare</option>
              <option value="uncommon">Uncommon</option>
              <option value="common">Common</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 text-sm"
            >
              <option value="rarity">Sort by Rarity</option>
              <option value="points">Sort by Points</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-200/30 dark:border-purple-800/30">
          <div className="flex justify-between text-sm mb-3">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Collection Progress</span>
            <motion.span 
              className="text-purple-600 dark:text-purple-400 font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {Math.round((earnedBadges.length / BADGES.length) * 100)}%
            </motion.span>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <Progress 
              value={(earnedBadges.length / BADGES.length) * 100} 
              className="h-3 rounded-full overflow-hidden"
            />
          </motion.div>
          
          {/* Achievement milestones */}
          <div className="flex justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                Earned Badges ({earnedBadges.length})
              </h3>
              <div className="ml-auto flex gap-1">
                {['mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'].map(rarity => {
                  const count = sortedEarnedBadges.filter(b => b.rarity === rarity).length
                  if (count === 0) return null
                  return (
                    <Badge 
                      key={rarity} 
                      variant="outline" 
                      className={cn(
                        "text-xs py-0 px-1.5",
                        getRarityColor(rarity)
                      )}
                    >
                      {count}
                    </Badge>
                  )
                })}
              </div>
            </div>
            
            <div className={cn(
              "gap-3",
              viewMode === "grid" 
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" 
                : "grid grid-cols-1 gap-2"
            )}>
              <AnimatePresence>
                {sortedEarnedBadges.map((badge, idx) => {
                  const Icon = getIcon(badge.icon)
                  return (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                      transition={{ 
                        delay: idx * 0.05,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                      whileHover={{ 
                        scale: 1.1, 
                        y: -10,
                        zIndex: 10
                      }}
                      className="relative group"
                      onMouseEnter={() => setHoveredBadge(badge.id)}
                      onMouseLeave={() => setHoveredBadge(null)}
                    >
                      <div className={cn(
                        "p-4 rounded-xl border-2 text-center relative overflow-hidden transition-all",
                        getRarityGlow(badge.rarity),
                        getRarityPulse(badge.rarity),
                        badge.rarity === 'mythic' ? 'bg-gradient-to-br from-red-500/30 to-yellow-500/30 border-red-400 shadow-lg shadow-red-500/30' :
                        badge.rarity === 'legendary' ? 'bg-gradient-to-br from-yellow-500/30 to-amber-500/30 border-yellow-400 shadow-lg shadow-yellow-500/30' :
                        badge.rarity === 'epic' ? 'bg-gradient-to-br from-purple-500/30 to-indigo-500/30 border-purple-400 shadow-lg shadow-purple-500/30' :
                        badge.rarity === 'rare' ? 'bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border-blue-400' :
                        badge.rarity === 'uncommon' ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-green-400' :
                        'bg-gradient-to-br from-slate-500/30 to-gray-500/30 border-slate-400'
                      )}>
                        {/* Shine effect on hover */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                        
                        {/* Animated border */}
                        <motion.div
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: badge.rarity === 'mythic' ? 'linear-gradient(45deg, #ef4444, #f59e0b, #ef4444)' :
                                       badge.rarity === 'legendary' ? 'linear-gradient(45deg, #f59e0b, #fbbf24, #f59e0b)' :
                                       badge.rarity === 'epic' ? 'linear-gradient(45deg, #8b5cf6, #6366f1, #8b5cf6)' :
                                       badge.rarity === 'rare' ? 'linear-gradient(45deg, #3b82f6, #06b6d4, #3b82f6)' :
                                       badge.rarity === 'uncommon' ? 'linear-gradient(45deg, #10b981, #059669, #10b981)' :
                                       'linear-gradient(45deg, #64748b, #475569, #64748b)'
                          }}
                          initial={{ backgroundPosition: '0% 50%' }}
                          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                        
                        <div className="relative z-10">
                          <motion.div
                            whileHover={{ rotate: 10 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Icon className={cn(
                              "h-8 w-8 mx-auto mb-2",
                              badge.rarity === 'mythic' ? 'text-red-600 dark:text-red-400' :
                              badge.rarity === 'legendary' ? 'text-yellow-600 dark:text-yellow-400' :
                              badge.rarity === 'epic' ? 'text-purple-600 dark:text-purple-400' :
                              badge.rarity === 'rare' ? 'text-blue-600 dark:text-blue-400' :
                              badge.rarity === 'uncommon' ? 'text-green-600 dark:text-green-400' :
                              'text-slate-600 dark:text-slate-400'
                            )} />
                          </motion.div>
                          
                          <p className="text-xs font-bold text-slate-900 dark:text-white mb-1 truncate">
                            {badge.name}
                          </p>
                          
                          <Badge variant="outline" className={cn(
                            "text-xs py-0 px-2",
                            getRarityColor(badge.rarity)
                          )}>
                            {badge.rarity}
                          </Badge>
                        </div>
                        
                        {/* Check mark */}
                        <motion.div
                          className="absolute top-1 right-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                        >
                          <div className="bg-green-500 rounded-full p-0.5">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        </motion.div>
                        
                        {/* Floating particles effect */}
                        <AnimatePresence>
                          {hoveredBadge === badge.id && (
                            <motion.div
                              className="absolute inset-0 pointer-events-none"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              {[...Array(5)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="absolute w-1 h-1 rounded-full bg-white"
                                  initial={{ 
                                    x: Math.random() * 100, 
                                    y: Math.random() * 100,
                                    opacity: 0
                                  }}
                                  animate={{ 
                                    y: [null, -20, -40],
                                    opacity: [0, 1, 0],
                                    x: `${Math.random() * 20 - 10}px`
                                  }}
                                  transition={{ 
                                    duration: 2 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeOut"
                                  }}
                                />
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      {/* Tooltip */}
                      <motion.div 
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20"
                        initial={{ y: 10 }}
                        whileHover={{ opacity: 100 }}
                      >
                        <div className="font-medium">{badge.name}</div>
                        <div className="text-slate-300">
                          {badge.points} points • Level {badge.level}+
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                      </motion.div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Locked Badges */}
        {lockedBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-slate-500" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                Locked Badges ({lockedBadges.length})
              </h3>
            </div>
            
            <div className={cn(
              "gap-3",
              viewMode === "grid" 
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" 
                : "grid grid-cols-1 gap-2"
            )}>
              {lockedBadges.slice(0, 10).map((badge, idx) => {
                const Icon = getIcon(badge.icon)
                const canUnlock = points >= badge.points && level >= badge.level
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative group"
                  >
                    <div className={cn(
                      "p-4 rounded-xl border-2 text-center relative overflow-hidden transition-all",
                      canUnlock 
                        ? "bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-400/50 animate-pulse shadow-lg shadow-yellow-500/20" 
                        : "bg-slate-100/50 dark:bg-slate-800/50 border-slate-300/50 dark:border-slate-700/50 opacity-70"
                    )}>
                      <Icon className="h-8 w-8 mx-auto mb-2 text-slate-400 dark:text-slate-600" />
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 truncate">
                        {badge.name}
                      </p>
                      <div className="text-xs text-slate-500 dark:text-slate-500">
                        {canUnlock ? (
                          <motion.span 
                            className="text-yellow-600 dark:text-yellow-400 font-bold"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            Ready to unlock!
                          </motion.span>
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
                      
                      {/* Unlock progress bar for near badges */}
                      {!canUnlock && (points >= badge.points * 0.7) && (
                        <div className="absolute bottom-1 left-1 right-1">
                          <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((points / badge.points) * 100, 100)}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
            
            {lockedBadges.length > 10 && (
              <motion.p 
                className="text-center text-sm text-slate-500 dark:text-slate-400 mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                + {lockedBadges.length - 10} more badges to unlock
              </motion.p>
            )}
          </motion.div>
        )}

        {/* All Badges View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-purple-500" />
            <h3 className="font-bold text-slate-900 dark:text-white">
              All Badges
            </h3>
            <Badge variant="outline" className="ml-auto">
              {filteredBadges.length} shown
            </Badge>
          </div>
          
          <div className={cn(
            "gap-3",
            viewMode === "grid" 
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" 
              : "grid grid-cols-1 gap-2"
          )}>
            {filteredBadges.map((badge, idx) => {
              const Icon = getIcon(badge.icon)
              const isEarned = earnedBadgeIds.includes(badge.id)
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative group"
                >
                  <div className={cn(
                    "p-3 rounded-xl border-2 text-center relative overflow-hidden transition-all",
                    isEarned 
                      ? badge.rarity === 'mythic' ? 'bg-gradient-to-br from-red-500/20 to-yellow-500/20 border-red-400 shadow-lg shadow-red-500/20' :
                        badge.rarity === 'legendary' ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-400 shadow-lg shadow-yellow-500/20' :
                        badge.rarity === 'epic' ? 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-400 shadow-lg shadow-purple-500/20' :
                        badge.rarity === 'rare' ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-400' :
                        badge.rarity === 'uncommon' ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400' :
                        'bg-gradient-to-br from-slate-500/20 to-gray-500/20 border-slate-400'
                      : "bg-slate-100/50 dark:bg-slate-800/50 border-slate-300/50 dark:border-slate-700/50 opacity-70"
                  )}>
                    <Icon className={cn(
                      "h-6 w-6 mx-auto mb-2",
                      isEarned
                        ? badge.rarity === 'mythic' ? 'text-red-600 dark:text-red-400' :
                          badge.rarity === 'legendary' ? 'text-yellow-600 dark:text-yellow-400' :
                          badge.rarity === 'epic' ? 'text-purple-600 dark:text-purple-400' :
                          badge.rarity === 'rare' ? 'text-blue-600 dark:text-blue-400' :
                          badge.rarity === 'uncommon' ? 'text-green-600 dark:text-green-400' :
                          'text-slate-600 dark:text-slate-400'
                        : 'text-slate-400 dark:text-slate-600'
                    )} />
                    <p className="text-xs font-bold text-slate-900 dark:text-white mb-1 truncate">
                      {badge.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={cn(
                        "text-xs py-0 px-1",
                        isEarned ? getRarityColor(badge.rarity) : "text-slate-500 border-slate-300"
                      )}>
                        {badge.rarity}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {badge.points}
                      </span>
                    </div>
                    
                    {/* Status indicator */}
                    {isEarned ? (
                      <div className="absolute top-1 right-1">
                        <div className="bg-green-500 rounded-full p-0.5">
                          <CheckCircle className="h-2 w-2 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="absolute top-1 right-1">
                        <Lock className="h-2 w-2 text-slate-400" />
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}