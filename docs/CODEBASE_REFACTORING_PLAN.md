# Codebase Refactoring Plan

## Executive Summary

This document outlines a comprehensive reorganization of the COMSATS ITE Portal codebase following industry-standard software engineering principles and best practices. The goal is to improve maintainability, scalability, and developer experience for both human developers and AI systems.

## Current Issues Identified

1. **Flat Structure in `/lib`**: Too many files at root level without clear categorization
2. **Mixed Concerns**: Business logic, utilities, and configurations are intermingled
3. **Inconsistent Naming**: Mix of naming conventions across files
4. **Documentation Gaps**: Lacks architectural documentation and module descriptions
5. **No Clear Module Boundaries**: Difficult to understand dependencies between modules
6. **Test Organization**: Tests scattered without clear mapping to source files

## Software Engineering Principles Applied

### 1. **Separation of Concerns (SoC)**
- Each module should have a single, well-defined responsibility
- Business logic separated from presentation and data access layers

### 2. **Don't Repeat Yourself (DRY)**
- Common utilities centralized and reusable
- Shared types and interfaces in dedicated locations

### 3. **SOLID Principles**
- **S**ingle Responsibility: Each file/module has one reason to change
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Interfaces and abstractions properly designed
- **I**nterface Segregation: Small, focused interfaces
- **D**ependency Inversion: Depend on abstractions, not concretions

### 4. **Clean Architecture**
- Domain logic independent of frameworks
- Clear dependency direction (outer layers depend on inner layers)
- Infrastructure concerns separated from business logic

### 5. **Feature-Based Organization**
- Group related functionality together
- Easy to locate and modify features
- Clear module boundaries

## Proposed Directory Structure

