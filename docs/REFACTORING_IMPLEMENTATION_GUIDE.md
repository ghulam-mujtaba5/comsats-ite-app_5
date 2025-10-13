# Refactoring Implementation Guide

## Quick Start (Immediate Actions)

This guide provides step-by-step instructions for implementing the codebase refactoring plan.

## Phase 1: Infrastructure Setup (Start Immediately)

### Step 1.1: Create Directory Structure

Run these commands in PowerShell:

```powershell
# Create core directories
New-Item -ItemType Directory -Path "src\core\domain" -Force
New-Item -ItemType Directory -Path "src\core\use-cases" -Force
New-Item -ItemType Directory -Path "src\core\repositories" -Force

# Create infrastructure directories
New-Item -ItemType Directory -Path "src\infrastructure\database\mongodb\models" -Force
New-Item -ItemType Directory -Path "src\infrastructure\database\mongodb\repositories" -Force
New-Item -ItemType Directory -Path "src\infrastructure\database\supabase" -Force
New-Item -ItemType Directory -Path "src\infrastructure\email\resend\templates" -Force
New-Item -ItemType Directory -Path "src\infrastructure\storage" -Force

# Create lib directories
New-Item -ItemType Directory -Path "src\lib\utils" -Force
New-Item -ItemType Directory -Path "src\lib\helpers" -Force
New-Item -ItemType Directory -Path "src\lib\constants" -Force
New-Item -ItemType Directory -Path "src\lib\types" -Force

# Create feature directories
New-Item -ItemType Directory -Path "src\features\auth\api" -Force
New-Item -ItemType Directory -Path "src\features\auth\components" -Force
New-Item -ItemType Directory -Path "src\features\auth\hooks" -Force
New-Item -ItemType Directory -Path "src\features\admin\analytics" -Force
New-Item -ItemType Directory -Path "src\features\community" -Force
New-Item -ItemType Directory -Path "src\features\timetable" -Force

# Create config directory
New-Item -ItemType Directory -Path "src\config" -Force

# Create test directories
New-Item -ItemType Directory -Path "tests\unit\core" -Force
New-Item -ItemType Directory -Path "tests\integration\api" -Force
New-Item -ItemType Directory -Path "tests\e2e" -Force
New-Item -ItemType Directory -Path "tests\fixtures" -Force
New-Item -ItemType Directory -Path "tests\mocks" -Force

# Create documentation directories
New-Item -ItemType Directory -Path "docs\architecture" -Force
New-Item -ItemType Directory -Path "docs\api" -Force
New-Item -ItemType Directory -Path "docs\guides" -Force
New-Item -ItemType Directory -Path "docs\features" -Force

# Create organized component directories
New-Item -ItemType Directory -Path "components\layout\header" -Force
New-Item -ItemType Directory -Path "components\layout\footer" -Force
New-Item -ItemType Directory -Path "components\layout\sidebar" -Force
New-Item -ItemType Directory -Path "components\common" -Force
New-Item -ItemType Directory -Path "components\providers" -Force
```

### Step 1.2: Update TypeScript Configuration

Update `tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "target": "ES6",
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "types": ["node", "jest", "@testing-library/jest-dom"],
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"],
      "@/src/*": ["./src/*"],
      "@/core/*": ["./src/core/*"],
      "@/infrastructure/*": ["./src/infrastructure/*"],
      "@/features/*": ["./src/features/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/components/*": ["./components/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/config/*": ["./src/config/*"],
      "@/types/*": ["./src/lib/types/*"],
      "@/tests/*": ["./tests/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Step 1.3: Create Barrel Export Files

Create index files for organized exports:

```typescript
// src/core/index.ts
export * from './domain'
export * from './use-cases'
export * from './repositories'

// src/infrastructure/index.ts
export * from './database'
export * from './email'
export * from './storage'

// src/lib/index.ts
export * from './utils'
export * from './helpers'
export * from './constants'
export * from './types'

