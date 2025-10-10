'use client'

import React from 'react'
import { useAnimation } from '@/contexts/animation-context'
import { CelebrationAnimation } from './celebration-animation'
import { ThankYouAnimation } from './thank-you-animation'
import { FireworksAnimation } from './fireworks-animation'
import { LevelUpEffect } from './level-up-effect'

export function GlobalAnimationController() {
  const { animations, removeAnimation } = useAnimation()

  const handleAnimationComplete = (id: string) => {
    removeAnimation(id)
  }

  return (
    <>
      {animations.map((animation) => {
        switch (animation.type) {
          case 'confetti':
          case 'fireworks':
          case 'balloons':
          case 'sparkles':
          case 'successGlow':
          case 'trophyShine':
            return (
              <CelebrationAnimation
                key={animation.id}
                type={animation.type}
                message={animation.message}
                duration={animation.duration}
                position={animation.position}
                onComplete={() => handleAnimationComplete(animation.id)}
              />
            )
          
          case 'thankYou':
          case 'handClap':
          case 'waveEmoji':
          case 'contributionBadge':
            return (
              <ThankYouAnimation
                key={animation.id}
                type={animation.type}
                message={animation.message}
                duration={animation.duration}
                onComplete={() => handleAnimationComplete(animation.id)}
              />
            )
          
          case 'partyPopper':
          case 'spotlight':
          case 'teamCelebration':
          case 'countdownTimer':
          case 'festiveTheme':
            return (
              <FireworksAnimation
                key={animation.id}
                type={animation.type}
                message={animation.message}
                duration={animation.duration}
                onComplete={() => handleAnimationComplete(animation.id)}
              />
            )
          
          case 'levelUp':
          case 'achievementPop':
          case 'motivationalText':
          case 'progressBar':
          case 'xpGlow':
            return (
              <LevelUpEffect
                key={animation.id}
                type={animation.type}
                message={animation.message}
                duration={animation.duration}
                onComplete={() => handleAnimationComplete(animation.id)}
              />
            )
          
          default:
            return null
        }
      })}
    </>
  )
}