/**
 * CampusAxis Animation Hooks
 * React hooks for triggering celebration and emotional animations
 */

'use client'

import { useCallback, useEffect, useRef } from 'react'
import {
  AnimationType,
  triggerAnimation,
  triggerConfetti,
  triggerFireworks,
  triggerLevelUp,
  triggerContributionAccepted,
  triggerMotivationBurst,
} from '@/lib/animations'

/**
 * Hook for triggering confetti on mount or on demand
 */
export function useConfetti(trigger: boolean = false) {
  const hasTriggered = useRef(false)

  useEffect(() => {
    if (trigger && !hasTriggered.current) {
      triggerConfetti()
      hasTriggered.current = true
    }
  }, [trigger])

  const fire = useCallback(() => {
    triggerConfetti()
  }, [])

  return { fire }
}

/**
 * Hook for celebration animations
 */
export function useCelebration() {
  const celebrate = useCallback((type: AnimationType = 'confetti') => {
    triggerAnimation(type)
  }, [])

  return { celebrate }
}

/**
 * Hook for success animations with element targeting
 */
export function useSuccessAnimation() {
  const triggerSuccess = useCallback((element?: HTMLElement, type: AnimationType = 'confetti') => {
    triggerAnimation(type, element)
  }, [])

  return { triggerSuccess }
}

/**
 * Hook for gamification animations (XP, level up, achievements)
 */
export function useGamificationAnimation() {
  const onLevelUp = useCallback(() => {
    triggerLevelUp()
  }, [])

  const onAchievement = useCallback(() => {
    triggerAnimation('trophy')
  }, [])

  const onXPGain = useCallback(() => {
    triggerMotivationBurst()
  }, [])

  return { onLevelUp, onAchievement, onXPGain }
}

/**
 * Hook for contribution and community animations
 */
export function useContributionAnimation() {
  const onContributionAccepted = useCallback(() => {
    triggerContributionAccepted()
  }, [])

  const onThankYou = useCallback(() => {
    triggerAnimation('hearts')
  }, [])

  const onTeamAchievement = useCallback(() => {
    triggerAnimation('party-popper')
  }, [])

  return { onContributionAccepted, onThankYou, onTeamAchievement }
}

/**
 * Hook for event-based animations
 */
export function useEventAnimation() {
  const onEventStart = useCallback(() => {
    triggerFireworks()
  }, [])

  const onEventJoin = useCallback(() => {
    triggerAnimation('party-popper')
  }, [])

  const onEventComplete = useCallback(() => {
    triggerAnimation('confetti-cannon')
  }, [])

  return { onEventStart, onEventJoin, onEventComplete }
}

/**
 * Hook for emotional wellness animations
 */
export function useWellnessAnimation() {
  const triggerCalm = useCallback(() => {
    triggerAnimation('calm')
  }, [])

  const triggerMotivation = useCallback(() => {
    triggerAnimation('motivation')
  }, [])

  const triggerRelaxation = useCallback(() => {
    triggerAnimation('balloons')
  }, [])

  return { triggerCalm, triggerMotivation, triggerRelaxation }
}

/**
 * Hook for auto-triggering animations based on events
 */
export function useAutoAnimation(event: string, animationType: AnimationType) {
  const hasTriggered = useRef(false)

  useEffect(() => {
    if (!hasTriggered.current && event) {
      triggerAnimation(animationType)
      hasTriggered.current = true
    }
  }, [event, animationType])
}

/**
 * Hook for sparkle effects on hover
 */
export function useSparkleHover(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseEnter = () => {
      triggerAnimation('sparkles', element)
    }

    element.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [ref])
}
