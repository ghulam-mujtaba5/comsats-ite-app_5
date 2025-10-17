# Styling Guide

This project follows a Tailwind-first, token-driven design with component-level CSS Modules for maintainability. This guide explains how to structure styles, support light/dark mode, and keep UI consistent.

## Principles

- Utilities first: prefer Tailwind classes in JSX for simple styling.
- Extract when repeated: if a utility group repeats or becomes long, move it into a `.module.css` file and compose with `@apply`.
- Token-driven theming: use CSS variables (defined in `app/globals.css`) via `hsl(var(--token))` to ensure light/dark parity and accessibility.
- Co-locate styles: each component can have a sibling `ComponentName.module.css` with only the styles unique to that component.

## File structure

- Global tokens, resets, and utilities: `app/globals.css`
- Component styles: `components/**/Component.module.css`
- Page-specific overrides (only if necessary): `app/route/route.module.css`

## Theming

The app uses `next-themes` via `components/theme-provider.tsx`. Theme class is set on `<html>` and tokens in `globals.css` ensure colors adapt automatically.

Use tokens like:

- Backgrounds: `bg-[hsl(var(--background))]` or Tailwind semantic classes already mapped
- Text: `text-foreground`, `text-muted-foreground`
- Surfaces: `bg-card`, `border-border`
- Brand: `text-primary`, `bg-primary`, `ring-primary`

Prefer existing utility classes over hard-coded colors.

## CSS Modules with Tailwind

In a module file:

```css
.example {
  @apply p-4 rounded-xl bg-card text-foreground shadow;
}
```

In the component:

```tsx
import styles from './Component.module.css'
<div className={styles.example}>...</div>
```

Keep selectors flat; avoid deep element/type selectors in modules.

## Accessibility and motion

- Respect `reduce motion` by using global utilities already present (see `globals.css`).
- Use focus styles: `focus-visible:ring-2 focus-visible:ring-primary` or existing `.focus-ring-campus`.

## Do’s and Don’ts

- Do: use tokens and semantic utilities for colors.
- Do: group repeated utility sets in modules with `@apply`.
- Do: keep component styles local; avoid adding one-off globals.
- Don’t: hardcode hex colors in components.
- Don’t: duplicate global utilities in modules.

## Example: Enhanced FAQ

See `components/home/enhanced-faq.module.css` for a sample of extracting repeated utility groups (cards, stats grid, accordion items) into scoped classes.

## App Router pages: page-level modules

For routes under `app/*/page.tsx`, prefer a small page-level CSS Module for structural layout while keeping visuals in JSX utilities:

  - `styles.page`, `styles.main`, `styles.container`
  - `styles.header`, `styles.statGrid`, `styles.cardsGrid` (names can vary per page)

This pattern is applied for: News & Events, Past Papers, Faculty, Community, and Admin dashboard.

## Three-layer CSS Modules approach

To simplify styling and improve light/dark mode consistency, we use three layers of CSS Modules:

- Component-level modules: co-located with components for small, isolated structural rules.
- Page-level modules: co-located with app pages for page-specific structure (wrappers, grids unique to that page).
- Common structural module: `app/styles/common.module.css` provides shared primitives like `.section`, `.spaceY6`, `.spaceY8`, `.twoCol`, `.threeCol`, `.cardsGrid`, `.statGrid`.

Guidelines
- Keep modules plain CSS only; avoid Tailwind `@apply` in modules due to Tailwind v4/PostCSS constraints here.
- Continue to use tokens/utilities (colors, glass, gradients) in JSX className to preserve theme parity.
- Prefer common primitives for wrappers/spacing; use page or component modules only when layout diverges.

Light/Dark best practices
- Rely on semantic tokens defined in globals for color and surface; keep structural CSS neutral.
- Use `next-themes` at the app root (attribute="class") and ensure components render with token-based utility classes.
- Avoid hard-coded colors in modules; if necessary, pick currentColor or neutral surfaces.
