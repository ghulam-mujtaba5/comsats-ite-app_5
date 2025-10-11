# 🎯 Quick Glassmorphism Migration Script

This document outlines automatic replacements to update all card components to use advanced 2025 glassmorphism.

## Replacement Patterns

### Pattern 1: card-modern to glass-card-premium
**Find:**
```
className="card-modern border-0 backdrop-blur-sm
```

**Replace with:**
```
className="glass-card-premium glass-border-glow glass-hover glass-noise
```

### Pattern 2: Simple backdrop-blur to glass-card
**Find:**
```
backdrop-blur-sm shadow-lg
```

**Replace with:**
```
glass-card glass-hover glass-border-subtle
```

### Pattern 3: Enhanced cards with hover
**Find:**
```
card-modern border-0 backdrop-blur-sm shadow-xl hover:shadow-2xl
```

**Replace with:**
```
glass-card-premium glass-hover-glow glass-border-glow glass-shimmer
```

### Pattern 4: Simple glass-card to glass-card-premium
**Find:**
```
glass-card border border-white/20 dark:border-white/10
```

**Replace with:**
```
glass-card-premium glass-border-light glass-hover-glow
```

### Pattern 5: Background gradients
**Find:**
```
bg-gradient-to-br from-background via-muted/20 to-background
```

**Replace with:**
```
bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/20 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/20
```

### Pattern 6: Navigation items
**Find:**
```
hover:bg-white/60 dark:hover:bg-slate-800/60 backdrop-blur-sm
```

**Replace with:**
```
glass-light glass-hover glass-interactive
```

### Pattern 7: Modal/Dialog backgrounds
**Find:**
```
bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl
```

**Replace with:**
```
glass-modal glass-noise
```

### Pattern 8: Button hover effects
**Find:**
```
hover:bg-white/60 dark:hover:bg-slate-800/60
```

**Replace with:**
```
glass-button glass-hover glass-interactive
```

### Pattern 9: Input fields
**Find:**
```
bg-background/50 backdrop-blur-sm
```

**Replace with:**
```
glass-input
```

### Pattern 10: Badge components
**Find:**
```
bg-primary/10 border-primary/20
```

**Replace with:**
```
glass-light glass-border-subtle border-primary/30
```

## Advanced Combinations

### Premium Feature Cards
```tsx
<Card className="glass-card-premium glass-border-glow glass-hover-glow glass-noise glass-depth rounded-3xl">
  <CardHeader className="glass-subtle glass-border-subtle pb-6">
    {/* Header content */}
  </CardHeader>
  <CardContent className="relative">
    {/* Card content */}
  </CardContent>
</Card>
```

### Interactive Dashboard Cards
```tsx
<Card className="glass-card glass-hover glass-interactive glass-border-light rounded-2xl">
  <CardContent className="p-6">
    {/* Stats or data */}
  </CardContent>
</Card>
```

### Hero Section Panels
```tsx
<div className="glass-hero glass-border-glow glass-gradient glass-noise rounded-3xl p-12">
  {/* Hero content */}
</div>
```

### Navigation Bars
```tsx
<nav className="glass-nav glass-border-subtle sticky top-0 z-50">
  {/* Nav items */}
</nav>
```

### Modals/Dialogs
```tsx
<Dialog>
  <DialogContent className="glass-modal glass-border-light glass-noise rounded-3xl">
    {/* Modal content */}
  </DialogContent>
</Dialog>
```

### Sidebar Panels
```tsx
<aside className="glass-sidebar glass-border-subtle h-screen">
  {/* Sidebar content */}
</aside>
```

## Implementation Checklist

- [ ] Replace all `card-modern` with `glass-card-premium`
- [ ] Update all `backdrop-blur-sm` to appropriate glass variants
- [ ] Add `glass-hover` to interactive elements
- [ ] Add `glass-noise` to premium/featured elements
- [ ] Add `glass-border-glow` to important cards
- [ ] Add `glass-shimmer` to loading states
- [ ] Add `glass-interactive` to clickable elements
- [ ] Add `glass-gradient` to hero sections
- [ ] Update navigation to `glass-nav`
- [ ] Update modals to `glass-modal`
- [ ] Test dark mode compatibility
- [ ] Test mobile performance
- [ ] Verify accessibility (text contrast)
- [ ] Test with reduced motion preferences

## Testing Commands

```bash
# Test build
pnpm build

# Test development server
pnpm dev

# Test for accessibility
# Check console for contrast warnings
```

## Performance Monitoring

After applying glassmorphism:
1. Check Chrome DevTools Performance tab
2. Ensure 60 FPS during scrolling
3. Monitor memory usage (<100MB increase)
4. Test on mobile devices
5. Use Lighthouse for performance score

## Rollback Plan

If performance issues occur:
1. Replace `glass-card-premium` with `glass-card`
2. Remove `glass-noise` from large elements
3. Reduce `backdrop-blur-3xl` to `backdrop-blur-xl`
4. Remove `glass-shimmer` animations
5. Simplify border effects

## Files Updated

- ✅ `components/layout/header.tsx`
- ✅ `components/layout/footer.tsx`
- ✅ `components/home/hero-section.tsx`
- ⏳ `app/past-papers/*.tsx`
- ⏳ `app/faculty/*.tsx`
- ⏳ `app/news/*.tsx`
- ⏳ `app/resources/*.tsx`
- ⏳ `app/admin/**/*.tsx`
- ⏳ `app/community/*.tsx`
- ⏳ `app/profile/*.tsx`

## Notes

- All glass effects are GPU-accelerated
- Supports prefers-reduced-motion
- Compatible with all modern browsers
- Degrades gracefully on older browsers
- Dark mode fully supported
