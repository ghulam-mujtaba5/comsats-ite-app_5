// This file configures the initialization of Sentry for edge runtime.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Adjust this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console
  debug: false,

  // Set the environment
  environment: process.env.NODE_ENV || 'development',

  // Filter sensitive data
  beforeSend(event: Sentry.Event) {
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

    return event
  },
})
