# Website Redesign & Refinement — Implementation Spec (Public Site)

Use this as the single source of truth to redesign and refine the public-facing website (non-Portal). The Admin Portal remains governed by `docs/portal-redesign-spec.md`.

---

## Global Search & Command Palette

### Entry Points
- Header Search button linking to `app/search/page.tsx` (route: `/search`).
- Keyboard shortcuts:
  - Cmd/Ctrl+K opens the Command Palette globally.
  - Slash `/` opens the palette when not typing; on `/search`, it focuses the input.
  - Visible kbd hint next to header Search on lg+ screens.

### Search Page (`app/search/page.tsx` + `app/search/search-client.tsx`)
- Server component provides metadata via `createMetadata()` from `lib/seo.ts`.
- Client component handles input, query param sync, and focus management.
- Accessibility:
  - `role="search"`, associated label, and visible placeholder.
  - Keyboard shortcuts: focuses input (Cmd/Ctrl+K, `/`), announced with tooltip in header.
  - URL updates (`?q=`) without full reload to preserve history/back (debounced ~300ms while typing).
  - Recent searches stored in `localStorage` with clear action; clickable chips route to `/search?q=…`.
  - Results region uses `aria-live="polite"` and surfaces a total results summary.
  - Empty-state shows suggested example query chips.

- Results UX:
  - Grouped by category: Learning Resources, Past Papers, Faculty (top 5 each).
  - Query highlighting in titles, descriptions, and key fields.
  - Per-item deep links:
    - Resources/Past Papers → `downloadUrl` when available; fallback to list page.
    - Faculty → `/faculty` (until detail pages exist).
  - "View all" links per group with contextual `aria-label`s.

### Command Palette (`components/search/command-palette.tsx`)
- Opens via Cmd/Ctrl+K or `/` (when not typing in an input/textarea/contenteditable).
- Provides quick navigation to key routes and a "Search site" action routing to `/search?q=...`.
- Focus is trapped within dialog; Esc closes; restores focus to trigger.
- Accessible via `cmdk` semantics; labeled dialog with descriptive title.
 - Admin group is shown only when an admin session is active (localStorage flag for demo).

### Header Integration (`components/layout/header.tsx`)
- Search button shows tooltip: "Search (Ctrl/⌘ K)" using `components/ui/tooltip.tsx`.
- Exposes `aria-keyshortcuts="Control+K Meta+K"` on the button for AT discoverability.

### QA Checklist
- Cmd/Ctrl+K opens palette on all public pages; Esc closes and restores focus.
- `/` opens palette only when not focused in a text-editing field.
- On `/search` with empty `?q`, input autofocuses; typing updates `?q` and preserves history.
- Header tooltip renders correctly and does not obstruct pointer events; correct on light/dark.
- No duplicate global footers or conflicting global shortcuts.
 - Recent searches persist, render as chips, and Clear removes them.
 - Search results announce total count and update via `aria-live`.
 - Empty-state example queries are visible and clickable.
 - Grouped results show max 5 per group with working "View all" links.
 - Per-item links open correct targets (download where available).

---

## Status Progress
- Owner: Web Team

Last updated: 2025-08-24T12:59:53+05:00


### Checklist
- [x] Create canonical website spec file at `docs/website-redesign-spec.md`
- [x] Confirm shared design tokens with Portal spec
- [ ] Route-by-route audit (UX, a11y, performance)
- [ ] Navigation & IA proposal (header, footer, breadcrumbs where relevant)
- [ ] Component library alignment (buttons, cards, forms, tables, list views)
- [x] Theme support (light/dark/system), zero CLS
- [ ] Critical flows: search, filter, contact, contribution, report issue
- [x] Global search entry point (/search) + command palette (Cmd/Ctrl+K)
- [ ] Accessibility pass (WCAG 2.2 AA+)
- [ ] Performance budgets & Lighthouse CI
- [ ] Tests (unit/a11y/e2e)

