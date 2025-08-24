# Portal Redesign & Refinement — Implementation Spec

Use this as the single source of truth to redesign and refine the internal, authenticated Portal. Do not change public/marketing routes.

---

## Command Palette (Admin)

### Goals
- Provide fast navigation and actions across Admin sections with the same shortcut model as the public site.

### Shortcuts
- Cmd/Ctrl+K opens the palette globally within the Portal UI.
- Slash `/` opens only when not focused in an editable field.

### Behavior
- Palette appears as a modal dialog; focus is trapped; Esc closes and returns focus to trigger.
- Items include: Go to Dashboard, Users, Faculty, Reviews (Moderation), Resources, Past Papers, News, News & Events, Community Moderation, Issues/Reports, Timetable, Settings.
- Actions (future): Create Resource, Invite User, Open Settings pane, Toggle Theme, View Logs.
- RBAC: show only items allowed by the current user's role; hide or disable others.
- Search action: typing filters items; optional global entity search can route to section pages with query params.

### Accessibility
- Labeled dialog; keyboard reachable; `aria-activedescendant` managed by list; screen reader-friendly.
- Announce open/close; maintain focus order; respect reduced motion.

### QA Checklist
- Cmd/Ctrl+K opens on all admin routes; Esc closes and restores focus.
- `/` does not interfere with text inputs or editors.
- RBAC correctly filters actions and destinations per role.
- Navigation items route correctly; no hydration warnings or console errors.
- Theme and density work within the palette across light/dark.

---

## Status Progress
- Owner: Portal Team
- Last updated: 2025-08-24 12:47 (+05:00)

### Checklist
- [x] Create canonical spec file at `docs/portal-redesign-spec.md`
- [x] Backfill enhanced spec content
- [x] Answer Open Questions (v1)
- [ ] Confirm filename and archive `testing-CampusAxis.txt`
- [x] Draft component inventory from `app/admin/**`, `components/admin/**`
- [ ] Theming audit (tokens, variables, system pref, no CLS)
- [ ] Navigation scaffolding (sidebar/topbar/breadcrumbs/command palette)
- [x] Command palette shortcut (Cmd/Ctrl+K) alignment with public site
- [ ] Dashboard KPIs + data wire-up
- [ ] Data tables (sort/filter/paginate/search)
- [ ] Forms/wizards (inline validation, optimistic)
- [ ] Accessibility pass (WCAG 2.2 AA+)
- [ ] Performance/Lighthouse budgets
- [ ] Tests (unit/a11y/e2e)

### Notes
- This file supersedes `testing-CampusAxis.txt` for Portal work. Keep the old file until rename is approved.
- Awaiting approval to archive/move `testing-CampusAxis.txt` into `docs/archive/` with timestamped filename.

---

## Scope
- Only modify:
  - `app/admin/**`, `components/admin/**`, `contexts/**`, `lib/**`, `hooks/**`, `styles/globals.css`
  - Supporting APIs under `app/api/**` used by the Portal
- Do not alter public/marketing routes like `app/about/**`, `app/resources/**`, `app/news-events/**`, `app/news/**`, etc.

## Goals
- 2025-level SaaS UX with WCAG 2.2 AA+ compliance, excellent performance, and zero layout shift.
- Fully responsive, accessible, consistent, and brand-aligned UI.
- Theme switching that is instant, respects system preference, and adapts icons/charts/illustrations.

## Constraints
- Respect brand tokens and documentation under `/docs` (typography, colors, spacing, iconography).
- Maintain folder structure, use modern Next.js App Router patterns, and TypeScript.
- No breaking changes to existing functionality or API contracts.

---

## Deliverables
- Modern dashboard: live KPIs, trends, spark-lines, quick actions, alerts
- Navigation: collapsible sidebar, topbar, profile menu, breadcrumbs, command palette (Cmd/Ctrl+K)
- Data tables: sorting, column visibility, filtering, pagination, global search, row selection, badges
- Workflows: forms/wizards/modals with inline validation, optimistic UI, error summaries
- Reports & Analytics: interactive charts, downloadable CSV/PDF, saved views, filters
- Settings & User Management: roles, permissions, preferences, integrations
- Accessibility: semantic HTML, ARIA, focus order, skip links, reduced motion, keyboard nav
- Responsiveness: mobile → 2xl/ultra-wide with sensible density/scales
- Theming: light/dark/system, instant switch, no CLS, assets adapt to theme
- Code: clean, documented components, tests, performance-optimized

---

## Architecture & Integration
- State: Prefer React Server Components for data; client components only when needed.
- Data fetching:
  - Use Next.js `app/` data routes, caching, revalidation; stale-while-revalidate where applicable.
  - Centralize API clients in `lib/**`. Handle auth and error normalization.
- Forms: `react-hook-form` + schema validation (Zod/Yup). Inline + summary errors.
- UI System: Follow existing component conventions (e.g., shadcn/ui per `components.json`). Tailwind utilities in `styles/globals.css`.
- Theming: System-pref via `prefers-color-scheme`. Toggle stored in localStorage without FOUC. CSS variables for tokens.

