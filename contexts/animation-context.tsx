"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useMemo } from "react"
import { useAuth } from "@/contexts/auth-context"

// Define types for animations
export type AnimationType = 
  | 'confetti'
  | 'fireworks'
  | 'balloons'
  | 'sparkles'
  | 'successGlow'
  | 'trophyShine'
  | 'thankYou'
  | 'handClap'
  | 'waveEmoji'
  | 'contributionBadge'
  | 'progressBar'
  | 'levelUp'
  | 'achievementPop'
  | 'motivationalText'
  | 'partyPopper'
  | 'spotlight'
  | 'teamCelebration'
  | 'countdownTimer'
  | 'festiveTheme'
  | 'buttonRipple'
  | 'cardGlow'
  | 'inputSuccess'
  | 'checkmarkDraw'
  | 'pageTransition'
  | 'xpGlow'
  | 'ribbons'

export interface AnimationTrigger {
  id: string
  type: AnimationType
  message?: string
  duration?: number
  position?: { x: number; y: number }
  options?: Record<string, any>
}

interface AnimationContextType {
  animations: AnimationTrigger[]
  triggerAnimation: (animation: Omit<AnimationTrigger, 'id'>) => void
  removeAnimation: (id: string) => void
  clearAnimations: () => void
  isAnimationEnabled: boolean
  setIsAnimationEnabled: (enabled: boolean) => void
  animationIntensity: 'low' | 'medium' | 'high'
  setAnimationIntensity: (intensity: 'low' | 'medium' | 'high') => void
  // Performance monitoring
  performanceMetrics: {
    frameRate: number
    cpuUsage: number
    memoryUsage: number
  }
  setPerformanceMetrics: (metrics: { frameRate: number; cpuUsage: number; memoryUsage: number }) => void
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined)

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [animations, setAnimations] = useState<AnimationTrigger[]>([])
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true)
  const [animationIntensity, setAnimationIntensity] = useState<'low' | 'medium' | 'high'>('medium')
  const [performanceMetrics, setPerformanceMetrics] = useState({
    frameRate: 60,
    cpuUsage: 0,
    memoryUsage: 0
  })

  // Load user preferences when user is available
  useEffect(() => {
    if (user) {
      // In a real implementation, you would fetch user preferences from the API
      // For now, we'll use localStorage as a fallback
      const savedSettings = localStorage.getItem('animationSettings')
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings)
          setIsAnimationEnabled(settings.enabled !== undefined ? settings.enabled : true)
          setAnimationIntensity(settings.intensity || 'medium')
        } catch (e) {
          console.error('Error loading animation settings:', e)
        }
      }
    }
  }, [user])

  // Save preferences when they change
  useEffect(() => {
    if (user) {
      const settings = {
        enabled: isAnimationEnabled,
        intensity: animationIntensity
      }
      localStorage.setItem('animationSettings', JSON.stringify(settings))
    }
  }, [isAnimationEnabled, animationIntensity, user])

  // Performance monitoring effect
  useEffect(() => {
    if (!isAnimationEnabled) return

    let frameCount = 0
    let lastTime = performance.now()
    let frameRate = 60
    let cpuUsage = 0
    let memoryUsage = 0

    const measurePerformance = () => {
      frameCount++
      const now = performance.now()
      
      if (now >= lastTime + 1000) {
        frameRate = Math.min(60, Math.round((frameCount * 1000) / (now - lastTime)))
        frameCount = 0
        lastTime = now
        
        // Simulate CPU and memory usage monitoring
        // In a real implementation, you would use Performance API or other monitoring tools
        cpuUsage = Math.min(100, Math.max(0, 100 - (frameRate / 60) * 100))
        memoryUsage = 0 // Simplified for now since memory API is not universally available
        
        setPerformanceMetrics({
          frameRate,
          cpuUsage,
          memoryUsage
        })
      }
      
      // Auto-adjust animation intensity based on performance
      if (frameRate < 30 && animationIntensity !== 'low') {
        setAnimationIntensity('low')
        console.warn('Performance dropping, reducing animation intensity to low')
      } else if (frameRate >= 30 && frameRate < 50 && animationIntensity === 'high') {
        setAnimationIntensity('medium')
        console.warn('Performance moderate, reducing animation intensity to medium')
      } else if (frameRate >= 50 && animationIntensity !== 'high') {
        setAnimationIntensity('high')
        console.info('Performance good, setting animation intensity to high')
      }
      
      requestAnimationFrame(measurePerformance)
    }

    const perfId = requestAnimationFrame(measurePerformance)
    return () => cancelAnimationFrame(perfId)
  }, [isAnimationEnabled, animationIntensity])

  const triggerAnimation = useMemo(() => (animation: Omit<AnimationTrigger, 'id'>) => {
    if (!isAnimationEnabled) return
    
    const id = Math.random().toString(36).substr(2, 9)
    const newAnimation: AnimationTrigger = { id, ...animation }
    
    setAnimations(prev => [...prev, newAnimation])
    
    // Auto-remove animation after its duration or default 5 seconds
    const duration = animation.duration || 5000
    setTimeout(() => {
      setAnimations(prev => prev.filter(a => a.id !== id))
    }, duration)
  }, [isAnimationEnabled])

  const removeAnimation = (id: string) => {
    setAnimations(prev => prev.filter(animation => animation.id !== id))
  }

  const clearAnimations = () => {
    setAnimations([])
  }

  const contextValue: AnimationContextType = {
    animations,
    triggerAnimation,
    removeAnimation,
    clearAnimations,
    isAnimationEnabled,
    setIsAnimationEnabled,
    animationIntensity,
    setAnimationIntensity,
    performanceMetrics,
    setPerformanceMetrics
  }

  return <AnimationContext.Provider value={contextValue}>{children}</AnimationContext.Provider>
}

export function useAnimation() {
  const context = useContext(AnimationContext)
  if (context === undefined) {
    throw new Error("useAnimation must be used within an AnimationProvider")
  }
  return context
}