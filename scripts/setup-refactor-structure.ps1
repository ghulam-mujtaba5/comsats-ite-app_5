# Quick Start Refactoring Script
# This script creates the new directory structure for the codebase refactoring

Write-Host "🚀 Starting COMSATS ITE Portal Refactoring..." -ForegroundColor Cyan
Write-Host ""

# Create src/core directories
Write-Host "📁 Creating Core directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "src\core\domain\user" -Force | Out-Null
New-Item -ItemType Directory -Path "src\core\domain\timetable" -Force | Out-Null
New-Item -ItemType Directory -Path "src\core\domain\community" -Force | Out-Null
New-Item -ItemType Directory -Path "src\core\domain\faculty" -Force | Out-Null
New-Item -ItemType Directory -Path "src\core\use-cases\auth" -Force | Out-Null
New-Item -ItemType Directory -Path "src\core\use-cases\admin" -Force | Out-Null
New-Item -ItemType Directory -Path "src\core\use-cases\community" -Force | Out-Null
New-Item -ItemType Directory -Path "src\core\repositories" -Force | Out-Null

# Create src/infrastructure directories
Write-Host "📁 Creating Infrastructure directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "src\infrastructure\database\mongodb\models" -Force | Out-Null
New-Item -ItemType Directory -Path "src\infrastructure\database\mongodb\repositories" -Force | Out-Null
New-Item -ItemType Directory -Path "src\infrastructure\database\supabase" -Force | Out-Null
New-Item -ItemType Directory -Path "src\infrastructure\email\resend\templates" -Force | Out-Null
New-Item -ItemType Directory -Path "src\infrastructure\storage" -Force | Out-Null
New-Item -ItemType Directory -Path "src\infrastructure\external-apis" -Force | Out-Null

# Create src/lib directories
Write-Host "📁 Creating Lib directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "src\lib\utils" -Force | Out-Null
New-Item -ItemType Directory -Path "src\lib\helpers" -Force | Out-Null
New-Item -ItemType Directory -Path "src\lib\constants" -Force | Out-Null
New-Item -ItemType Directory -Path "src\lib\types" -Force | Out-Null

# Create src/features directories
Write-Host "📁 Creating Feature directories..." -ForegroundColor Yellow
$features = @(
    "auth",
    "admin\analytics",
    "admin\dashboard",
    "community",
    "timetable",
    "faculty",
    "gamification",
    "gpa-calculator",
    "student-portal",
    "resources",
    "past-papers"
)

foreach ($feature in $features) {
    New-Item -ItemType Directory -Path "src\features\$feature\api" -Force | Out-Null
    New-Item -ItemType Directory -Path "src\features\$feature\components" -Force | Out-Null
    New-Item -ItemType Directory -Path "src\features\$feature\hooks" -Force | Out-Null
    New-Item -ItemType Directory -Path "src\features\$feature\utils" -Force | Out-Null
    New-Item -ItemType Directory -Path "src\features\$feature\types" -Force | Out-Null
}

# Create src/config directory
Write-Host "📁 Creating Config directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "src\config" -Force | Out-Null

# Create test directories
Write-Host "📁 Creating Test directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "tests\unit\core" -Force | Out-Null
New-Item -ItemType Directory -Path "tests\unit\features" -Force | Out-Null
New-Item -ItemType Directory -Path "tests\unit\lib" -Force | Out-Null
New-Item -ItemType Directory -Path "tests\integration\api" -Force | Out-Null
New-Item -ItemType Directory -Path "tests\integration\features" -Force | Out-Null
New-Item -ItemType Directory -Path "tests\e2e\playwright" -Force | Out-Null
New-Item -ItemType Directory -Path "tests\fixtures" -Force | Out-Null
New-Item -ItemType Directory -Path "tests\mocks" -Force | Out-Null

# Create documentation directories
Write-Host "📁 Creating Documentation directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "docs\architecture" -Force | Out-Null
New-Item -ItemType Directory -Path "docs\api" -Force | Out-Null
New-Item -ItemType Directory -Path "docs\guides" -Force | Out-Null
New-Item -ItemType Directory -Path "docs\features" -Force | Out-Null

# Reorganize components directories
Write-Host "📁 Creating Component directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "components\layout\header" -Force | Out-Null
New-Item -ItemType Directory -Path "components\layout\footer" -Force | Out-Null
New-Item -ItemType Directory -Path "components\layout\sidebar" -Force | Out-Null
New-Item -ItemType Directory -Path "components\common" -Force | Out-Null
New-Item -ItemType Directory -Path "components\providers" -Force | Out-Null

