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
