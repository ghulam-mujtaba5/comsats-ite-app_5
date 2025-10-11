'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { usePageTransition, useScrollAnimation, useMicroInteraction } from '@/hooks/use-enhanced-animations'
import { cn } from '@/lib/utils'

/**
 * Page transition wrapper
 */
interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const { variants, transition } = usePageTransition()

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
interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  className?: string
  enableHover?: boolean
  enableGlow?: boolean
}

export function AnimatedCard({ 
  children, 
  className, 
  enableHover = true, 
  enableGlow = false,
  ...props 
}: AnimatedCardProps) {
  const { hoverVariants, glowVariants, prefersReducedMotion } = useMicroInteraction()

  return (
    <motion.div
      initial="rest"
      whileHover={enableHover ? "hover" : undefined}
      variants={enableGlow ? glowVariants : hoverVariants}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        'transition-shadow duration-300',
        enableHover && !prefersReducedMotion && 'cursor-pointer',
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
interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'glow'
}

export function AnimatedButton({ 
  children, 
  className,
  variant = 'default',
  ...props 
}: AnimatedButtonProps) {
  const { tapVariants, glowVariants, prefersReducedMotion } = useMicroInteraction()

  return (
    <motion.button
      initial="rest"
      whileHover={variant === 'glow' ? "hover" : undefined}
      whileTap="tap"
      variants={variant === 'glow' ? glowVariants : tapVariants}
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

  return (
    <motion.div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
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
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  className?: string
}

export function StaggerItem({ children, className, ...props }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
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
          transition={{ duration: 1, ease: 'easeOut' }}
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
  if (!isOpen) return null

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
        transition={{ type: 'spring', duration: 0.5 }}
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
interface FloatingButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode
  className?: string
}

export function FloatingButton({ children, className, ...props }: FloatingButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        y: {
          duration: 2,
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
  return (
    <motion.div
      animate={active ? {
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1]
      } : {}}
      transition={{
        duration: 2,
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
  return (
    <motion.div
      animate={active ? {
        y: [0, -10, 0]
      } : {}}
      transition={{
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: 2
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
  return (
    <div className={cn('relative overflow-hidden rounded', width, height, className)}>
      <div className="absolute inset-0 bg-muted" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 1.5,
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
        transition={{ duration: 0.5, ease: 'easeInOut' }}
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

  React.useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return (
    <span className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}
