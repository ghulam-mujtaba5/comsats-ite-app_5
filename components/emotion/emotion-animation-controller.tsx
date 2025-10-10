"use client"

import { useEffect } from "react"
import { useEmotion } from "@/contexts/emotion-context"
import { useAnimation } from "@/contexts/animation-context"
import { 
  BreathingCircle, 
  FloatingParticles, 
  GradientWave 
} from "./calm-animations"
import { 
  FocusPulse, 
  ConcentricCircles, 
  FocusBeam 
} from "./focus-animations"
import { 
  SparkleBurst, 
  ConfettiSpray, 
  TrophyShine 
} from "./celebration-animations"

export function EmotionAnimationController() {
  const { emotionState } = useEmotion()
  const { triggerAnimation, isAnimationEnabled } = useAnimation()

  // Trigger animations based on emotion state changes
  useEffect(() => {
    if (!isAnimationEnabled) return

    // Celebration animations for positive moods
    if (emotionState.mood === 'happy' || emotionState.mood === 'excited') {
      triggerAnimation({
        type: 'confetti',
        message: 'Keep up the great work!',
        duration: 3000
      })
    }

    // Calming animations for stress or sadness
    if (emotionState.stressLevel === 'high' || emotionState.mood === 'sad') {
      triggerAnimation({
        type: 'successGlow',
        message: 'Take a deep breath',
        duration: 2000
      })
    }

    // Focus animations for high focus levels
    if (emotionState.focusLevel === 'high') {
      triggerAnimation({
        type: 'spotlight',
        duration: 3000
      })
    }
  }, [emotionState, triggerAnimation, isAnimationEnabled])

  return null
}

// Background calm animations
export function CalmBackgroundAnimations() {
  const { emotionState } = useEmotion()
  
  if (emotionState.stressLevel === 'high' || emotionState.mood === 'sad' || emotionState.mood === 'calm') {
    return (
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <FloatingParticles />
        <div className="absolute bottom-0 left-0 right-0">
          <GradientWave />
        </div>
      </div>
    )
  }
  
  return null
}

// Focus background animations
export function FocusBackgroundAnimations() {
  const { emotionState } = useEmotion()
  
  if (emotionState.focusLevel === 'high') {
    return (
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-1/4 left-1/4">
          <ConcentricCircles />
        </div>
        <div className="absolute bottom-1/4 right-1/4">
          <FocusPulse />
        </div>
      </div>
    )
  }
  
  return null
}

// Celebration background animations
export function CelebrationBackgroundAnimations() {
  const { emotionState } = useEmotion()
  
  if (emotionState.mood === 'happy' || emotionState.mood === 'excited') {
    return (
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-10 left-10">
          <SparkleBurst />
        </div>
        <div className="absolute bottom-10 right-10">
          <TrophyShine />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <ConfettiSpray />
        </div>
      </div>
    )
  }
  
  return null
}