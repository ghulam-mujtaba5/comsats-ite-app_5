# Quick Reference Guide

## For Developers

### Where to Put New Code

| What You're Adding | Where It Goes | Example |
|-------------------|---------------|---------|
| **Domain Entity** | `src/core/domain/[entity]/` | `src/core/domain/user/user.entity.ts` |
| **Business Logic** | `src/core/use-cases/[feature]/` | `src/core/use-cases/auth/login.use-case.ts` |
| **Repository Interface** | `src/core/repositories/` | `src/core/repositories/user.repository.ts` |
| **Database Code** | `src/infrastructure/database/` | `src/infrastructure/database/mongodb/connection.ts` |
| **API Route** | `app/api/[feature]/` or `src/features/[feature]/api/` | `app/api/auth/login/route.ts` |
| **React Component** | `src/features/[feature]/components/` | `src/features/auth/components/login-form.tsx` |
| **Shared Component** | `components/ui/` or `components/common/` | `components/ui/button.tsx` |
| **Custom Hook** | `src/features/[feature]/hooks/` or `hooks/` | `src/features/auth/hooks/use-login.ts` |
| **Utility Function** | `src/lib/utils/` | `src/lib/utils/date.utils.ts` |
| **Constant** | `src/lib/constants/` | `src/lib/constants/app.constants.ts` |
| **Type Definition** | Co-locate with code or `src/lib/types/` | `src/core/domain/user/user.types.ts` |
| **Test File** | Mirror source in `tests/` | `tests/unit/lib/utils/date.utils.test.ts` |

### Common Import Patterns

```typescript
// Core layer imports
import { User } from '@/core/domain/user'
import { LoginUseCase } from '@/core/use-cases/auth'
import type { UserRepository } from '@/core/repositories'

// Infrastructure imports
import { connectToDatabase } from '@/infrastructure/database/mongodb'
import { sendEmail } from '@/infrastructure/email/resend'

// Feature imports
import { LoginForm } from '@/features/auth/components'
import { useAuth } from '@/features/auth/hooks'

// Shared utilities
import { formatDate } from '@/lib/utils/date.utils'
import { APP_NAME } from '@/lib/constants/app.constants'

// UI components
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
```

### File Naming Quick Reference

| Type | Pattern | Example |
|------|---------|---------|
| Component | `PascalCase.tsx` | `UserProfile.tsx` |
| Hook | `use-kebab-case.ts` | `use-auth.ts` |
| Utility | `kebab-case.utils.ts` | `date.utils.ts` |
| Type | `kebab-case.types.ts` | `user.types.ts` |
| Schema | `kebab-case.schema.ts` | `user.schema.ts` |
| Use Case | `kebab-case.use-case.ts` | `login.use-case.ts` |
| Repository | `kebab-case.repository.ts` | `user.repository.ts` |
| Test | `[name].test.ts` | `date.utils.test.ts` |
| Config | `kebab-case.config.ts` | `database.config.ts` |

### Common Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm start                  # Start production server
pnpm lint                   # Run ESLint
pnpm lint:fix               # Fix linting issues
pnpm type-check             # Check TypeScript types

# Database
pnpm db:seed                # Seed baseline data
pnpm db:seed-complete       # Seed complete dataset
pnpm db:seed-timetable      # Seed timetable data
pnpm db:seed-faculty        # Seed faculty data

# Testing
pnpm test                   # Run unit tests
pnpm test:watch             # Run tests in watch mode
pnpm test:coverage          # Run tests with coverage
pnpm test:e2e               # Run E2E tests
pnpm test:e2e:ui            # Run E2E tests with UI

# PWA
pnpm build-pwa              # Build with PWA support

# Refactoring
pwsh scripts/setup-refactor-structure.ps1  # Setup new directory structure
```

### Git Commit Types

| Type | When to Use | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add forgot password` |
| `fix` | Bug fix | `fix(timetable): resolve timezone issue` |
| `docs` | Documentation | `docs(api): update auth endpoints` |
| `style` | Formatting | `style(components): format with prettier` |
| `refactor` | Code refactor | `refactor(lib): extract date utils` |
| `perf` | Performance | `perf(api): optimize db queries` |
| `test` | Tests | `test(auth): add login tests` |
| `chore` | Maintenance | `chore(deps): update dependencies` |

