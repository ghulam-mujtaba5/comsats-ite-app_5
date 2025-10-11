'use client'

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useEmotionState, EmotionType } from '@/hooks/use-emotion-state'

export interface EmotionalUIContextType {
  emotion: EmotionType
  intensity: number
  setEmotion: (emotion: EmotionType, intensity?: number) => void
  trackActivity: (type: 'study' | 'social' | 'contribution' | 'idle', duration?: number) => void
  suggestBreak: () => boolean
  getMotivationalMessage: () => string
  theme: {
    backgroundColor: string
    textColor: string
    accentColor: string
    animationSpeed: 'slow' | 'normal' | 'fast'
  }
}

const EmotionalUIContext = createContext<EmotionalUIContextType | undefined>(undefined)

export function EmotionalUIProvider({ children }: { children: ReactNode }) {
  const {
    emotionState,
    setEmotion,
    trackActivity,
    suggestBreak,
    getMotivationalMessage,
  } = useEmotionState()

  const [theme, setTheme] = useState({
    backgroundColor: 'bg-white dark:bg-gray-900',
    textColor: 'text-gray-900 dark:text-gray-100',
    accentColor: 'text-indigo-600 dark:text-indigo-400',
    animationSpeed: 'normal' as 'slow' | 'normal' | 'fast',
  })

  // Update theme based on emotion
  useEffect(() => {
    const emotionThemes = {
      happy: {
        backgroundColor: 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800',
        textColor: 'text-gray-900 dark:text-yellow-50',
        accentColor: 'text-yellow-600 dark:text-yellow-400',
        animationSpeed: 'fast' as const,
      },
      calm: {
        backgroundColor: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-blue-950',
        textColor: 'text-gray-900 dark:text-blue-50',
        accentColor: 'text-blue-600 dark:text-blue-400',
        animationSpeed: 'slow' as const,
      },
      stressed: {
        backgroundColor: 'bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-900 dark:to-red-950',
        textColor: 'text-gray-900 dark:text-red-50',
        accentColor: 'text-red-600 dark:text-red-400',
        animationSpeed: 'slow' as const,
      },
      motivated: {
        backgroundColor: 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-orange-950',
        textColor: 'text-gray-900 dark:text-orange-50',
        accentColor: 'text-orange-600 dark:text-orange-400',
        animationSpeed: 'fast' as const,
      },
      lonely: {
        backgroundColor: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-950',
        textColor: 'text-gray-900 dark:text-purple-50',
        accentColor: 'text-purple-600 dark:text-purple-400',
        animationSpeed: 'normal' as const,
      },
      focused: {
        backgroundColor: 'bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-indigo-950',
        textColor: 'text-gray-900 dark:text-indigo-50',
        accentColor: 'text-indigo-600 dark:text-indigo-400',
        animationSpeed: 'normal' as const,
      },
      neutral: {
        backgroundColor: 'bg-white dark:bg-gray-900',
        textColor: 'text-gray-900 dark:text-gray-100',
        accentColor: 'text-indigo-600 dark:text-indigo-400',
        animationSpeed: 'normal' as const,
      },
    }

    setTheme(emotionThemes[emotionState.current] || emotionThemes.neutral)
  }, [emotionState.current])

  const contextValue: EmotionalUIContextType = {
    emotion: emotionState.current,
    intensity: emotionState.intensity,
    setEmotion,
    trackActivity,
    suggestBreak,
    getMotivationalMessage,
    theme,
  }

  return (
    <EmotionalUIContext.Provider value={contextValue}>
      {children}
    </EmotionalUIContext.Provider>
  )
}

export function useEmotionalUI() {
  const context = useContext(EmotionalUIContext)
  if (context === undefined) {
    throw new Error('useEmotionalUI must be used within an EmotionalUIProvider')
  }
  return context
}
