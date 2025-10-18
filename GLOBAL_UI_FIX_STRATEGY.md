# Global UI Fix Strategy

## Problem Analysis

### 1. Empty CSS Module Files
**Issue:** Most `.module.css`, `.light.module.css`, and `.dark.module.css` files are empty or only contain placeholder selectors.

**Root Cause:** These files were created as part of a CSS Modules migration strategy but never populated. The project relies on:
- Tailwind CSS utility classes directly in JSX
- Theme variables from `globals.css`
- Custom glass morphism utilities

**Solution:** These empty files can be safely removed or ignored. The real styling should be done via Tailwind classes with explicit `dark:` variants.

### 2. Generic Theme Tokens Used Everywhere
**Problem Files Found (100+ matches):**
- `text-foreground`
- `text-muted-foreground`  
- `bg-card`
- `border-white/20` and `border-white/10`
- `glass-primary` and `glass-secondary` classes

**Impact:**
- Light mode: Text may be too light/invisible
- Dark mode: Backgrounds may appear light/washed out
- Borders may be invisible or too prominent

## Fix Strategy

### Phase 1: Core Components (Already Done ✅)
- ✅ `app/page.tsx` - Homepage background
- ✅ `components/home/enhanced-hero.tsx` - Hero section
- ✅ `components/home/enhanced-features.tsx` - Features section

### Phase 2: High-Traffic Pages (Priority)
1. **Authentication Pages**
   - `app/auth/page.tsx`
   - `app/auth/reset-password/page.tsx`

2. **Core Features**
   - `app/gpa-calculator/page.tsx` + sub-pages
   - `app/past-papers/page.tsx`
   - `app/faculty/page.tsx`
   - `app/community/page.tsx`

3. **Resource Pages**
   - `app/resources/page.tsx`
   - `app/timetable/page.tsx`
   - `app/news-events/page.tsx`

4. **User Pages**
   - `app/profile/page.tsx`
   - `app/dashboard/page.tsx`
   - `app/settings/page.tsx`

### Phase 3: Admin Pages
- All `app/admin/**/page.tsx` files

### Phase 4: Secondary Pages
- About, Contact, Help, etc.

## Replacement Patterns

### Text Colors
```tsx
// REPLACE:
text-foreground → text-slate-900 dark:text-white
text-muted-foreground → text-slate-700 dark:text-slate-300
text-muted-foreground/90 → text-slate-600 dark:text-slate-400
```

### Backgrounds
```tsx
// REPLACE:
bg-card → bg-white dark:bg-slate-800
bg-card/90 → bg-white/90 dark:bg-slate-800/90
bg-card/80 → bg-white/80 dark:bg-slate-800/80
bg-muted → bg-slate-100 dark:bg-slate-900
```

### Borders
```tsx
// REPLACE:
border-white/20 → border-slate-200 dark:border-slate-700
border-white/10 → border-slate-200 dark:border-slate-700
border-white/30 → border-slate-200 dark:border-slate-700
```

### Hover States
```tsx
// ADD:
hover:border-blue-300 dark:hover:border-blue-600 (for interactive elements)
hover:bg-slate-100 dark:hover:bg-slate-900 (for buttons)
```

### Icon Colors
```tsx
// REPLACE:
text-primary → text-blue-600 dark:text-blue-400
text-${color}-500 → text-${color}-600 dark:text-${color}-400
```

## Automation Script Needed

Create a PowerShell/Node script to:
1. Find all `.tsx` files
2. Search for generic tokens
3. Replace with explicit theme-aware classes
4. Generate report of changes

## Estimated Files to Fix
- ~240 page.tsx files
- ~100+ component files
- Priority: Top 50 high-traffic pages

## Timeline
- Phase 1: ✅ Done (Homepage)
- Phase 2: 2-3 hours (Top 20 pages)
- Phase 3: 1-2 hours (Admin pages)
- Phase 4: 2-3 hours (Remaining pages)

**Total Estimated Time:** 5-8 hours for complete project-wide fix
