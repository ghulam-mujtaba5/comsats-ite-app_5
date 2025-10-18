# CSS Redundancy Report
Generated: 2025-10-18 16:43:14

## Summary
- Total inline transparent/opacity usage: 14
- Files affected: 5

## Top Files Needing Cleanup

### page.tsx (5 occurrences)
Path: `app\page.tsx`
 ### ui-ux-examples.tsx (2 occurrences)
Path: `lib\ui-ux-examples.tsx`
 ### error.tsx (1 occurrences)
Path: `app\error.tsx`
 ### layout.tsx (1 occurrences)
Path: `app\layout.tsx`
 ### not-found.tsx (1 occurrences)
Path: `app\not-found.tsx`


## Recommended Actions

### 1. Replace Common Inline Patterns

| Current (Inline) | Replacement (Utility Class) |
|------------------|----------------------------|
| `bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm` | `glass-card` |
| `bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl` | `glass-card-premium` |
| `bg-white/60 dark:bg-slate-800/60` | `glass-subtle` |
| `border border-slate-200 dark:border-slate-700/30` | `glass-border-light` |
| `hover:bg-white/20 dark:hover:bg-slate-700/30` | `glass-hover` |

### 2. Components Requiring Module CSS

1. **Footer** - \components/layout/footer.tsx\
2. **Header** - \components/layout/header.tsx\
3. **Navigation** - Various navigation components
4. **Cards** - Home page feature cards
5. **Modals/Dialogs** - Profile, settings dialogs

### 3. Glassmorphism Conversion

Convert all \g-transparent\ to proper opaque glassmorphism:

- âœ… Use \gba(255, 255, 255, 0.70)\ instead of \	ransparent\
- âœ… Add \ackdrop-filter: blur(16px)\
- âœ… Apply proper shadows and borders
- âœ… Use theme-specific opacity (light: 60-85%, dark: 40-60%)

## Next Steps

1. Run \ix-footer-layout.ps1\ to fix footer
2. Run \consolidate-glass-styles.ps1\ to create utility classes  
3. Update components to use new classes
4. Test light/dark mode thoroughly
