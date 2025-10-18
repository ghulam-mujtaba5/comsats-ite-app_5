'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useCelebrationAnimations } from '@/hooks/use-celebration-animations'
import { Card } from '@/components/ui/card'

interface AchievementBadgeProps {
  title: string
  description: string
  icon: string
  earned?: boolean
  onEarn?: () => void
}

export function AchievementBadge({ 
  title, 
  description, 
  icon, 
  earned = false,
  onEarn
}: AchievementBadgeProps) {
  const { triggerAchievement } = useCelebrationAnimations()

  const handleEarn = () => {
    if (!earned && onEarn) {
      onEarn()
      triggerAchievement({
        title: `New Achievement: ${title}`,
        description,
        type: 'badge'
      })
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer"
      onClick={handleEarn}
    >
      <Card className={`p-4 rounded-xl glass-card transition-all duration-300 ${
        earned 
          ? 'border-green-500/50 bg-green-500/10 glass-border-glow' 
          : 'border-gray-200/50 dark:border-gray-700/50 opacity-70'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`text-2xl p-2 rounded-full ${
            earned 
              ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
              : 'bg-gray-200/50 dark:bg-gray-700/50 text-gray-400'
          }`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold truncate ${
              earned 
                ? 'text-green-700 dark:text-green-300' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {title}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 truncate">
              {description}
            </p>
          </div>
          {earned && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-green-500"
            >
              ✅
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}