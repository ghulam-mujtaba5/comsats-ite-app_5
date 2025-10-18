import dynamic from "next/dynamic"
import { ComponentType } from "react"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import styles from './performance.module.css';

/**
 * Performance optimization utilities for lazy loading and code splitting
 * 
 * Features:
 * - Dynamic imports with custom loading states
 * - Automatic code splitting
 * - Error boundaries
 * - Loading skeletons
 */

interface DynamicLoadOptions {
  loading?: ComponentType
  ssr?: boolean
}

/**
 * Create a lazy-loaded component with automatic code splitting
 * 
 * @example
 * const HeavyChart = lazyLoad(() => import('./HeavyChart'))
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: DynamicLoadOptions = {}
) {
  const { loading: LoadingComponent = DefaultLoading, ssr = false } = options

  return dynamic(importFunc, {
    loading: () => <LoadingComponent />,
    ssr,
  })
}

/**
 * Default loading component with shimmer effect
 */
function DefaultLoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <CenteredLoader />
    </div>
  )
}

/**
 * Card-based loading skeleton
 */
export function CardSkeleton() {
  return (
    <Card className="glass-card">
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 pt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Table loading skeleton
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-12" />
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * List loading skeleton
 */
export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <Card key={i} className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/**
 * Preload a route or component for better perceived performance
 * 
 * @example
 * <button onClick={() => preloadRoute('/dashboard')}>
 *   Go to Dashboard
 * </button>
 */
export function preloadRoute(route: string) {
  if (typeof window !== "undefined") {
    const link = document.createElement("link")
    link.rel = "prefetch"
    link.href = route
    document.head.appendChild(link)
  }
}

/**
 * Preload an image for better perceived performance
 */
export function preloadImage(src: string) {
  if (typeof window !== "undefined") {
    const link = document.createElement("link")
    link.rel = "preload"
    link.as = "image"
    link.href = src
    document.head.appendChild(link)
  }
}

/**
 * Intersection Observer hook for lazy loading
 * Returns true when element is in viewport
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  { threshold = 0, root = null, rootMargin = "0%" }: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false)

  React.useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      { threshold, root, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [elementRef, threshold, root, rootMargin])

  return isIntersecting
}

/**
 * Performance monitoring utility
 * Logs component render performance in development
 */
export function measurePerformance(componentName: string, fn: () => void) {
  if (process.env.NODE_ENV === "development") {
    const start = performance.now()
    fn()
    const end = performance.now()
    console.log(`[Performance] ${componentName}: ${(end - start).toFixed(2)}ms`)
  } else {
    fn()
  }
}

/**
 * Debounce utility for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle utility for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Re-export React for the hook
import React from "react"
