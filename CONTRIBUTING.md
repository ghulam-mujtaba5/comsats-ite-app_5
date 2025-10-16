# Contributing to COMSATS ITE App

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Table of Contents
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Code Review Process](#code-review-process)

---

## Getting Started

### Prerequisites
- **Node.js** 18+ and pnpm installed
- **Git** for version control
- **PostgreSQL** database (local or remote)
- Code editor (VS Code recommended)

### First Time Setup

1. **Fork and Clone**
```bash
git clone https://github.com/YOUR_USERNAME/comsats-ite-app.git
cd comsats-ite-app
```

2. **Install Dependencies**
```bash
pnpm install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Database Setup**
```bash
# Run migrations
pnpm db:migrate

# Seed database (optional)
pnpm db:seed
```

5. **Start Development Server**
```bash
pnpm dev
```

Visit `http://localhost:3000` to see the app running!

---

## Development Setup

### Environment Variables

Required variables in `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/comsats_ite"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth (if using)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# File Upload
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="..."
SMTP_PASS="..."
```

### Development Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start

# Lint code
pnpm lint

# Format code
pnpm format

# Run tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Database commands
pnpm db:migrate     # Run migrations
pnpm db:seed        # Seed database
pnpm db:studio      # Open Prisma Studio
```

---

## Project Structure

```
comsats-ite-app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (login, register)
│   ├── (dashboard)/       # Main app routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── forms/            # Form components
│   └── layouts/          # Layout components
├── lib/                   # Utilities and helpers
│   ├── db.ts             # Database client
│   ├── auth.ts           # Authentication logic
│   ├── utils.ts          # General utilities
│   └── performance.tsx   # Performance utilities
├── public/               # Static assets
├── tests/                # Test files
│   ├── auth.spec.ts      # Auth tests
│   ├── community.spec.ts # Community tests
│   └── ...
├── prisma/               # Database schema
│   ├── schema.prisma     # Prisma schema
│   └── migrations/       # Migration files
└── docs/                 # Documentation
```

---

## Coding Standards

### TypeScript

- **Always use TypeScript** - No JavaScript files in `/app` or `/components`
- **Strict mode enabled** - Fix all type errors
- **Explicit return types** for functions
- **Interface over type** for object shapes

**Good:**
```typescript
interface User {
  id: string
  name: string
  email: string
}

function getUser(id: string): Promise<User | null> {
  return db.user.findUnique({ where: { id } })
}
```

**Bad:**
```typescript
function getUser(id) {
  return db.user.findUnique({ where: { id } })
}
```

### React Components

- **Function components** with hooks (no class components)
- **Named exports** for components
- **Props interface** for all components
- **Async Server Components** when possible

**Good:**
```typescript
interface ProfileCardProps {
  user: User
  showStats?: boolean
}

export function ProfileCard({ user, showStats = true }: ProfileCardProps) {
  return (
    <div className="profile-card">
      <h2>{user.name}</h2>
      {showStats && <Stats userId={user.id} />}
    </div>
  )
}
```

### File Naming

- **Components:** PascalCase (`ProfileCard.tsx`)
- **Utilities:** camelCase (`formatDate.ts`)
- **API routes:** kebab-case (`past-papers.ts`)
- **Test files:** `*.spec.ts` or `*.test.ts`

### CSS/Styling

- **Tailwind CSS** for all styling
- **shadcn/ui** for base components
- **CSS modules** only when absolutely necessary
- **Responsive** by default (mobile-first)

**Good:**
```tsx
<div className="flex flex-col gap-4 md:flex-row md:gap-6">
  <Card className="w-full">...</Card>
</div>
```

### Code Organization

- **One component per file**
- **Related files grouped** in folders
- **Barrel exports** for public APIs
- **Private utilities** prefixed with `_`

---

## Testing

### Writing Tests

We use **Playwright** for E2E tests and **Jest** for unit tests.

**E2E Test Example:**
```typescript
import { test, expect } from '@playwright/test'

test.describe('Community', () => {
  test('should create a post', async ({ page }) => {
    await page.goto('/community')
    await page.click('button:has-text("Create Post")')
    await page.fill('input[name="title"]', 'Test Post')
    await page.fill('textarea[name="content"]', 'Test content')
    await page.click('button:has-text("Submit")')
    
    await expect(page.locator('text=Test Post')).toBeVisible()
  })
})
```

**Unit Test Example:**
```typescript
import { formatDate } from '@/lib/utils'

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2025-01-15')
    expect(formatDate(date)).toBe('Jan 15, 2025')
  })
})
```

### Test Coverage Goals

- **E2E Tests:** 70%+ critical user flows
- **Unit Tests:** 80%+ utilities and helpers
- **Integration Tests:** All API endpoints

### Running Tests

```bash
# Run all tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

---

## Submitting Changes

### Branch Naming

- **Features:** `feature/add-gpa-calculator`
- **Bugs:** `fix/community-post-error`
- **Refactor:** `refactor/optimize-queries`
- **Docs:** `docs/api-reference`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add GPA calculator history
fix: resolve community post pagination
docs: update API reference
refactor: optimize database queries
test: add faculty review tests
chore: update dependencies
```

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Example:**
```
feat(community): add poll creation

