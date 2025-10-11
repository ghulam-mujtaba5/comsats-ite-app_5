'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface SparkleTrailProps {
  enabled?: boolean
  color?: string
  size?: number
  density?: 'low' | 'medium' | 'high'
}

interface Sparkle {
  id: number
  x: number
  y: number
}

export function SparkleTrail({
  enabled = true,
  color = '#fbbf24',
  size = 4,
  density = 'medium',
}: SparkleTrailProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const sparkleIdRef = useRef(0)

  const densityMap = {
    low: 150,
    medium: 100,
    high: 50,
  }

  useEffect(() => {
    if (!enabled) return

    let lastTime = 0
    const interval = densityMap[density]

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastTime < interval) return
      lastTime = now

      const newSparkle: Sparkle = {
        id: sparkleIdRef.current++,
        x: e.clientX,
        y: e.clientY,
      }

      setSparkles((prev) => [...prev, newSparkle])

      // Remove sparkle after animation
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id))
      }, 1000)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [enabled, density])

  if (!enabled) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute"
            style={{
              left: sparkle.x,
              top: sparkle.y,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
              rotate: [0, 180],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <svg
              width={size * 4}
              height={size * 4}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                fill={color}
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
