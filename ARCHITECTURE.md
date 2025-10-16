# System Architecture

Complete technical architecture documentation for the COMSATS ITE application.

## Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [System Design](#system-design)
- [Database Schema](#database-schema)
- [API Architecture](#api-architecture)
- [Authentication Flow](#authentication-flow)
- [Performance Strategy](#performance-strategy)
- [Security Model](#security-model)
- [Deployment Architecture](#deployment-architecture)

---

## Overview

The COMSATS ITE App is a modern web application built with Next.js 15, providing a comprehensive platform for students to manage their academic activities, connect with peers, access resources, and track their progress.

### Key Features
- **Community Platform:** Post discussions, polls, help requests
- **Faculty Reviews:** Rate and review faculty members
- **Past Papers Repository:** Upload and access past exam papers
- **GPA Calculator:** Calculate semester, cumulative, and aggregate scores
- **News & Events:** Stay updated with campus news
- **User Profiles:** Personalized dashboards and settings

### Design Principles
1. **Performance First:** Optimized for Core Web Vitals
2. **Mobile Responsive:** Mobile-first design approach
3. **Accessibility:** WCAG 2.1 Level AA compliance
4. **Security:** Zero-trust security model
5. **Scalability:** Designed to handle 10,000+ concurrent users

---

## Technology Stack

### Frontend
- **Framework:** Next.js 15.2.4 (App Router)
- **UI Library:** React 19.2.0
- **Styling:** Tailwind CSS 3.4
- **Components:** shadcn/ui (Radix UI)
- **State Management:** React Context + Hooks
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Animations:** Framer Motion

### Backend
- **Runtime:** Node.js 18+
- **API:** Next.js API Routes (App Router)
- **Authentication:** NextAuth.js
- **File Upload:** UploadThing
- **Email:** Nodemailer

### Database
- **Primary Database:** PostgreSQL 15+
- **ORM:** Prisma 5.x
- **Caching:** In-memory cache (Redis optional)
- **Search:** PostgreSQL Full-Text Search

### Testing
- **E2E Testing:** Playwright
- **Unit Testing:** Jest
- **Component Testing:** React Testing Library
- **API Testing:** Supertest

### DevOps
- **Hosting:** Vercel (recommended)
- **Database:** Neon/Supabase (recommended)
- **File Storage:** UploadThing/S3
- **Monitoring:** Sentry (error tracking)
- **Analytics:** Vercel Analytics

---

## System Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│                   Client Layer                   │
│  (Browser, Mobile Web, PWA)                     │
└────────────┬────────────────────────────────────┘
             │
             │ HTTPS
             │
┌────────────▼────────────────────────────────────┐
│              Next.js Application                 │
│  ┌──────────────────────────────────────────┐   │
│  │        Server Components (RSC)           │   │
│  │  - Static Generation (SSG)               │   │
│  │  - Server-Side Rendering (SSR)           │   │
│  │  - Incremental Static Regeneration       │   │
│  └──────────────┬───────────────────────────┘   │
│                 │                                │
│  ┌──────────────▼───────────────────────────┐   │
│  │          Client Components               │   │
│  │  - Interactive UI                        │   │
│  │  - Client-side State                     │   │
│  │  - Real-time Updates                     │   │
│  └──────────────┬───────────────────────────┘   │
└─────────────────┼────────────────────────────────┘
                  │
                  │ API Routes
                  │
┌─────────────────▼────────────────────────────────┐
│              API Layer (REST)                    │
│  ┌──────────┬──────────┬──────────┬──────────┐  │
│  │   Auth   │Community │ Faculty  │   GPA    │  │
│  │   API    │   API    │   API    │   API    │  │
│  └────┬─────┴────┬─────┴────┬─────┴────┬─────┘  │
│       │          │          │          │         │
│  ┌────▼──────────▼──────────▼──────────▼─────┐  │
│  │         Middleware Layer                   │  │
│  │  - Authentication                          │  │
│  │  - Rate Limiting                           │  │
│  │  - Input Validation                        │  │
│  │  - Error Handling                          │  │
│  └────────────────┬───────────────────────────┘  │
└───────────────────┼──────────────────────────────┘
                    │
                    │ Prisma ORM
                    │
┌───────────────────▼──────────────────────────────┐
│              Data Layer                          │
│  ┌──────────────────────────────────────────┐   │
│  │       PostgreSQL Database                │   │
│  │  - Users & Profiles                      │   │
│  │  - Posts & Comments                      │   │
│  │  - Faculty & Reviews                     │   │
│  │  - Past Papers                           │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │         Cache Layer (Optional)           │   │
│  │  - Query Results                         │   │
│  │  - Session Data                          │   │
│  └──────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│            External Services                     │
│  - File Storage (UploadThing/S3)                │
│  - Email Service (SMTP)                         │
│  - OAuth Providers (Google)                     │
│  - Error Tracking (Sentry)                      │
│  - Analytics (Vercel Analytics)                 │
└──────────────────────────────────────────────────┘
```

### Component Architecture

```
app/
├── (auth)/                    # Auth route group
│   ├── login/
│   ├── register/
│   └── layout.tsx            # Auth layout
├── (dashboard)/              # Main app route group
│   ├── dashboard/
│   ├── community/
│   ├── faculty/
│   ├── past-papers/
│   ├── gpa-calculator/
│   └── layout.tsx            # Dashboard layout
├── api/                      # API routes
│   ├── auth/
│   ├── community/
│   ├── faculty/
│   └── ...
└── layout.tsx                # Root layout

components/
├── ui/                       # Base UI components
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── forms/                    # Form components
│   ├── login-form.tsx
│   ├── post-form.tsx
│   └── ...
├── layouts/                  # Layout components
│   ├── header.tsx
│   ├── sidebar.tsx
│   └── footer.tsx
└── features/                 # Feature components
    ├── community/
    ├── faculty/
    └── ...
```

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐         ┌─────────────────┐
│      User       │◄────────┤      Post       │
├─────────────────┤   1:N   ├─────────────────┤
│ id (PK)         │         │ id (PK)         │
│ email           │         │ authorId (FK)   │
│ name            │         │ title           │
│ password        │         │ content         │
│ department      │         │ category        │
│ semester        │         │ createdAt       │
│ role            │         │ updatedAt       │
│ avatar          │         └─────────────────┘
│ createdAt       │                 │
└─────────────────┘                 │ 1:N
        │                           │
        │ 1:N                       ▼
        │                   ┌─────────────────┐
        │                   │    Comment      │
        │                   ├─────────────────┤
        │                   │ id (PK)         │
        │                   │ postId (FK)     │
        │                   │ authorId (FK)   │
        │                   │ content         │
        │                   │ parentId (FK)   │
        │                   │ createdAt       │
        │                   └─────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────┐         ┌─────────────────┐
│  FacultyReview  │─────────┤     Faculty     │
├─────────────────┤   N:1   ├─────────────────┤
│ id (PK)         │         │ id (PK)         │
│ facultyId (FK)  │         │ name            │
│ authorId (FK)   │         │ department      │
│ rating          │         │ designation     │
│ content         │         │ email           │
│ anonymous       │         │ avatar          │
│ createdAt       │         └─────────────────┘
└─────────────────┘

┌─────────────────┐
│    PastPaper    │
├─────────────────┤
│ id (PK)         │
│ title           │
│ course          │
│ semester        │
│ year            │
│ type            │
│ fileUrl         │
│ uploadedById(FK)│
│ downloads       │
│ createdAt       │
└─────────────────┘
```

### Key Tables

**Users Table:**
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  department TEXT,
  semester INTEGER,
  role TEXT DEFAULT 'student',
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_department ON users(department);
```

**Posts Table:**
```sql
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  author_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

**Comments Table:**
```sql
CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
  author_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  parent_id TEXT REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
```

---

## API Architecture

### REST API Design

**Endpoint Structure:**
```
/api/{resource}/{id?}/{action?}
```

**Examples:**
- `GET /api/community/posts` - List posts
- `POST /api/community/posts` - Create post
- `GET /api/community/posts/123` - Get post
- `POST /api/community/posts/123/like` - Like post

### Request/Response Flow

```
Client Request
    │
    ▼
┌─────────────────┐
│  Middleware     │
│  - CORS         │
│  - Rate Limit   │
│  - Auth Check   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Route Handler  │
│  - Validate     │
│  - Parse        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Business Logic │
│  - Process      │
│  - Transform    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Data Access    │
│  - Prisma Query │
│  - Cache        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Response       │
│  - Format       │
│  - Send         │
└─────────────────┘
```

### Error Handling

```typescript
// Standard error response format
{
  "error": "Error type",
  "message": "Human-readable message",
  "details": { /* additional context */ },
  "statusCode": 400
}
```

**Error Codes:**
- `400` Bad Request - Invalid input
- `401` Unauthorized - Not authenticated
- `403` Forbidden - Insufficient permissions
- `404` Not Found - Resource not found
- `429` Too Many Requests - Rate limit exceeded
- `500` Internal Server Error - Server error

---

## Authentication Flow

### Registration Flow

```
1. User fills registration form
   ↓
2. Client validates input (Zod schema)
   ↓
3. POST /api/auth/register
   ↓
4. Server validates email uniqueness
   ↓
5. Hash password (bcrypt)
   ↓
6. Create user record
   ↓
7. Send verification email
   ↓
8. Return success response
```

### Login Flow

```
1. User enters credentials
   ↓
2. POST /api/auth/login
   ↓
3. Find user by email
   ↓
4. Verify password (bcrypt)
   ↓
5. Create JWT token
   ↓
6. Set httpOnly cookie
   ↓
7. Return user data + token
```

### Protected Route Flow

```
1. Request to protected route
   ↓
2. Extract token from cookie/header
   ↓
3. Verify JWT signature
   ↓
4. Check expiration
   ↓
5. Decode user ID
   ↓
6. Fetch user from database
   ↓
7. Attach user to request
   ↓
8. Proceed to handler
```

### Session Management

- **JWT Tokens:** 7-day expiration
- **Refresh Tokens:** 30-day expiration
- **Cookie Settings:** httpOnly, secure, sameSite
- **Token Rotation:** On refresh

---

## Performance Strategy

### Caching Strategy

**Levels of Caching:**

1. **CDN Caching (Vercel Edge)**
   - Static assets: 1 year
   - API responses: 60 seconds (with stale-while-revalidate)

2. **Application Caching**
   - Database queries: 60 seconds
   - Computed results: 5 minutes
   - User sessions: 7 days

3. **Database Caching**
   - Frequently accessed data
   - Aggregated statistics
   - Search results

**Cache Invalidation:**
```typescript
// On data mutation
await db.post.create({ ... })
await cache.invalidate('posts:list')
await cache.invalidate(`posts:user:${userId}`)
```

### Code Splitting

```typescript
// Route-based splitting (automatic)
// Each page is a separate chunk

// Component-based splitting (manual)
const CommunityFeed = lazyLoad(() => import('./community-feed'))
const FacultyList = lazyLoad(() => import('./faculty-list'))
```

### Image Optimization

```tsx
// Automatic optimization with Next.js Image
<Image
  src="/avatar.jpg"
  width={100}
  height={100}
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

### Database Optimization

**Query Optimization:**
```typescript
// ✅ Good - Selective fields + pagination
const posts = await db.post.findMany({
  select: {
    id: true,
    title: true,
    author: { select: { name: true, avatar: true } }
  },
  take: 20,
  skip: page * 20
})

// ❌ Bad - Fetching all fields + no pagination
const posts = await db.post.findMany()
```

**Indexing Strategy:**
- Primary keys (automatic)
- Foreign keys (automatic)
- Frequently queried fields (manual)
- Composite indexes for complex queries

---

## Security Model

### Zero-Trust Principles

1. **Never trust user input** - Validate everything
2. **Authenticate all requests** - No anonymous writes
3. **Authorize all actions** - Check permissions
4. **Sanitize all output** - Prevent XSS
5. **Encrypt sensitive data** - At rest and in transit

### Input Validation

```typescript
import { z } from 'zod'

const postSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(10).max(10000),
  category: z.enum(['discussion', 'help', 'announcement'])
})

// Validate before processing
const result = postSchema.safeParse(input)
if (!result.success) {
  return { error: result.error }
}
```

### SQL Injection Prevention

```typescript
// ✅ Safe - Parameterized query (Prisma)
await db.user.findUnique({
  where: { email: userEmail }
})

// ❌ Unsafe - String concatenation
await db.$executeRaw`SELECT * FROM users WHERE email = '${userEmail}'`
```

### XSS Prevention

```tsx
// ✅ Safe - React escapes by default
<div>{userContent}</div>

// ❌ Unsafe - dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ Safe with sanitization
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userContent) 
}} />
```

### CSRF Protection

```typescript
// NextAuth.js handles CSRF automatically
// Additional protection with SameSite cookies
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'
}
```

### Rate Limiting

```typescript
// Per-user rate limits
const rateLimits = {
  authenticated: {
    windowMs: 60 * 1000, // 1 minute
    max: 100 // requests
  },
  unauthenticated: {
    windowMs: 60 * 1000,
    max: 20
  },
  uploads: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10
  }
}
```

---

## Deployment Architecture

### Vercel Deployment

```
┌─────────────────────────────────────────┐
│           Vercel Edge Network           │
│  - Global CDN                           │
│  - DDoS Protection                      │
│  - SSL/TLS Termination                  │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│        Vercel Serverless Functions      │
│  - API Routes                           │
│  - Server Components                    │
│  - ISR                                  │
└─────────────┬───────────────────────────┘
              │
              ├──────────┬──────────┬──────────┐
              ▼          ▼          ▼          ▼
         ┌─────────┐ ┌────────┐ ┌────────┐ ┌────────┐
         │ Database│ │  File  │ │  Email │ │ Sentry │
         │  (Neon) │ │Storage │ │ (SMTP) │ │(Errors)│
         └─────────┘ └────────┘ └────────┘ └────────┘
