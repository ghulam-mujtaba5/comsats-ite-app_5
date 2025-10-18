'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAnimation } from '@/contexts/animation-context'

interface LevelUpEffectProps {
  type: 'levelUp' | 'achievementPop' | 'motivationalText' | 'progressBar' | 'xpGlow'
  message?: string
  duration?: number
  onComplete?: () => void
}

export function LevelUpEffect({ 
  type, 
  message, 
  duration = 4000,
  onComplete 
}: LevelUpEffectProps) {
  const [active, setActive] = useState(true)
  const { isAnimationEnabled } = useAnimation()

  useEffect(() => {
    if (!isAnimationEnabled) return
    
    const timer = setTimeout(() => {
      setActive(false)
      if (onComplete) onComplete()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onComplete, isAnimationEnabled])

  if (!isAnimationEnabled || !active) {
    return null
  }

  const renderAnimation = () => {
    switch (type) {
      case 'levelUp':
        return (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <div className="relative">
              {/* Main level up card */}
              <motion.div
                className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 shadow-2xl text-center border-2 border-slate-200 dark:border-slate-700"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="text-5xl mb-2"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 1,
                    repeat: 2
                  }}
                >
                  🚀
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Level Up!</h2>
                <p className="text-blue-100">You've reached a new milestone</p>
              </motion.div>
              
              {/* XP burst effect */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-yellow-400"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 1,
                    scale: 1
                  }}
                  animate={{ 
                    x: Math.cos((i * 30 * Math.PI) / 180) * 100,
                    y: Math.sin((i * 30 * Math.PI) / 180) * 100,
                    opacity: 0,
                    scale: 0
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.5
                  }}
                />
              ))}
              
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-blue-400 blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 0] }}
                transition={{ duration: 1 }}
              />
            </div>
          </motion.div>
        )
      
      case 'achievementPop':
        return (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="relative">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 shadow-2xl text-center border-2 border-slate-200 dark:border-slate-700">
                <div className="text-4xl mb-2">🏆</div>
                <h3 className="text-2xl font-bold text-white">Achievement Unlocked!</h3>
              </div>
              
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-white/30"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </motion.div>
        )
      
      case 'motivationalText':
        return (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-xl border border-gray-200 dark:border-gray-700">
              <motion.p 
                className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {message || "Keep Going! You're Doing Great!"}
              </motion.p>
            </div>
          </motion.div>
        )
      
      case 'progressBar':
        return (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 w-80"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-center mb-3 text-gray-800 dark:text-gray-200">
                Progress Update
              </h3>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-4 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                {message || "Great progress! Keep it up!"}
              </p>
            </div>
          </motion.div>
        )
      
      case 'xpGlow':
        return (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <motion.div
                className="w-32 h-32 rounded-full bg-blue-500/20 blur-2xl"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              />
              
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity
                }}
              >
                +100 XP
              </motion.div>
            </div>
          </motion.div>
        )
      
      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {active && renderAnimation()}
    </AnimatePresence>
  )
}