'use client'

import React, { useState, useEffect, useRef } from 'react'
import ReactConfetti from 'react-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import { useAnimation } from '@/contexts/animation-context'

interface CelebrationAnimationProps {
  type: 'confetti' | 'fireworks' | 'balloons' | 'sparkles' | 'successGlow' | 'trophyShine' | 'ribbons'
  message?: string
  duration?: number
  position?: { x: number; y: number }
  onComplete?: () => void
  options?: {
    ribbonCount?: number
    colors?: string[]
    balloonCount?: number
    lightCount?: number
  }
}

export function CelebrationAnimation({ 
  type, 
  message, 
  duration = 5000,
  position,
  onComplete,
  options
}: CelebrationAnimationProps) {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  })
  const [confettiActive, setConfettiActive] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const { isAnimationEnabled, animationIntensity } = useAnimation()

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-stop animation after duration
  useEffect(() => {
    if (!isAnimationEnabled) return
    
    const timer = setTimeout(() => {
      setConfettiActive(false)
      if (onComplete) onComplete()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onComplete, isAnimationEnabled])

  if (!isAnimationEnabled) {
    return null
  }

  // Calculate particle count based on intensity
  const getParticleCount = () => {
    switch (animationIntensity) {
      case 'low': return 50
      case 'medium': return 150
      case 'high': return 250
      default: return 150
    }
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

  // Render different animation types
  const renderAnimation = () => {
    const complexity = getAnimationComplexity()
    
    switch (type) {
      case 'confetti':
        return (
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={getParticleCount()}
            gravity={0.1}
            initialVelocityY={10}
            tweenDuration={100}
          />
        )
      
      case 'fireworks':
        return (
          <div className="fixed inset-0 pointer-events-none z-50">
            {/* We'll implement fireworks with CSS animations */}
            {[...Array(Math.floor(4 * complexity))].map((_, i) => (
              <div 
                key={i}
                className="absolute w-4 h-4 rounded-full animate-firework"
                style={{
                  backgroundColor: ['#fbbf24', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6'][i % 5],
                  left: `${20 + i * 20}%`,
                  top: `${20 + (i % 2) * 40}%`,
                }}
              />
            ))}
          </div>
        )
      
      case 'balloons':
        const balloonCount = Math.floor((options?.balloonCount || 15) * complexity)
        return (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(balloonCount)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-8 h-10 rounded-full"
                style={{
                  backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                  left: `${Math.random() * 100}%`,
                  bottom: '-20px',
                }}
                initial={{ y: 0, x: 0 }}
                animate={{ 
                  y: -windowSize.height - 100,
                  x: [0, (Math.random() - 0.5) * 200],
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  ease: "easeOut"
                }}
              >
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-px h-20 bg-white/30"></div>
              </motion.div>
            ))}
          </div>
        )
      
      case 'sparkles':
        const lightCount = Math.floor((options?.lightCount || 50) * complexity)
        return (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(lightCount)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-yellow-300"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ 
                  scale: 0,
                  opacity: 0
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1 + Math.random() * 2,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 3,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        )
      
      case 'successGlow':
        return (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-50"></div>
          </motion.div>
        )
      
      case 'trophyShine':
        return (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <div className="text-8xl">🏆</div>
              <motion.div
                className="absolute inset-0 bg-yellow-300 rounded-full opacity-0"
                animate={{
                  opacity: [0, 0.7, 0],
                  scale: [0.5, 1.5, 2]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
              />
            </motion.div>
          </motion.div>
        )
      
      case 'ribbons':
        const ribbonCount = Math.floor((options?.ribbonCount || 10) * complexity)
        return (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(ribbonCount)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-24 rounded-full origin-bottom"
                style={{
                  backgroundColor: (options?.colors || ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'])[i % (options?.colors?.length || 5)],
                  left: `${Math.random() * 100}%`,
                  top: Math.random() > 0.5 ? '-10%' : '110%',
                  boxShadow: `0 0 8px ${(options?.colors || ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'])[i % (options?.colors?.length || 5)]}, 0 0 16px ${(options?.colors || ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'])[i % (options?.colors?.length || 5)]}`
                }}
                initial={{ 
                  rotate: 0,
                  scaleY: 0,
                  opacity: 0
                }}
                animate={{ 
                  rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360],
                  scaleY: [0, 1, 1, 1, 0],
                  opacity: [0, 1, 1, 1, 0],
                  x: [0, (Math.random() - 0.5) * 200],
                  y: Math.random() > 0.5 ? [-windowSize.height * 0.3, windowSize.height * 0.3] : [windowSize.height * 0.3, -windowSize.height * 0.3]
                }}
                transition={{
                  duration: duration / 1000,
                  delay: Math.random() * 1000 / 1000,
                  times: [0, 0.1, 0.5, 0.9, 1],
                  ease: "easeInOut"
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
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {confettiActive && renderAnimation()}
      </AnimatePresence>
      
      {message && (
        <motion.div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl border border-gray-200 dark:border-gray-700 glass-card">
            <p className="text-lg font-bold text-center text-gray-800 dark:text-gray-200">
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}