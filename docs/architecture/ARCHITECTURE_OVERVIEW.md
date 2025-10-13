# Architecture Overview

## System Architecture

The COMSATS ITE Portal follows **Clean Architecture** principles with **Feature-Slice Design** for optimal maintainability, testability, and scalability.

## High-Level Architecture

```
┌───────────────────────────────────────────────────────────┐
│                     Presentation Layer                    │
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Next.js    │  │  React      │  │   UI        │     │
│  │  App Router │  │  Components │  │  Components │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└───────────────────────────────────────────────────────────┘
                            ↓
┌───────────────────────────────────────────────────────────┐
│                      Feature Modules                      │
│                                                           │
│  ┌──────┐  ┌──────┐  ┌──────────┐  ┌──────────┐        │
│  │ Auth │  │Admin │  │Community │  │Timetable │  ...   │
│  └──────┘  └──────┘  └──────────┘  └──────────┘        │
└───────────────────────────────────────────────────────────┘
                            ↓
┌───────────────────────────────────────────────────────────┐
│                    Application Layer                      │
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Use Cases  │  │  Business   │  │   Services  │     │
│  │             │  │   Logic     │  │             │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└───────────────────────────────────────────────────────────┘
                            ↓
┌───────────────────────────────────────────────────────────┐
│                      Domain Layer                         │
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Entities   │  │   Types     │  │   Schemas   │     │
│  │             │  │             │  │             │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└───────────────────────────────────────────────────────────┘
                            ↓
┌───────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                     │
│                                                           │
│  ┌─────────┐  ┌─────────┐  ┌──────┐  ┌──────────┐      │
│  │ MongoDB │  │Supabase │  │Email │  │ Storage  │      │
│  └─────────┘  └─────────┘  └──────┘  └──────────┘      │
└───────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. Presentation Layer (`app/` & `components/`)

**Purpose**: User interface and user interaction handling

**Responsibilities**:
- Render UI components
- Handle user input
- Route management (Next.js App Router)
- Client-side state management
- SEO and metadata

**Technologies**:
- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4
- Radix UI components

**Rules**:
- No business logic
- Only UI concerns
- Can call Feature modules
- Should be framework-specific

### 2. Feature Modules (`src/features/`)

**Purpose**: Vertical slices of application functionality

**Responsibilities**:
- Group related functionality
- Expose public API
- Coordinate between layers
- Feature-specific UI components
- Feature-specific hooks and utilities

**Structure** (per feature):
```
features/auth/
├── api/              # API route handlers
├── components/       # Feature-specific components
├── hooks/           # Feature-specific hooks
├── utils/           # Feature-specific utilities
├── types/           # Feature-specific types
└── index.ts         # Public API
```

**Rules**:
- Self-contained features
- Minimal cross-feature dependencies
- Clear public API (via index.ts)
- Can depend on Core and Infrastructure

**Example Features**:
- `auth`: Authentication & authorization
- `admin`: Admin dashboard & management
- `community`: Community threads & interactions
- `timetable`: Timetable management
- `faculty`: Faculty directory
- `gamification`: Points, badges, leaderboards

### 3. Application Layer (`src/core/use-cases/`)

**Purpose**: Business logic and application workflows

**Responsibilities**:
- Orchestrate domain objects
- Implement use cases
- Application-specific business rules
- Transaction management
- Validation

**Example**:
```typescript
// src/core/use-cases/auth/login.use-case.ts
export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService
  ) {}

  async execute(input: LoginInput): Promise<User> {
    // Business logic here
    const user = await this.userRepository.findByEmail(input.email)
    
    if (!user) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const isValid = await this.authService.verifyPassword(
      input.password,
      user.passwordHash
    )

    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials')
    }

    return user
  }
}
```

**Rules**:
- Framework-agnostic
- No UI dependencies
- No direct infrastructure dependencies (use interfaces)
- Pure business logic

### 4. Domain Layer (`src/core/domain/`)

**Purpose**: Core business entities and rules

**Responsibilities**:
- Define entities and value objects
- Domain types and interfaces
- Validation schemas
- Domain-specific business rules

**Structure**:
```
domain/user/
├── user.entity.ts    # User entity
├── user.types.ts     # Types & interfaces
├── user.schema.ts    # Validation schemas
└── index.ts          # Barrel export
```

**Rules**:
- Zero external dependencies
- No framework code
- Pure TypeScript
- Highly reusable

### 5. Infrastructure Layer (`src/infrastructure/`)

**Purpose**: External services and technical implementations

**Responsibilities**:
- Database implementations
- External API clients
- Email services
- File storage
- Caching
- Logging

**Structure**:
```
infrastructure/
├── database/
│   ├── mongodb/
│   │   ├── connection.ts
│   │   ├── models/
│   │   └── repositories/
│   └── supabase/
├── email/
│   └── resend/
└── storage/
```

**Rules**:
- Implements Core interfaces
- Contains all external dependencies
- Can be swapped out
- Should be testable with mocks

## Data Flow

### Read Flow (Query)
```
User Request
    ↓
