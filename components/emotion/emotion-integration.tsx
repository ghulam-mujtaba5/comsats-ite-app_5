"use client"

import { useEffect } from "react"
import { useEmotion } from "@/contexts/emotion-context"
import { useAnimation } from "@/contexts/animation-context"
import { useEmotionDetection } from "@/hooks/use-emotion-detection"
import { EmotionAnimationController } from "./emotion-animation-controller"
import { 
  FocusBackgroundAnimations, 
  CelebrationBackgroundAnimations 
} from "./emotion-animation-controller"

// This component integrates the emotion system with existing CampusAxis components
export function EmotionIntegration() {
  const { emotionState } = useEmotion()
  const { isAnimationEnabled } = useAnimation()
  const { trackActivity, detectEmotionState } = useEmotionDetection()

  // Track user activity across the application
  useEffect(() => {
    // Set up activity tracking for key user interactions
    const trackUserActivity = () => {
      trackActivity("user_interaction")
    }

    // Add event listeners for user activity
    window.addEventListener("click", trackUserActivity)
    window.addEventListener("keypress", trackUserActivity)
    window.addEventListener("scroll", trackUserActivity)

    // Periodically detect emotion state
    const emotionDetectionInterval = setInterval(() => {
      detectEmotionState()
    }, 60000) // Check every minute

    return () => {
      window.removeEventListener("click", trackUserActivity)
      window.removeEventListener("keypress", trackUserActivity)
      window.removeEventListener("scroll", trackUserActivity)
      clearInterval(emotionDetectionInterval)
    }
  }, [trackActivity, detectEmotionState])

  // Apply emotion-based styling to the entire application
  useEffect(() => {
    // Apply mode-based classes
    if (emotionState.focusLevel === "high") {
      document.body.classList.add("focus-mode")
      document.body.classList.remove("celebration-mode")
    } else if (emotionState.mood === "happy" || emotionState.mood === "excited") {
      document.body.classList.add("celebration-mode")
      document.body.classList.remove("focus-mode")
    } else {
      document.body.classList.remove("focus-mode", "celebration-mode")
    }
  }, [emotionState])

  return (
    <>
      {/* Animation controller */}
      <EmotionAnimationController />
      
      {/* Background animations based on emotion state */}
      {isAnimationEnabled && (
        <>
          <FocusBackgroundAnimations />
          <CelebrationBackgroundAnimations />
        </>
      )}
    </>
  )
}

// HOC to wrap components with emotion tracking
export function withEmotionTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  activityType: string
) {
  return function WithEmotionTracking(props: P) {
    const { trackActivity } = useEmotionDetection()
    
    useEffect(() => {
      trackActivity(activityType)
    }, [trackActivity, activityType])
    
    return <WrappedComponent {...props} />
  }
}

// Hook to apply emotion-based styling to components
export function useEmotionStyles() {
  const { emotionState } = useEmotion()
  
  const getEmotionClass = () => {
    if (emotionState.stressLevel === "high" || emotionState.mood === "sad") {
      return "emotion-calm"
    }
    if (emotionState.mood === "happy" || emotionState.mood === "excited") {
      return "emotion-celebration"
    }
    if (emotionState.focusLevel === "high") {
      return "emotion-focus"
    }
    return "emotion-neutral"
  }
  
  return {
    emotionClass: getEmotionClass(),
    emotionState
  }
}