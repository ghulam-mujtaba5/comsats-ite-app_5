# New Project Structure Documentation

## Overview

This document explains the new project structure for the CampusAxis application, which has been reorganized to improve maintainability, scalability, and developer experience. The structure follows domain-driven design principles and software engineering best practices.

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
│   │   ├── index.ts         # Community feature exports
│   │   ├── posts/           # Post-related components
│   │   ├── comments/        # Comment-related components
│   │   ├── sharing/         # Sharing-related components
│   │   ├── user/            # User-related components
│   │   ├── admin/           # Admin-related components
│   │   └── layout/          # Community layout components
│   ├── gamification/        # Gamification feature components
│   ├── profile/             # Profile feature components
│   ├── animations/          # Animation feature components
│   ├── emotion/             # Emotion feature components
│   └── ...                  # Additional features
└── pages/                   # Page-specific components (future use)

hooks/
├── index.ts                 # Main export file
├── shared/                  # Shared hooks used across features
├── features/                # Feature-specific hooks
│   ├── community/           # Community feature hooks
│   ├── gamification/        # Gamification feature hooks
│   ├── emotion/             # Emotion feature hooks
│   └── animations/          # Animation feature hooks
└── ui/                      # UI-specific hooks (future use)

lib/
├── index.ts                 # Main export file
├── core/                    # Core business logic and domain models
├── data/                    # Data access layer (repositories, database utilities)
├── services/                # Business services
├── utils/                   # Utility functions
└── config/                  # Configuration files

contexts/                    # React context providers (unchanged structure)
app/                        # Next.js app directory (unchanged structure)
docs/                       # Documentation files (unchanged structure)
```

## Component Organization

### Shared Components
Shared components are reusable across the entire application and are organized by type:

- **UI Components**: Base UI elements like buttons, cards, inputs
- **Layout Components**: Page layout elements like headers, footers, sidebars
- **Common Components**: Frequently used components like loaders, empty states

### Feature Components
Feature components are organized by domain to maintain clear boundaries:

```
components/features/
├── community/
│   ├── posts/
│   │   ├── PostCard.tsx
│   │   ├── PostForm.tsx
│   │   └── index.ts
│   ├── comments/
│   │   ├── CommentList.tsx
│   │   ├── CommentForm.tsx
│   │   └── index.ts
│   └── index.ts
└── gamification/
    ├── AchievementCard.tsx
    ├── Leaderboard.tsx
    └── index.ts
```

## Hook Organization

### Shared Hooks
Hooks that are used across multiple features:

```typescript
// Usage example
import { useMediaQuery, useToast } from '@/hooks/shared'
```

### Feature Hooks
Hooks that are specific to a particular feature:

```typescript
// Usage example
import { useRealtimePosts, useRealtimeComments } from '@/hooks/features/community'
import { useAchievements } from '@/hooks/features/gamification'
```

## Library Organization

### Core Layer
Contains core business logic and domain models:

```typescript
// Usage example
import { authenticateUser, createPost } from '@/lib/core'
```

### Data Layer
Handles data access and database operations:

```typescript
// Usage example
import { supabaseClient, getUserById } from '@/lib/data'
```

### Service Layer
Contains business services and external API integrations:

```typescript
// Usage example
import { sendNotification, generateMetadata } from '@/lib/services'
```

### Utility Layer
Provides utility functions for common operations:

```typescript
// Usage example
import { cn, formatDate, validateEmail } from '@/lib/utils'
```

## Benefits of the New Structure

### 1. Improved Maintainability
- Clear separation of concerns
- Easier to locate related files
- Reduced coupling between components
- Consistent naming conventions

### 2. Enhanced Scalability
- Modular structure supports feature growth
- Clear boundaries between domains
- Easier to add new features without disrupting existing code
- Better support for code splitting

### 3. Better Developer Experience
- Intuitive file organization
- Faster onboarding for new developers
- Improved IDE autocompletion
- Better support for AI assistants

### 4. Enhanced Testability
- Isolated components are easier to test
- Clear separation between UI and business logic
- Mocking dependencies becomes simpler
- Better support for unit and integration tests

## Migration Guide

### For Component Imports
**Before:**
```typescript
import { Button } from '@/components/ui/button'
import { ThreadCard } from '@/components/community/thread-card'
```

**After:**
```typescript
import { Button } from '@/components/shared/ui'
import { ThreadCard } from '@/components/features/community'
```

### For Hook Imports
**Before:**
```typescript
import { useRealtimePosts } from '@/hooks/use-realtime-posts'
import { useToast } from '@/hooks/use-toast'
```

**After:**
```typescript
import { useRealtimePosts } from '@/hooks/features/community'
import { useToast } from '@/hooks/shared'
```

### For Library Imports
**Before:**
```typescript
import { supabase } from '@/lib/supabase'
import { generateMetadata } from '@/lib/seo-utils'
```

**After:**
```typescript
import { supabase } from '@/lib/data'
import { generateMetadata } from '@/lib/services'
```

## Future Improvements

### 1. Page Component Organization
Plan to organize page-specific components under `components/pages/` for better separation.

### 2. Enhanced Testing Structure
Create parallel test directories that mirror the component structure for better test organization.

### 3. Documentation Integration
Add inline documentation and examples for each major component and hook.

### 4. Performance Optimization
Implement code splitting strategies based on the new directory structure.

This new structure provides a solid foundation for the continued growth and maintenance of the CampusAxis application while making it easier for both human developers and AI assistants to navigate and understand the codebase.