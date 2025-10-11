'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { EmotionType } from '@/hooks/use-emotion-state'

export interface EmotionAnimationProps {
  type: EmotionType
  intensity?: number
  children?: React.ReactNode
}

export function EmotionAnimation({ type, intensity = 50, children }: EmotionAnimationProps) {
  // Different animation patterns based on emotion
  const animations = {
    happy: {
      animate: {
        scale: [1, 1.02, 1],
        rotate: [0, 1, -1, 0],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    calm: {
      animate: {
        y: [0, -5, 0],
        opacity: [0.8, 1, 0.8],
      },
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    stressed: {
      animate: {
        scale: [1, 0.98, 1],
      },
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    motivated: {
      animate: {
        scale: [1, 1.05, 1],
        x: [0, 2, -2, 0],
      },
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    lonely: {
      animate: {
        opacity: [0.7, 1, 0.7],
      },
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    focused: {
      animate: {
        boxShadow: [
          '0 0 0 0 rgba(99, 102, 241, 0)',
          '0 0 20px 10px rgba(99, 102, 241, 0.3)',
          '0 0 0 0 rgba(99, 102, 241, 0)',
        ],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    neutral: {
      animate: {},
      transition: {},
    },
  }

  const animation = animations[type] || animations.neutral

  // Adjust animation speed based on intensity
  const baseDuration = 'duration' in animation.transition ? animation.transition.duration as number : 2
  const adjustedTransition = {
    ...animation.transition,
    duration: baseDuration * (1 - intensity / 200),
  }

  return (
    <motion.div
      animate={animation.animate}
      transition={adjustedTransition as any}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  )
}

// Wrapper components for specific emotion animations
export function HappyAnimation({ children }: { children: React.ReactNode }) {
  return <EmotionAnimation type="happy">{children}</EmotionAnimation>
}

export function CalmAnimation({ children }: { children: React.ReactNode }) {
  return <EmotionAnimation type="calm">{children}</EmotionAnimation>
}

export function StressedAnimation({ children }: { children: React.ReactNode }) {
  return <EmotionAnimation type="stressed">{children}</EmotionAnimation>
}

export function MotivatedAnimation({ children }: { children: React.ReactNode }) {
  return <EmotionAnimation type="motivated">{children}</EmotionAnimation>
}

export function FocusedAnimation({ children }: { children: React.ReactNode }) {
  return <EmotionAnimation type="focused">{children}</EmotionAnimation>
}
