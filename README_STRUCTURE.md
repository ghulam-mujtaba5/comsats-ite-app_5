# CampusAxis Project Structure

## Overview

This document explains the organized project structure for the CampusAxis application, which follows domain-driven design principles and software engineering best practices to improve maintainability, scalability, and developer experience.

## Directory Structure

```
components/
├── index.ts                 # Main export file
├── shared/                  # Shared components used across features
│   ├── ui/                  # Base UI components (buttons, cards, etc.)
│   ├── layout/              # Layout components (headers, footers, etc.)
│   └── common/              # Commonly used components (loaders, empty states, etc.)
├── features/                # Feature-specific components
│   ├── community/           # Community feature components
│   ├── gamification/        # Gamification feature components
│   ├── profile/             # Profile feature components
│   ├── animations/          # Animation feature components
│   └── emotion/             # Emotion feature components
└── pages/                   # Page-specific components (future use)

hooks/
├── index.ts                 # Main export file
├── shared/                  # Shared hooks used across features
└── features/                # Feature-specific hooks

lib/
├── index.ts                 # Main export file
├── core/                    # Core business logic and domain models
├── data/                    # Data access layer (repositories, database utilities)
├── services/                # Business services
├── utils/                   # Utility functions
└── config/                  # Configuration files
```

## How to Use the New Structure

### Importing Components

**Shared UI Components:**
```typescript
import { Button, Card, Input } from '@/components/shared/ui'
```

**Feature Components:**
```typescript
import { ThreadCard } from '@/components/features/community'
import { AchievementCard } from '@/components/features/gamification'
```

### Importing Hooks

**Shared Hooks:**
```typescript
import { useToast, useMediaQuery } from '@/hooks/shared'
```

**Feature Hooks:**
```typescript
import { useRealtimePosts } from '@/hooks/features/community'
import { useAchievements } from '@/hooks/features/gamification'
```

### Importing Library Functions

**Core Business Logic:**
```typescript
import { authenticateUser, createPost } from '@/lib/core'
```

**Data Access:**
```typescript
import { supabaseClient, getUserById } from '@/lib/data'
```

**Services:**
```typescript
import { sendNotification, generateMetadata } from '@/lib/services'
```

**Utilities:**
```typescript
import { cn, formatDate, validateEmail } from '@/lib/utils'
```

## Benefits

### 1. Improved Maintainability
- Clear separation of concerns
- Easier to locate related files
- Reduced coupling between components

### 2. Enhanced Scalability
- Modular structure supports feature growth
- Clear boundaries between domains
- Easier to add new features

### 3. Better Developer Experience
- Intuitive file organization
- Faster onboarding for new developers
- Improved IDE autocompletion

### 4. Enhanced Testability
- Isolated components are easier to test
- Clear separation between UI and business logic
- Better support for unit and integration tests

## Migration Status

The new structure has been implemented and validated. All existing functionality should work as expected with the updated import paths.

## Documentation

For detailed information about the new structure, see:
- [Project Structure Refactor Documentation](./docs/PROJECT_STRUCTURE_REFACTOR.md)
- [New Project Structure Documentation](./docs/NEW_PROJECT_STRUCTURE.md)

## Scripts

Helper scripts are available for migration and validation:
- `scripts/migrate-structure.ts` - Updates import paths
- `scripts/validate-structure.ts` - Validates the new structure

## Contributing

When adding new features or components, follow the established structure:
1. Place shared components in `components/shared/`
2. Place feature-specific components in `components/features/[feature-name]/`
3. Update the appropriate index files
4. Follow the import patterns shown above

This structure makes it easier for both human developers and AI assistants to navigate and understand the codebase.