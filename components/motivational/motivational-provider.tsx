"use client"

import { ReactNode } from "react"
import { UnifiedFeedbackSystem } from "./unified-feedback-system"
import { InteractiveAppreciation } from "./appreciation-animations"
import { EmotionalResponseSystem } from "./emotional-responses"

interface MotivationalProviderProps {
  children: ReactNode
}

export function MotivationalProvider({ children }: MotivationalProviderProps) {
  return (
    <>
      {/* Unified motivational feedback system */}
      <UnifiedFeedbackSystem />
      
      {/* Interactive appreciation animations */}
      <InteractiveAppreciation />
      
      {/* Emotional response system */}
      <EmotionalResponseSystem />
      
      {/* Render children */}
      {children}
    </>
  )
}