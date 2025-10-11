'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEmotionState } from '@/hooks/use-emotion-state'
import { Sparkles, TrendingUp, Award, Zap } from 'lucide-react'

export interface MotivationMessageProps {
  trigger?: boolean
  customMessage?: string
  icon?: 'sparkles' | 'trending' | 'award' | 'zap'
  duration?: number
  position?: 'top' | 'center' | 'bottom'
}

export function MotivationMessage({
  trigger = false,
  customMessage,
  icon = 'sparkles',
  duration = 4000,
  position = 'top',
}: MotivationMessageProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { getMotivationalMessage } = useEmotionState()

  const message = customMessage || getMotivationalMessage()

  const icons = {
    sparkles: Sparkles,
    trending: TrendingUp,
    award: Award,
    zap: Zap,
  }

  const Icon = icons[icon]

  const positionClasses = {
    top: 'top-24',
    center: 'top-1/2 -translate-y-1/2',
    bottom: 'bottom-24',
  }

  useEffect(() => {
    if (trigger) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [trigger, duration])

  return (
    <AnimatePresence>
      {isVisible && (
        <div className={`fixed left-1/2 -translate-x-1/2 ${positionClasses[position]} z-50 pointer-events-none`}>
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative"
          >
            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-2xl blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Message Card */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl px-6 py-4 border border-gray-200 dark:border-gray-700 flex items-center gap-3 min-w-[300px] max-w-md">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="flex-shrink-0"
              >
                <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </motion.div>

              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {message}
              </p>

              {/* Sparkle Particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-yellow-400"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [-20, -40, -20],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