// src/features/index.ts
export * from './auth'
export * from './admin'
export * from './community'
export * from './timetable'
```

## Phase 2: Core Layer Migration

### Step 2.1: Extract Domain Models

#### Example: User Domain Model

```typescript
// src/core/domain/user/user.types.ts
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  campus: string
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  STUDENT = 'student',
  FACULTY = 'faculty',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface CreateUserDTO {
  email: string
  name: string
  password: string
  campus: string
}

export interface UpdateUserDTO {
  name?: string
  email?: string
  campus?: string
}
```

```typescript
// src/core/domain/user/user.schema.ts
import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  password: z.string().min(8),
  campus: z.string()
})

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  campus: z.string().optional()
})
```

```typescript
// src/core/domain/user/index.ts
export * from './user.types'
export * from './user.schema'
```

### Step 2.2: Create Use Cases

```typescript
// src/core/use-cases/auth/login.use-case.ts
import type { UserRepository } from '@/core/repositories'
import type { User } from '@/core/domain/user'

export interface LoginInput {
  email: string
  password: string
}

export class LoginUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(input: LoginInput): Promise<User> {
    // Business logic here
    const user = await this.userRepository.findByEmail(input.email)
    
    if (!user) {
      throw new Error('User not found')
    }

    // Validate password, etc.
    
    return user
  }
}
```

### Step 2.3: Define Repository Interfaces

```typescript
// src/core/repositories/user.repository.ts
import type { User, CreateUserDTO, UpdateUserDTO } from '@/core/domain/user'

export interface UserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(data: CreateUserDTO): Promise<User>
  update(id: string, data: UpdateUserDTO): Promise<User>
  delete(id: string): Promise<void>
  findAll(filters?: UserFilters): Promise<User[]>
}

export interface UserFilters {
  campus?: string
  role?: string
  search?: string
}
```

## Phase 3: Infrastructure Layer

### Step 3.1: Implement MongoDB Repository

```typescript
// src/infrastructure/database/mongodb/repositories/user.repository.impl.ts
import type { UserRepository } from '@/core/repositories'
import type { User, CreateUserDTO, UpdateUserDTO } from '@/core/domain/user'
import { UserModel } from '../models/user.model'

export class MongoDBUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id).lean()
    return user ? this.toEntity(user) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email }).lean()
    return user ? this.toEntity(user) : null
  }

  async create(data: CreateUserDTO): Promise<User> {
    const user = await UserModel.create(data)
    return this.toEntity(user)
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    const user = await UserModel.findByIdAndUpdate(id, data, { new: true }).lean()
    if (!user) throw new Error('User not found')
    return this.toEntity(user)
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id)
  }

  async findAll(filters?: UserFilters): Promise<User[]> {
    const query: any = {}
    if (filters?.campus) query.campus = filters.campus
    if (filters?.role) query.role = filters.role
    
    const users = await UserModel.find(query).lean()
    return users.map(u => this.toEntity(u))
  }

  private toEntity(doc: any): User {
    return {
      id: doc._id.toString(),
      email: doc.email,
      name: doc.name,
      role: doc.role,
      campus: doc.campus,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    }
  }
}
```

### Step 3.2: Database Connection

```typescript
// src/infrastructure/database/mongodb/connection.ts
import mongoose from 'mongoose'

let isConnected = false

export async function connectToDatabase() {
  if (isConnected) {
    return
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI!)
    isConnected = db.connections[0].readyState === 1
    console.log('✅ MongoDB connected')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw error
  }
}
```

## Phase 4: Feature Modules

### Step 4.1: Auth Feature Module

```typescript
// src/features/auth/hooks/use-login.ts
import { useState } from 'react'
import { LoginUseCase } from '@/core/use-cases/auth/login.use-case'
import { MongoDBUserRepository } from '@/infrastructure/database/mongodb/repositories'

