# Contributing Guide

Welcome to the COMSATS ITE Portal project! This guide will help you understand our codebase structure and development workflow.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Code Standards](#code-standards)
5. [Architecture Principles](#architecture-principles)
6. [Testing Guidelines](#testing-guidelines)
7. [Commit Conventions](#commit-conventions)
8. [Pull Request Process](#pull-request-process)

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm (recommended) or npm
- Git
- VS Code (recommended) with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Path Intellisense

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd comsats-ite-app_5

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
pnpm dev
```

## Project Structure

Our codebase follows **Clean Architecture** with **Feature-Slice Design**:

```
comsats-ite-app_5/
├── src/                      # Source code (NEW structure)
│   ├── core/                # Core business logic (framework-agnostic)
│   │   ├── domain/          # Entities, types, schemas
│   │   ├── use-cases/       # Business logic
│   │   └── repositories/    # Data access interfaces
│   │
│   ├── infrastructure/       # External services & implementations
│   │   ├── database/        # MongoDB, Supabase
│   │   ├── email/           # Email services
│   │   └── storage/         # File storage
│   │
│   ├── features/            # Feature modules (vertical slices)
│   │   ├── auth/
│   │   ├── admin/
│   │   └── [feature]/
│   │       ├── api/         # API handlers
│   │       ├── components/  # UI components
│   │       ├── hooks/       # React hooks
│   │       └── utils/       # Feature utilities
│   │
│   ├── lib/                 # Shared utilities
│   │   ├── utils/          # Pure functions
│   │   ├── helpers/        # Functions with side effects
│   │   ├── constants/      # Constants
│   │   └── types/          # Shared types
│   │
│   └── config/             # Configuration files
│
├── app/                     # Next.js App Router (pages & layouts)
├── components/              # Shared UI components
├── hooks/                   # Shared React hooks
├── tests/                   # Test files
└── docs/                    # Documentation
```

### Key Directories

| Directory | Purpose | Example |
|-----------|---------|---------|
| `src/core/domain/` | Business entities & types | `user.entity.ts`, `user.types.ts` |
| `src/core/use-cases/` | Business logic | `login.use-case.ts` |
| `src/infrastructure/` | External dependencies | `mongodb/connection.ts` |
| `src/features/` | Feature modules | `auth/`, `admin/` |
| `src/lib/utils/` | Pure utility functions | `date.utils.ts` |
| `components/ui/` | Reusable UI components | `button.tsx`, `input.tsx` |
| `app/` | Next.js routes | `page.tsx`, `layout.tsx` |

## Development Workflow

### Adding a New Feature

1. **Create Feature Module**
   ```bash
   mkdir -p src/features/[feature-name]/{api,components,hooks,utils,types}
   ```

2. **Define Domain Model** (if needed)
   ```typescript
   // src/core/domain/[entity]/[entity].types.ts
   export interface MyEntity {
     id: string
     name: string
   }
   ```

3. **Create Use Case**
   ```typescript
   // src/core/use-cases/[feature]/[action].use-case.ts
   export class MyActionUseCase {
     async execute(input: Input): Promise<Output> {
       // Business logic here
     }
   }
   ```

4. **Implement Components**
   ```typescript
   // src/features/[feature]/components/MyComponent.tsx
   export function MyComponent() {
     // Component logic
   }
   ```

5. **Add API Route** (if needed)
   ```typescript
   // app/api/[feature]/route.ts
   export async function GET(request: Request) {
     // API logic
   }
   ```

6. **Write Tests**
   ```typescript
   // tests/unit/features/[feature]/[component].test.ts
   describe('MyComponent', () => {
     it('should render correctly', () => {
       // Test logic
     })
   })
   ```

### Modifying Existing Code

1. **Locate the file** using the structure guide
2. **Check dependencies** before making changes
3. **Update tests** to reflect changes
4. **Run linter** and fix issues
5. **Test locally** before committing

## Code Standards

### File Naming

- **Components**: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- **Hooks**: `use-kebab-case.ts` (e.g., `use-auth.ts`)
- **Utils**: `kebab-case.utils.ts` (e.g., `date.utils.ts`)
- **Types**: `kebab-case.types.ts` (e.g., `user.types.ts`)
- **Tests**: `[filename].test.ts` or `[filename].spec.ts`
- **Directories**: `kebab-case`

### Import Order

```typescript
// 1. External dependencies (React, Next.js, etc.)
import React from 'react'
import { useRouter } from 'next/navigation'

// 2. Internal absolute imports (using path aliases)
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks'
import { User } from '@/core/domain/user'

// 3. Relative imports (co-located files only)
import { helper } from './helper'
import { MyType } from './types'

// 4. Type-only imports
import type { ComponentProps } from 'react'
```

### TypeScript

- ✅ Use TypeScript for all new files
- ✅ Define explicit types for function parameters and returns
- ✅ Use interfaces for object shapes
- ✅ Use type for unions and primitives
- ✅ Avoid `any` - use `unknown` if type is truly unknown
- ✅ Use const assertions for constant objects

```typescript
// ✅ Good
interface User {
  id: string
  name: string
  email: string
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ Bad
function getUser(id) {
  // ...
}
```

### React Components

```typescript
// ✅ Good - Typed props, clear structure
interface UserCardProps {
  user: User
  onEdit?: (user: User) => void
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div>
      <h2>{user.name}</h2>
      {onEdit && <button onClick={() => onEdit(user)}>Edit</button>}
    </div>
  )
}

// ❌ Bad - No types, unclear props
export function UserCard(props) {
  return <div>{props.user.name}</div>
}
```

### Utility Functions

```typescript
// ✅ Good - Pure, typed, documented
/**
 * Capitalizes the first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// ❌ Bad - Impure, side effects, no types
export function capitalize(str) {
  console.log('Capitalizing:', str) // Side effect!
  return str.charAt(0).toUpperCase() + str.slice(1)
}
```

## Architecture Principles

### 1. Separation of Concerns

- **Core**: Business logic only (no framework code)
- **Infrastructure**: External dependencies (database, APIs)
- **Features**: Feature-specific code (self-contained)
- **Presentation**: UI and user interaction

### 2. Dependency Direction

```
Infrastructure  →  Core (implements interfaces)
Features        →  Core + Infrastructure
Presentation    →  Features
```

### 3. Feature Encapsulation

Each feature exposes a public API via `index.ts`:

```typescript
// src/features/auth/index.ts
// Only export what other modules need
export { LoginForm, RegisterForm } from './components'
export { useAuth, useLogin } from './hooks'
export type { AuthUser, LoginInput } from './types'

// Internal utilities NOT exported (encapsulated)
```

### 4. Interface-Based Design

```typescript
// ✅ Good - Depend on interfaces
interface UserRepository {
  findById(id: string): Promise<User>
}

class GetUserUseCase {
  constructor(private repository: UserRepository) {}
}

// ❌ Bad - Depend on concrete implementations
class GetUserUseCase {
  constructor(private mongoRepo: MongoUserRepository) {}
}
```

## Testing Guidelines

### Test Structure

Mirror the source structure:

```
tests/
├── unit/
│   ├── core/
│   ├── features/
│   └── lib/
├── integration/
│   └── api/
└── e2e/
    └── playwright/
```

### Unit Tests

Test pure functions and business logic:

```typescript
// tests/unit/lib/utils/string.utils.test.ts
import { capitalize } from '@/lib/utils/string.utils'

describe('capitalize', () => {
  it('should capitalize first letter', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('should handle empty string', () => {
    expect(capitalize('')).toBe('')
  })

  it('should lowercase remaining characters', () => {
    expect(capitalize('HELLO')).toBe('Hello')
  })
})
```

### Integration Tests

Test API routes and database operations:

```typescript
// tests/integration/api/auth.test.ts
describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.user).toBeDefined()
  })
})
```

### E2E Tests

Test user flows with Playwright:

```typescript
// tests/e2e/auth.spec.ts
test('user can login', async ({ page }) => {
  await page.goto('/auth/login')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  
  await expect(page).toHaveURL('/dashboard')
})
```

### Running Tests

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage

# E2E tests
pnpm test:e2e

# E2E with UI
pnpm test:e2e:ui
```

## Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring (no functionality change)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, config, etc.)
- `ci`: CI/CD changes

### Examples

```bash
# Feature
feat(auth): add forgot password functionality

# Bug fix
fix(timetable): resolve timezone display issue

# Documentation
docs(api): update authentication endpoint docs

# Refactor
refactor(lib): extract date utilities to separate file

# Multiple scopes
feat(admin,timetable): add bulk edit functionality
```

### Scopes

Common scopes:
- `auth`, `admin`, `community`, `timetable`, `faculty`
- `api`, `ui`, `db`, `lib`, `config`
- `tests`, `docs`, `ci`

## Pull Request Process

### Before Submitting

1. **Create a feature branch**
   ```bash
   git checkout -b feat/my-feature
   ```

2. **Make your changes**
   - Follow code standards
   - Write tests
   - Update documentation

3. **Verify locally**
   ```bash
   pnpm lint          # Check linting
   pnpm type-check    # Check types
   pnpm test          # Run tests
   pnpm build         # Verify build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

5. **Push to GitHub**
   ```bash
   git push origin feat/my-feature
   ```

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
- [ ] Build succeeds
```

### Review Process

1. **Automated Checks**
   - Linting
   - Type checking
   - Tests
   - Build verification

2. **Code Review**
   - At least one approval required
   - Address all comments
   - Update based on feedback

3. **Merge**
   - Squash and merge (preferred)
   - Keep commit history clean

## Additional Resources

- [Architecture Overview](../architecture/ARCHITECTURE_OVERVIEW.md)
- [Refactoring Plan](../CODEBASE_REFACTORING_PLAN.md)
- [Implementation Guide](../REFACTORING_IMPLEMENTATION_GUIDE.md)
- [TypeScript Path Aliases](./TYPESCRIPT_PATH_ALIASES.md)

## Getting Help

- Check [documentation](../README.md)
- Review [existing issues](../../issues)
- Ask in team discussions
- Contact maintainers

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what is best for the project

---

**Thank you for contributing! 🎉**
