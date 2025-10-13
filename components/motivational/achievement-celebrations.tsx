"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  Award, 
  Target, 
  Zap, 
  Flame,
  CheckCircle,
  Gift,
  Sparkles,
  Heart,
  Lock
} from "lucide-react"
import { useAnimation } from "@/contexts/animation-context"
import { useCelebrationAnimations } from "@/hooks/use-celebration-animations"

// Define achievement types
type AchievementType = 
  | 'academic_excellence'
  | 'consistency'
  | 'community_engagement'
  | 'helpfulness'
  | 'creativity'
  | 'leadership'
  | 'persistence'
  | 'innovation'
  | 'collaboration'
  | 'milestone'

interface Achievement {
  id: string
  type: AchievementType
  title: string
  description: string
  icon: React.ElementType
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points: number
  unlockedAt: Date
}

interface AchievementCelebrationProps {
  achievement: Achievement
  isVisible: boolean
  onComplete: () => void
}

export function AchievementCelebration({ 
  achievement, 
  isVisible, 
  onComplete 
}: AchievementCelebrationProps) {
  const { triggerConfetti, triggerBalloons, triggerFlickeringLights } = useCelebrationAnimations()

  // Trigger celebration effects when achievement is shown
  useEffect(() => {
    if (isVisible) {
      // Trigger appropriate celebration based on rarity
      switch (achievement.rarity) {
        case 'legendary':
          triggerConfetti({
            message: `Legendary Achievement!\n${achievement.title}`,
            duration: 7000,
            particleCount: 500
          })
          triggerBalloons({
            message: achievement.description,
            duration: 8000,
            balloonCount: 30
          })
          break
        
        case 'epic':
          triggerConfetti({
            message: `Epic Achievement!\n${achievement.title}`,
            duration: 6000,
            particleCount: 300
          })
          triggerFlickeringLights({
            message: achievement.description,
            duration: 5000
          })
          break
        
        case 'rare':
          triggerConfetti({
            message: `Rare Achievement!\n${achievement.title}`,
            duration: 5000,
            particleCount: 200
          })
          break
        
        default:
          triggerFlickeringLights({
            message: `Achievement Unlocked!\n${achievement.title}`,
            duration: 4000
          })
      }
    }
  }, [isVisible, achievement, triggerConfetti, triggerBalloons, triggerFlickeringLights])

  if (!isVisible) return null

  // Get rarity color
  const getRarityColor = () => {
    switch (achievement.rarity) {
      case 'legendary': return 'from-yellow-400 via-orange-500 to-red-500'
      case 'epic': return 'from-purple-500 to-indigo-600'
      case 'rare': return 'from-blue-400 to-cyan-500'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const rarityColor = getRarityColor()
  const IconComponent = achievement.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          initial={{ scale: 0.5, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.5, y: 50 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md w-full mx-4"
        >
          <div className="text-center">
            {/* Achievement badge */}
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${rarityColor} mb-6 relative`}>
              <IconComponent className="w-12 h-12 text-white" />
              <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
            </div>
            
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {achievement.title}
            </h2>
            
            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {achievement.description}
            </p>
            
            {/* Points */}
            <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold text-gray-900 dark:text-white">
                +{achievement.points} XP
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`h-2 rounded-full bg-gradient-to-r ${rarityColor}`}
              />
            </div>
            
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Continue
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Hook for managing achievements
export function useAchievements() {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([])
  const [currentCelebration, setCurrentCelebration] = useState<Achievement | null>(null)

  // Define available achievements
  const achievements: Achievement[] = [
    {
      id: 'first_login',
      type: 'milestone',
      title: 'First Steps',
      description: 'Successfully logged into CampusAxis',
      icon: Target,
      rarity: 'common',
      points: 10,
      unlockedAt: new Date()
    },
    {
      id: 'first_post',
      type: 'community_engagement',
      title: 'Community Starter',
      description: 'Created your first community post',
      icon: Sparkles,
      rarity: 'common',
      points: 25,
      unlockedAt: new Date()
    },
    {
      id: 'helpful_user',
      type: 'helpfulness',
      title: 'Helpful Soul',
      description: 'Received 10 helpful votes',
      icon: Heart,
      rarity: 'rare',
      points: 50,
      unlockedAt: new Date()
    },
    {
      id: 'week_streak',
      type: 'consistency',
      title: 'Week Warrior',
      description: '7 consecutive days of activity',
      icon: Flame,
      rarity: 'rare',
      points: 75,
      unlockedAt: new Date()
    },
    {
      id: 'content_creator',
      type: 'creativity',
      title: 'Content Creator',
      description: 'Created 5 valuable resources',
      icon: Gift,
      rarity: 'epic',
      points: 100,
      unlockedAt: new Date()
    },
    {
      id: 'community_leader',
      type: 'leadership',
      title: 'Community Leader',
      description: '100 likes on your posts',
      icon: Crown,
      rarity: 'legendary',
      points: 200,
      unlockedAt: new Date()
    }
  ]

  // Unlock an achievement
  const unlockAchievement = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId)
    if (achievement && !unlockedAchievements.some(a => a.id === achievementId)) {
      setUnlockedAchievements(prev => [...prev, achievement])
      setCurrentCelebration(achievement)
      
      // Auto-close after 10 seconds
      setTimeout(() => {
        setCurrentCelebration(null)
      }, 10000)
    }
  }

  // Check if achievement is unlocked
  const isUnlocked = (achievementId: string) => {
    return unlockedAchievements.some(a => a.id === achievementId)
  }

  return {
    achievements,
    unlockedAchievements,
    currentCelebration,
    unlockAchievement,
    isUnlocked,
    closeCelebration: () => setCurrentCelebration(null)
  }
}

// Component to display achievement gallery
export function AchievementGallery() {
  const { achievements, isUnlocked } = useAchievements()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {achievements.map(achievement => {
        const IconComponent = achievement.icon
        const isAchieved = isUnlocked(achievement.id)
        
        return (
          <motion.div
            key={achievement.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative rounded-xl p-4 border-2 ${
              isAchieved 
                ? 'bg-white/80 dark:bg-gray-800/80 border-green-500/50' 
                : 'bg-gray-100/50 dark:bg-gray-900/50 border-gray-300/50 dark:border-gray-700/50'
            } backdrop-blur-sm`}
          >
            <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
              isAchieved 
                ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                : 'bg-gray-300 dark:bg-gray-700'
            }`}>
              <IconComponent className={`w-6 h-6 ${isAchieved ? 'text-white' : 'text-gray-500'}`} />
            </div>
            
            <h3 className={`font-semibold text-sm mb-1 ${
              isAchieved ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {achievement.title}
            </h3>
            
            <p className={`text-xs ${
              isAchieved ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
            }`}>
              {achievement.description}
            </p>
            
            {!isAchieved && (
              <div className="absolute inset-0 bg-gray-900/70 dark:bg-black/70 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-gray-300" />
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