```

### Environment Configuration

**Production:**
- Build optimization enabled
- Source maps disabled (or uploaded to Sentry)
- Analytics enabled
- Error tracking enabled

**Preview (Staging):**
- Build optimization enabled
- Source maps enabled
- Analytics enabled
- Separate database

**Development:**
- Hot reload enabled
- Source maps enabled
- Mock external services
- Local database

### CI/CD Pipeline

```
Push to GitHub
    │
    ▼
┌─────────────┐
│  Run Tests  │ ← E2E, Unit, Integration
└──────┬──────┘
       │ ✓
       ▼
┌─────────────┐
│  Run Lint   │ ← ESLint, TypeScript
└──────┬──────┘
       │ ✓
       ▼
┌─────────────┐
│    Build    │ ← Next.js build
└──────┬──────┘
       │ ✓
       ▼
┌─────────────┐
│   Deploy    │ ← Vercel deployment
└──────┬──────┘
       │ ✓
       ▼
┌─────────────┐
│   Monitor   │ ← Sentry, Analytics
└─────────────┘
```

---

## Monitoring & Observability

### Error Tracking (Sentry)

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter sensitive data
    return event
  }
})
```

### Performance Monitoring

**Core Web Vitals:**
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

**Custom Metrics:**
- API response time
- Database query time
- Cache hit rate
- Error rate

### Logging

```typescript
// Structured logging
logger.info('User logged in', {
  userId: user.id,
  timestamp: new Date(),
  ip: request.ip
})

logger.error('Database error', {
  error: error.message,
  stack: error.stack,
  query: 'SELECT ...'
})
```

---

## Scalability Considerations

### Horizontal Scaling

- **Stateless serverless functions** - Auto-scale based on demand
- **Database connection pooling** - Reuse connections
- **CDN caching** - Reduce origin load
- **Read replicas** - Distribute read queries

### Vertical Scaling

- **Database upgrades** - More CPU/RAM when needed
- **Optimize queries** - Reduce processing time
- **Add indexes** - Speed up lookups

### Performance Budgets

- **Page Size:** < 500KB
- **JS Bundle:** < 200KB
- **LCP:** < 2.5s
- **API Response:** < 500ms

---

**Last Updated:** January 2025
