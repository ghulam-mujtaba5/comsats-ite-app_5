'use client'

import { useCallback } from 'react'
import { useAnimation } from '@/contexts/animation-context'

// Custom hook for triggering confetti effects
export function useConfettiEffect() {
  const { triggerAnimation } = useAnimation()

  const triggerConfetti = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'confetti',
      message,
      duration
    })
  }, [triggerAnimation])

  const triggerFireworks = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'fireworks',
      message,
      duration
    })
  }, [triggerAnimation])

  const triggerBalloons = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'balloons',
      message,
      duration
    })
  }, [triggerAnimation])

  const triggerSparkles = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'sparkles',
      message,
      duration
    })
  }, [triggerAnimation])

  return {
    triggerConfetti,
    triggerFireworks,
    triggerBalloons,
    triggerSparkles
  }
}

// Custom hook for gratitude and acknowledgment effects
export function useThankYouEffect() {
  const { triggerAnimation } = useAnimation()

  const triggerThankYou = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'thankYou',
      message,
      duration
    })
  }, [triggerAnimation])

  const triggerHandClap = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'handClap',
      message,
      duration
    })
  }, [triggerAnimation])

  const triggerWaveEmoji = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'waveEmoji',
      message,
      duration
    })
  }, [triggerAnimation])

  const triggerContributionBadge = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'contributionBadge',
      message,
      duration
    })
  }, [triggerAnimation])

  return {
    triggerThankYou,
    triggerHandClap,
    triggerWaveEmoji,
    triggerContributionBadge
  }
}

// Custom hook for motivation and progress effects
export function useMotivationEffect() {
  const { triggerAnimation } = useAnimation()

  const triggerLevelUp = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'levelUp',
      message,
      duration
    })
  }, [triggerAnimation])

  const triggerAchievementPop = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'achievementPop',
      message,
      duration
    })
  }, [triggerAnimation])

  const triggerMotivationalText = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'motivationalText',
      message,
      duration
    })
  }, [triggerAnimation])

  const triggerProgressBar = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'progressBar',
      message,
      duration
    })
  }, [triggerAnimation])

  const triggerXpGlow = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'xpGlow',
      message,
      duration
    })
  }, [triggerAnimation])

  return {
    triggerLevelUp,
    triggerAchievementPop,
    triggerMotivationalText,
    triggerProgressBar,
    triggerXpGlow
  }
}

// Custom hook for community and events effects
export function useCommunityEffect() {
  const { triggerAnimation } = useAnimation()

  const triggerPartyPopper = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'partyPopper',
      message,
      duration
    })
  }, [triggerAnimation])

  const triggerSpotlight = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'spotlight',
      message,
      duration
    })
  }, [triggerAnimation])

  const triggerTeamCelebration = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'teamCelebration',
      message,
      duration
    })
  }, [triggerAnimation])

  const triggerCountdownTimer = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'countdownTimer',
      message,
      duration
    })
  }, [triggerAnimation])

  const triggerFestiveTheme = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'festiveTheme',
      message,
      duration
    })
  }, [triggerAnimation])

  return {
    triggerPartyPopper,
    triggerSpotlight,
    triggerTeamCelebration,
    triggerCountdownTimer,
    triggerFestiveTheme
  }
}

// Custom hook for UI emotional feedback effects
export function useUiFeedbackEffect() {
  const { triggerAnimation } = useAnimation()

  const triggerButtonRipple = useCallback((position: { x: number; y: number }) => {
    triggerAnimation({
      type: 'buttonRipple',
      position,
      duration: 600
    })
  }, [triggerAnimation])

  const triggerCardGlow = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'cardGlow',
      message,
      duration
    })
  }, [triggerAnimation])

  const triggerInputSuccess = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'inputSuccess',
      message,
      duration
    })
  }, [triggerAnimation])

  const triggerCheckmarkDraw = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'checkmarkDraw',
      message,
      duration
    })
  }, [triggerAnimation])

  const triggerPageTransition = useCallback((message?: string, duration?: number) => {
    triggerAnimation({
      type: 'pageTransition',
      message,
      duration
    })
  }, [triggerAnimation])

  return {
    triggerButtonRipple,
    triggerCardGlow,
    triggerInputSuccess,
    triggerCheckmarkDraw,
    triggerPageTransition
  }
}