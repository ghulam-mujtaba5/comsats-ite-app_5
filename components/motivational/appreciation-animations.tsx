"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { 
  Heart, 
  ThumbsUp, 
  Hand, 
  Star, 
  Sparkles, 
  Gift,
  Crown,
  Medal,
  Flame,
  Zap,
  Trophy
} from "lucide-react"
import { useAnimation } from "@/contexts/animation-context"

// Define appreciation types
type AppreciationType = 
  | 'heart'
  | 'thumbs_up'
  | 'clap'
  | 'star'
  | 'sparkles'
  | 'gift'
  | 'crown'
  | 'medal'
  | 'flame'
  | 'zap'
  | 'trophy'

interface AppreciationAnimationProps {
  type: AppreciationType
  message?: string
  position?: { x: number; y: number }
  duration?: number
  size?: 'sm' | 'md' | 'lg'
  onComplete?: () => void
}

export function AppreciationAnimation({ 
  type, 
  message, 
  position = { x: 50, y: 50 }, 
  duration = 3000,
  size = 'md',
  onComplete 
}: AppreciationAnimationProps) {
  const { isAnimationEnabled } = useAnimation()
  const [isVisible, setIsVisible] = useState(true)

  // Auto-hide after duration
  useEffect(() => {
    if (!isAnimationEnabled) return
    
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onComplete) onComplete()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onComplete, isAnimationEnabled])

  if (!isAnimationEnabled || !isVisible) return null

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-6 h-6'
      case 'lg': return 'w-12 h-12'
      default: return 'w-8 h-8'
    }
  }

  // Get icon component
  const getIcon = () => {
    switch (type) {
      case 'heart': return Heart
      case 'thumbs_up': return ThumbsUp
      case 'clap': return Hand
      case 'star': return Star
      case 'sparkles': return Sparkles
      case 'gift': return Gift
      case 'crown': return Crown
      case 'medal': return Medal
      case 'flame': return Flame
      case 'zap': return Zap
      case 'trophy': return Trophy
      default: return Heart
    }
  }

  const IconComponent = getIcon()
  const sizeClasses = getSizeClasses()

  return (
    <div 
      className="fixed pointer-events-none z-50"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -10 }}
        animate={{ 
          scale: [0, 1.2, 1], 
          opacity: [0, 1, 1, 0],
          rotate: [0, 5, -5, 0]
        }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ 
          duration: duration / 1000,
          times: [0, 0.2, 0.8, 1]
        }}
        className="relative"
      >
        <IconComponent 
          className={`${sizeClasses} text-pink-500 drop-shadow-lg`} 
          fill="currentColor"
        />
        
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg whitespace-nowrap text-sm font-medium"
          >
            {message}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

// Hook for triggering appreciation animations
export function useAppreciation() {
  const { triggerAnimation } = useAnimation()
  
  const showAppreciation = (options: {
    type: AppreciationType
    message?: string
    position?: { x: number; y: number }
    duration?: number
    size?: 'sm' | 'md' | 'lg'
  }) => {
    const {
      type,
      message,
      position = { x: 50, y: 50 },
      duration = 3000,
      size = 'md'
    } = options

    // For simple appreciation, we'll use the existing animation system
    triggerAnimation({
      type: 'sparkles',
      message: message || 'Thank you!',
      duration,
      position
    })
  }

  return {
    showAppreciation
  }
}

// Component for showing appreciation in response to user actions
export function InteractiveAppreciation() {
  const [activeAppreciations, setActiveAppreciations] = useState<Array<{
    id: string
    type: AppreciationType
    message?: string
    position: { x: number; y: number }
    duration: number
    size: 'sm' | 'md' | 'lg'
  }>>([])

  const addAppreciation = (options: {
    type: AppreciationType
    message?: string
    position: { x: number; y: number }
    duration?: number
    size?: 'sm' | 'md' | 'lg'
  }) => {
    const id = Math.random().toString(36).substr(2, 9)
    const appreciation = {
      id,
      ...options,
      duration: options.duration || 3000,
      size: options.size || 'md'
    }
    
    setActiveAppreciations(prev => [...prev, appreciation])
    
    // Remove after duration
    setTimeout(() => {
      setActiveAppreciations(prev => prev.filter(a => a.id !== id))
    }, appreciation.duration)
  }

  return (
    <>
      {activeAppreciations.map(appreciation => (
        <AppreciationAnimation
          key={appreciation.id}
          type={appreciation.type}
          message={appreciation.message}
          position={appreciation.position}
          duration={appreciation.duration}
          size={appreciation.size}
          onComplete={() => {
            setActiveAppreciations(prev => prev.filter(a => a.id !== appreciation.id))
          }}
        />
      ))}
    </>
  )
}