---

## For AI Systems

### Code Generation Patterns

#### Creating a New Feature

1. **Create domain model**:
```typescript
// src/core/domain/[entity]/[entity].types.ts
export interface Entity {
  id: string
  // ... fields
}
```

2. **Create use case**:
```typescript
// src/core/use-cases/[feature]/[action].use-case.ts
export class ActionUseCase {
  async execute(input: Input): Promise<Output> {
    // Logic here
  }
}
```

3. **Create feature module**:
```typescript
// src/features/[feature]/components/Component.tsx
export function Component() {
  // Component logic
}

// src/features/[feature]/hooks/use-feature.ts
export function useFeature() {
  // Hook logic
}

// src/features/[feature]/index.ts
export { Component } from './components'
export { useFeature } from './hooks'
```

#### Adding a Utility Function

```typescript
// src/lib/utils/[category].utils.ts
/**
 * Description of what the function does
 * @param param - Parameter description
 * @returns Return value description
 */
export function utilityName(param: Type): ReturnType {
  // Pure function logic
}
```

#### Creating a Repository

```typescript
// 1. Define interface in core
// src/core/repositories/entity.repository.ts
export interface EntityRepository {
  findById(id: string): Promise<Entity | null>
  create(data: CreateDTO): Promise<Entity>
  update(id: string, data: UpdateDTO): Promise<Entity>
  delete(id: string): Promise<void>
}

// 2. Implement in infrastructure
// src/infrastructure/database/mongodb/repositories/entity.repository.impl.ts
export class MongoDBEntityRepository implements EntityRepository {
  async findById(id: string): Promise<Entity | null> {
    // Implementation
  }
  // ... other methods
}
```

### Dependency Rules for AI

**✅ Allowed Dependencies:**
```
Infrastructure  →  Core (implements interfaces)
Features        →  Core + Infrastructure
App/Components  →  Features
Lib/Utils       →  Nothing (pure utilities)
```

**❌ Forbidden Dependencies:**
```
Core           →  Infrastructure (NEVER)
Core           →  Features (NEVER)
Infrastructure →  Features (NEVER)
```

### Testing Patterns

```typescript
// Unit test template
// tests/unit/[path]/[file].test.ts
import { functionName } from '@/[path]/[file]'

describe('functionName', () => {
  it('should do something', () => {
    // Arrange
    const input = 'test'
    
    // Act
    const result = functionName(input)
    
    // Assert
    expect(result).toBe('expected')
  })
})
```

### File Location Decision Tree

```
Need to add code?
│
├─ Is it a domain entity/type?
│  └─ YES → src/core/domain/[entity]/
│
├─ Is it business logic?
│  └─ YES → src/core/use-cases/[feature]/
│
├─ Is it database/external service code?
│  └─ YES → src/infrastructure/[service]/
│
├─ Is it feature-specific?
│  └─ YES → src/features/[feature]/[type]/
│
├─ Is it a shared utility?
│  └─ YES → src/lib/utils/[category].utils.ts
│
├─ Is it a shared UI component?
│  └─ YES → components/[ui|common|layout]/
│
└─ Is it a configuration?
   └─ YES → src/config/[name].config.ts
```

---

## Quick Links

### Documentation
- [Architecture Overview](./docs/architecture/ARCHITECTURE_OVERVIEW.md)
- [Refactoring Plan](./docs/CODEBASE_REFACTORING_PLAN.md)
- [Implementation Guide](./docs/REFACTORING_IMPLEMENTATION_GUIDE.md)
- [Contributing Guide](./docs/guides/CONTRIBUTING.md)
- [TypeScript Path Aliases](./docs/guides/TYPESCRIPT_PATH_ALIASES.md)

### Key Principles
1. **Separation of Concerns**: Each layer has a single responsibility
2. **Dependency Inversion**: Depend on abstractions, not concretions
3. **Feature Encapsulation**: Features are self-contained vertical slices
4. **Interface-Based Design**: Core defines interfaces, infrastructure implements
5. **Pure Business Logic**: Core layer is framework-agnostic

### Need Help?
- Check existing code for patterns
- Review documentation above
- Follow the decision tree for file placement
- Maintain consistency with existing code
- When in doubt, ask the team!

---

**Keep this guide handy for quick reference during development! 📚**