Next.js Route
    ↓
Feature Module (Hook/Component)
    ↓
Use Case
    ↓
Repository Interface (Core)
    ↓
Repository Implementation (Infrastructure)
    ↓
Database
    ↓
Response back up the chain
```

### Write Flow (Command)
```
User Action
    ↓
Form Submission
    ↓
API Route (Feature Module)
    ↓
Use Case (validate + orchestrate)
    ↓
Repository Interface
    ↓
Repository Implementation
    ↓
Database Write
    ↓
Success Response
```

## Dependency Rules

### The Dependency Rule

**Dependencies point inward**:
- Outer layers depend on inner layers
- Inner layers know nothing about outer layers
- Source code dependencies must point inward only

```
Infrastructure  →  Core
Features        →  Core + Infrastructure
Presentation    →  Features
```

### Crossing Boundaries

Use **Dependency Inversion**:
- Inner layers define interfaces
- Outer layers implement interfaces
- Inject dependencies at runtime

Example:
```typescript
// Core defines interface
export interface UserRepository {
  findById(id: string): Promise<User>
}

// Infrastructure implements
export class MongoDBUserRepository implements UserRepository {
  async findById(id: string): Promise<User> {
    // MongoDB-specific implementation
  }
}

// Use case depends on interface
export class GetUserUseCase {
  constructor(private repository: UserRepository) {}
  
  async execute(id: string) {
    return this.repository.findById(id)
  }
}
```

## Module Organization

### Feature Module Example

```typescript
// src/features/auth/index.ts
// Public API - only export what other modules need

export { LoginForm, RegisterForm } from './components'
export { useAuth, useLogin, useRegister } from './hooks'
export type { AuthUser, LoginInput, RegisterInput } from './types'

// Internal utilities, components NOT exported
// This keeps feature internals encapsulated
```

### Core Module Example

```typescript
// src/core/domain/user/index.ts
export * from './user.entity'
export * from './user.types'
export * from './user.schema'

// src/core/use-cases/auth/index.ts
export * from './login.use-case'
export * from './register.use-case'
export * from './logout.use-case'
```

## Communication Patterns

### Between Features
- ❌ Direct imports from other features' internals
- ✅ Import from other features' public API (index.ts)
- ✅ Use shared Core domain objects
- ✅ Emit/listen to domain events

### Between Layers
- ❌ Core importing from Infrastructure
- ✅ Infrastructure implementing Core interfaces
- ✅ Features importing from Core
- ✅ Dependency injection for loose coupling

## Testing Strategy

### Unit Tests
- **Domain**: Pure business logic, no dependencies
- **Use Cases**: Mock repository interfaces
- **Utils**: Pure functions, easy to test

### Integration Tests
- **Repositories**: Real database (test DB)
- **API Routes**: Test request/response
- **Feature Modules**: Test feature workflows

### E2E Tests
- **Critical Flows**: Login, registration, key features
- **User Journeys**: Multi-step processes
- **Playwright**: Browser automation

## Security Considerations

### Authentication & Authorization
- Centralized in `src/features/auth`
- JWT tokens for sessions
- Role-based access control (RBAC)
- Middleware for route protection

### Data Validation
- Zod schemas in domain layer
- Input validation at API boundaries
- Sanitization before database operations

### API Security
- Rate limiting
- CSRF protection
- Input sanitization
- Error message sanitization

## Performance Optimization

### Caching Strategy
- Static page generation where possible
- Incremental Static Regeneration (ISR)
- API response caching
- Database query optimization

### Code Splitting
- Route-based splitting (automatic with Next.js)
- Feature-based splitting
- Dynamic imports for heavy components

### Database Optimization
- Proper indexing
- Query optimization
- Connection pooling
- Pagination

## Monitoring & Logging

### Application Monitoring
- Error tracking
- Performance monitoring
- User analytics

### Logging Strategy
- Structured logging
- Log levels (error, warn, info, debug)
- Centralized logging service

## Deployment Architecture

### Production Environment
- **Hosting**: Vercel (optimized for Next.js)
- **Database**: MongoDB Atlas
- **Auth**: Supabase Auth
- **Email**: Resend
- **CDN**: Vercel Edge Network

### CI/CD Pipeline
1. Code push to GitHub
2. Automated tests run
3. Type checking
4. Linting
5. Build verification
6. Deploy to preview (PR)
7. Deploy to production (main branch)

## Future Considerations

### Scalability
- Microservices extraction (if needed)
- Database sharding
- Caching layer (Redis)
- Message queue (for async operations)

### Feature Flags
- Gradual feature rollout
- A/B testing
- Kill switches

### API Gateway
- Unified API entry point
- Rate limiting
- Request transformation
- API versioning

---

## References

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)

## Related Documents

- [ADR-001: Codebase Restructuring](./ADR-001-CODEBASE-RESTRUCTURING.md)
- [Refactoring Plan](../CODEBASE_REFACTORING_PLAN.md)
- [Implementation Guide](../REFACTORING_IMPLEMENTATION_GUIDE.md)

---

**Last Updated**: October 13, 2025
