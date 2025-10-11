'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export interface XPProgressGlowProps {
  currentXP: number
  maxXP: number
  level: number
  showLabel?: boolean
  glowIntensity?: 'low' | 'medium' | 'high'
}

export function XPProgressGlow({
  currentXP,
  maxXP,
  level,
  showLabel = true,
  glowIntensity = 'medium',
}: XPProgressGlowProps) {
  const progress = Math.min((currentXP / maxXP) * 100, 100)

  const glowColors = {
    low: 'shadow-[0_0_10px_rgba(99,102,241,0.5)]',
    medium: 'shadow-[0_0_20px_rgba(99,102,241,0.7)]',
    high: 'shadow-[0_0_30px_rgba(99,102,241,0.9)]',
  }

  return (
    <div className="relative w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Level {level}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {currentXP} / {maxXP} XP
          </span>
        </div>
      )}

      <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        {/* Background Glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Progress Bar */}
        <motion.div
          className={`absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 ${glowColors[glowIntensity]}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>

        {/* Energy Particles */}
        {progress > 0 && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-yellow-400"
                style={{
                  left: `${Math.random() * progress}%`,
                  top: '50%',
                }}
                animate={{
                  y: [-5, 5, -5],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Level Up Indicator */}
      {progress >= 100 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-8 right-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
        >
          Ready to Level Up! 🎉
        </motion.div>
      )}
    </div>
  )
}