```
comsats-ite-app_5/
├── .github/                          # GitHub workflows, issue templates
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy.yml
│   │   └── test.yml
│   └── ISSUE_TEMPLATE/
│
├── .vscode/                          # VSCode workspace settings
│   ├── settings.json
│   ├── extensions.json
│   └── launch.json
│
├── app/                              # Next.js App Router (Pages & Layouts)
│   ├── (auth)/                       # Auth route group
│   │   ├── auth/
│   │   └── layout.tsx
│   ├── (dashboard)/                  # Dashboard route group
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── (admin)/                      # Admin route group
│   │   ├── admin/
│   │   └── layout.tsx
│   ├── (public)/                     # Public pages route group
│   │   ├── about/
│   │   ├── contact/
│   │   ├── help/
│   │   └── layout.tsx
│   ├── api/                          # API Routes (keep organized by domain)
│   │   ├── auth/
│   │   ├── admin/
│   │   ├── community/
│   │   ├── timetable/
│   │   └── [...domain]/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   └── loading.tsx
│
├── src/                              # Source code (NEW - main refactor)
│   ├── core/                         # Core business logic & domain models
│   │   ├── domain/                   # Domain models & entities
│   │   │   ├── user/
│   │   │   │   ├── user.entity.ts
│   │   │   │   ├── user.types.ts
│   │   │   │   └── user.schema.ts
│   │   │   ├── timetable/
│   │   │   ├── community/
│   │   │   ├── faculty/
│   │   │   └── index.ts
│   │   │
│   │   ├── use-cases/                # Business logic / Application services
│   │   │   ├── auth/
│   │   │   │   ├── login.use-case.ts
│   │   │   │   ├── register.use-case.ts
│   │   │   │   └── index.ts
│   │   │   ├── admin/
│   │   │   ├── community/
│   │   │   └── index.ts
│   │   │
│   │   └── repositories/             # Data access interfaces
│   │       ├── user.repository.ts
│   │       ├── timetable.repository.ts
│   │       └── index.ts
│   │
│   ├── infrastructure/               # External dependencies & implementations
│   │   ├── database/
│   │   │   ├── mongodb/
│   │   │   │   ├── connection.ts
│   │   │   │   ├── models/
│   │   │   │   └── repositories/    # Repository implementations
│   │   │   ├── supabase/
│   │   │   │   ├── client.ts
│   │   │   │   ├── admin.ts
│   │   │   │   └── auth.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── email/
│   │   │   ├── resend/
│   │   │   │   ├── client.ts
│   │   │   │   └── templates/
│   │   │   └── index.ts
│   │   │
│   │   ├── storage/
│   │   │   ├── media-upload.ts
│   │   │   └── index.ts
│   │   │
│   │   └── external-apis/
│   │       └── index.ts
│   │
│   ├── lib/                          # Shared utilities & helpers
│   │   ├── utils/                    # Pure utility functions
│   │   │   ├── string.utils.ts
│   │   │   ├── date.utils.ts
│   │   │   ├── validation.utils.ts
│   │   │   ├── formatting.utils.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── helpers/                  # Helper functions with side effects
│   │   │   ├── error-handler.ts
│   │   │   ├── retry.helper.ts
│   │   │   ├── notification.helper.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── constants/                # Application constants
│   │   │   ├── app.constants.ts
│   │   │   ├── routes.constants.ts
│   │   │   ├── validation.constants.ts
│   │   │   └── index.ts
│   │   │
│   │   └── types/                    # Shared TypeScript types
│   │       ├── common.types.ts
│   │       ├── api.types.ts
│   │       └── index.ts
│   │
│   ├── features/                     # Feature modules (vertical slices)
│   │   ├── auth/
│   │   │   ├── api/                  # API handlers specific to auth
│   │   │   ├── components/           # Auth-specific components
│   │   │   ├── hooks/                # Auth-specific hooks
│   │   │   ├── utils/                # Auth-specific utilities
│   │   │   ├── types/                # Auth-specific types
│   │   │   └── index.ts
│   │   │
│   │   ├── admin/
│   │   │   ├── analytics/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── index.ts
│   │   │
│   │   ├── community/
│   │   ├── timetable/
│   │   ├── faculty/
│   │   ├── gamification/
│   │   ├── gpa-calculator/
│   │   └── index.ts
│   │
│   └── config/                       # Configuration files
│       ├── app.config.ts
│       ├── seo.config.ts
│       ├── database.config.ts
│       ├── email.config.ts
│       └── index.ts
│
├── components/                       # Shared UI components
│   ├── ui/                          # Base UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── index.ts
│   │
│   ├── layout/                      # Layout components
│   │   ├── header/
│   │   ├── footer/
│   │   ├── sidebar/
│   │   └── index.ts
│   │
│   ├── common/                      # Common reusable components
│   │   ├── loading-spinner.tsx
│   │   ├── error-boundary.tsx
│   │   ├── empty-state.tsx
│   │   └── index.ts
│   │
│   └── providers/                   # Context providers
│       ├── theme-provider.tsx
│       ├── auth-provider.tsx
│       └── index.ts
│
├── hooks/                           # Shared custom hooks
│   ├── use-auth.ts
│   ├── use-toast.ts
│   ├── use-media-query.ts
│   └── index.ts
│
├── contexts/                        # Global contexts (if not in providers)
│   └── index.ts
│
├── styles/                          # Global styles
│   ├── globals.css
│   └── themes/
│
├── public/                          # Static assets
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   └── manifest.json
│
├── scripts/                         # Build & deployment scripts
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeds/
│   │   └── introspect-schema.mjs
│   ├── deployment/
│   └── utilities/
│
├── tests/                           # Test files (mirror src structure)
│   ├── unit/
│   │   ├── core/
│   │   ├── features/
│   │   └── lib/
│   ├── integration/
│   │   ├── api/
│   │   └── features/
│   ├── e2e/
│   │   └── playwright/
│   ├── fixtures/
│   ├── mocks/
│   └── setup.ts
│
├── docs/                            # Documentation
│   ├── architecture/
│   │   ├── OVERVIEW.md
│   │   ├── DECISIONS.md (ADRs)
│   │   └── DIAGRAMS/
│   ├── api/
│   │   └── API_REFERENCE.md
│   ├── guides/
│   │   ├── GETTING_STARTED.md
│   │   ├── DEPLOYMENT.md
│   │   └── CONTRIBUTING.md
│   └── features/
│       └── [feature-docs].md
│
├── supabase/                        # Supabase configuration
│   ├── migrations/
│   ├── functions/
│   └── config.toml
│
├── .env.example                     # Example environment variables
├── .env.local                       # Local environment (gitignored)
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── next.config.mjs
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
├── README.md
└── CHANGELOG.md
```

