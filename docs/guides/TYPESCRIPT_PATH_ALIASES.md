# Updated tsconfig.json for Refactored Structure

Copy this configuration to your `tsconfig.json` file:

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
      // Root alias (existing)
      "@/*": ["./*"],
      
      // Core layer aliases (NEW)
      "@/core/*": ["./src/core/*"],
      "@/core/domain/*": ["./src/core/domain/*"],
      "@/core/use-cases/*": ["./src/core/use-cases/*"],
      "@/core/repositories/*": ["./src/core/repositories/*"],
      
      // Infrastructure layer aliases (NEW)
      "@/infrastructure/*": ["./src/infrastructure/*"],
      "@/infrastructure/database/*": ["./src/infrastructure/database/*"],
      "@/infrastructure/email/*": ["./src/infrastructure/email/*"],
      "@/infrastructure/storage/*": ["./src/infrastructure/storage/*"],
      
      // Feature module aliases (NEW)
      "@/features/*": ["./src/features/*"],
      "@/features/auth/*": ["./src/features/auth/*"],
      "@/features/admin/*": ["./src/features/admin/*"],
      "@/features/community/*": ["./src/features/community/*"],
      "@/features/timetable/*": ["./src/features/timetable/*"],
      "@/features/faculty/*": ["./src/features/faculty/*"],
      "@/features/gamification/*": ["./src/features/gamification/*"],
      
      // Shared library aliases (NEW)
      "@/lib/*": ["./src/lib/*"],
      "@/lib/utils/*": ["./src/lib/utils/*"],
      "@/lib/helpers/*": ["./src/lib/helpers/*"],
      "@/lib/constants/*": ["./src/lib/constants/*"],
      "@/lib/types/*": ["./src/lib/types/*"],
      
      // Configuration aliases (NEW)
      "@/config/*": ["./src/config/*"],
      
      // Component aliases
      "@/components/*": ["./components/*"],
      "@/components/ui/*": ["./components/ui/*"],
      "@/components/layout/*": ["./components/layout/*"],
      "@/components/common/*": ["./components/common/*"],
      
      // Hook aliases
      "@/hooks/*": ["./hooks/*"],
      
      // Context aliases
      "@/contexts/*": ["./contexts/*"],
      
      // Test aliases (NEW)
      "@/tests/*": ["./tests/*"],
      "@/tests/unit/*": ["./tests/unit/*"],
      "@/tests/integration/*": ["./tests/integration/*"],
      "@/tests/e2e/*": ["./tests/e2e/*"],
      "@/tests/fixtures/*": ["./tests/fixtures/*"],
      "@/tests/mocks/*": ["./tests/mocks/*"],
      
      // Legacy lib alias (for gradual migration)
      "@/lib-legacy/*": ["./lib/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "src/**/*.ts",
    "src/**/*.tsx"
  ],
  "exclude": ["node_modules"]
}
```

## Import Examples

### Before (Current):
```typescript
import { analytics } from '@/lib/analytics'
import { connectToDatabase } from '@/lib/mongodb'
import { createClient } from '@/lib/supabase'
```

### After (Refactored):
```typescript
// Use aliases for better organization
import { AnalyticsService } from '@/features/admin/analytics'
import { connectToDatabase } from '@/infrastructure/database/mongodb'
import { createClient } from '@/infrastructure/database/supabase'

// Import from core
import { User } from '@/core/domain/user'
import { LoginUseCase } from '@/core/use-cases/auth'

// Import from features
import { LoginForm } from '@/features/auth/components'
import { useAuth } from '@/features/auth/hooks'

// Import shared utilities
import { formatDate } from '@/lib/utils/date.utils'
import { APP_NAME } from '@/lib/constants/app.constants'

// Import UI components
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
```

## Benefits of New Path Aliases

1. **Clear Intent**: Immediately know what layer you're importing from
2. **Easy Refactoring**: Change implementations without breaking imports
3. **Better Autocomplete**: IDE suggestions are more organized
4. **Enforces Architecture**: Harder to break layer boundaries accidentally
5. **AI-Friendly**: Clear patterns for AI systems to follow

## Migration Strategy

### Phase 1: Add Aliases (Do First)
1. Copy the new tsconfig.json configuration
2. Restart TypeScript server in VS Code
3. Verify autocomplete works with new aliases

### Phase 2: Gradual Migration
1. Keep old `lib/` working with `@/lib-legacy/*` alias
2. Move files to new structure
3. Update imports gradually
4. Remove legacy alias when done

### Phase 3: Cleanup
1. Remove `@/lib-legacy/*` alias
2. Delete old `lib/` directory
3. Update all documentation

## VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "javascript.preferences.importModuleSpecifier": "non-relative",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "javascript.updateImportsOnFileMove.enabled": "always",
  "path-intellisense.mappings": {
    "@/core": "${workspaceFolder}/src/core",
    "@/infrastructure": "${workspaceFolder}/src/infrastructure",
    "@/features": "${workspaceFolder}/src/features",
    "@/lib": "${workspaceFolder}/src/lib",
    "@/components": "${workspaceFolder}/components",
    "@/hooks": "${workspaceFolder}/hooks"
  }
}
```

## ESLint Configuration

Add import order rules in `.eslintrc.json`:

```json
{
  "rules": {
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "pathGroups": [
          {
            "pattern": "@/core/**",
            "group": "internal",
            "position": "before"
          },
          {
            "pattern": "@/infrastructure/**",
            "group": "internal",
            "position": "before"
          },
          {
            "pattern": "@/features/**",
            "group": "internal",
            "position": "before"
          },
          {
            "pattern": "@/lib/**",
            "group": "internal",
            "position": "before"
          },
          {
            "pattern": "@/components/**",
            "group": "internal",
            "position": "after"
          }
        ],
        "pathGroupsExcludedImportTypes": ["builtin"],
        "alphabetize": {
          "order": "asc"
        }
      }
    ]
  }
}
```

## Troubleshooting

### Issue: Imports not resolving
**Solution**: Restart TypeScript server (Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")

### Issue: Path intellisense not working
**Solution**: Install "Path Intellisense" extension and add VS Code settings above

### Issue: Build errors after adding aliases
**Solution**: Ensure `include` in tsconfig.json includes `"src/**/*.ts"` and `"src/**/*.tsx"`

## Next Steps

1. ✅ Update tsconfig.json
2. ✅ Restart TypeScript server
3. ✅ Run `pnpm build` to verify configuration
4. ✅ Start migrating files using implementation guide
