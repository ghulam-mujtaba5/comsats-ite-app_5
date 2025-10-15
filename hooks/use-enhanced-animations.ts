'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import { useAnimation as useFramerAnimation } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useAnimation } from '@/contexts/animation-context'

/**
 * Enhanced animation hooks for CampusAxis
 * Provides performance-optimized, accessible animations
 */

// Check if user prefers reduced motion
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

/**
 * Page transition animations
 */
export function usePageTransition() {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const { animationIntensity } = useAnimation()

  useEffect(() => {
    if (prefersReducedMotion) return

    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 300)
    return () => clearTimeout(timer)
  }, [pathname, prefersReducedMotion])

  // Adjust duration based on animation intensity
  const getTransitionDuration = () => {
    switch (animationIntensity) {
      case 'low': return prefersReducedMotion ? 0 : 0.1
      case 'medium': return prefersReducedMotion ? 0 : 0.3
      case 'high': return prefersReducedMotion ? 0 : 0.5
      default: return prefersReducedMotion ? 0 : 0.3
    }
  }

  const duration = getTransitionDuration()

  const variants = {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: prefersReducedMotion ? 0 : -20 }
  }

  const transition = {
    duration,
    ease: 'easeInOut'
  }

  return { isTransitioning, variants, transition }
}

/**
 * Scroll-triggered animations with IntersectionObserver
 */
export function useScrollAnimation(options: IntersectionObserverInit = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const { animationIntensity } = useAnimation()

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true)
      setHasAnimated(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true)
          setHasAnimated(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    )

    const element = elementRef.current
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [hasAnimated, options, prefersReducedMotion])

  return { elementRef, isVisible, hasAnimated }
}

/**
 * Micro-interactions for buttons and interactive elements
 */
export function useMicroInteraction() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const { animationIntensity } = useAnimation()

  // Adjust scale based on animation intensity
  const getScaleFactor = (baseScale: number) => {
    switch (animationIntensity) {
      case 'low': return 1 + (baseScale - 1) * 0.5
      case 'medium': return baseScale
      case 'high': return 1 + (baseScale - 1) * 1.5
      default: return baseScale
    }
  }

  const hoverVariants = {
    rest: { scale: 1 },
    hover: { scale: prefersReducedMotion ? 1 : getScaleFactor(1.05) }
  }

  const tapVariants = {
    rest: { scale: 1 },
    tap: { scale: prefersReducedMotion ? 1 : getScaleFactor(0.95) }
  }

  const glowVariants = {
    rest: { boxShadow: '0 0 0px rgba(59, 130, 246, 0)' },
    hover: { 
      boxShadow: prefersReducedMotion 
        ? '0 0 0px rgba(59, 130, 246, 0)' 
        : `0 0 ${20 * (animationIntensity === 'low' ? 0.5 : animationIntensity === 'high' ? 1.5 : 1)}px rgba(59, 130, 246, 0.5)` 
    }
  }

  return { hoverVariants, tapVariants, glowVariants, prefersReducedMotion }
}

/**
 * Loading state animations
 */
export function useLoadingState(isLoading: boolean) {
  const controls = useFramerAnimation()
  const prefersReducedMotion = usePrefersReducedMotion()
  const { animationIntensity } = useAnimation()

  // Adjust duration based on animation intensity
  const getDuration = () => {
    switch (animationIntensity) {
      case 'low': return 2
      case 'medium': return 1.5
      case 'high': return 1
      default: return 1.5
    }
  }

  const duration = getDuration()

  useEffect(() => {
    if (prefersReducedMotion) return

    if (isLoading) {
      controls.start({
        opacity: [0.5, 1, 0.5],
        transition: {
          duration,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      })
    } else {
      controls.stop()
      controls.set({ opacity: 1 })
    }
  }, [isLoading, controls, prefersReducedMotion, duration])

  return { controls, prefersReducedMotion }
}

/**
 * Success animation handler
 */
export function useSuccessAnimation() {
  const [showSuccess, setShowSuccess] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const { animationIntensity } = useAnimation()

  const triggerSuccess = useCallback(() => {
    setShowSuccess(true)
    const timeout = prefersReducedMotion ? 1000 : animationIntensity === 'low' ? 3000 : animationIntensity === 'high' ? 1000 : 2000
    setTimeout(() => setShowSuccess(false), timeout)
  }, [prefersReducedMotion, animationIntensity])

  // Adjust scale based on animation intensity
  const getScaleValues = () => {
    switch (animationIntensity) {
      case 'low': return [0, 1.1, 1]
      case 'medium': return [0, 1.2, 1]
      case 'high': return [0, 1.3, 1]
      default: return [0, 1.2, 1]
    }
  }

  const scaleValues = prefersReducedMotion ? [1, 1, 1] : getScaleValues()

  // Adjust duration based on animation intensity
  const getDuration = () => {
    switch (animationIntensity) {
      case 'low': return prefersReducedMotion ? 0.2 : 0.7
      case 'medium': return prefersReducedMotion ? 0.2 : 0.5
      case 'high': return prefersReducedMotion ? 0.2 : 0.3
      default: return prefersReducedMotion ? 0.2 : 0.5
    }
  }

  const duration = getDuration()

  const successVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: scaleValues,
      opacity: 1,
      transition: { duration }
    },
    exit: { scale: 0, opacity: 0 }
  }

  return { showSuccess, triggerSuccess, successVariants }
}

/**
 * Card stagger animation for lists
 */
