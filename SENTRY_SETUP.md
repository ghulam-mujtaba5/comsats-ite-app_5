# Sentry Configuration Guide

This guide explains how to set up Sentry for error tracking and monitoring in the COMSATS ITE app.

## Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Installation

### 1. Install Sentry Package

```bash
pnpm add @sentry/nextjs
```

### 2. Run Sentry Wizard (Optional)

```bash
npx @sentry/wizard@latest -i nextjs
```

This will:
- Create Sentry configuration files
- Add Sentry to your build process
- Set up source maps upload

---

## Configuration

### Environment Variables

Add these to your `.env.local`:

```env
# Sentry DSN (Data Source Name)
SENTRY_DSN=https://your-dsn@sentry.io/project-id
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Sentry Auth Token (for source maps upload)
SENTRY_AUTH_TOKEN=your-auth-token

# Sentry Organization and Project
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug

# Environment
NODE_ENV=production
```

### Production `.env.production`:

```env
SENTRY_DSN=https://production-dsn@sentry.io/project-id
NEXT_PUBLIC_SENTRY_DSN=https://production-dsn@sentry.io/project-id
SENTRY_AUTH_TOKEN=production-auth-token
NODE_ENV=production
```

---

## Configuration Files

### 1. Server Configuration (`sentry.server.config.ts`)

Handles errors in:
- API routes
- Server components
- Middleware
- Server-side code

**Features:**
- Error tracking
- Performance monitoring
- Profiling (10% of requests)
- Sensitive data filtering

### 2. Client Configuration (`sentry.client.config.ts`)

Handles errors in:
- Client components
- Browser interactions
- Client-side code

**Features:**
- Error tracking
- Session replay (10% of sessions)
- Performance monitoring
- Browser tracing

### 3. Edge Configuration (`sentry.edge.config.ts`)

Handles errors in:
- Edge functions
- Middleware running on edge

**Features:**
- Lightweight error tracking
- Minimal overhead

---

## Usage

### Automatic Error Tracking

Sentry automatically captures unhandled errors:

```typescript
// This error will be automatically captured
throw new Error('Something went wrong')
```

### Manual Error Tracking

```typescript
import * as Sentry from '@sentry/nextjs'

try {
  // Your code
  riskyOperation()
} catch (error) {
  // Manually capture error with context
  Sentry.captureException(error, {
    tags: {
      section: 'community',
      action: 'create-post'
    },
    extra: {
      userId: user.id,
      postData: sanitizedData
    }
  })
}
```

### Capturing Messages

```typescript
import * as Sentry from '@sentry/nextjs'

// Log information
Sentry.captureMessage('User completed tutorial', 'info')

// Log warning
Sentry.captureMessage('Unusual activity detected', 'warning')

// Log error
Sentry.captureMessage('Failed to process payment', 'error')
```

### Adding Context

```typescript
import * as Sentry from '@sentry/nextjs'

// Set user context
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name
})

// Set custom tags
Sentry.setTag('page', 'community')
Sentry.setTag('feature', 'posts')

// Set custom context
Sentry.setContext('post', {
  id: post.id,
  category: post.category,
  likes: post.likes
})

// Clear user context (on logout)
Sentry.setUser(null)
```

### Performance Monitoring

```typescript
import * as Sentry from '@sentry/nextjs'

// Start a transaction
const transaction = Sentry.startTransaction({
  op: 'api.request',
  name: 'GET /api/community/posts'
})

// Create spans for operations
const dbSpan = transaction.startChild({
  op: 'db.query',
  description: 'Fetch posts from database'
})

const posts = await db.post.findMany()
dbSpan.finish()

const cacheSpan = transaction.startChild({
  op: 'cache.set',
  description: 'Cache posts result'
})

await cache.set('posts', posts)
cacheSpan.finish()

// Finish transaction
transaction.finish()
```

### Using with Error Boundary

```typescript
import * as Sentry from '@sentry/nextjs'
import { ErrorBoundary } from '@/components/error-boundary'

export function MyComponent() {
  return (
    <ErrorBoundary
      fallback={<ErrorFallback />}
      onError={(error, errorInfo) => {
        Sentry.captureException(error, {
          contexts: {
            react: errorInfo
          }
        })
      }}
    >
      <YourComponent />
    </ErrorBoundary>
  )
}
```

---

## Best Practices

### 1. Filter Sensitive Data

Always filter sensitive information before sending to Sentry:

```typescript
// ✅ Good - Filter sensitive data
Sentry.captureException(error, {
  extra: {
    userId: user.id,
    // Don't include passwords, tokens, etc.
  }
})

// ❌ Bad - Exposing sensitive data
Sentry.captureException(error, {
  extra: {
    password: user.password, // Never do this!
    token: authToken
  }
})
```

### 2. Use Appropriate Severity Levels

```typescript
// Fatal - Critical errors
Sentry.captureException(error, { level: 'fatal' })

// Error - Application errors
Sentry.captureException(error, { level: 'error' })

// Warning - Warning conditions
Sentry.captureMessage('Deprecated API used', 'warning')

// Info - Informational messages
Sentry.captureMessage('User logged in', 'info')

// Debug - Debug messages
Sentry.captureMessage('Cache hit', 'debug')
```

### 3. Add Relevant Context

```typescript
Sentry.captureException(error, {
  tags: {
    feature: 'community',
    action: 'create-post',
    environment: process.env.NODE_ENV
  },
  extra: {
    userId: user.id,
    postCategory: category,
    timestamp: new Date().toISOString()
  },
  contexts: {
    device: {
      type: 'desktop',
      browser: 'Chrome'
    }
  }
})
```

