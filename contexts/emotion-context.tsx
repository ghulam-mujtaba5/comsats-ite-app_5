"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useMemo } from "react"
import { useAuth } from "@/contexts/auth-context"
import styles from './emotion-context.module.css';

// Define types for emotion states
export type MoodType = 
  | 'happy'
  | 'sad'
  | 'neutral'
  | 'excited'
  | 'stressed'
  | 'calm'
  | 'focused'
  | 'distracted'
  | 'tired'
  | 'energized'

export type StressLevel = 'low' | 'medium' | 'high'
export type FocusLevel = 'low' | 'medium' | 'high'
export type MotivationLevel = 'low' | 'medium' | 'high'

export interface EmotionState {
  mood: MoodType
  stressLevel: StressLevel
  focusLevel: FocusLevel
  motivationLevel: MotivationLevel
  lastUpdated: Date
}

interface EmotionContextType {
  emotionState: EmotionState
  updateEmotionState: (updates: Partial<EmotionState>) => void
  resetEmotionState: () => void
  getRecommendedTheme: () => string
  getRecommendedAnimation: () => string
}

const EmotionContext = createContext<EmotionContextType | undefined>(undefined)

const DEFAULT_EMOTION_STATE: EmotionState = {
  mood: 'neutral',
  stressLevel: 'low',
  focusLevel: 'medium',
  motivationLevel: 'medium',
  lastUpdated: new Date(),
}

export function EmotionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [emotionState, setEmotionState] = useState<EmotionState>(DEFAULT_EMOTION_STATE)

  // Load user emotion preferences when user is available
  useEffect(() => {
    if (user) {
      // In a real implementation, you would fetch user preferences from the API
      // For now, we'll use localStorage as a fallback
      const savedEmotions = localStorage.getItem(`emotionState_${user.id}`)
      if (savedEmotions) {
        try {
          const parsed = JSON.parse(savedEmotions)
          setEmotionState({
            ...parsed,
            lastUpdated: new Date(parsed.lastUpdated),
          })
        } catch (e) {
          console.error('Error loading emotion state:', e)
        }
      }
    }
  }, [user])

  // Save preferences when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`emotionState_${user.id}`, JSON.stringify(emotionState))
    }
  }, [emotionState, user])

  const updateEmotionState = useMemo(() => (updates: Partial<EmotionState>) => {
    setEmotionState(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date(),
    }))
  }, [])

  const resetEmotionState = useMemo(() => () => {
    setEmotionState({
      ...DEFAULT_EMOTION_STATE,
      lastUpdated: new Date(),
    })
  }, [])

  const getRecommendedTheme = useMemo(() => () => {
    // Return theme class based on current emotion state
    if (emotionState.stressLevel === 'high' || emotionState.mood === 'sad') {
      return 'calm-theme'
    }
    
    if (emotionState.mood === 'happy' || emotionState.motivationLevel === 'high') {
      return 'positive-theme'
    }
    
    if (emotionState.focusLevel === 'high') {
      return 'focus-theme'
    }
    
    return 'default-theme'
  }, [emotionState])

  const getRecommendedAnimation = useMemo(() => () => {
    // Return animation type based on current emotion state
    if (emotionState.mood === 'happy' || emotionState.motivationLevel === 'high') {
      return 'celebration'
    }
    
    if (emotionState.stressLevel === 'high' || emotionState.mood === 'sad') {
      return 'calm'
    }
    
    if (emotionState.focusLevel === 'high') {
      return 'focus'
    }
    
    return 'subtle'
  }, [emotionState])

  const contextValue: EmotionContextType = {
    emotionState,
    updateEmotionState,
    resetEmotionState,
    getRecommendedTheme,
    getRecommendedAnimation,
  }

  return <EmotionContext.Provider value={contextValue}>{children}</EmotionContext.Provider>
}

export function useEmotion() {
  const context = useContext(EmotionContext)
  if (context === undefined) {
    throw new Error("useEmotion must be used within an EmotionProvider")
  }
  return context
}