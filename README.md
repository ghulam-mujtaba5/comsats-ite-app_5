<div align="center">

# COMSATS ITE Portal

Modern university portal built with Next.js 15, React 19, Tailwind CSS 4, and MongoDB/Mongoose.

<!-- Badges -->
<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-Custom-lightgrey" />
  <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" />
  
</p>

<sub>Admin dashboard • Authentication • Community threads • Timetable • Analytics</sub>

</div>

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Deployment](#deployment)
  - [Vercel Free Tier Deployment](#vercel-free-tier-deployment)
- [Screenshots](#screenshots)
- [License](#license)

## Features

- Admin dashboard (analytics, timetable, content management)
- Auth (login, reset-password, delete account)
- Community threads and interaction
- Fully responsive UI with PWA support for all 108 pages
- Mobile-first design optimized for all screen sizes
- MongoDB with Mongoose models and seeding scripts
- Analytics hooks and tracking utilities

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4 + PostCSS
- MongoDB + Mongoose
- Supabase (SSR helpers and JS SDK)
- Radix UI primitives, Lucide icons, Framer Motion, Recharts
- Progressive Web App (PWA) with full mobile support

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm or npm
- MongoDB connection string
- (Optional) Supabase project URL and keys if you enable Supabase features

### Installation

Using pnpm (recommended):

```bash
pnpm install
pnpm dev
```

Or using npm:

```bash
npm install
npm run dev
```

The app starts on http://localhost:3000

### Environment Variables

Create a `.env.local` file in the project root. Common variables (adjust to your configuration):

```bash
# Database
MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority"
```

> Tip: Review files under `lib/` and `app/api/` to confirm the exact variables used by your deployment.

## Scripts

Defined in `package.json`:

- `dev` – Start the dev server
- `build` – Build for production
- `start` – Start the production server
- `lint` – Run Next.js lint
- `db:seed` – Seed baseline data
- `db:seed-complete` – Seed complete dataset
- `db:seed-timetable` – Seed timetable data
- `build-pwa` – Build with PWA support for mobile deployment

Run with pnpm:

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm run db:seed
pnpm run db:seed-complete
pnpm run db:seed-timetable
pnpm run build-pwa
```

## Project Structure

Our codebase follows **Clean Architecture** and **Feature-Slice Design** principles for maximum maintainability:

```
app/                    # Next.js App Router pages & API routes
  admin/                # Admin area (dashboard, login, timetable, etc.)
  api/                  # Route handlers (account, admin, auth, ...)

src/                    # Source code (Refactored Structure) ⭐ NEW
  core/                 # Core business logic (framework-agnostic)
    domain/             # Entities, types, schemas
    use-cases/          # Business logic & application services
    repositories/       # Data access interfaces
  
  infrastructure/       # External services & implementations
    database/           # MongoDB, Supabase implementations
    email/              # Email service (Resend)
    storage/            # File storage
  
  features/             # Feature modules (vertical slices)
    auth/               # Authentication feature
    admin/              # Admin feature
    community/          # Community feature
    timetable/          # Timetable feature
    [feature]/          # Each feature contains:
      api/              # - API handlers
      components/       # - UI components
      hooks/            # - React hooks
      utils/            # - Utilities
  
  lib/                  # Shared utilities & helpers
    utils/              # Pure utility functions
    helpers/            # Helper functions with side effects
    constants/          # Application constants
    types/              # Shared TypeScript types
  
  config/               # Configuration files

components/             # Shared UI components
  ui/                   # Base UI components (shadcn/ui)
  layout/               # Layout components (header, footer, sidebar)
  common/               # Common reusable components
  providers/            # Context providers

contexts/               # React contexts (e.g., auth)
hooks/                  # Shared custom React hooks
lib/                    # Legacy utilities (being migrated to src/lib)

tests/                  # Test files ⭐ NEW
  unit/                 # Unit tests
  integration/          # Integration tests
  e2e/                  # End-to-end tests (Playwright)

docs/                   # Documentation
  architecture/         # Architecture docs & ADRs ⭐ NEW
  guides/               # Developer guides ⭐ NEW
  api/                  # API documentation
  features/             # Feature documentation

public/                 # Static assets
scripts/                # DB and utility scripts (seeders, etc.)
styles/                 # Global styles (Tailwind)
```

📖 **For detailed architecture information**, see:
- [Architecture Overview](docs/architecture/ARCHITECTURE_OVERVIEW.md)
- [Codebase Refactoring Plan](docs/CODEBASE_REFACTORING_PLAN.md)
- [Contributing Guide](docs/guides/CONTRIBUTING.md)

## Roadmap

- [ ] Improve admin analytics with custom charts
- [ ] Full test coverage for API routes
- [ ] Role-based access control (RBAC)
- [ ] Dark mode refinements
- [ ] CI workflow (lint, type-check, build)

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a PR or issue.

1. Fork the repo
2. Create your feature branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m "feat: add amazing feature"`
4. Push to the branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

## Deployment

- Build: `pnpm build`
- Start: `pnpm start`
- Ensure the required environment variables are configured in your hosting provider (e.g., Vercel, Netlify with adapters, or your own server).

### Vercel Free Tier Deployment

This project includes optimizations for deployment on Vercel's free tier:

- **Resource Usage Minimization**: Implemented ISR caching, API route caching, and database query optimizations
- **Database Indexes**: Added indexes to improve query performance and reduce CPU usage
- **Image Optimization**: Configured Next.js image optimization to reduce bandwidth usage
- **Deployment Configuration**: Includes `vercel.json` with optimized settings

For detailed deployment instructions, see [DEPLOYMENT_FREE_TIER.md](DEPLOYMENT_FREE_TIER.md).

For a complete summary of optimizations, see [FREE_TIER_OPTIMIZATIONS_SUMMARY.md](FREE_TIER_OPTIMIZATIONS_SUMMARY.md).

## Screenshots

Add screenshots or a short demo GIF in the `public/` folder and reference them here:

```md
![Dashboard](public/screenshot-dashboard.png)
```

## License

This project is provided as-is for portfolio/showcase purposes. If you need a specific open-source license (e.g., MIT), add a `LICENSE` file and update this section.