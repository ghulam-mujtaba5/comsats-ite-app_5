'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Sparkles } from 'lucide-react'

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
    low: 'shadow-[0_0_8px_rgba(99,102,241,0.4)]',
    medium: 'shadow-[0_0_16px_rgba(99,102,241,0.6)]',
    high: 'shadow-[0_0_24px_rgba(99,102,241,0.8)]',
  }

  return (
    <div className="relative w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Level {level}
            </span>
          </div>
          <span className="text-[10px] text-gray-500 dark:text-gray-400">
            {currentXP} / {maxXP}
          </span>
        </div>
      )}

      <div className="relative h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        {/* Background Glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Progress Bar */}
        <motion.div
          className={`absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 ${glowColors[glowIntensity]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>

        {/* Energy Particles */}
        {progress > 0 && (
          <>
            {[...Array(2)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-yellow-400"
                style={{
                  left: `${Math.random() * progress}%`,
                  top: '50%',
                }}
                animate={{
                  y: [-3, 3, -3],
                  opacity: [0, 1, 0],
                  scale: [0.3, 1.2, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
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
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-7 right-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1"
        >
          <Sparkles className="w-2.5 h-2.5" />
          Level Up!
        </motion.div>
      )}
    </div>
  )
}