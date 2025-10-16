# Deprecated CSS Classes Documentation

This document lists all the legacy CSS glassmorphism classes that have been deprecated and replaced with the new unified system.

## Legacy Glass Classes (Deprecated)

The following glassmorphism classes have been deprecated and should no longer be used:

### Primary Glass Classes
| Deprecated Class | Replacement Class | Reason |
|------------------|-------------------|--------|
| `.glass-light` | `.glass-subtle` | Simplified naming system |
| `.glass-medium` | `.glass-secondary` | Simplified naming system |
| `.glass-strong` | `.glass-primary` | Simplified naming system |
| `.glass-premium` | `.glass-primary` | Consolidated into primary class |
| `.glass-ultra` | `.glass-primary` | Consolidated into primary class |
| `.glass-card` | `.glass-secondary` | Consolidated into secondary class |
| `.glass-card-premium` | `.glass-primary` | Consolidated into primary class |
| `.glass-nav` | `.glass-primary` | Consolidated into primary class |
| `.glass-modal` | `.glass-primary` | Consolidated into primary class |
| `.glass-hero` | `.glass-primary` | Consolidated into primary class |

### Effect Classes
| Deprecated Class | Replacement | Reason |
|------------------|-------------|--------|
| `.glass-floating` | `.glass-secondary` + animation | Effects now handled via utility classes |
| `.glass-layered` | `.glass-primary` + pseudo-elements | Effects now handled via utility classes |
| `.glass-depth` | `.glass-primary` + pseudo-elements | Effects now handled via utility classes |
| `.glass-gradient` | `.glass-primary` + pseudo-elements | Effects now handled via utility classes |
| `.glass-hover-glow` | `.glass-interactive` + pseudo-elements | Effects now handled via utility classes |
| `.glass-shimmer` | `.glass-secondary` + animation | Effects now handled via utility classes |
| `.glass-noise` | `.glass-secondary` | Effects now handled via utility classes |
| `.glass-professional` | `.glass-primary` | Effects now handled via utility classes |

### Border Classes
| Deprecated Class | Replacement | Reason |
|------------------|-------------|--------|
| `.glass-border-subtle` | New utility system | Replaced with border utility classes |
| `.glass-border-light` | New utility system | Replaced with border utility classes |
| `.glass-border-glow` | New utility system | Replaced with border utility classes |

### Interactive Classes
| Deprecated Class | Replacement | Reason |
|------------------|-------------|--------|
| `.glass-hover` | `.glass-interactive` | Simplified naming system |
| `.glass-interactive` | New utility system | Now part of the core interactive class |

## New Simplified Glass System

The new system uses only 4 core classes:

1. `.glass-primary` - High emphasis elements (heroes, major CTAs)
2. `.glass-secondary` - Medium emphasis elements (feature cards, content)
3. `.glass-subtle` - Low emphasis elements (backgrounds, dividers)
4. `.glass-interactive` - Interactive elements (buttons, clickable cards)

## Migration Path

To migrate from legacy classes to the new system:

1. Replace legacy glass classes with the appropriate new class from the mapping above
2. Use utility classes for effects instead of dedicated effect classes
3. Use the new border utility classes for border styles
4. Use the new animation utility classes for animations

## Example Migrations

### Before (Legacy)
```html
<div class="glass-card-premium glass-border-glow glass-hover-glow glass-gradient">
  Content
</div>
```

### After (New System)
```html
<div class="glass-primary glass-border-glow glass-interactive">
  Content
</div>
```

### Before (Legacy)
```html
<div class="glass-card glass-border-light glass-hover glass-gradient">
  Content
</div>
```

### After (New System)
```html
<div class="glass-secondary glass-border-light glass-interactive">
  Content
</div>
```

## Component Updates

All UI components have been updated to use the new glassmorphism utility functions:
- Button component uses `getEnhancedGlassClasses` with presets
- Card component uses `getEnhancedGlassClasses` with presets
- Badge component uses `getEnhancedGlassClasses` with presets
- Shared GlassCard component uses the new utility system

## CSS Variables

The new system uses CSS variables for consistent styling across light and dark modes:

```css
--glass-blur-sm: 8px;
--glass-blur-md: 12px;
--glass-blur-lg: 16px;
--glass-blur-xl: 20px;
--glass-saturation: 150%;
--glass-brightness: 110%;
--glass-border-opacity: 0.15;
--glass-bg-opacity: 0.25;
--glass-shadow-opacity: 0.10;
```

These variables automatically adapt for dark mode:

```css
.dark {
  --glass-saturation: 140%;
  --glass-brightness: 105%;
  --glass-border-opacity: 0.12;
  --glass-bg-opacity: 0.18;
  --glass-shadow-opacity: 0.20;
}
```