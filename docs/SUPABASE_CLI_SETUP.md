# Supabase CLI Setup Guide

This guide explains how to set up and use the Supabase CLI for local development.

## Prerequisites

- Node.js 18+
- npm or pnpm
- Docker (for local Supabase development)

## Installation

The setup script will automatically install the Supabase CLI if it's not already available:

```bash
npm run db:setup-cli
```

Alternatively, you can install it manually:

```bash
npm install -g supabase
```

## Project Setup

1. **Link your project** (if you have a Supabase project):
   ```bash
   npx supabase link
   ```

2. **Start local development**:
   ```bash
   npx supabase start
   ```

3. **Apply migrations**:
   ```bash
   npx supabase db reset
   ```

## Available Commands

### Database Management

```bash
# Check Supabase status
npx supabase status

# Reset database with latest migrations
npx supabase db reset

# Create a new migration
npx supabase migration new migration_name

# Apply pending migrations
npx supabase db push

# Generate TypeScript types from database schema
npx supabase gen types typescript --local > lib/database.types.ts
```

### Local Development

```bash
# Start Supabase services locally
npx supabase start

# Stop Supabase services
npx supabase stop

# View logs
npx supabase logs
```

## Project Structure

```
supabase/
├── migrations/          # Database migration files
├── seed.sql            # Database seed data
├── config.toml         # Supabase configuration
└── functions/          # Edge functions
```

## Environment Variables

Make sure your `.env` file contains the necessary Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Working with Migrations

### Creating New Migrations

```bash
npx supabase migration new feature_name
```

This creates a new migration file in `supabase/migrations/` with a timestamp prefix.

### Applying Migrations

```bash
# Apply to local development
npx supabase db reset

# Apply to linked project
npx supabase db push
```

## Troubleshooting

### Common Issues

1. **Docker not running**: Make sure Docker is installed and running
2. **Port conflicts**: Stop other services using ports 5432, 8000, 54321, 8081
3. **Permission errors**: Run commands with appropriate permissions

### Resetting Local Development

If you encounter issues with your local Supabase setup:

```bash
# Stop services
npx supabase stop

# Remove volumes
npx supabase stop --no-backup

# Start fresh
npx supabase start
npx supabase db reset
```

## Additional Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Local Development Guide](https://supabase.com/docs/guides/cli/local-development)