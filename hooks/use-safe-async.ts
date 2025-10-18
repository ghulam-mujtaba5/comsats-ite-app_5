import { useState, useCallback } from 'react'
import { logError, parseError, handleApiError } from '@lib/error-handler'

/**
 * Hook for safe async operations with automatic error handling
 */
export function useSafeAsync<T>() {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const execute = useCallback(async (
    asyncFn: () => Promise<T>,
    options?: {
      onSuccess?: (data: T) => void
      onError?: (error: string) => void
      context?: string
    }
  ) => {
    setLoading(true)
    setError(null)

    try {
      const result = await asyncFn()
      setData(result)
      options?.onSuccess?.(result)
      return result
    } catch (err) {
      const errorMessage = parseError(err)
      setError(errorMessage)
      const appError = handleApiError(err)
      logError(appError, options?.context || 'useSafeAsync')
      options?.onError?.(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    data,
    error,
    loading,
    execute,
    reset,
  }
}
