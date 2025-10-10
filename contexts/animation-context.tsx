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
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined)

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [animations, setAnimations] = useState<AnimationTrigger[]>([])
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true)
  const [animationIntensity, setAnimationIntensity] = useState<'low' | 'medium' | 'high'>('medium')

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
    setAnimationIntensity
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