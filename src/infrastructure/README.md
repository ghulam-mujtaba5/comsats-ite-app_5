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
