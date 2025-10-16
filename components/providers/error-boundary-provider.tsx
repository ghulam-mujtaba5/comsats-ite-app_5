"use client"

import { ErrorBoundary } from '@/components/ui/error-boundary'
import { ReactNode } from 'react'

/**
 * Global Error Boundary Provider
 * Wraps the entire application to catch and handle errors gracefully
 */
export function ErrorBoundaryProvider({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
}
