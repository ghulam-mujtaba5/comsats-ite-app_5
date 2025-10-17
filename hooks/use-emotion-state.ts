'use client'

import { useState, useEffect, useCallback } from 'react'

export type EmotionType = 'happy' | 'calm' | 'stressed' | 'motivated' | 'lonely' | 'focused' | 'neutral'

export interface EmotionState {
  current: EmotionType
  intensity: number // 0-100
  lastChanged: Date
  history: Array<{ emotion: EmotionType; timestamp: Date; duration: number }>
}

export interface ActivityPattern {
  sessionDuration: number // minutes
  actionsCount: number
  lastActivity: Date
  activityType: 'study' | 'social' | 'contribution' | 'idle'
}

const EMOTION_STORAGE_KEY = 'campusaxis_emotion_state'
const ACTIVITY_STORAGE_KEY = 'campusaxis_activity_pattern'

export function useEmotionState() {
  const [emotionState, setEmotionState] = useState<EmotionState>({
    current: 'neutral',
    intensity: 50,
    lastChanged: new Date(),
    history: [],
  })

  const [activityPattern, setActivityPattern] = useState<ActivityPattern>({
    sessionDuration: 0,
    actionsCount: 0,
    lastActivity: new Date(),
    activityType: 'idle',
  })

  // Load emotion state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(EMOTION_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setEmotionState({
          ...parsed,
          lastChanged: new Date(parsed.lastChanged),
          history: parsed.history.map((h: any) => ({
            ...h,
            timestamp: new Date(h.timestamp),
          })),
        })
      }

      const storedActivity = localStorage.getItem(ACTIVITY_STORAGE_KEY)
      if (storedActivity) {
        const parsed = JSON.parse(storedActivity)
        setActivityPattern({
          ...parsed,
          lastActivity: new Date(parsed.lastActivity),
        })
      }
    } catch (error) {
      console.error('Failed to load emotion state:', error)
    }
  }, [])

  // Save emotion state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(EMOTION_STORAGE_KEY, JSON.stringify(emotionState))
    } catch (error) {
      console.error('Failed to save emotion state:', error)
    }
  }, [emotionState])

  // Save activity pattern to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activityPattern))
    } catch (error) {
      console.error('Failed to save activity pattern:', error)
    }
  }, [activityPattern])

  const setEmotion = useCallback((emotion: EmotionType, intensity: number = 50) => {
    setEmotionState((prev) => {
      const now = new Date()
      const duration = now.getTime() - prev.lastChanged.getTime()

      return {
        current: emotion,
        intensity: Math.max(0, Math.min(100, intensity)),
        lastChanged: now,
        history: [
          ...prev.history.slice(-19), // Keep last 20 entries
          {
            emotion: prev.current,
            timestamp: prev.lastChanged,
            duration,
          },
        ],
      }
    })
  }, [])

  const trackActivity = useCallback(
    (type: ActivityPattern['activityType'], duration: number = 0) => {
      setActivityPattern((prev) => ({
        sessionDuration: prev.sessionDuration + duration,
        actionsCount: prev.actionsCount + 1,
        lastActivity: new Date(),
        activityType: type,
      }))

      // Auto-detect emotion based on activity patterns
      if (type === 'study' && duration > 30) {
        setEmotion('focused', 70)
      } else if (type === 'social') {
        setEmotion('happy', 60)
      } else if (type === 'contribution') {
        setEmotion('motivated', 80)
      }
    },
    [setEmotion]
  )

  const detectStress = useCallback(() => {
    const now = new Date()
    const timeSinceLastActivity = now.getTime() - activityPattern.lastActivity.getTime()
    const minutesSinceLastActivity = timeSinceLastActivity / (1000 * 60)

    // Detect stress patterns
    if (activityPattern.sessionDuration > 120) {
      // Over 2 hours
      return { isStressed: true, reason: 'long_session', intensity: 70 }
    }

    if (activityPattern.actionsCount > 50) {
      // Too many actions
      return { isStressed: true, reason: 'high_activity', intensity: 60 }
    }

    if (minutesSinceLastActivity > 60) {
      // Inactive for over 1 hour
      return { isStressed: false, reason: 'inactive', intensity: 30 }
    }

    return { isStressed: false, reason: 'normal', intensity: 50 }
  }, [activityPattern])

  const suggestBreak = useCallback(() => {
    const stress = detectStress()
    return stress.isStressed && stress.reason === 'long_session'
  }, [detectStress])

  const getMotivationalMessage = useCallback(() => {
    const messages = {
      happy: [
        'Keep spreading those positive vibes! 🌟',
        'Your energy is contagious! 😊',
        'You\'re doing amazing! 🎉',
      ],
      calm: [
        'Stay peaceful and focused 🧘',
        'You\'re in the flow ✨',
        'Inner peace brings clarity 🌿',
      ],
      stressed: [
        'You\'ve got this 💙',
        'One step at a time. You\'re stronger than you think 💪',
        'It\'s okay to take a break. Self-care matters 🌸',
      ],
      motivated: [
        'Your determination is inspiring! 🚀',
        'Keep pushing forward! You\'re unstoppable 💫',
        'Excellence is a habit. You\'re building it! 🏆',
      ],
      lonely: [
        'Remember, you\'re part of a community 🤝',
        'Reach out to your campus friends. They\'re here for you ❤️',
        'You\'re never alone in this journey 🌈',
      ],
      focused: [
        'Deep work mode activated! 🎯',
        'Your concentration is impressive! 📚',
        'Flow state achieved! Keep it up! ⚡',
      ],
      neutral: [
        'Ready for your next move? 💡',
        'What will you accomplish today? 🌟',
        'Your journey continues! 🎓',
      ],
    }

    const emotionMessages = messages[emotionState.current] || messages.neutral
    return emotionMessages[Math.floor(Math.random() * emotionMessages.length)]
  }, [emotionState.current])

  const resetSession = useCallback(() => {
    setActivityPattern({
      sessionDuration: 0,
      actionsCount: 0,
      lastActivity: new Date(),
      activityType: 'idle',
    })
  }, [])

  return {
    emotionState,
    activityPattern,
    setEmotion,
    trackActivity,
    detectStress,
    suggestBreak,
    getMotivationalMessage,
    resetSession,
  }
}
