import { useCallback, useEffect, useRef } from "react"
import { useEmotion } from "@/contexts/emotion-context"
import { useAnimation } from "@/contexts/animation-context"

// Activity tracking types
interface UserActivity {
  lastActive: Date
  sessionStartTime: Date
  idleTime: number
  actions: string[]
}

// Configuration for emotion detection
const EMOTION_CONFIG = {
  IDLE_THRESHOLD: 30 * 60 * 1000, // 30 minutes
  LONG_SESSION_THRESHOLD: 60 * 60 * 1000, // 1 hour
  LATE_NIGHT_START: 22, // 10 PM
  LATE_NIGHT_END: 6, // 6 AM
  ACTIVITY_WINDOW: 10 * 60 * 1000, // 10 minutes
}

/**
 * Hook for detecting user emotion state based on activity patterns
 */
export function useEmotionDetection() {
  const { emotionState, updateEmotionState, activateCalmMode } = useEmotion()
  const { triggerAnimation } = useAnimation()
  const activityRef = useRef<UserActivity>({
    lastActive: new Date(),
    sessionStartTime: new Date(),
    idleTime: 0,
    actions: [],
  })

  // Track user activity
  const trackActivity = useCallback((action: string) => {
    const now = new Date()
    activityRef.current = {
      ...activityRef.current,
      lastActive: now,
      idleTime: 0,
      actions: [...activityRef.current.actions.slice(-9), action], // Keep last 10 actions
    }
  }, [])

  // Detect stress based on activity patterns
  const detectStress = useCallback(() => {
    const now = new Date()
    const idleTime = now.getTime() - activityRef.current.lastActive.getTime()
    const sessionDuration = now.getTime() - activityRef.current.sessionStartTime.getTime()
    
    // High stress indicators
    if (sessionDuration > EMOTION_CONFIG.LONG_SESSION_THRESHOLD) {
      return true
    }
    
    if (idleTime > EMOTION_CONFIG.IDLE_THRESHOLD) {
      return true
    }
    
    // Late night usage
    const hour = now.getHours()
    if (hour >= EMOTION_CONFIG.LATE_NIGHT_START || hour <= EMOTION_CONFIG.LATE_NIGHT_END) {
      return true
    }
    
    return false
  }, [])

  // Detect motivation level based on activity
  const detectMotivation = useCallback(() => {
    const recentActions = activityRef.current.actions.filter(action => {
      const actionTime = new Date(action.split('_')[0]).getTime()
      return Date.now() - actionTime < EMOTION_CONFIG.ACTIVITY_WINDOW
    })
    
    if (recentActions.length > 10) {
      return 'high'
    } else if (recentActions.length > 3) {
      return 'medium'
    } else {
      return 'low'
    }
  }, [])

  // Detect focus level based on activity consistency
  const detectFocus = useCallback(() => {
    const now = new Date()
    const sessionDuration = now.getTime() - activityRef.current.sessionStartTime.getTime()
    const actionCount = activityRef.current.actions.length
    
    // Calculate actions per minute
    const actionsPerMinute = actionCount / (sessionDuration / 60000)
    
    if (actionsPerMinute > 5) {
      return 'high'
    } else if (actionsPerMinute > 2) {
      return 'medium'
    } else {
      return 'low'
    }
  }, [])

  // Main emotion detection function
  const detectEmotionState = useCallback(() => {
    const isStressed = detectStress()
    const motivationLevel = detectMotivation()
    const focusLevel = detectFocus()
    
    let mood: any = 'neutral'
    let stressLevel: any = 'low'
    
    if (isStressed) {
      mood = 'stressed'
      stressLevel = 'high'
    } else if (motivationLevel === 'high') {
      mood = 'happy'
    } else if (focusLevel === 'high') {
      mood = 'focused'
    }
    
    updateEmotionState({
      mood,
      stressLevel,
      focusLevel,
      motivationLevel,
    })
  }, [detectStress, detectMotivation, detectFocus, updateEmotionState])

  // Effect to periodically check emotion state
  useEffect(() => {
    const interval = setInterval(() => {
      detectEmotionState()
    }, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [detectEmotionState])

  return {
    trackActivity,
    detectEmotionState,
  }
}

/**
 * Hook for boosting motivation with positive feedback
 */
export function useMotivationBooster() {
  const { emotionState, updateEmotionState } = useEmotion()
  const { triggerAnimation } = useAnimation()

  const boostMotivation = useCallback((reason: string) => {
    // Increase motivation level
    const currentLevel = emotionState.motivationLevel
    let newLevel: any = currentLevel
    
    if (currentLevel === 'low') {
      newLevel = 'medium'
    } else if (currentLevel === 'medium') {
      newLevel = 'high'
    }
    
    updateEmotionState({
      motivationLevel: newLevel,
      mood: 'happy',
    })
    
    // Trigger positive animation
    triggerAnimation({
      type: 'confetti',
      message: reason,
      duration: 5000,
    })
  }, [emotionState.motivationLevel, updateEmotionState, triggerAnimation])

  return {
    boostMotivation,
  }
}

/**
 * Hook for activating calm mode during stressful periods
 */
export function useCalmMode() {
  const { activateCalmMode, updateEmotionState } = useEmotion()
  const { triggerAnimation } = useAnimation()

  const activateCalmModeWithFeedback = useCallback((duration?: number) => {
    activateCalmMode(duration)
    
    updateEmotionState({
      mood: 'calm',
      stressLevel: 'low',
    })
    
    // Trigger calming animation
    triggerAnimation({
      type: 'successGlow',
      message: 'Take a deep breath. You\'ve got this!',
      duration: 3000,
    })
  }, [activateCalmMode, updateEmotionState, triggerAnimation])

  return {
    activateCalmMode: activateCalmModeWithFeedback,
  }
}

/**
 * Hook for providing study companion feedback based on performance
 */
export function useStudyCompanionFeedback() {
  const { emotionState, updateEmotionState } = useEmotion()
  const { triggerAnimation } = useAnimation()
  const errorStreakRef = useRef(0)

  const onStudyAction = useCallback((action: 'success' | 'error' | 'streak') => {
    if (action === 'error') {
      errorStreakRef.current += 1
      
      // If user makes repeated errors, provide encouragement
      if (errorStreakRef.current >= 3) {
        updateEmotionState({
          mood: 'sad',
        })
        
        triggerAnimation({
          type: 'motivationalText',
          message: 'Don\'t worry, mistakes = progress 💪',
          duration: 4000,
        })
      }
    } else if (action === 'success') {
      errorStreakRef.current = 0
      
      // Celebrate success
      updateEmotionState({
        mood: 'happy',
        motivationLevel: emotionState.motivationLevel === 'low' ? 'medium' : emotionState.motivationLevel,
      })
      
      triggerAnimation({
        type: 'successGlow',
        message: 'Great job! You\'re improving fast!',
        duration: 3000,
      })
    } else if (action === 'streak') {
      // Celebrate streak
      updateEmotionState({
        mood: 'excited',
        motivationLevel: 'high',
      })
      
      triggerAnimation({
        type: 'confetti',
        message: 'Proud of your consistency!',
        duration: 5000,
      })
    }
  }, [emotionState.motivationLevel, updateEmotionState, triggerAnimation])

  return {
    onStudyAction,
  }
}