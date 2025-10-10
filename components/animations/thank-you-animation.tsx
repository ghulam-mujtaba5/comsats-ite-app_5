'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAnimation } from '@/contexts/animation-context'

interface ThankYouAnimationProps {
  type: 'thankYou' | 'handClap' | 'waveEmoji' | 'contributionBadge'
  message?: string
  duration?: number
  onComplete?: () => void
}

export function ThankYouAnimation({ 
  type, 
  message, 
  duration = 3000,
  onComplete 
}: ThankYouAnimationProps) {
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
      case 'thankYou':
        return (
          <motion.div
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative">
              <motion.div
                className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600"
                initial={{ scale: 0.5, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                Thank You! ❤️
              </motion.div>
              
              {/* Floating hearts */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: '50%',
                  }}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ 
                    opacity: 1, 
                    y: -100,
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  ❤️
                </motion.div>
              ))}
            </div>
          </motion.div>
        )
      
      case 'handClap':
        return (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <motion.div
              className="text-8xl"
              animate={{
                rotate: [0, -20, 0, 20, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: 3
              }}
            >
              👏
            </motion.div>
            
            {/* Particle effects */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-yellow-400"
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
                  x: (Math.random() - 0.5) * 100,
                  y: (Math.random() - 0.5) * 100,
                  opacity: 0,
                  scale: 0
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.1
                }}
              />
            ))}
          </motion.div>
        )
      
      case 'waveEmoji':
        return (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <motion.div
              className="text-8xl"
              animate={{
                rotate: [0, -20, 0, 20, 0],
                y: [0, -10, 0]
              }}
              transition={{
                duration: 1,
                repeat: 2
              }}
            >
              😊
            </motion.div>
          </motion.div>
        )
      
      case 'contributionBadge':
        return (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
                <span className="text-4xl">✨</span>
              </div>
              
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-white"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1, repeat: 2 }}
              />
              
              <motion.div
                className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                NEW
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
      
      {message && (
        <motion.div
          className="fixed top-3/4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-800 dark:text-gray-200 font-medium">
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}