### Component Inventory (v1)
- **Admin pages (`app/admin/`)**
  - Root dashboard launcher: `app/admin/page.tsx` (fetches `/api/admin/dashboard-stats`)
  - Sections: `auth/`, `community/`, `dashboard/`, `events/`, `faculty/`, `guidance/`, `issues/`, `login/`, `lost-found/`, `moderation/`, `news/`, `news-events/`, `past-papers/`, `resources/`, `reviews/`, `settings/`, `support/`, `timetable/`, `timetable-docs/`, `users/`
- **Admin components (`components/admin/`)**
  - `admin-guard.tsx` (route protection)
- **Key libs (`lib/**`)**
  - Auth/Admin: `admin.ts`, `supabase.ts`, `supabase-admin.ts`
  - Data helpers: `community.ts`, `community-data.ts`, `faculty-data.ts`, `resources-data.ts`, `past-papers-data.ts`
  - Infra/Utils: `mongo.ts`, `mongodb.ts`, `notify.ts`, `seo.ts`, `gpa-utils.ts`, `utils.ts`
- **APIs (`app/api/**`)**
  - Admin endpoints: `app/api/admin/**` (users, dashboard-stats, faculty, moderation, resources, past-papers, settings, timetable, lost-found, seed, session)
  - Domain endpoints: `community`, `news`, `news-events`, `guidance`, `reviews`, `issues`, `timetable(-docs)`, `past-papers`, `resources`, `stats`

---

## Design System & Tokens
- Typography: per `/docs`. Avoid widows/orphans; truncate gracefully.
- Color: WCAG 2.2 AA+ for text/interactive. High contrast mode supported.
- Spacing & Radii: 4/8px rhythm (or per `/docs`). Consistent radii across inputs/cards/modals.
- Iconography: Use approved sets from `/docs`. Size/weight adapt to theme.
- Motion: Subtle (120–200ms). Respect `prefers-reduced-motion`.

---

## UX Patterns
- Layout: 12-col responsive grid, adaptive gutters. Sticky topbar. Collapsible sidebar with icons+labels.
- Breadcrumbs: Reflect route segments. First segment is Portal root (e.g., Admin).
- Command palette: Fuzzy search across nav, commands, recent entities.
- Micro-interactions: Hover/pressed states, live refresh badges, skeleton loaders, optimistic commits with toasts.
- Feedback: Toasts for success/info/error. Provide Undo where feasible.

---

## Accessibility
- Landmarks: `header`, `nav`, `main`, `aside`, `footer` used correctly.
- Focus management: visible focus ring; trap focus in modals; restore focus on close.
- Forms: labels, descriptions, `aria-invalid`, `aria-describedby`, error summary link list.
- Keyboard: Tab reachability; Esc closes modals; Enter submits forms.
- Content: meaningful alt text; no color-only distinctions.

---

## Performance & Quality
- Core Web Vitals: LCP < 2.5s (p75), CLS < 0.1, INP < 200ms.
- Budgets: Route JS < 180KB gz (initial); images optimized; icons via sprite/inline where suitable.
- Rendering: Avoid unnecessary client hydration. Memoize heavy components. Virtualize long lists.
- Data: Incremental rendering, pagination, `suspense` with skeletons.
- Images: `next/image` with responsive sizes and priority flags.

---

## Page & Module Specs
- Dashboard (`app/admin/dashboard/page.tsx`)
  - KPI cards with delta + spark-lines, quick actions, recent activity, alerts, pinned items
- Data Management (e.g., Users, Entities)
  - Table with server-backed filters, smart search, tag/badge status; bulk actions with confirmation
  - Row detail panel or drawer
- Workflows
  - Multi-step wizard with progress; autosave drafts; inline validation; error summary at submit
- Reports & Analytics
  - Theme-aware charts; export CSV/PDF; schedule email; saved filters
- Settings
  - Profile, security (2FA), notifications, integrations; role mapping and permission matrix

---

## Theming Requirements
- Zero CLS on theme switch: pre-inject chosen theme class before paint
- Assets: icons/charts/illustrations auto-adapt (stroke/fill/legend)
- Charts: tokenized colors; ensure contrast and gridline visibility in both themes

---

## Security & Privacy
- Auth: Guard all admin routes (e.g., `components/admin/admin-guard.tsx`)
- RBAC: Enforce role checks in UI and server logic
- Forms: CSRF where applicable; rate limit sensitive actions
- Logs: No PII in client logs/toasts

---

## Telemetry & Observability
- Instrument key flows (create/update/delete, export, invite)
- Error boundaries per route with user-friendly recovery UI
- UX measurements: loading states, success rates, retries

---

## Testing & QA
- Unit: components, utils, hooks
- Integration: workflows (forms, tables)
- Accessibility: axe, keyboard traversal tests
- Visual: per-theme visual regression for critical pages
- Performance: Lighthouse CI per route; assert budgets

---