## Implementation Strategy

### Phase 1: Setup Infrastructure (Week 1)

#### 1.1 Create New Directory Structure
```bash
mkdir -p src/{core,infrastructure,lib,features,config}
mkdir -p src/core/{domain,use-cases,repositories}
mkdir -p src/infrastructure/{database,email,storage,external-apis}
mkdir -p src/lib/{utils,helpers,constants,types}
mkdir -p tests/{unit,integration,e2e,fixtures,mocks}
mkdir -p docs/{architecture,api,guides,features}
```

#### 1.2 Update TypeScript Configuration
- Add path aliases for new structure
- Configure module resolution
- Set up barrel exports (index.ts files)

#### 1.3 Setup Documentation Structure
- Create architectural decision records (ADRs)
- Document module boundaries
- Create contribution guidelines

### Phase 2: Core Layer Migration (Week 2-3)

#### 2.1 Domain Models
- Extract domain entities from existing code
- Create type-safe interfaces
- Define validation schemas with Zod

#### 2.2 Use Cases
- Identify business logic scattered across API routes
- Extract to dedicated use-case files
- Make them framework-agnostic

#### 2.3 Repository Interfaces
- Define data access contracts
- Abstract database operations

### Phase 3: Infrastructure Layer (Week 3-4)

#### 3.1 Database Layer
- Consolidate MongoDB/Mongoose code
- Implement repository pattern
- Create connection management

#### 3.2 External Services
- Extract email service code
- Standardize API clients
- Add retry logic and error handling

### Phase 4: Feature Modules (Week 4-6)

#### 4.1 Feature Extraction
Organize by domain:
- Auth feature module
- Admin feature module
- Community feature module
- Timetable feature module
- Faculty feature module
- Gamification feature module

Each feature module contains:
- Components specific to that feature
- Hooks used only in that feature
- API handlers
- Types and utilities

#### 4.2 Shared Library
- Move common utilities to `src/lib/utils`
- Extract constants
- Create shared types

### Phase 5: Component Reorganization (Week 6-7)

#### 5.1 UI Components
- Keep shadcn/ui in `components/ui`
- Add barrel exports

#### 5.2 Layout Components
- Extract header, footer, sidebar
- Create layout compositions

#### 5.3 Feature Components
- Move feature-specific components to feature modules
- Keep only truly shared components in root

### Phase 6: Testing Infrastructure (Week 7-8)

#### 6.1 Test Structure
- Mirror source structure in tests
- Create test utilities and fixtures
- Setup mocking infrastructure

#### 6.2 Test Coverage
- Add unit tests for core logic
- Integration tests for API routes
- E2e tests for critical flows

### Phase 7: Documentation & Cleanup (Week 8-9)

#### 7.1 Documentation
- API documentation
- Architecture diagrams
- Developer guides
- Feature documentation

#### 7.2 Code Cleanup
- Remove unused files
- Fix import paths
- Optimize bundle size

## File Naming Conventions

### Files
- **Components**: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- **Hooks**: `use-kebab-case.ts` (e.g., `use-auth.ts`)
- **Utils**: `kebab-case.ts` (e.g., `date-utils.ts`)
- **Types**: `kebab-case.types.ts` (e.g., `user.types.ts`)
- **Constants**: `kebab-case.constants.ts` (e.g., `app.constants.ts`)
- **Tests**: `[filename].test.ts` or `[filename].spec.ts`

### Directories
- Use `kebab-case` for all directories
- Group related files in folders
- Use barrel exports (`index.ts`)

## Import Organization

