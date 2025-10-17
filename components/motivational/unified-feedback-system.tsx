"use client"

import { useEffect, useCallback } from "react"
import { useEmotion } from "@/contexts/emotion-context"
import { useAnimation } from "@/contexts/animation-context"
import { useCelebrationAnimations } from "@/hooks/use-celebration-animations"
import { useToast } from "@/components/ui/use-toast"
import { 
  useMotivationBooster, 
  useStudyCompanionFeedback 
} from "@/hooks/use-emotion-detection"
import { 
  Trophy, 
  Heart, 
  Star, 
  Award, 
  Smile, 
  Frown, 
  Zap, 
  Sparkles,
  ThumbsUp,
  Gift,
  Medal,
  Crown,
  Flame,
  Target,
  CheckCircle
} from "lucide-react"

// Define motivational event types
type MotivationalEventType = 
  | 'achievement_unlocked'
  | 'goal_reached'
  | 'streak_maintained'
  | 'help_provided'
  | 'content_created'
  | 'study_session_completed'
  | 'peer_interaction'
  | 'challenge_completed'
  | 'consistency_maintained'
  | 'positive_feedback_received'
  | 'stress_detected'
  | 'low_motivation'
  | 'focus_achieved'
  | 'break_needed'

// Define student psychological states
type StudentPsychologicalState = 
  | 'motivated'
  | 'stressed'
  | 'sad'
  | 'focused'
  | 'distracted'
  | 'tired'
  | 'celebrating'
  | 'needing_encouragement'

interface MotivationalEvent {
  type: MotivationalEventType
  message: string
  studentState: StudentPsychologicalState
  intensity?: 'low' | 'medium' | 'high'
  context?: Record<string, any>
}

export function UnifiedFeedbackSystem() {
  const { emotionState, updateEmotionState } = useEmotion()
  const { triggerAnimation } = useAnimation()
  const { 
    triggerConfetti, 
    triggerBalloons, 
    triggerFlickeringLights, 
    triggerWrappingRibbons,
    triggerAchievement
  } = useCelebrationAnimations()
  const { toast } = useToast()
  const { boostMotivation } = useMotivationBooster()
  const { onStudyAction } = useStudyCompanionFeedback()

  // Map psychological states to appropriate responses
  const getResponseForState = useCallback((state: StudentPsychologicalState, event: MotivationalEvent) => {
    switch (state) {
      case 'motivated':
      case 'celebrating':
        return {
          animation: 'confetti',
          intensity: 'high',
          message: event.message,
          icon: Trophy
        }
      
      case 'stressed':
      case 'sad':
        return {
          animation: 'successGlow',
          intensity: 'low', // Reduced from 'medium' to be less intrusive
          message: '💙 Take a breath - you\'re doing great',
          icon: Heart
        }
      
      case 'focused':
        return {
          animation: 'spotlight',
          intensity: 'low', // Reduced to not interrupt focus
          message: '🎯 Great focus!',
          icon: Target
        }
      
      case 'distracted':
      case 'tired':
        return {
          animation: 'motivationalText',
          intensity: 'low',
          message: '✨ Quick break?',
          icon: Sparkles
        }
      
      case 'needing_encouragement':
        return {
          animation: 'sparkles',
          intensity: 'medium',
          message: 'You\'ve got this!',
          icon: ThumbsUp
        }
      
      default:
        return {
          animation: 'sparkles',
          intensity: 'low',
          message: 'Keep going!',
          icon: Star
        }
    }
  }, [])

  // Trigger appropriate feedback based on event
  const triggerMotivationalFeedback = useCallback((event: MotivationalEvent) => {
    const response = getResponseForState(event.studentState, event)
    
    // Update emotion state based on event
    switch (event.type) {
      case 'achievement_unlocked':
      case 'goal_reached':
      case 'streak_maintained':
        updateEmotionState({
          mood: 'happy',
          motivationLevel: 'high',
          stressLevel: 'low'
        })
        break
      
      case 'stress_detected':
        updateEmotionState({
          mood: 'stressed',
          stressLevel: 'high'
        })
        break
      
      case 'low_motivation':
        updateEmotionState({
          mood: 'sad',
          motivationLevel: 'low'
        })
        break
      
      case 'focus_achieved':
        updateEmotionState({
          mood: 'focused',
          focusLevel: 'high'
        })
        break
      
      case 'break_needed':
        updateEmotionState({
          mood: 'tired',
          stressLevel: 'high'
        })
        break
    }

    // Trigger appropriate animation
    switch (response.animation) {
      case 'confetti':
        triggerConfetti({
          message: response.message,
          duration: 5000,
          particleCount: 300
        })
        break
      
      case 'balloons':
        triggerBalloons({
          message: response.message,
          duration: 6000
        })
        break
      
      case 'sparkles':
        triggerFlickeringLights({
          message: response.message,
          duration: 4000
        })
        break
      
      case 'ribbons':
        triggerWrappingRibbons({
          message: response.message,
          duration: 7000
        })
        break
      
      case 'successGlow':
        triggerAnimation({
          type: 'successGlow',
          message: response.message,
          duration: 3000
        })
        break
      
      case 'spotlight':
        triggerAnimation({
          type: 'spotlight',
          message: response.message,
          duration: 3000
        })
        break
      
      case 'motivationalText':
        triggerAnimation({
          type: 'motivationalText',
          message: response.message,
          duration: 4000
        })
        break
      
      default:
        triggerAnimation({
          type: 'sparkles',
          message: response.message,
          duration: 3000
        })
    }

    // Show toast notification for important events (with reduced duration)
    if (['achievement_unlocked', 'goal_reached', 'challenge_completed'].includes(event.type)) {
      toast({
        title: "🎉 Achievement Unlocked!",
        description: event.message,
        variant: "success",
        duration: 4000, // Reduced from default 5000ms
      })
    }
  }, [
    getResponseForState, 
    updateEmotionState, 
    triggerConfetti, 
    triggerBalloons, 
    triggerFlickeringLights, 
    triggerWrappingRibbons, 
    triggerAnimation,
    toast
  ])

  // Specialized handlers for different event types
  const handleAchievement = useCallback((title: string, description: string) => {
    triggerAchievement({
      title,
      description,
      type: 'badge'
    })
    
    updateEmotionState({
      mood: 'happy',
      motivationLevel: 'high'
    })
  }, [triggerAchievement, updateEmotionState])

  const handleStressDetection = useCallback(() => {
    // Reduced duration and made less intrusive
    toast({
      title: "💙 Wellness Check",
      description: "Consider taking a short break",
      variant: "warning",
      duration: 3000, // Reduced from default 5000ms to 3000ms
    })
    
    updateEmotionState({
      mood: 'calm',
      stressLevel: 'low'
    })
  }, [toast, updateEmotionState])

  const handleLowMotivation = useCallback(() => {
    boostMotivation("Remember, every small step counts!")
    
    // Reduced duration for less intrusion
    toast({
      title: "✨ You've Got This!",
      description: "Progress isn't always linear. Keep going!",
      variant: "info",
      duration: 3000, // Reduced from default
    })
  }, [boostMotivation, toast])

  // Expose methods for other components to use
  const feedbackAPI = {
    triggerMotivationalFeedback,
    handleAchievement,
    handleStressDetection,
    handleLowMotivation,
    triggerStudySuccess: () => onStudyAction('success'),
    triggerStudyError: () => onStudyAction('error'),
    triggerStudyStreak: () => onStudyAction('streak')
  }

  // Make feedback API available globally
  useEffect(() => {
    // @ts-ignore
    window.motivationalFeedback = feedbackAPI
    
    return () => {
      // @ts-ignore
      delete window.motivationalFeedback
    }
  }, [feedbackAPI])

  return null
}