export function useLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const userRepository = new MongoDBUserRepository()
      const loginUseCase = new LoginUseCase(userRepository)
      
      const user = await loginUseCase.execute({ email, password })
      
      // Handle successful login
      return user
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}
```

```typescript
// src/features/auth/components/login-form.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLogin } from '../hooks/use-login'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}
```

## Phase 5: Utilities Organization

### Step 5.1: String Utilities

```typescript
// src/lib/utils/string.utils.ts
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '...' : str
}
```

### Step 5.2: Date Utilities

```typescript
// src/lib/utils/date.utils.ts
import { format, formatDistance } from 'date-fns'

export function formatDate(date: Date | string, formatStr = 'PPP'): string {
  return format(new Date(date), formatStr)
}

export function timeAgo(date: Date | string): string {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}

export function isToday(date: Date | string): boolean {
  const today = new Date()
  const checkDate = new Date(date)
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  )
}
```

### Step 5.3: Constants Organization

```typescript
// src/lib/constants/app.constants.ts
export const APP_NAME = 'COMSATS ITE Portal'
export const APP_DESCRIPTION = 'Modern university portal'
export const APP_VERSION = '1.0.0'

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
} as const

export const CACHE_DURATION = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600 // 1 hour
} as const
```

```typescript
// src/lib/constants/routes.constants.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    TIMETABLE: '/admin/timetable'
  }
} as const

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register'
  },
  USERS: '/api/users',
  TIMETABLE: '/api/timetable'
} as const
```

## Phase 6: Testing Setup

### Step 6.1: Test Setup

```typescript
// tests/setup.ts
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn()
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams()
}))
```

### Step 6.2: Unit Test Example

```typescript
// tests/unit/lib/utils/string.utils.test.ts
import { capitalize, slugify, truncate } from '@/lib/utils/string.utils'

describe('String Utils', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
    })

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('')
    })
  })

  describe('slugify', () => {
    it('should convert to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world')
    })

    it('should remove special characters', () => {
      expect(slugify('Hello @World!')).toBe('hello-world')
    })
  })

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...')
    })

    it('should not truncate short strings', () => {
      expect(truncate('Hi', 5)).toBe('Hi')
    })
  })
})
```

## Migration Commands

### Automated File Movement

```powershell
# Move utilities to new structure
Move-Item "lib\utils.ts" "src\lib\utils\common.utils.ts"
Move-Item "lib\analytics.ts" "src\features\admin\analytics\analytics.service.ts"
Move-Item "lib\auth.ts" "src\features\auth\utils\auth.utils.ts"

# Move database files
Move-Item "lib\mongodb.ts" "src\infrastructure\database\mongodb\connection.ts"
Move-Item "lib\supabase.ts" "src\infrastructure\database\supabase\client.ts"
```

## Validation Checklist

After each phase, verify:

- [ ] All imports resolve correctly
- [ ] No circular dependencies
- [ ] Tests pass
- [ ] Build succeeds (`pnpm build`)
- [ ] Type checking passes (`pnpm type-check`)
- [ ] Linting passes (`pnpm lint`)

## Rollback Strategy

If issues occur:

1. Keep old files until migration is complete
2. Use feature flags for gradual rollout
3. Commit frequently with descriptive messages
4. Tag stable versions

## Tips for Success

1. **Migrate incrementally**: Don't try to move everything at once
2. **Test after each change**: Ensure nothing breaks
3. **Update imports gradually**: Use IDE refactoring tools
4. **Document as you go**: Update docs when structure changes
5. **Communicate with team**: Keep everyone informed

## Next Actions

1. Start with Phase 1 (create directories)
2. Update `tsconfig.json` with new paths
3. Create barrel export files
4. Begin migrating utilities (easiest first)
5. Move to domain models and use cases
6. Finally, migrate feature-specific code

---

**Ready to begin?** Start with the directory creation commands above!
