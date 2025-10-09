# 🔐 Security Guide

## ⚠️ CRITICAL: Environment Variables

### DO NOT commit these files:
- `.env.local`
- `.env.production`
- `.env`
- Any file containing actual credentials

### Setup Instructions:

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your actual credentials** (NEVER commit this file)

3. **Verify .gitignore includes:**
   ```
   .env*
   !.env.example
   ```

## 🚨 If Credentials Were Exposed:

### Immediate Actions Required:

1. **Supabase:**
   - Go to https://app.supabase.com
   - Navigate to Settings → API
   - Click "Reset service role key"
   - Update `.env.local` with new key
   - Restart dev server

2. **MongoDB:**
   - Go to MongoDB Atlas
   - Database Access → Edit User
   - Change password
   - Update connection string in `.env.local`

3. **Git History:**
   ```bash
   # Remove .env.local from git history
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env.local" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (CAREFUL!)
   git push origin --force --all
   ```

4. **Check for exposed secrets on GitHub:**
   - Go to repository Settings → Security → Secret scanning
   - Review any alerts
   - Rotate all flagged credentials

## 🔒 Security Checklist

### Before Deploying to Production:

- [ ] All credentials rotated and secured
- [ ] `.env.local` not in git history
- [ ] Environment variables set in hosting platform (Vercel/Netlify)
- [ ] TypeScript strict mode enabled (`ignoreBuildErrors: false`)
- [ ] ESLint enabled (`ignoreDuringBuilds: false`)
- [ ] Rate limiting configured (Redis/Upstash)
- [ ] Error monitoring setup (Sentry)
- [ ] Database backups configured
- [ ] SSL/HTTPS enforced
- [ ] CORS properly configured
- [ ] CSP headers added
- [ ] Input validation on all routes
- [ ] File upload security implemented
- [ ] Audit logging enabled

## 🛡️ Security Best Practices

### 1. Authentication:
- Never use hardcoded credentials
- Use environment variables for all secrets
- Implement proper session management
- Add rate limiting on auth endpoints

### 2. Authorization:
- Verify user permissions on every request
- Use Row Level Security (RLS) in Supabase
- Implement role-based access control (RBAC)
- Log all admin actions

### 3. Input Validation:
- Use Zod schemas for all API inputs
- Sanitize user-generated content
- Validate file uploads (type, size, content)
- Protect against SQL injection

### 4. Data Protection:
- Encrypt sensitive data at rest
- Use HTTPS in production
- Implement proper CORS policies
- Add CSP headers

### 5. Monitoring:
- Set up error tracking (Sentry)
- Monitor failed login attempts
- Track API rate limits
- Review audit logs regularly

## 📞 Security Incident Response

If you discover a security vulnerability:

1. **DO NOT** commit the fix publicly
2. Contact the security team immediately
3. Document the issue privately
4. Create a patch in a private branch
5. Deploy the fix ASAP
6. Notify affected users if needed
7. Post-mortem and process improvement

## 🔗 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/security)
- [Next.js Security Headers](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)
