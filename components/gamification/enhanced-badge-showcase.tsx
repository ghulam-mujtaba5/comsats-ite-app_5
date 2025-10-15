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
  Search,
  Grid,
  List
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
    <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 relative overflow-hidden glass-card glass-border-light glass-hover glass-depth">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      
      <CardHeader className="relative z-10 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-5 w-5 text-purple-600" />
          </motion.div>
          Badges
          <Badge variant="secondary" className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs h-5">
            {earnedBadges.length} / {BADGES.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-5 relative z-10">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search badges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 bg-white/80 dark:bg-slate-800/80 text-xs"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 text-xs"
            >
              <option value="all">All</option>
              <option value="mythic">Mythic</option>
              <option value="legendary">Legendary</option>
              <option value="epic">Epic</option>
              <option value="rare">Rare</option>
              <option value="uncommon">Uncommon</option>
              <option value="common">Common</option>
            </select>
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600"
            >
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-purple-200/30 dark:border-purple-800/30">
          <div className="flex justify-between text-xs mb-2">
            <span className="font-medium text-slate-700 dark:text-slate-300">Collection</span>
            <motion.span 
              className="text-purple-600 dark:text-purple-400 font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {Math.round((earnedBadges.length / BADGES.length) * 100)}%
            </motion.span>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(earnedBadges.length / BADGES.length) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Progress 
              value={(earnedBadges.length / BADGES.length) * 100} 
              className="h-2 bg-slate-200 dark:bg-slate-700" 
            />
          </motion.div>
        </div>

        {/* Badges Grid/List */}
        <div className={cn(
          "grid gap-3",
          viewMode === "grid" 
            ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-5" 
            : "grid-cols-1"
        )}>
          <AnimatePresence>
            {filteredBadges.map((badge) => {
              const isEarned = earnedBadgeIds.includes(badge.id)
              const IconComponent = getIcon(badge.icon)
              const rarityColor = getRarityColor(badge.rarity)
              
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -5 }}
                  className={cn(
                    "relative rounded-xl p-3 text-center border transition-all duration-300",
                    isEarned 
                      ? `bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 ${getRarityGlow(badge.rarity)}`
                      : "bg-slate-100/50 dark:bg-slate-900/50 border-dashed border-slate-300 dark:border-slate-700",
                    viewMode === "list" && "flex items-center gap-3"
                  )}
                  onMouseEnter={() => setHoveredBadge(badge.id)}
                  onMouseLeave={() => setHoveredBadge(null)}
                >
                  <div className={cn(
                    "flex items-center justify-center mx-auto mb-2 rounded-full p-2",
                    viewMode === "list" && "flex-shrink-0",
                    isEarned 
                      ? `${rarityColor.replace('text-', 'bg-').replace('border-', 'border-')} bg-opacity-20`
                      : "bg-slate-200 dark:bg-slate-700"
                  )}>
                    {isEarned ? (
                      <IconComponent className={cn("h-5 w-5", rarityColor.split(' ')[0])} />
                    ) : (
                      <Lock className="h-4 w-4 text-slate-500" />
                    )}
                  </div>
                  
                  <div className={viewMode === "list" ? "text-left flex-1" : ""}>
                    <h3 className={cn(
                      "font-medium text-xs truncate",
                      isEarned ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
                    )}>
                      {badge.name}
                    </h3>
                    {viewMode === "list" && (
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[8px] px-1.5 py-0.5 h-4">
                          {badge.points} pts
                        </Badge>
                        <Badge variant="secondary" className={cn("text-[8px] px-1.5 py-0.5 h-4", rarityColor)}>
                          {badge.rarity}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {viewMode === "grid" && (
                    <div className="absolute bottom-1 right-1">
                      <Badge variant="secondary" className={cn("text-[8px] px-1 py-0 h-3", rarityColor)}>
                        {badge.rarity.charAt(0)}
                      </Badge>
                    </div>
                  )}
                  
                  {hoveredBadge === badge.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl"
                    >
                      <div className="text-white text-center p-2">
                        <div className="text-xs font-medium">{badge.name}</div>
                        <div className="text-[10px] opacity-80">{badge.points} points</div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {filteredBadges.length === 0 && (
          <div className="text-center py-8">
            <Sparkles className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No badges found
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}