### Notes
- Public site should share brand tokens and primitives with Portal, while respecting differing UX needs of anonymous vs. authenticated users.
- Global Footer integrated via `app/layout.tsx` using `components/layout/footer.tsx`.
- Zero-CLS theme pre-injection added in `app/layout.tsx` head; honors localStorage `theme` or system preference.
- ThemeToggle added to `components/layout/header.tsx` via `components/ui/theme-toggle.tsx` for instant theme switching.
- Skip-to-content link and `main` landmark wrapper added in `app/layout.tsx` to improve keyboard navigation.
- Design tokens synced in `styles/globals.css`: added semantic tokens `--success`, `--warning`, `--info` (+ foregrounds) for light/dark, mapped to `--color-*` aliases; added base focus-visible styles and reduced-motion handling.
- Added `components/ui/breadcrumbs.tsx` and integrated on `app/resources/page.tsx`, `app/news/page.tsx`, and `app/news-events/page.tsx`.

---

## Scope
- Include: All routes under `app/` excluding `app/admin/**` and admin APIs.
- Exclude: Admin Portal routes (spec: `docs/portal-redesign-spec.md`).

---

## Goals
- Modern 2025 UX across public pages with WCAG 2.2 AA+.
- Strong information architecture, discoverability, and search.
- Consistent theming and brand alignment with the Portal.
- Excellent performance, instant theme switch, no layout shift.
- SEO-ready with semantic markup and metadata.

---

## Route Inventory (from `app/`)
- Core shell: `layout.tsx`, `globals.css`, `loading.tsx`, `error.tsx`, `not-found.tsx`
- System: `manifest.ts`, `robots.ts`, `sitemap.ts`
- Root: `/` → `app/page.tsx`
- Sections:
  - `/about` → `app/about/`
  - `/blog` → `app/blog/`
  - `/community` → `app/community/`
  - `/contact` → `app/contact/`
  - `/contribute` → `app/contribute/`
  - `/faculty` → `app/faculty/`
  - `/gpa-calculator` → `app/gpa-calculator/` (incl. `cumulative/`)
  - `/guidance` → `app/guidance/`
  - `/help` → `app/help/`
  - `/legal` → `app/legal/`
  - `/lost-found` → `app/lost-found/`
  - `/news` → `app/news/`
  - `/news-events` → `app/news-events/`
  - `/past-papers` → `app/past-papers/`
  - `/privacy` → `app/privacy/`
  - `/profile` → `app/profile/` (may require auth but is outside admin)
  - `/report-issue` → `app/report-issue/`
  - `/resources` → `app/resources/`
  - `/student-support` → `app/student-support/`
  - `/support` → `app/support/`
  - `/terms` → `app/terms/`
  - `/timetable` → `app/timetable/`
  - `/timetables` → `app/timetables/`

---

## Information Architecture & Navigation
- Global Header
  - Primary nav (order): Home, Past Papers, Resources, News & Events, Faculty, GPA Calculator, Timetable
  - Utilities: Search entry, Theme Toggle, Auth (Sign In/Profile), Admin (if role)
  - Active state: aria-current="page" and visual highlight (implemented)
  - Mobile: collapsible sheet with the same structure and descriptions (implemented)
- Global Footer
  - Columns: About, Resources, Support, Legal, Community
  - Include contact, policies, GitHub, sitemap link
  - Copyright line + last updated year
- Breadcrumbs
  - Show on pages deeper than 1 level or with filters: `resources`, `past-papers`, `news/[id]`
  - Structure: Home > Section > Page/ID
  - Include JSON-LD (already present) + visual breadcrumbs component
- Search
  - Global search affordance in Header opens the `/search` route. A command palette is available globally (Cmd/Ctrl+K, or `/` when not typing).
  - Header search button shows a tooltip "Search (Ctrl/⌘ K)" and exposes `aria-keyshortcuts`.
  - Section-scoped search bars remain on `resources`, `past-papers`, `news-events`.

---