- Add poll creation dialog
- Implement voting logic
- Add poll results visualization

Closes #123
```

### Pull Request Process

1. **Create a branch** from `main`
2. **Make your changes** following coding standards
3. **Write/update tests** for your changes
4. **Run tests** and ensure they pass
5. **Update documentation** if needed
6. **Commit your changes** with clear messages
7. **Push to your fork**
8. **Create a Pull Request**

**PR Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

---

## Code Review Process

### Review Criteria

- ✅ **Functionality:** Does it work as intended?
- ✅ **Code Quality:** Is it clean and maintainable?
- ✅ **Performance:** Is it optimized?
- ✅ **Tests:** Are there adequate tests?
- ✅ **Documentation:** Is it well documented?
- ✅ **Security:** Are there security concerns?

### Review Timeline

- **Initial review:** Within 24 hours
- **Follow-up:** Within 12 hours
- **Approval:** 2 approving reviews required

### Addressing Feedback

- Respond to all comments
- Make requested changes
- Mark resolved conversations
- Request re-review when ready

---

## Style Guide

### Imports

Order imports consistently:

```typescript
// 1. External dependencies
import { useState } from 'react'
import { Card } from '@/components/ui/card'

// 2. Internal utilities
import { formatDate } from '@/lib/utils'
import { db } from '@/lib/db'

// 3. Components
import { ProfileCard } from '@/components/profile-card'

// 4. Types
import type { User } from '@/types'

// 5. Styles (if any)
import './styles.css'
```

### Naming Conventions

- **Variables:** camelCase (`userName`, `isActive`)
- **Constants:** UPPER_SNAKE_CASE (`API_URL`, `MAX_RETRIES`)
- **Components:** PascalCase (`ProfileCard`, `UserList`)
- **Functions:** camelCase (`getUserById`, `formatDate`)
- **Types/Interfaces:** PascalCase (`User`, `PostData`)

### Comments

- **JSDoc** for public functions
- **Inline comments** for complex logic
- **TODO comments** for future work

```typescript
/**
 * Calculates the cumulative GPA based on previous and current semester data.
 * 
 * @param previousGPA - The GPA from previous semesters
 * @param previousCredits - Total credit hours from previous semesters
 * @param currentGPA - The GPA for current semester
 * @param currentCredits - Credit hours for current semester
 * @returns The calculated cumulative GPA
 */
export function calculateCumulativeGPA(
  previousGPA: number,
  previousCredits: number,
  currentGPA: number,
  currentCredits: number
): number {
  const totalPoints = (previousGPA * previousCredits) + (currentGPA * currentCredits)
  const totalCredits = previousCredits + currentCredits
  
  // TODO: Add validation for zero credits
  return totalPoints / totalCredits
}
```

---

## Performance Guidelines

### Optimization Rules

1. **Use Server Components** by default
2. **Lazy load** heavy components
3. **Optimize images** with Next.js Image
4. **Cache database** queries when possible
5. **Debounce** user input
6. **Paginate** long lists
7. **Minimize bundle** size

**Example:**
```tsx
// ✅ Good - Server Component with optimized image
export async function ProfilePage({ id }: { id: string }) {
  const user = await db.user.findUnique({ where: { id } })
  
  return (
    <div>
      <Image
        src={user.avatar}
        alt={user.name}
        width={100}
        height={100}
        priority
      />
    </div>
  )
}

// ❌ Bad - Client component for simple rendering
'use client'
export function ProfilePage({ id }: { id: string }) {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    fetch(`/api/users/${id}`).then(r => r.json()).then(setUser)
  }, [id])
  
  return <div>...</div>
}
```

---

## Accessibility Guidelines

- **Semantic HTML** always
- **ARIA labels** for interactive elements
- **Keyboard navigation** support
- **Color contrast** WCAG AA minimum
- **Focus indicators** visible
- **Screen reader** tested

```tsx
// ✅ Good - Accessible button
<button
  aria-label="Delete post"
  onClick={handleDelete}
  className="focus:ring-2 focus:ring-blue-500"
>
  <TrashIcon aria-hidden="true" />
</button>

// ❌ Bad - No accessibility
<div onClick={handleDelete}>
  <TrashIcon />
</div>
```

---

## Security Guidelines

- **Never** commit secrets
- **Validate** all user input
- **Sanitize** user content
- **Use** parameterized queries
- **Implement** rate limiting
- **Enable** CSRF protection

```typescript
// ✅ Good - Parameterized query
const user = await db.user.findUnique({
  where: { email: email.toLowerCase().trim() }
})

// ❌ Bad - SQL injection risk
const user = await db.$queryRaw`SELECT * FROM users WHERE email = '${email}'`
```

---

## Documentation

### Code Documentation

- **JSDoc** for all public functions
- **README** for each major feature
- **Inline comments** for complex logic
- **API docs** for all endpoints

### Updating Docs

When you make changes, update:
- `API_REFERENCE.md` for API changes
- `README.md` for feature changes
- `CHANGELOG.md` for version changes
- Inline JSDoc for function changes

---

## Getting Help

- **Issues:** Open a GitHub issue
- **Discussions:** Use GitHub Discussions
- **Discord:** Join our Discord server
- **Email:** dev@comsats.edu.pk

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing! 🚀**
