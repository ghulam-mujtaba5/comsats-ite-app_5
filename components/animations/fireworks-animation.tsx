'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAnimation } from '@/contexts/animation-context'

interface FireworksAnimationProps {
  type: 'partyPopper' | 'spotlight' | 'teamCelebration' | 'countdownTimer' | 'festiveTheme'
  message?: string
  duration?: number
  onComplete?: () => void
}

export function FireworksAnimation({ 
  type, 
  message, 
  duration = 5000,
  onComplete 
}: FireworksAnimationProps) {
  const [active, setActive] = useState(true)
  const { isAnimationEnabled, animationIntensity } = useAnimation()

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

  // Calculate animation complexity based on intensity
  const getAnimationComplexity = () => {
    switch (animationIntensity) {
      case 'low': return 0.5
      case 'medium': return 1
      case 'high': return 1.5
      default: return 1
    }
  }

  const renderAnimation = () => {
    const complexity = getAnimationComplexity()
    
    switch (type) {
      case 'partyPopper':
        const partyPopperParticleCount = Math.floor(100 * complexity)
        return (
          <div className="fixed inset-0 pointer-events-none z-50">
            {/* Confetti particles */}
            {[...Array(partyPopperParticleCount)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: `hsl(${Math.random() * 360}, 100%, 60%)`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ 
                  scale: 0,
                  opacity: 0,
                  y: 0,
                  rotate: 0
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: -100,
                  rotate: 360
                }}
                transition={{
                  duration: 1 + Math.random() * 2,
                  delay: Math.random() * 1
                }}
              />
            ))}
            
            {/* Party popper emoji */}
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl z-50"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              🎊
            </motion.div>
          </div>
        )
      
      case 'spotlight':
        return (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Spotlight effect */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-radial from-yellow-300/30 to-transparent"
              initial={{ scale: 0 }}
              animate={{ scale: 3 }}
              transition={{ duration: 2 }}
            />
            
            {/* Soft glow background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>
          </motion.div>
        )
      
      case 'teamCelebration':
        const burstCount = Math.floor(5 * complexity)
        const particlesPerBurst = Math.floor(30 * complexity)
        return (
          <div className="fixed inset-0 pointer-events-none z-50">
            {/* Multiple confetti bursts */}
            {[...Array(burstCount)].map((_, i) => (
              <div 
                key={i}
                className="absolute"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 20}%`,
                }}
              >
                {[...Array(particlesPerBurst)].map((_, j) => (
                  <motion.div
                    key={j}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: `hsl(${Math.random() * 360}, 100%, 60%)`,
                    }}
                    initial={{ 
                      scale: 0,
                      opacity: 0,
                      x: 0,
                      y: 0
                    }}
                    animate={{ 
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      x: (Math.random() - 0.5) * 100,
                      y: (Math.random() - 0.5) * 100
                    }}
                    transition={{
                      duration: 1 + Math.random(),
                      delay: Math.random() * 0.5
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        )
      
      case 'countdownTimer':
        return (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <div className="relative w-48 h-48 rounded-full bg-gradient-to-r from-blue-600 to-purple-700 flex items-center justify-center shadow-2xl">
              <div className="absolute inset-4 rounded-full border-4 border-white/20 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">EVENT</span>
              </div>
              
              {/* Animated border */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-yellow-400"
                animate={{
                  rotate: 360,
                  borderColor: [
                    '#fbbf24', 
                    '#3b82f6', 
                    '#8b5cf6', 
                    '#fbbf24'
                  ]
                }}
                transition={{
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  borderColor: { duration: 2, repeat: Infinity }
                }}
              />
            </div>
          </motion.div>
        )
      
      case 'festiveTheme':
        const iconCount = Math.floor(6 * complexity)
        const festiveParticleCount = Math.floor(50 * complexity)
        return (
          <div className="fixed inset-0 pointer-events-none z-50">
            {/* Floating festive icons */}
            {['🎄', '❄️', '✨', '🎉', '🎊', '🌟'].slice(0, iconCount).map((icon, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ y: 0, opacity: 0 }}
                animate={{ 
                  y: -100,
                  opacity: [0, 1, 0],
                  rotate: 360
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              >
                {icon}
              </motion.div>
            ))}
            
            {/* Soft background particles */}
            {[...Array(festiveParticleCount)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
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