// Hook for using the unified feedback system
export function useMotivationalFeedback() {
  const { emotionState } = useEmotion()
  const { triggerAnimation } = useAnimation()
  const { 
    triggerConfetti, 
    triggerBalloons, 
    triggerFlickeringLights, 
    triggerWrappingRibbons,
    triggerAchievement
  } = useCelebrationAnimations()
  const { toast } = useToast()
  const { boostMotivation } = useMotivationBooster()
  const { onStudyAction } = useStudyCompanionFeedback()

  // Determine student psychological state based on emotion state
  const getStudentPsychologicalState = useCallback((): StudentPsychologicalState => {
    if (emotionState.stressLevel === 'high') return 'stressed'
    if (emotionState.mood === 'sad') return 'sad'
    if (emotionState.mood === 'happy' || emotionState.motivationLevel === 'high') return 'motivated'
    if (emotionState.focusLevel === 'high') return 'focused'
    if (emotionState.mood === 'tired') return 'tired'
    return 'needing_encouragement'
  }, [emotionState])

  // Trigger feedback for specific events
  const triggerFeedback = useCallback((event: Omit<MotivationalEvent, 'studentState'>) => {
    const studentState = getStudentPsychologicalState()
    const fullEvent: MotivationalEvent = { ...event, studentState }
    
    // In a real implementation, this would trigger the actual feedback
    // For now, we'll just log it
    console.log('Motivational feedback triggered:', fullEvent)
  }, [getStudentPsychologicalState])

  return {
    triggerFeedback,
    getStudentPsychologicalState,
    triggerAchievement,
    triggerConfetti,
    triggerBalloons,
    triggerFlickeringLights,
    triggerWrappingRibbons,
    triggerAnimation,
    toast,
    boostMotivation,
    onStudyAction
  }
}