### 4. Set Sampling Rates Appropriately

```typescript
// Production - Lower sampling for cost efficiency
tracesSampleRate: 0.1,        // 10% of transactions
replaysSessionSampleRate: 0.1, // 10% of sessions
replaysOnErrorSampleRate: 1.0, // 100% of errors

// Development - Higher sampling for testing
tracesSampleRate: 1.0,         // 100% of transactions
replaysSessionSampleRate: 1.0, // 100% of sessions
```

### 5. Use Breadcrumbs for Context

```typescript
// Automatically captured:
// - Console logs
// - Network requests
// - DOM events
// - Navigation changes

// Manual breadcrumbs
Sentry.addBreadcrumb({
  category: 'auth',
  message: 'User attempted login',
  level: 'info',
  data: {
    email: user.email
  }
})
```

---

## Integration with Features

### API Routes

```typescript
// app/api/community/posts/route.ts
import * as Sentry from '@sentry/nextjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Your logic
    const post = await createPost(body)
    
    return Response.json({ success: true, post })
  } catch (error) {
    // Capture error with context
    Sentry.captureException(error, {
      tags: {
        endpoint: '/api/community/posts',
        method: 'POST'
      },
      extra: {
        requestBody: body
      }
    })
    
    return Response.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
```

### Server Components

```typescript
// app/community/page.tsx
import * as Sentry from '@sentry/nextjs'

export default async function CommunityPage() {
  try {
    const posts = await db.post.findMany()
    
    return <PostsList posts={posts} />
  } catch (error) {
    Sentry.captureException(error, {
      tags: { page: 'community' }
    })
    
    return <ErrorPage />
  }
}
```

### Client Components

```typescript
'use client'
import * as Sentry from '@sentry/nextjs'
import { useState } from 'react'

export function CreatePostForm() {
  const [error, setError] = useState<string | null>(null)
  
  async function handleSubmit(data: FormData) {
    try {
      await createPost(data)
    } catch (err) {
      Sentry.captureException(err, {
        tags: { component: 'CreatePostForm' }
      })
      setError('Failed to create post')
    }
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

---

## Monitoring Dashboard

### Key Metrics to Monitor

1. **Error Rate**
   - Track error frequency over time
   - Alert on spikes

2. **Performance**
   - API response times
   - Page load times
   - Database query duration

3. **User Impact**
   - Number of affected users
   - Error distribution by user

4. **Release Health**
   - Crash-free sessions
   - Error rate per release

### Setting Up Alerts

1. Go to Sentry dashboard
2. Navigate to Alerts
3. Create alert rules:
   - Error spike detection
   - Performance degradation
   - High error rate

---

## Source Maps

Source maps help you debug minified production code.

### Upload Source Maps

```typescript
// next.config.mjs
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig = {
  // Your Next.js config
}

export default withSentryConfig(
  nextConfig,
  {
    // Sentry webpack plugin options
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
  },
  {
    // Sentry options
    widenClientFileUpload: true,
    transpileClientSDK: true,
    hideSourceMaps: true,
    disableLogger: true,
  }
)
```

---

## Troubleshooting

### Events Not Appearing

1. **Check DSN:**
   ```bash
   echo $SENTRY_DSN
   ```

2. **Verify Environment:**
   - Events are filtered in development by default
   - Check `beforeSend` filter

3. **Test Sentry:**
   ```typescript
   Sentry.captureMessage('Test event')
   ```

### High Event Volume

1. **Adjust Sampling Rates:**
   ```typescript
   tracesSampleRate: 0.1, // Lower from 1.0
   ```

2. **Add Ignore Rules:**
   ```typescript
   ignoreErrors: [
     'NetworkError',
     'ResizeObserver loop'
   ]
   ```

### Source Maps Not Working

1. **Verify Auth Token:**
   ```bash
   echo $SENTRY_AUTH_TOKEN
   ```

2. **Check Build Output:**
   - Look for "Sentry: Source maps uploaded"

3. **Manual Upload:**
   ```bash
   npx @sentry/cli releases files <release> upload-sourcemaps .next
   ```

---

## Cost Optimization

### Reduce Event Volume

1. **Sample transactions:**
   ```typescript
   tracesSampleRate: 0.1 // 10% instead of 100%
   ```

2. **Filter errors:**
   ```typescript
   ignoreErrors: ['NetworkError', 'LoadError']
   ```

3. **Disable in development:**
   ```typescript
   if (process.env.NODE_ENV !== 'production') return null
   ```

### Optimize Replay Sessions

```typescript
// Only replay 10% of normal sessions
replaysSessionSampleRate: 0.1,

// But always replay errors
replaysOnErrorSampleRate: 1.0
```

---

## Security Considerations

### Never Send Sensitive Data

```typescript
beforeSend(event) {
  // Remove cookies
  delete event.request?.cookies
  
  // Remove auth headers
  delete event.request?.headers?.['authorization']
  
  // Remove sensitive extras
  delete event.extra?.password
  delete event.extra?.token
  
  return event
}
```

### Use Environment Variables

Never hardcode your DSN:

```typescript
// ❌ Bad
const SENTRY_DSN = 'https://xxx@sentry.io/123'

// ✅ Good
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN
```

---

## Further Reading

- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Session Replay](https://docs.sentry.io/product/session-replay/)
- [Alerts](https://docs.sentry.io/product/alerts/)

---

**Last Updated:** January 2025