export function useStaggerAnimation(itemCount: number, staggerDelay = 0.1) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const { animationIntensity } = useAnimation()

  // Adjust stagger delay based on animation intensity
  const getStaggerDelay = () => {
    switch (animationIntensity) {
      case 'low': return staggerDelay * 1.5
      case 'medium': return staggerDelay
      case 'high': return staggerDelay * 0.5
      default: return staggerDelay
    }
  }

  const adjustedStaggerDelay = prefersReducedMotion ? 0 : getStaggerDelay()

  // Adjust duration based on animation intensity
  const getDuration = () => {
    switch (animationIntensity) {
      case 'low': return 0.7
      case 'medium': return 0.5
      case 'high': return 0.3
      default: return 0.5
    }
  }

  const duration = prefersReducedMotion ? 0 : getDuration()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: adjustedStaggerDelay
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration }
    }
  }

  return { containerVariants, itemVariants }
}

/**
 * Progress bar animation
 */
export function useProgressAnimation(progress: number) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()
  const { animationIntensity } = useAnimation()

  // Adjust animation delay based on animation intensity
  const getDelay = () => {
    switch (animationIntensity) {
      case 'low': return 200
      case 'medium': return 100
      case 'high': return 50
      default: return 100
    }
  }

  const delay = getDelay()

  useEffect(() => {
    if (prefersReducedMotion) {
      setAnimatedProgress(progress)
      return
    }

    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, delay)

    return () => clearTimeout(timer)
  }, [progress, prefersReducedMotion, delay])

  return { animatedProgress }
}

/**
 * Ripple effect for button clicks
 */
export function useRippleEffect() {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])
  const prefersReducedMotion = usePrefersReducedMotion()
  const { animationIntensity } = useAnimation()

  const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return

    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const id = Date.now()

    setRipples(prev => [...prev, { x, y, id }])

    // Adjust ripple duration based on animation intensity
    const duration = animationIntensity === 'low' ? 800 : animationIntensity === 'high' ? 400 : 600

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id))
    }, duration)
  }, [prefersReducedMotion, animationIntensity])

  return { ripples, createRipple }
}

/**
 * Toast notification animation
 */
export function useToastAnimation() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const { animationIntensity } = useAnimation()

  // Adjust durations based on animation intensity
  const getDurations = () => {
    switch (animationIntensity) {
      case 'low': return { animate: 0.6, exit: 0.3 }
      case 'medium': return { animate: 0.4, exit: 0.2 }
      case 'high': return { animate: 0.2, exit: 0.1 }
      default: return { animate: 0.4, exit: 0.2 }
    }
  }

  const durations = getDurations()

  const toastVariants = {
    initial: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : -50,
      scale: prefersReducedMotion ? 1 : 0.3
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0.1 : durations.animate,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0,
      y: prefersReducedMotion ? 0 : -20,
      scale: prefersReducedMotion ? 1 : 0.5,
      transition: { duration: prefersReducedMotion ? 0.1 : durations.exit }
    }
  }

  return { toastVariants }
}

/**
 * Modal animation with backdrop
 */
export function useModalAnimation() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const { animationIntensity } = useAnimation()

  // Adjust durations based on animation intensity
  const getDurations = () => {
    switch (animationIntensity) {
      case 'low': return { backdrop: 0.3, modal: 0.5 }
      case 'medium': return { backdrop: 0.2, modal: 0.3 }
      case 'high': return { backdrop: 0.1, modal: 0.2 }
      default: return { backdrop: 0.2, modal: 0.3 }
    }
  }

  const durations = getDurations()

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: prefersReducedMotion ? 0.1 : durations.backdrop }
    }
  }

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: prefersReducedMotion ? 1 : 0.75,
      y: prefersReducedMotion ? 0 : 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.1 : durations.modal,
        ease: 'easeOut'
      }
    }
  }

  return { backdropVariants, modalVariants }
}

/**
 * Count-up animation for numbers
 */
export function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()
  const { animationIntensity } = useAnimation()

  // Adjust duration based on animation intensity
  const getAdjustedDuration = () => {
    switch (animationIntensity) {
      case 'low': return duration * 1.5
      case 'medium': return duration
      case 'high': return duration * 0.5
      default: return duration
    }
  }

  const adjustedDuration = getAdjustedDuration()

  useEffect(() => {
    if (prefersReducedMotion) {
      setCount(end)
      return
    }

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
  }, [end, adjustedDuration, prefersReducedMotion])

  return count
}

/**
 * Skeleton loading animation
 */
export function useSkeletonAnimation() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const { animationIntensity } = useAnimation()

  // Adjust duration based on animation intensity
  const getDuration = () => {
    switch (animationIntensity) {
      case 'low': return 2.5
      case 'medium': return 1.5
      case 'high': return 1
      default: return 1.5
    }
  }

  const duration = prefersReducedMotion ? 0 : getDuration()

  const skeletonVariants = {
    initial: { opacity: 0.5 },
    animate: {
      opacity: prefersReducedMotion ? 0.5 : [0.5, 1, 0.5],
      transition: {
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  return { skeletonVariants }
}

/**
 * Parallax scroll effect
 */
export function useParallax(speed = 0.5) {
  const [offset, setOffset] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()
  const { animationIntensity } = useAnimation()

  // Adjust speed based on animation intensity
  const getAdjustedSpeed = () => {
    switch (animationIntensity) {
      case 'low': return speed * 0.5
      case 'medium': return speed
      case 'high': return speed * 1.5
      default: return speed
    }
  }

  const adjustedSpeed = getAdjustedSpeed()

  useEffect(() => {
    if (prefersReducedMotion) return

    const handleScroll = () => {
      setOffset(window.pageYOffset * adjustedSpeed)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [adjustedSpeed, prefersReducedMotion])

  return prefersReducedMotion ? 0 : offset
}