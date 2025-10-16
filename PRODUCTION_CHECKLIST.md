# Production Deployment Checklist

Complete checklist for deploying COMSATS ITE App to production.

## Table of Contents
- [Pre-Deployment](#pre-deployment)
- [Environment Setup](#environment-setup)
- [Database](#database)
- [Security](#security)
- [Performance](#performance)
- [Monitoring](#monitoring)
- [Deployment](#deployment)
- [Post-Deployment](#post-deployment)

---

## Pre-Deployment

### Code Quality
- [ ] All tests passing (`pnpm test`, `pnpm test:e2e`)
- [ ] No TypeScript errors (`pnpm type-check` or `pnpm build`)
- [ ] No ESLint warnings (`pnpm lint`)
- [ ] Code formatted (`pnpm format`)
- [ ] Bundle size within budget (< 200KB JS)
- [ ] All features tested manually
- [ ] No console.log statements in production code
- [ ] No TODO comments for critical features

### Documentation
- [ ] README.md updated
- [ ] API_REFERENCE.md complete
- [ ] CONTRIBUTING.md for developers
- [ ] ARCHITECTURE.md for technical overview
- [ ] CHANGELOG.md with version history
- [ ] Environment variables documented in .env.example

### Dependencies
- [ ] All dependencies up to date (`pnpm outdated`)
- [ ] No critical security vulnerabilities (`pnpm audit`)
- [ ] Unused dependencies removed
- [ ] Package.json scripts verified
- [ ] Lock file committed (pnpm-lock.yaml)

---

## Environment Setup

### Required Environment Variables

Create `.env.production` with these variables:

- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NEXTAUTH_URL` - Production URL (https://your-domain.com)
- [ ] `NEXTAUTH_SECRET` - Secure random string (32+ characters)
- [ ] `UPLOADTHING_SECRET` - File upload API secret
- [ ] `UPLOADTHING_APP_ID` - File upload app ID
- [ ] `SMTP_HOST` - Email server host
- [ ] `SMTP_PORT` - Email server port
- [ ] `SMTP_USER` - Email username
- [ ] `SMTP_PASS` - Email password
- [ ] `SENTRY_DSN` - Error tracking DSN
- [ ] `NEXT_PUBLIC_SENTRY_DSN` - Client-side error tracking
- [ ] `SENTRY_AUTH_TOKEN` - For source maps upload

### Optional Environment Variables

- [ ] `GOOGLE_CLIENT_ID` - Google OAuth
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth
- [ ] `GITHUB_CLIENT_ID` - GitHub OAuth
- [ ] `GITHUB_CLIENT_SECRET` - GitHub OAuth
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics
- [ ] `UPSTASH_REDIS_REST_URL` - Redis for rate limiting
- [ ] `UPSTASH_REDIS_REST_TOKEN` - Redis token

### Verify Environment

```bash
# Check all required variables are set
node -e "
const required = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'SENTRY_DSN'
];
const missing = required.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error('Missing:', missing.join(', '));
  process.exit(1);
}
console.log('✓ All required variables set');
"
```

---

## Database

### Database Setup
- [ ] Production database created (Neon/Supabase/Vercel Postgres)
- [ ] Database URL configured in environment variables
- [ ] Connection pooling enabled (min: 2, max: 10)
- [ ] SSL/TLS enforced for connections
- [ ] Database backups scheduled (daily recommended)
- [ ] Point-in-time recovery enabled

### Migrations
- [ ] All migrations generated (`pnpm db:migrate:dev`)
- [ ] Migrations tested locally
- [ ] Migration deployment strategy decided:
  - [ ] Automatic (in deployment script)
  - [ ] Manual (before deployment)
- [ ] Rollback plan prepared

```bash
# Run migrations in production
pnpm db:migrate:deploy

# Or if using Prisma Cloud
npx prisma migrate deploy
```

### Seeding
- [ ] Seed data prepared (if needed)
- [ ] Admin users created
- [ ] Initial content added (if any)

```bash
# Run seed script
pnpm db:seed
```

### Database Performance
- [ ] Indexes created for frequently queried fields
- [ ] Query performance tested with realistic data volume
- [ ] N+1 query problems resolved
- [ ] Database monitoring enabled

---

## Security

### Authentication
- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] Password hashing using bcrypt (12+ rounds)
- [ ] OAuth providers configured (if using)
- [ ] Session expiration set appropriately (7 days)
- [ ] Refresh token rotation enabled
- [ ] Password reset flow tested

### Authorization
- [ ] Role-based access control implemented
- [ ] User permissions validated on all protected routes
- [ ] Admin routes properly secured
- [ ] API routes require authentication where needed

### Data Protection
- [ ] Sensitive data filtered before sending to Sentry
- [ ] User passwords never logged
- [ ] Personal data encrypted at rest (database level)
- [ ] GDPR compliance considered
- [ ] Data retention policy defined

### Security Headers
- [ ] Content Security Policy configured
- [ ] X-Frame-Options set
- [ ] X-Content-Type-Options set
- [ ] Referrer-Policy set
- [ ] Strict-Transport-Security set

```typescript
// next.config.mjs
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  }
]
```

### Rate Limiting
- [ ] Rate limiting implemented for:
  - [ ] Authentication endpoints (5 requests/minute)
  - [ ] API endpoints (100 requests/minute)
  - [ ] File uploads (10 requests/hour)
- [ ] Rate limit bypass for trusted IPs (if needed)
- [ ] Rate limit headers included in responses

### Security Audit
- [ ] `pnpm audit` run with no high/critical issues
- [ ] Dependencies scanned for vulnerabilities
- [ ] OWASP Top 10 checklist reviewed
- [ ] Penetration testing completed (if applicable)

---

## Performance

### Build Optimization
- [ ] Production build successful (`pnpm build`)
- [ ] Bundle analyzed (`pnpm analyze`)
- [ ] Code splitting configured
- [ ] Tree shaking enabled
- [ ] Unused code removed

### Image Optimization
- [ ] Next.js Image component used everywhere
- [ ] Image sizes optimized (< 200KB each)
- [ ] WebP format used
- [ ] Lazy loading implemented
- [ ] Blur placeholders added
- [ ] CDN configured for images

### Caching
- [ ] Static assets cached (1 year)
- [ ] API responses cached appropriately
- [ ] Stale-while-revalidate configured
- [ ] Cache invalidation strategy defined
- [ ] Service worker configured (if using PWA)

### Performance Budgets
- [ ] LCP < 2.5 seconds
- [ ] FID < 100 milliseconds
- [ ] CLS < 0.1
- [ ] TTFB < 600 milliseconds
- [ ] Total page size < 500KB

### Database Performance
- [ ] Query caching enabled
- [ ] Connection pooling configured
- [ ] Slow query logging enabled
- [ ] Database indexes verified

---

## Monitoring

### Error Tracking
- [ ] Sentry configured
- [ ] Source maps uploaded
- [ ] Error alerts configured
- [ ] Error budget defined
- [ ] On-call rotation set up

### Analytics
- [ ] Vercel Analytics enabled (if on Vercel)
- [ ] Google Analytics configured (if using)
- [ ] Privacy-friendly analytics set up
- [ ] Cookie consent banner (if required)

### Performance Monitoring
- [ ] Core Web Vitals tracked
- [ ] API response times monitored
- [ ] Database query performance tracked
- [ ] Real User Monitoring enabled

### Uptime Monitoring
- [ ] Uptime monitor configured (Pingdom/UptimeRobot)
- [ ] Health check endpoint created (`/api/health`)
- [ ] Status page set up (optional)
- [ ] Incident response plan documented

### Logging
- [ ] Structured logging implemented
- [ ] Log aggregation service configured (optional)
- [ ] Log retention policy defined
- [ ] Sensitive data filtered from logs

---

## Deployment

### Platform: Vercel (Recommended)

#### 1. Create Vercel Project
```bash
# Install Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Link project
vercel link

# Deploy to production
vercel --prod
```

#### 2. Configure Vercel
- [ ] Environment variables added in Vercel dashboard
- [ ] Production domain configured
- [ ] SSL certificate verified (automatic)
- [ ] Deployment protection enabled (if needed)
- [ ] Branch deployments configured

#### 3. Vercel Settings
- [ ] Node.js version: 18.x or higher
- [ ] Build command: `pnpm build`
- [ ] Output directory: `.next`
- [ ] Install command: `pnpm install`
- [ ] Development command: `pnpm dev`

### Alternative: Self-Hosted

#### Docker Deployment
```dockerfile
# Build
docker build -t comsats-ite-app .

# Run
docker run -p 3000:3000 --env-file .env.production comsats-ite-app
```

#### Manual Deployment
```bash
# Install dependencies
pnpm install --production

# Run migrations
pnpm db:migrate:deploy

# Build
pnpm build

# Start server
pnpm start
```

---

## Post-Deployment

### Verification
- [ ] Application loads successfully
- [ ] All pages render correctly
- [ ] Authentication works
- [ ] Database connection successful
- [ ] File uploads working
- [ ] Email sending functional
- [ ] Error tracking receiving events
- [ ] Analytics tracking pageviews

### Smoke Testing
- [ ] User registration
- [ ] User login
- [ ] Create community post
- [ ] Upload past paper
- [ ] Submit faculty review
- [ ] Calculate GPA
- [ ] View profile
- [ ] Logout

### Performance Testing
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals in green
- [ ] API response times < 500ms
- [ ] Page load times < 3 seconds

### DNS Configuration
- [ ] Custom domain pointed to deployment
- [ ] SSL certificate verified
- [ ] WWW redirect configured
- [ ] DNS propagation verified

### SEO
- [ ] Sitemap generated and submitted
- [ ] Robots.txt configured
- [ ] Meta tags optimized
- [ ] Open Graph tags set
- [ ] Schema markup added

### Communication
- [ ] Stakeholders notified of deployment
- [ ] Users informed of new features
- [ ] Documentation updated
- [ ] Changelog published

---

## Rollback Plan

### If Issues Occur

1. **Immediate Actions**
   ```bash
   # Vercel: Rollback to previous deployment
   vercel rollback <deployment-url>
   
   # Or redeploy previous version
   git revert HEAD
   vercel --prod
   ```

2. **Database Rollback**
   ```bash
   # Restore from backup
   # (specific commands depend on your database provider)
   ```

3. **Communication**
   - [ ] Inform users of issues
   - [ ] Update status page
   - [ ] Post mortem scheduled

---

## Production Checklist Summary

### Critical (Must Complete)
- [ ] All tests passing
- [ ] Production environment variables set
- [ ] Database migrations deployed
- [ ] SSL/HTTPS enabled
- [ ] Error tracking configured
- [ ] Rate limiting enabled
- [ ] Security headers set
- [ ] Performance budgets met

### Important (Highly Recommended)
- [ ] Backups scheduled
- [ ] Monitoring configured
- [ ] Analytics tracking
- [ ] Documentation complete
- [ ] SEO optimized
- [ ] Uptime monitoring

### Optional (Nice to Have)
- [ ] CDN configured
- [ ] Service worker/PWA
- [ ] Advanced caching
- [ ] A/B testing ready
- [ ] Feature flags

---

## Post-Launch Monitoring

### First 24 Hours
- [ ] Monitor error rates every 2 hours
- [ ] Check performance metrics
- [ ] Verify all features working
- [ ] Respond to user feedback
- [ ] Watch server resources

### First Week
- [ ] Daily performance reviews
- [ ] User feedback collection
- [ ] Bug fixes prioritized
- [ ] Documentation updates
- [ ] Performance optimizations

### First Month
- [ ] Weekly performance reports
- [ ] Feature usage analytics
- [ ] User satisfaction surveys
- [ ] Plan next iterations
- [ ] Security review

---

## Helpful Commands

```bash
# Build for production
pnpm build

# Run production build locally
pnpm start

# Run all tests
pnpm test && pnpm test:e2e

# Check for security issues
pnpm audit

# Analyze bundle size
pnpm analyze

# Database migrations
pnpm db:migrate:deploy

# Generate Prisma client
pnpm db:generate
```

---

## Support Contacts

- **Development Team:** dev@comsats-ite.com
- **Database Admin:** dba@comsats-ite.com
- **DevOps:** devops@comsats-ite.com
- **Security:** security@comsats-ite.com

---

## Congratulations! 🎉

Once all items are checked, your application is ready for production deployment!

**Remember:**
- Monitor closely in the first 24 hours
- Be ready to rollback if needed
- Collect user feedback
- Iterate and improve

---

**Last Updated:** January 2025
