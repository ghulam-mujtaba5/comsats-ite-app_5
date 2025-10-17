// This file configures the initialization of Sentry on the client.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Automatically instrument your application
  integrations: [
    // Enable session replay
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    // Track browser performance
    Sentry.browserTracingIntegration(),
  ],

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

    // Filter out sensitive information from breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.filter((breadcrumb: Sentry.Breadcrumb) => {
        // Remove breadcrumbs containing sensitive data
        if (breadcrumb.category === 'console' && breadcrumb.message) {
          return !breadcrumb.message.includes('password')
        }
        return true
      })
    }

    // Filter sensitive data from event extras
    if (event.extra) {
      delete event.extra.password
      delete event.extra.token
      delete event.extra.secret
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
    'Load failed',
    
    // User cancelled actions
    'AbortError',
    'The user aborted a request',
    
    // Common browser errors
    'ResizeObserver loop',
    'Non-Error promise rejection captured',
    'Cannot read property',
    
    // React errors that are handled
    'Loading chunk',
    'ChunkLoadError',
  ],

  // Don't send transactions for these URLs
  denyUrls: [
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
    /^moz-extension:\/\//i,
  ],

  // Track specific transactions
  tracePropagationTargets: [
    'localhost',
    /^https:\/\/comsats-ite\.vercel\.app/,
  ],
})
