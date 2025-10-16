'use client'

import React from 'react'
import { motion, HTMLMotionProps, useReducedMotion } from 'framer-motion'
import { usePageTransition, useScrollAnimation, useMicroInteraction } from '@/hooks/use-enhanced-animations'
import { cn } from '@/lib/utils'
import { useAnimation } from '@/contexts/animation-context'

/**
 * Page transition wrapper
 */
interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const { variants, transition } = usePageTransition()
  const { isAnimationEnabled } = useAnimation()
  const prefersReducedMotion = useReducedMotion()

  // Disable animations if user prefers reduced motion or animations are disabled
  if (prefersReducedMotion || !isAnimationEnabled) {
    return <div className={cn('w-full', className)}>{children}</div>
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={transition as any}
      className={cn('w-full', className)}
    >
      {children}
    </motion.div>
  )
}

/**
 * Animated card with hover effects
 */
interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  enableHover?: boolean
  enableGlow?: boolean
  [key: string]: any
}

export function AnimatedCard({ 
  children, 
  className, 
  enableHover = true, 
  enableGlow = false,
  ...props 
}: AnimatedCardProps) {
  const { hoverVariants, glowVariants } = useMicroInteraction()
  const { animationIntensity, isAnimationEnabled } = useAnimation()
  const prefersReducedMotion = useReducedMotion()

  // Disable animations if user prefers reduced motion or animations are disabled
  if (prefersReducedMotion || !isAnimationEnabled) {
    return (
      <div
        className={cn(
          'rounded-lg border bg-card text-card-foreground shadow-sm',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  // Adjust animation intensity
  const getIntensityScale = () => {
    switch (animationIntensity) {
      case 'low': return 1.01
      case 'medium': return 1.05
      case 'high': return 1.1
      default: return 1.05
    }
  }

  const intensityScale = getIntensityScale()

  const adjustedHoverVariants = {
    rest: { scale: 1 },
    hover: { scale: intensityScale }
  }

  return (
    <motion.div
      initial="rest"
      whileHover={enableHover ? "hover" : undefined}
      variants={enableGlow ? glowVariants : adjustedHoverVariants}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        'transition-shadow duration-300',
        enableHover && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Animated button with press feedback
 */
interface AnimatedButtonProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'glow'
  [key: string]: any
}

export function AnimatedButton({ 
  children, 
  className,
  variant = 'default',
  ...props 
}: AnimatedButtonProps) {
  const { tapVariants, glowVariants } = useMicroInteraction()
  const { animationIntensity, isAnimationEnabled } = useAnimation()
  const prefersReducedMotion = useReducedMotion()

  // Disable animations if user prefers reduced motion or animations are disabled
  if (prefersReducedMotion || !isAnimationEnabled) {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium',
          'transition-colors focus-visible:outline-none focus-visible:ring-2',
          'disabled:pointer-events-none disabled:opacity-50',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }

  // Adjust animation intensity
  const getIntensityScale = () => {
    switch (animationIntensity) {
      case 'low': return 0.98
      case 'medium': return 0.95
      case 'high': return 0.9
      default: return 0.95
    }
  }

  const intensityScale = getIntensityScale()

  const adjustedTapVariants = {
    rest: { scale: 1 },
    tap: { scale: intensityScale }
  }

  return (
    <motion.button
      initial="rest"
      whileHover={variant === 'glow' ? "hover" : undefined}
      whileTap="tap"
      variants={variant === 'glow' ? glowVariants : adjustedTapVariants}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium',
        'transition-colors focus-visible:outline-none focus-visible:ring-2',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}

/**
 * Scroll-triggered fade in
 */
interface FadeInScrollProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function FadeInScroll({ children, className, delay = 0 }: FadeInScrollProps) {
  const { elementRef, isVisible } = useScrollAnimation()
  const { animationIntensity, isAnimationEnabled } = useAnimation()
  const prefersReducedMotion = useReducedMotion()

  // Disable animations if user prefers reduced motion or animations are disabled
  if (prefersReducedMotion || !isAnimationEnabled) {
    return <div className={className}>{children}</div>
  }

  // Adjust animation intensity
  const getDuration = () => {
    switch (animationIntensity) {
      case 'low': return 0.4
      case 'medium': return 0.6
      case 'high': return 0.8
      default: return 0.6
    }
  }

  const duration = getDuration()

  return (
    <motion.div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Stagger children animation
 */
interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerContainer({ children, className, staggerDelay = 0.1 }: StaggerContainerProps) {
  const { animationIntensity, isAnimationEnabled } = useAnimation()
  const prefersReducedMotion = useReducedMotion()

  // Disable animations if user prefers reduced motion or animations are disabled
  if (prefersReducedMotion || !isAnimationEnabled) {
    return <div className={className}>{children}</div>
  }

  // Adjust animation intensity
  const getStaggerDelay = () => {
    switch (animationIntensity) {
      case 'low': return staggerDelay * 1.5
      case 'medium': return staggerDelay
      case 'high': return staggerDelay * 0.7
      default: return staggerDelay
    }
  }

  const adjustedStaggerDelay = getStaggerDelay()

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: adjustedStaggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
  [key: string]: any
}

export function StaggerItem({ children, className, ...props }: StaggerItemProps) {
  const { animationIntensity, isAnimationEnabled } = useAnimation()
  const prefersReducedMotion = useReducedMotion()

  // Disable animations if user prefers reduced motion or animations are disabled
  if (prefersReducedMotion || !isAnimationEnabled) {
    return <div className={className}>{children}</div>
  }

  // Adjust animation intensity
  const getDuration = () => {
    switch (animationIntensity) {
      case 'low': return 0.3
      case 'medium': return 0.5
      case 'high': return 0.7
      default: return 0.5
    }
  }

  const duration = getDuration()

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration } }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Animated progress bar
 */
interface AnimatedProgressProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  variant?: 'default' | 'gradient' | 'glow'
}

export function AnimatedProgress({ 
  value, 
  max = 100, 
  className,
  showLabel = false,
  variant = 'default'
}: AnimatedProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const { animationIntensity, isAnimationEnabled } = useAnimation()
  const prefersReducedMotion = useReducedMotion()

  // Disable animations if user prefers reduced motion or animations are disabled
  if (prefersReducedMotion || !isAnimationEnabled) {
    const getVariantClass = () => {
      switch (variant) {
        case 'gradient':
          return 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
        case 'glow':
          return 'bg-blue-500'
        default:
          return 'bg-primary'
      }
    }

    return (
      <div className={cn('relative w-full', className)}>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full', getVariantClass())}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <span className="absolute right-0 -top-6 text-sm font-medium text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    )
  }

  // Adjust animation intensity
  const getDuration = () => {
    switch (animationIntensity) {
      case 'low': return 0.5
      case 'medium': return 1
      case 'high': return 1.5
      default: return 1
    }
  }

  const duration = getDuration()

  const getVariantClass = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
      case 'glow':
        return 'bg-blue-500 shadow-lg shadow-blue-500/50'
      default:
        return 'bg-primary'
    }
  }

  return (
    <div className={cn('relative w-full', className)}>
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration, ease: 'easeOut' }}
          className={cn('h-full rounded-full', getVariantClass())}
        />
      </div>
      {showLabel && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute right-0 -top-6 text-sm font-medium text-muted-foreground"
        >
          {Math.round(percentage)}%
        </motion.span>
      )}
    </div>
  )
}

/**
 * Animated modal/dialog
 */
interface AnimatedModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function AnimatedModal({ isOpen, onClose, children, className }: AnimatedModalProps) {
  const { animationIntensity, isAnimationEnabled } = useAnimation()
  const prefersReducedMotion = useReducedMotion()

  if (!isOpen) return null

  // Disable animations if user prefers reduced motion or animations are disabled
  if (prefersReducedMotion || !isAnimationEnabled) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={onClose}
      >
        <div
          className={cn(
            'relative bg-background rounded-lg shadow-xl max-w-lg w-full p-6',
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    )
  }

  // Adjust animation intensity
  const getDuration = () => {
    switch (animationIntensity) {
      case 'low': return 0.2
      case 'medium': return 0.5
      case 'high': return 0.8
      default: return 0.5
    }
  }

  const duration = getDuration()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.75, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.75, y: 50 }}
        transition={{ type: 'spring', duration }}
        className={cn(
          'relative bg-background rounded-lg shadow-xl max-w-lg w-full p-6',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

/**
 * Floating action button
 */
interface FloatingButtonProps {
  children: React.ReactNode
  className?: string
  [key: string]: any
}

export function FloatingButton({ children, className, ...props }: FloatingButtonProps) {
  const { animationIntensity, isAnimationEnabled } = useAnimation()
  const prefersReducedMotion = useReducedMotion()

  // Disable animations if user prefers reduced motion or animations are disabled
  if (prefersReducedMotion || !isAnimationEnabled) {
    return (
      <button
        className={cn(
          'fixed bottom-8 right-8 p-4 rounded-full shadow-lg',
          'bg-primary text-primary-foreground z-50',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }

  // Adjust animation intensity
  const getYMovement = () => {
    switch (animationIntensity) {
      case 'low': return 5
      case 'medium': return 10
      case 'high': return 15
      default: return 10
    }
  }

  const yMovement = getYMovement()
  const duration = animationIntensity === 'low' ? 3 : animationIntensity === 'high' ? 1 : 2

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      animate={{
        y: [0, -yMovement, 0],
      }}
      transition={{
        y: {
          duration,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }}
      className={cn(
        'fixed bottom-8 right-8 p-4 rounded-full shadow-lg',
        'bg-primary text-primary-foreground z-50',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}

/**
 * Pulse animation for notifications
 */
interface PulseProps {
  children: React.ReactNode
  className?: string
  active?: boolean
}

export function Pulse({ children, className, active = true }: PulseProps) {
  const { animationIntensity, isAnimationEnabled } = useAnimation()
  const prefersReducedMotion = useReducedMotion()

  // Disable animations if user prefers reduced motion or animations are disabled
  if (prefersReducedMotion || !isAnimationEnabled || !active) {
    return <div className={className}>{children}</div>
  }

  // Adjust animation intensity
  const getDuration = () => {
    switch (animationIntensity) {
      case 'low': return 3
      case 'medium': return 2
      case 'high': return 1
      default: return 2
    }
  }

  const duration = getDuration()

  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Bounce animation for attention
 */
interface BounceProps {
  children: React.ReactNode
  className?: string
  active?: boolean
}

export function Bounce({ children, className, active = true }: BounceProps) {
  const { animationIntensity, isAnimationEnabled } = useAnimation()
  const prefersReducedMotion = useReducedMotion()

  // Disable animations if user prefers reduced motion or animations are disabled
  if (prefersReducedMotion || !isAnimationEnabled || !active) {
    return <div className={className}>{children}</div>
  }

  // Adjust animation intensity
  const getDuration = () => {
    switch (animationIntensity) {
      case 'low': return 1
      case 'medium': return 0.6
      case 'high': return 0.3
      default: return 0.6
    }
  }

  const duration = getDuration()
  const repeatDelay = animationIntensity === 'low' ? 3 : animationIntensity === 'high' ? 1 : 2

  return (
    <motion.div
      animate={{
        y: [0, -10, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatDelay
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Shimmer loading effect
 */
interface ShimmerProps {
  className?: string
  width?: string
  height?: string
}

export function Shimmer({ className, width = 'w-full', height = 'h-4' }: ShimmerProps) {
  const { animationIntensity, isAnimationEnabled } = useAnimation()
  const prefersReducedMotion = useReducedMotion()

  // Disable animations if user prefers reduced motion or animations are disabled
  if (prefersReducedMotion || !isAnimationEnabled) {
    return (
      <div className={cn('relative overflow-hidden rounded', width, height, className)}>
        <div className="absolute inset-0 bg-muted" />
      </div>
    )
  }

  // Adjust animation intensity
  const getDuration = () => {
    switch (animationIntensity) {
      case 'low': return 2
      case 'medium': return 1.5
      case 'high': return 1
      default: return 1.5
    }
  }

  const duration = getDuration()

  return (
    <div className={cn('relative overflow-hidden rounded', width, height, className)}>
      <div className="absolute inset-0 bg-muted" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  )
}

/**
 * Checkmark draw animation
 */
interface CheckmarkProps {
  className?: string
  size?: number
}

export function CheckmarkDraw({ className, size = 24 }: CheckmarkProps) {
  const { animationIntensity, isAnimationEnabled } = useAnimation()
  const prefersReducedMotion = useReducedMotion()

  // Disable animations if user prefers reduced motion or animations are disabled
  if (prefersReducedMotion || !isAnimationEnabled) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
      >
        <path
          d="M5 13l4 4L19 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  // Adjust animation intensity
  const getDuration = () => {
    switch (animationIntensity) {
      case 'low': return 0.7
      case 'medium': return 0.5
      case 'high': return 0.3
      default: return 0.5
    }
  }

  const duration = getDuration()

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <motion.path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration, ease: 'easeInOut' }}
      />
    </svg>
  )
}

/**
 * Count up animation
 */
interface CountUpProps {
  end: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}

export function CountUp({ end, duration = 2000, className, prefix = '', suffix = '' }: CountUpProps) {
  const [count, setCount] = React.useState(0)
  const { animationIntensity, isAnimationEnabled } = useAnimation()
  const prefersReducedMotion = useReducedMotion()

  // Disable animations if user prefers reduced motion or animations are disabled
  if (prefersReducedMotion || !isAnimationEnabled) {
    return (
      <span className={className}>
        {prefix}{end.toLocaleString()}{suffix}
      </span>
    )
  }

  // Adjust animation intensity
  const getAdjustedDuration = () => {
    switch (animationIntensity) {
      case 'low': return duration * 1.5
      case 'medium': return duration
      case 'high': return duration * 0.7
      default: return duration
    }
  }

  const adjustedDuration = getAdjustedDuration()

  React.useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / adjustedDuration, 1)
      
      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, adjustedDuration])

  return (
    <span className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}