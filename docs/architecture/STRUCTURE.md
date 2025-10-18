# Project structure (clean overview)

This app follows a Next.js (App Router) layout with supporting domain and infrastructure code.

Top-level folders:
- `app/` – Next.js routes, layouts, pages, and route handlers (UI and API boundaries)
- `components/` – Reusable UI components (cohesive, styled with CSS Modules/Tailwind)
- `lib/` – Application modules (domain/core, services, data access, utilities)
- `src/` – Incremental migration area for clean-architecture layers: `core`, `features`, `infrastructure` (kept for gradual refactor)
- `public/` – Static assets
- `styles/` – Global styles and design tokens
- `hooks/` and `contexts/` – React hooks and context providers
- `scripts/` – DevOps, migrations, audits, and maintenance scripts (do not import from runtime code)
- `tests/` and `__tests__/` – E2E (Playwright) and unit/integration tests respectively

Conventions:
- Use path alias `@/*` to import from project root (configured in `tsconfig.json`).
- Keep server-only code under `lib/` or inside `app/**/route.ts` files; avoid importing server code into client components.
- Keep feature-specific hooks in `hooks/features/<feature>` and shared hooks in `hooks/shared`.
- Prefer colocating component-specific styles next to the component using CSS Modules.

Notes:
- Some legacy audit/optimization documents were removed to keep the repo focused. CI artifacts and large reports should live outside the repo or be gitignored.
- If you need a previous report, check the repository history.
