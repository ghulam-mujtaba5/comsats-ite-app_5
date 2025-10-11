'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import { useAnimation as useFramerAnimation } from 'framer-motion'
import { usePathname } from 'next/navigation'

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

  useEffect(() => {
    if (prefersReducedMotion) return

    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 300)
    return () => clearTimeout(timer)
  }, [pathname, prefersReducedMotion])

  const variants = {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: prefersReducedMotion ? 0 : -20 }
  }

  const transition = {
    duration: prefersReducedMotion ? 0 : 0.3,
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

  const hoverVariants = {
    rest: { scale: 1 },
    hover: { scale: prefersReducedMotion ? 1 : 1.05 }
  }

  const tapVariants = {
    rest: { scale: 1 },
    tap: { scale: prefersReducedMotion ? 1 : 0.95 }
  }

  const glowVariants = {
    rest: { boxShadow: '0 0 0px rgba(59, 130, 246, 0)' },
    hover: { 
      boxShadow: prefersReducedMotion 
        ? '0 0 0px rgba(59, 130, 246, 0)' 
        : '0 0 20px rgba(59, 130, 246, 0.5)' 
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

  useEffect(() => {
    if (prefersReducedMotion) return

    if (isLoading) {
      controls.start({
        opacity: [0.5, 1, 0.5],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      })
    } else {
      controls.stop()
      controls.set({ opacity: 1 })
    }
  }, [isLoading, controls, prefersReducedMotion])

  return { controls, prefersReducedMotion }
}

/**
 * Success animation handler
 */
export function useSuccessAnimation() {
  const [showSuccess, setShowSuccess] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  const triggerSuccess = useCallback(() => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), prefersReducedMotion ? 1000 : 2000)
  }, [prefersReducedMotion])

  const successVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: prefersReducedMotion ? 1 : [0, 1.2, 1], 
      opacity: 1,
      transition: { duration: prefersReducedMotion ? 0.2 : 0.5 }
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.5 }
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

  useEffect(() => {
    if (prefersReducedMotion) {
      setAnimatedProgress(progress)
      return
    }

    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, 100)

    return () => clearTimeout(timer)
  }, [progress, prefersReducedMotion])

  return { animatedProgress }
}

/**
 * Ripple effect for button clicks
 */
export function useRippleEffect() {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])
  const prefersReducedMotion = usePrefersReducedMotion()

  const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return

    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const id = Date.now()

    setRipples(prev => [...prev, { x, y, id }])

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id))
    }, 600)
  }, [prefersReducedMotion])

  return { ripples, createRipple }
}

/**
 * Toast notification animation
 */
export function useToastAnimation() {
  const prefersReducedMotion = usePrefersReducedMotion()

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
        duration: prefersReducedMotion ? 0.1 : 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0,
      y: prefersReducedMotion ? 0 : -20,
      scale: prefersReducedMotion ? 1 : 0.5,
      transition: { duration: prefersReducedMotion ? 0.1 : 0.2 }
    }
  }

  return { toastVariants }
}

/**
 * Modal animation with backdrop
 */
export function useModalAnimation() {
  const prefersReducedMotion = usePrefersReducedMotion()

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: prefersReducedMotion ? 0.1 : 0.2 }
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
        duration: prefersReducedMotion ? 0.1 : 0.3,
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

  useEffect(() => {
    if (prefersReducedMotion) {
      setCount(end)
      return
    }

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
  }, [end, duration, prefersReducedMotion])

  return count
}

/**
 * Skeleton loading animation
 */
export function useSkeletonAnimation() {
  const prefersReducedMotion = usePrefersReducedMotion()

  const skeletonVariants = {
    initial: { opacity: 0.5 },
    animate: {
      opacity: prefersReducedMotion ? 0.5 : [0.5, 1, 0.5],
      transition: {
        duration: prefersReducedMotion ? 0 : 1.5,
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

  useEffect(() => {
    if (prefersReducedMotion) return

    const handleScroll = () => {
      setOffset(window.pageYOffset * speed)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, prefersReducedMotion])

  return prefersReducedMotion ? 0 : offset
}