## Rollout Plan
- Feature flags for new nav and dashboard
- Incremental migration by section
- Fall-back routes maintained during cutover
- Collect beta feedback, iterate, then flip default

---

## Acceptance Criteria
- Navigation: Sidebar, topbar, breadcrumbs, command palette work across screen sizes
- Dashboard: KPIs live-update; quick actions complete primary flows
- Tables: Sort/filter/paginate/search with server-backed results
- Forms: Inline validation + error summary; keyboard-only completion possible
- Accessibility: WCAG 2.2 AA+ automated checks pass; manual keyboard review passes
- Theming: Instant, no CLS; charts/icons adapt; honors system preference
- Performance: Core Web Vitals within budgets on real data
- Code: Typed, documented, modular; tests pass; no console errors/warnings

---

## Answers to Open Questions (v1)

- **Primary entities for Data Management**
  - Users: `app/admin/users/**`, API `app/api/admin/admin-users/**`, KPI used in `app/admin/page.tsx`.
  - Faculty & Reviews: `lib/faculty-data.ts`, admin `app/admin/faculty/**`, review moderation `app/admin/reviews/**`, APIs under `app/api/admin/faculty/**` and `.../moderation/reviews/**`.
  - Resources: `lib/resources-data.ts`, admin `app/admin/resources/**`, API `app/api/admin/resources/route.ts`.
  - Community (posts/replies): client `lib/community.ts`, moderation `app/admin/moderation/**`, APIs `app/api/admin/moderation/**`.
  - News & Events: admin `app/admin/news/**`, `app/admin/news-events/**`, APIs `app/api/news/**`, `app/api/news-events/**`.
  - Past Papers: `lib/past-papers-data.ts`, admin `app/admin/past-papers/**`, API `app/api/admin/past-papers/route.ts`.
  - Lost & Found: admin `app/admin/lost-found/**`, API `app/api/admin/lost-found/**`.
  - Issues/Reports: admin `app/admin/issues/**`, API `app/api/admin/moderation/reports/**`.
  - Timetable & Docs: admin `app/admin/timetable/**`, `app/admin/timetable-docs/**`, APIs `app/api/admin/timetable**` and `.../timetable-docs/**`.
  - Guidance: admin `app/admin/guidance/**`, APIs `app/api/guidance/**`.

- **Chart library preference + brand palette mapping**
  - No charts detected in repo. Recommend Recharts for themeable, accessible charts with Next.js compatibility.
  - Map brand tokens via CSS variables (e.g., `--chart-1`, `--chart-text`, `--chart-grid`) defined in `styles/globals.css`; pass to Recharts components so light/dark are automatic via class or `prefers-color-scheme`.

- **Specific KPIs and data sources/refresh**
  - Existing: `totalUsers`, `totalFaculty`, `totalReviews`, `totalResources` from `GET /api/admin/dashboard-stats` consumed in `app/admin/page.tsx`.
  - Recommended expansions using existing endpoints:
    - Users: new signups/day, active users (from Supabase auth events).
    - Community: new posts/replies, pending moderation counts (`app/api/admin/moderation/posts/**`).
    - Reviews: pending approvals, average rating, flagged count (`app/api/admin/moderation/reviews/route.ts`; calc helpers in `lib/faculty-data.ts`).
    - Resources: downloads last 7/30 days, top resources (`lib/resources-data.ts`).
    - Past Papers: submissions per period, approval rate (`app/api/admin/past-papers/route.ts`).
    - Issues: open vs resolved (`app/api/admin/moderation/reports/**`).
  - Refresh: tag-based revalidation from server actions; client-side SWR 30–60s for light metrics; `suspense` + skeletons; optimistic updates on mutations.

- **RBAC roles and permission matrix**
  - Current: `components/admin/admin-guard.tsx` + `lib/admin.ts` use a basic admin session (localStorage). No granular roles found.
  - Proposal: Roles = SuperAdmin, Admin, Moderator, Editor, Viewer.
    - Users: SuperAdmin/Admin (full), Viewer (read).
    - Faculty/Resources/Past Papers/News-Events: Editor/Admin (create/update/publish), Viewer (read).
    - Moderation (community, reviews, reports): Moderator/Admin.
    - Settings: SuperAdmin/Admin only.
  - Impl: store role in Supabase user metadata or `profiles` table; enforce in API under `app/api/admin/**`; extend `AdminGuard` to accept `allowedRoles` per route.

- **Required integrations and settings surface**
  - Integrations present: Supabase (`lib/supabase.ts`, `lib/supabase-admin.ts`, `contexts/auth-context.tsx`), MongoDB drivers present (`lib/mongo.ts`, `lib/mongodb.ts`)—verify actual usage before pruning.
  - Settings pages to expose:
    - Authentication (email domain policy, 2FA, session timeouts), Roles & Permissions, Content Moderation thresholds, Storage (buckets/MIME/limits), News/Events scheduling defaults, Past Papers approval policy, Telemetry toggles, Theming (light/dark/system within approved tokens).

---
