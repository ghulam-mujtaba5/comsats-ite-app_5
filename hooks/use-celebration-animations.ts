'use client'

import { useCallback } from 'react'
import { useAnimation } from '@/contexts/animation-context'
import { useConfettiEffect } from './use-confetti-effect'

/**
 * Enhanced celebration animations hook
 * Provides specialized celebratory animations for user achievements and milestones
 */

export function useCelebrationAnimations() {
  const { triggerAnimation } = useAnimation()
  const confetti = useConfettiEffect()

  /**
   * Trigger confetti celebration with customizable options
   */
  const triggerConfetti = useCallback((options: {
    message?: string
    duration?: number
    position?: { x: number; y: number }
    particleCount?: number
    colors?: string[]
  } = {}) => {
    const {
      message = 'Congratulations!',
      duration = 5000,
      position,
      particleCount = 200,
      colors = ['#6366f1', '#ec4899', '#ec4899', '#f59e0b', '#10b981']
    } = options

    // Trigger the existing confetti effect
    confetti.fire({
      particleCount,
      spread: 70,
      colors,
      origin: position ? { x: position.x / 100, y: position.y / 100 } : { x: 0.5, y: 0.5 }
    })

    // Trigger the celebration animation for message display
    triggerAnimation({
      type: 'confetti',
      message,
      duration,
      position
    })
  }, [confetti, triggerAnimation])

  /**
   * Trigger floating balloons animation
   */
  const triggerBalloons = useCallback((options: {
    message?: string
    duration?: number
    balloonCount?: number
  } = {}) => {
    const {
      message = 'Well done!',
      duration = 6000,
      balloonCount = 15
    } = options

    triggerAnimation({
      type: 'balloons',
      message,
      duration,
      options: { balloonCount }
    })
  }, [triggerAnimation])

  /**
   * Trigger flickering lights animation
   */
  const triggerFlickeringLights = useCallback((options: {
    message?: string
    duration?: number
    lightCount?: number
    colors?: string[]
  } = {}) => {
    const {
      message = 'Brilliant!',
      duration = 4000,
      lightCount = 20,
      colors = ['#6366f1', '#ec4899', '#ec4899', '#f59e0b', '#10b981']
    } = options

    triggerAnimation({
      type: 'sparkles',
      message,
      duration,
      options: { lightCount, colors }
    })
  }, [triggerAnimation])

  /**
   * Trigger wrapping ribbons animation
   */
  const triggerWrappingRibbons = useCallback((options: {
    message?: string
    duration?: number
    ribbonCount?: number
    colors?: string[]
  } = {}) => {
    const {
      message = 'Achievement unlocked!',
      duration = 7000,
      ribbonCount = 10,
      colors = ['#6366f1', '#ec4899', '#ec4899', '#f59e0b', '#10b981']
    } = options

    // We'll implement this as a custom fireworks effect
    triggerAnimation({
      type: 'fireworks',
      message,
      duration,
      options: { ribbonCount, colors }
    })
  }, [triggerAnimation])

  /**
   * Trigger a complete celebration sequence
   */
  const triggerCelebrationSequence = useCallback((options: {
    message?: string
    duration?: number
    effects?: ('confetti' | 'balloons' | 'lights' | 'ribbons')[]
  } = {}) => {
    const {
      message = 'Outstanding achievement!',
      duration = 8000,
      effects = ['confetti', 'balloons', 'lights']
    } = options

    // Trigger multiple animations in sequence
    if (effects.includes('confetti')) {
      setTimeout(() => {
        triggerConfetti({ message, duration: duration * 0.8 })
      }, 100)
    }

    if (effects.includes('balloons')) {
      setTimeout(() => {
        triggerBalloons({ message, duration: duration * 0.9 })
      }, 300)
    }

    if (effects.includes('lights')) {
      setTimeout(() => {
        triggerFlickeringLights({ message, duration: duration * 0.7 })
      }, 500)
    }

    if (effects.includes('ribbons')) {
      setTimeout(() => {
        triggerWrappingRibbons({ message, duration: duration * 0.85 })
      }, 200)
    }
  }, [triggerConfetti, triggerBalloons, triggerFlickeringLights, triggerWrappingRibbons])

  /**
   * Trigger achievement celebration
   */
  const triggerAchievement = useCallback((options: {
    title?: string
    description?: string
    duration?: number
    type?: 'levelUp' | 'badge' | 'milestone'
  } = {}) => {
    const {
      title = 'Achievement Unlocked!',
      description = 'Great job on reaching this milestone',
      duration = 5000,
      type = 'levelUp'
    } = options

    const message = `${title}\n${description}`

    switch (type) {
      case 'levelUp':
        triggerCelebrationSequence({
          message,
          duration,
          effects: ['confetti', 'balloons']
        })
        break
      case 'badge':
        triggerFlickeringLights({
          message,
          duration
        })
        break
      case 'milestone':
        triggerCelebrationSequence({
          message,
          duration,
          effects: ['confetti', 'balloons', 'lights', 'ribbons']
        })
        break
      default:
        triggerConfetti({ message, duration })
    }
  }, [triggerCelebrationSequence, triggerConfetti, triggerFlickeringLights])

  return {
    triggerConfetti,
    triggerBalloons,
    triggerFlickeringLights,
    triggerWrappingRibbons,
    triggerCelebrationSequence,
    triggerAchievement
  }
}