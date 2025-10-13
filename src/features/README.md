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
