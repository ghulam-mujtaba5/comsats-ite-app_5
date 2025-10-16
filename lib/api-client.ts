/**
 * Safe API Client with automatic error handling and retries
 */

import { retryWithBackoff, createErrorMessage, logError, handleApiError } from './error-handler'

export interface ApiClientOptions {
  retries?: number
  timeout?: number
  headers?: Record<string, string>
  cache?: RequestCache
}

export class ApiClient {
  private baseUrl: string
  private defaultOptions: ApiClientOptions

  constructor(baseUrl: string = '', options?: ApiClientOptions) {
    this.baseUrl = baseUrl
    this.defaultOptions = {
      retries: 2,
      timeout: 30000,
      ...options,
    }
  }

  /**
   * Safe GET request with automatic error handling
   */
  async get<T>(
    endpoint: string,
    options?: ApiClientOptions
  ): Promise<{ data: T | null; error: string | null }> {
    return this.request<T>(endpoint, {
      method: 'GET',
      ...options,
    })
  }

  /**
   * Safe POST request with automatic error handling
   */
  async post<T>(
    endpoint: string,
    body?: any,
    options?: ApiClientOptions
  ): Promise<{ data: T | null; error: string | null }> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })
  }

  /**
   * Safe PUT request with automatic error handling
   */
  async put<T>(
    endpoint: string,
    body?: any,
    options?: ApiClientOptions
  ): Promise<{ data: T | null; error: string | null }> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })
  }

  /**
   * Safe DELETE request with automatic error handling
   */
  async delete<T>(
    endpoint: string,
    options?: ApiClientOptions
  ): Promise<{ data: T | null; error: string | null }> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      ...options,
    })
  }

  /**
   * Core request method with error handling and retries
   */
  private async request<T>(
    endpoint: string,
    options?: RequestInit & ApiClientOptions
  ): Promise<{ data: T | null; error: string | null }> {
    const url = this.baseUrl + endpoint
    const mergedOptions = { ...this.defaultOptions, ...options }

    try {
      const response = await retryWithBackoff(
        async () => {
          const controller = new AbortController()
          const timeoutId = setTimeout(
            () => controller.abort(),
            mergedOptions.timeout
          )

          try {
            const res = await fetch(url, {
              ...options,
              signal: controller.signal,
              headers: {
                ...this.defaultOptions.headers,
                ...options?.headers,
              },
            })

            clearTimeout(timeoutId)

            if (!res.ok) {
              let errorMessage = `HTTP ${res.status}: ${res.statusText}`
              
              try {
                const errorData = await res.json()
                errorMessage = errorData.error || errorData.message || errorMessage
              } catch {
                // If JSON parsing fails, use default error message
              }

              throw new Error(errorMessage)
            }

            return res
          } catch (error) {
            clearTimeout(timeoutId)
            throw error
          }
        },
        {
          maxRetries: mergedOptions.retries,
          onRetry: (attempt: number, error: Error) => {
            console.warn(`Retry attempt ${attempt} for ${url}:`, error.message)
          },
        }
      )

      // Handle empty responses
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        return { data: data as T, error: null }
      } else {
        return { data: null, error: null }
      }
    } catch (error) {
      const errorMessage = createErrorMessage(error, 'Request failed')
      const appError = handleApiError(error)
      logError(appError, `ApiClient: ${options?.method || 'GET'} ${endpoint}`)
      return { data: null, error: errorMessage }
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

/**
 * Safe fetch wrapper that never throws
 */
export async function safeFetch<T>(
  url: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null; status: number }> {
  try {
    const response = await fetch(url, options)
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorData.message || errorMessage
      } catch {
        // Ignore JSON parsing errors
      }

      return {
        data: null,
        error: errorMessage,
        status: response.status,
      }
    }

    const data = await response.json()
    return { data: data as T, error: null, status: response.status }
  } catch (error) {
    const errorMessage = createErrorMessage(error)
    const appError = handleApiError(error)
    logError(appError, `safeFetch: ${url}`)
    return { data: null, error: errorMessage, status: 0 }
  }
}