# Create barrel export files
Write-Host "📄 Creating barrel export files..." -ForegroundColor Yellow

# Core barrel exports
@"
// Core domain exports
export * from './domain'
export * from './use-cases'
export * from './repositories'
"@ | Out-File -FilePath "src\core\index.ts" -Encoding UTF8

@"
// Domain exports
export * from './user'
export * from './timetable'
export * from './community'
export * from './faculty'
"@ | Out-File -FilePath "src\core\domain\index.ts" -Encoding UTF8

@"
// Use cases exports
export * from './auth'
export * from './admin'
export * from './community'
"@ | Out-File -FilePath "src\core\use-cases\index.ts" -Encoding UTF8

# Infrastructure barrel exports
@"
// Infrastructure exports
export * from './database'
export * from './email'
export * from './storage'
"@ | Out-File -FilePath "src\infrastructure\index.ts" -Encoding UTF8

@"
// Database exports
export * from './mongodb'
export * from './supabase'
"@ | Out-File -FilePath "src\infrastructure\database\index.ts" -Encoding UTF8

# Lib barrel exports
@"
// Shared utilities and helpers
export * from './utils'
export * from './helpers'
export * from './constants'
export * from './types'
"@ | Out-File -FilePath "src\lib\index.ts" -Encoding UTF8

# Features barrel exports
@"
// Feature modules
export * from './auth'
export * from './admin'
export * from './community'
export * from './timetable'
export * from './faculty'
export * from './gamification'
"@ | Out-File -FilePath "src\features\index.ts" -Encoding UTF8

# Create README files for main directories
Write-Host "📝 Creating README files..." -ForegroundColor Yellow

@"
# Core Layer

This directory contains the core business logic and domain models of the application.

## Structure

- **domain/**: Domain entities, types, and schemas
- **use-cases/**: Business logic and application services
- **repositories/**: Data access interfaces (no implementations)

## Rules

- No external dependencies (framework-agnostic)
- No UI code
- Pure TypeScript/JavaScript
- Infrastructure implements these interfaces
"@ | Out-File -FilePath "src\core\README.md" -Encoding UTF8

@"
# Infrastructure Layer

This directory contains implementations of external services and technical infrastructure.

## Structure

- **database/**: Database connections and repository implementations
- **email/**: Email service implementations
- **storage/**: File storage implementations

## Rules

- Implements Core interfaces
- Contains all external dependencies
- Can be swapped out
- Should be mockable for testing
"@ | Out-File -FilePath "src\infrastructure\README.md" -Encoding UTF8

@"
# Feature Modules

This directory contains feature slices - vertical slices of application functionality.

## Structure

Each feature contains:
- **api/**: API route handlers
- **components/**: Feature-specific UI components
- **hooks/**: Feature-specific React hooks
- **utils/**: Feature-specific utilities
- **types/**: Feature-specific TypeScript types

## Rules

- Each feature is self-contained
- Minimal cross-feature dependencies
- Expose public API via index.ts
- Can depend on Core and Infrastructure
"@ | Out-File -FilePath "src\features\README.md" -Encoding UTF8

@"
# Shared Library

This directory contains shared utilities, helpers, constants, and types.

## Structure

- **utils/**: Pure utility functions (no side effects)
- **helpers/**: Helper functions with side effects
- **constants/**: Application constants
- **types/**: Shared TypeScript types

## Rules

- Keep functions small and focused
- Pure utilities in utils/
- Side effects in helpers/
- Well-documented and tested
"@ | Out-File -FilePath "src\lib\README.md" -Encoding UTF8

Write-Host ""
Write-Host "✅ Directory structure created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update tsconfig.json with new path aliases" -ForegroundColor White
Write-Host "2. Review docs\REFACTORING_IMPLEMENTATION_GUIDE.md" -ForegroundColor White
Write-Host "3. Start migrating files according to the implementation guide" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation created:" -ForegroundColor Cyan
Write-Host "   - docs\CODEBASE_REFACTORING_PLAN.md" -ForegroundColor White
Write-Host "   - docs\REFACTORING_IMPLEMENTATION_GUIDE.md" -ForegroundColor White
Write-Host "   - docs\architecture\ADR-001-CODEBASE-RESTRUCTURING.md" -ForegroundColor White
Write-Host "   - docs\architecture\ARCHITECTURE_OVERVIEW.md" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Ready to refactor! Good luck!" -ForegroundColor Green
