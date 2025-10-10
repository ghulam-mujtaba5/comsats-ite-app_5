"use client"

import { EmotionProvider } from "@/contexts/emotion-context"
import { EmotionIntegration } from "./emotion-integration"

export function CampusAxisEmotionProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <EmotionProvider>
      <EmotionIntegration />
      {children}
    </EmotionProvider>
  )
}