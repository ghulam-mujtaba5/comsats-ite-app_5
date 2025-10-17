// This file configures the initialization of Sentry on the server.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Automatically instrument your application (server-side)
  // Note: profilingIntegration is not available in @sentry/nextjs v10; rely on default instrumentation
  integrations: [],

  // Set the environment
  environment: process.env.NODE_ENV || 'development',

  // Enable session replay for errors
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Filter sensitive data
  beforeSend(event: Sentry.ErrorEvent, hint: Sentry.EventHint) {
    // Don't send events in development
    if (process.env.NODE_ENV !== 'production') {
      return null
    }

    // Filter out sensitive headers
    if (event.request) {
      delete event.request.cookies
      if (event.request.headers) {
        delete event.request.headers['authorization']
        delete event.request.headers['cookie']
      }
    }

    // Filter sensitive data from exception
    if (event.exception) {
      event.exception.values?.forEach((exception: any) => {
        if (exception.stacktrace?.frames) {
          exception.stacktrace.frames.forEach((frame: any) => {
            // Remove local file paths for privacy
            if (frame.abs_path) {
              frame.abs_path = frame.abs_path.replace(/^.*node_modules/, 'node_modules')
            }
          })
        }
      })
    }

    return event
  },

  // Ignore specific errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'chrome-extension://',
    'moz-extension://',
    
    // Network errors
    'NetworkError',
    'Network request failed',
    'Failed to fetch',
    
    // User cancelled actions
    'AbortError',
    'The user aborted a request',
    
    // Common browser errors
    'ResizeObserver loop',
    'Non-Error promise rejection captured',
  ],

  // Don't send transactions for these URLs
  denyUrls: [
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
    /^moz-extension:\/\//i,
  ],
})