## Design System & Theming
- Share base tokens with Portal (colors, radii, spacing, typography) via CSS variables in `styles/globals.css`.
- Theme: light/dark/system with pre-injection to avoid FOUC/CLS.
- Motion: subtle 120–200ms, respect `prefers-reduced-motion`.

---

## Accessibility
- Semantic landmarks across pages (`header`, `nav`, `main`, `footer`).
- Focus states, skip-to-content, keyboard navigability.
- Form a11y on contact/contribute/report-issue (labels, errors, ARIA).
- Color contrast AA+ across themes.

---

## Route-by-Route Audit Log

Pages reviewed in this phase. Track issues, decisions, and follow-ups.

### /resources (`app/resources/page.tsx`)
- Findings:
  - Loading state uses `CenteredLoader` — good. Error message shows plain text; consider `role="alert"`.
  - Filters use `AdvancedFilterBar`; ensure selects have accessible labels and proper focus order.
  - Breadcrumb JSON-LD present — good. Page-level Footer deduped (Footer now global).
- Actions:
  - Add `aria-live="polite"` for async status and `role="alert"` for errors.
  - Ensure select triggers have `aria-label` or visible label. Verify keyboard navigation order.

### /news-events (`app/news-events/page.tsx`)
- Findings:
  - Data fetched client-side; loading handled by `CenteredLoader`.
  - Filters are button groups; ensure `aria-pressed` reflects selection.
  - Category badge variants rely on color; verify contrast in both themes.
  - Breadcrumb JSON-LD present. No duplicate Footer.
- Actions:
  - Toggle buttons: add `aria-pressed={newsFilter===...}` and `aria-pressed={eventsFilter===...}`.
  - Audit contrast tokens for `destructive/secondary/outline` on badges.
  - Consider SSR/ISR for SEO if content is public and stable.

### /news (`app/news/page.tsx`)
- Findings:
  - Uses plain "Loading…" text — inconsistent with site loader.
  - Pagination buttons are accessible but need aria labels; ensure focus visibility.
  - Breadcrumb JSON-LD present. Footer deduped.
- Actions:
  - Replace loading text with `CenteredLoader`.
  - Add `aria-label` to pagination controls and `aria-live` for page changes.
  - Add empty state messaging announced to AT.

---

## Performance & SEO
- Budgets: initial route JS < 150KB gz; images optimized via `next/image`.
- Metadata: per-page `generateMetadata` or static metadata.
- SSG/ISR as applicable; SWR for live sections (news/resources).
- Sitemap/robots accurate; OpenGraph/Twitter cards.

---

## Content & Components
- Components: hero, section header, card grid, list, data table (light), filters/tags, forms, pagination, breadcrumbs, tabs, accordion, callouts.
- Content sources: `lib/**` mocks and Supabase-backed areas (community). Migrate to unified data providers per section.

---

## Critical Flows
- Search and filter (resources, past papers, news/events, faculty).
- Contact and report-issue forms with validation and toasts.
- Contribution flows (where applicable) with moderation cues.

---

## Rollout Plan
- Phase 1: Shell + Global Nav/Footer + Theme + Tokens.
- Phase 2: High-traffic pages (Home, Resources, Past Papers, News/Events).
- Phase 3: Tools (GPA Calculator), Community, Faculty.
- Phase 4: Remaining sections, polish, accessibility/performance passes.
- Phase 5: QA, visual regression, launch.

---

## Acceptance Criteria
- Navigation consistent and responsive across all pages.
- Theming instant with no CLS; brand parity with Portal.
- Pages pass WCAG 2.2 AA automated checks and keyboard review.
- Lighthouse scores: PWA not required, but Perf/Best/SEO > 90 on key pages.
- No console errors; hydration warnings resolved.

---

## Open Questions
- Any sections to deprecate/merge? (e.g., `timetable` vs `timetables`)
- Central search requirements and ranking rules?
- Analytics stack (privacy-compliant) and KPIs for public site?
- Content editing workflow (CMS vs. code-driven) for news/events?