```typescript
// 1. External imports
import React from 'react'
import { useRouter } from 'next/navigation'

// 2. Internal absolute imports (using aliases)
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { LoginUseCase } from '@/core/use-cases/auth/login.use-case'

// 3. Relative imports (only for co-located files)
import { LoginForm } from './login-form'
import type { LoginProps } from './types'

// 4. Type-only imports separated
import type { User } from '@/core/domain/user'
```

## Code Organization Rules

### 1. Barrel Exports
Every directory with multiple exports should have an `index.ts`:

```typescript
// src/lib/utils/index.ts
export * from './string.utils'
export * from './date.utils'
export * from './validation.utils'
```

### 2. Feature Modules
Each feature is self-contained:

```typescript
// src/features/auth/index.ts
export * from './components'
export * from './hooks'
export * from './types'
// Don't export internal utilities (keep them private)
```

### 3. Dependency Rules
- Core layer: NO dependencies on infrastructure or features
- Infrastructure: Can depend on core interfaces
- Features: Can depend on core and infrastructure
- Components: Can depend on hooks and contexts
- Hooks: Can depend on contexts and services

## Module Documentation Template

Every major module should have a README:

```markdown
# Module Name

## Purpose
Brief description of what this module does.

## Responsibilities
- Responsibility 1
- Responsibility 2

## Dependencies
- List of key dependencies

## Usage Example
\`\`\`typescript
// Code example
\`\`\`

## API Reference
Link to detailed API docs if applicable.

## Testing
How to test this module.
```

## Migration Checklist

- [ ] Phase 1: Infrastructure setup
  - [ ] Create directory structure
  - [ ] Update tsconfig.json with path aliases
  - [ ] Setup documentation structure
  - [ ] Create ADR template

- [ ] Phase 2: Core layer
  - [ ] Extract domain models
  - [ ] Create use cases
  - [ ] Define repository interfaces

- [ ] Phase 3: Infrastructure
  - [ ] Migrate database code
  - [ ] Extract external services
  - [ ] Implement repository pattern

- [ ] Phase 4: Features
  - [ ] Create feature modules
  - [ ] Migrate feature-specific code
  - [ ] Setup barrel exports

- [ ] Phase 5: Components
  - [ ] Reorganize UI components
  - [ ] Create layout components
  - [ ] Move feature components

- [ ] Phase 6: Testing
  - [ ] Setup test infrastructure
  - [ ] Write unit tests
  - [ ] Add integration tests
  - [ ] Setup E2E tests

- [ ] Phase 7: Documentation
  - [ ] Write API documentation
  - [ ] Create architecture diagrams
  - [ ] Developer guides
  - [ ] Update README

- [ ] Phase 8: Cleanup
  - [ ] Remove unused code
  - [ ] Fix all imports
  - [ ] Run linter and fix issues
  - [ ] Optimize bundle

## Benefits of This Structure

### For Developers
✅ Clear separation of concerns
✅ Easy to locate files and features
✅ Reduced cognitive load
✅ Better code reusability
✅ Easier onboarding for new developers
✅ Testability improved dramatically

### For AI Systems
✅ Predictable file locations
✅ Clear module boundaries
✅ Consistent naming patterns
✅ Self-documenting structure
✅ Easy to understand dependencies
✅ Better context for code generation

### For Project Maintenance
✅ Scalable architecture
✅ Framework-agnostic core
✅ Easy to refactor
✅ Better team collaboration
✅ Reduced technical debt
✅ Clear upgrade paths

## Tools & Automation

### Recommended VSCode Extensions
- ESLint
- Prettier
- Path Intellisense
- Auto Barrel
- Import Cost
- Error Lens

### Scripts to Add
```json
{
  "scripts": {
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "analyze": "ANALYZE=true pnpm build"
  }
}
```

## Next Steps

1. Review this plan with the team
2. Create a project board with tasks
3. Assign phases to sprints
4. Start with Phase 1 (infrastructure)
5. Migrate incrementally, ensuring the app stays functional
6. Write tests as you migrate
7. Update documentation continuously

---

**Document Version**: 1.0  
**Last Updated**: October 13, 2025  
**Status**: Proposed
