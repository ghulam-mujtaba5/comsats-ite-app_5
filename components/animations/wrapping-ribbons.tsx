'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAnimation } from '@/contexts/animation-context'

export interface WrappingRibbonsProps {
  ribbonCount?: number
  colors?: string[]
  duration?: number
  onComplete?: () => void
}

export function WrappingRibbons({ 
  ribbonCount = 10, 
  colors = ['#6366f1', '#ec4899', '#ec4899', '#f59e0b', '#10b981'],
  duration = 7000,
  onComplete 
}: WrappingRibbonsProps) {
  const [ribbons, setRibbons] = useState<Array<{
    id: number
    color: string
    startX: number
    startY: number
    endX: number
    endY: number
    delay: number
  }>>([])
  const { isAnimationEnabled } = useAnimation()

  useEffect(() => {
    if (!isAnimationEnabled) return

    // Generate ribbon positions
    const newRibbons = Array.from({ length: ribbonCount }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      startX: Math.random() * 100,
      startY: Math.random() > 0.5 ? -10 : 110, // Start from top or bottom
      endX: Math.random() * 100,
      endY: Math.random() > 0.5 ? -10 : 110, // End at top or bottom
      delay: Math.random() * 1000
    }))

    setRibbons(newRibbons)

    // Clean up after duration
    const timer = setTimeout(() => {
      if (onComplete) onComplete()
    }, duration)

    return () => clearTimeout(timer)
  }, [ribbonCount, colors, duration, onComplete, isAnimationEnabled])

  if (!isAnimationEnabled) {
    return null
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {ribbons.map((ribbon) => (
        <motion.div
          key={ribbon.id}
          className="absolute w-1 h-20 rounded-full origin-bottom"
          style={{
            backgroundColor: ribbon.color,
            left: `${ribbon.startX}%`,
            top: `${ribbon.startY}%`,
            boxShadow: `0 0 8px ${ribbon.color}, 0 0 16px ${ribbon.color}`
          }}
          initial={{ 
            rotate: 0,
            scaleY: 0,
            opacity: 0
          }}
          animate={{ 
            rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360],
            scaleY: [0, 1, 1, 1, 0],
            opacity: [0, 1, 1, 1, 0],
            x: [0, (ribbon.endX - ribbon.startX) * 10],
            y: [0, (ribbon.endY - ribbon.startY) * 10]
          }}
          transition={{
            duration: duration / 1000,
            delay: ribbon.delay / 1000,
            times: [0, 0.1, 0.5, 0.9, 1],
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}