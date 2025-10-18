# 🎨 Glassmorphism Quick Reference

## Instant Copy-Paste Examples

### Basic Glass Card
```tsx
<div className="glass-card">
  <h2>Card Title</h2>
  <p>Card content</p>
</div>
```

### Glass Button
```tsx
<button className="glass-button-primary">Click Me</button>
```

### Glass Input
```tsx
<input 
  className="glass-input" 
  placeholder="Enter text..."
/>
```

### Glass Navigation
```tsx
<nav className="glass-nav-sticky">
  <div className="container">
    {/* Nav content */}
  </div>
</nav>
```

---

## CSS Variables Cheatsheet

### Colors (Use with `rgb()` or `rgba()`)
```css
rgb(var(--color-brand-primary))           /* Blue */
rgba(var(--color-brand-primary), 0.5)     /* 50% Blue */
```

### Glass Backgrounds
```css
var(--glass-bg-card)          /* Standard card */
var(--glass-bg-elevated)      /* Raised surface */
var(--glass-bg-subtle)        /* Subtle background */
```

### Blur Levels
```css
var(--glass-blur-sm)     /* 4px  - Subtle */
var(--glass-blur-md)     /* 8px  - Light */
var(--glass-blur-lg)     /* 12px - Medium */
var(--glass-blur-xl)     /* 16px - Strong (default) */
var(--glass-blur-2xl)    /* 24px - Very strong */
var(--glass-blur-3xl)    /* 32px - Maximum */
```

### Spacing (8px grid)
```css
var(--space-2)    /* 8px */
var(--space-4)    /* 16px */
var(--space-6)    /* 24px */
var(--space-8)    /* 32px */
```

### Border Radius
```css
var(--radius-lg)     /* 12px */
var(--radius-xl)     /* 16px */
var(--radius-2xl)    /* 20px (recommended) */
var(--radius-3xl)    /* 24px */
```

### Shadows
```css
var(--glass-shadow-sm)    /* Subtle */
var(--glass-shadow-md)    /* Standard */
var(--glass-shadow-lg)    /* Prominent */
```

---

## Custom Component Template

```css
/* MyComponent.module.css */

.container {
  /* Glass effect */
  background: var(--glass-bg-card);
  -webkit-backdrop-filter: blur(var(--glass-blur-xl));
  backdrop-filter: blur(var(--glass-blur-xl));
  
  /* Border */
  border: 1px solid var(--glass-border-base);
  border-radius: var(--radius-2xl);
  
  /* Spacing */
  padding: var(--space-6);
  
  /* Shadow */
  box-shadow: var(--glass-shadow-md);
  
  /* Transition */
  transition: all var(--transition-medium) var(--ease-in-out);
}

.container:hover {
  background: var(--glass-hover-bg);
  box-shadow: var(--glass-hover-shadow);
  transform: translateY(-2px);
}

.title {
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--space-3);
}

.description {
  color: var(--text-secondary);
  line-height: 1.6;
}
```

---

## Utility Class Combos

### Feature Card
```tsx
<div className="glass-card glass-blue">
  <h3>Feature Title</h3>
  <p>Description</p>
  <button className="glass-button-primary">Learn More</button>
</div>
```

### Stats Widget
```tsx
<div className="glass-card-subtle">
  <div className="flex items-center gap-4">
    <div className="glass-badge">+25%</div>
    <div>
      <h4>Active Users</h4>
      <p>1,234</p>
    </div>
  </div>
</div>
```

### Modal
```tsx
<div className="glass-modal-backdrop">
  <div className="glass-modal">
    <h2>Modal Title</h2>
    <p>Modal content</p>
    <div className="flex gap-3">
      <button className="glass-button">Cancel</button>
      <button className="glass-button-primary">Confirm</button>
    </div>
  </div>
</div>
```

---

## Light vs Dark Differences

### Light Mode
- **Opacity:** 60-85% (more opaque)
- **Backgrounds:** White-based
- **Borders:** Subtle white
- **Shadows:** Soft, warm
- **Text:** Dark on light

### Dark Mode  
- **Opacity:** 40-60% (more transparent)
- **Backgrounds:** Dark slate-based
- **Borders:** Brighter for visibility
- **Shadows:** Deep + glow effects
- **Text:** Light on dark

---

## Common Patterns

### Hero Section
```tsx
<section className="glass-panel-overlay">
  <div className="container">
    <h1>Hero Title</h1>
    <p>Hero description</p>
    <button className="glass-button-primary">Get Started</button>
  </div>
</section>
```

### Form
```tsx
<form className="glass-panel">
  <div className="fieldGroup">
    <label className="label">Email</label>
    <input type="email" className="glass-input" />
  </div>
  <button type="submit" className="glass-button-primary buttonFull">
    Submit
  </button>
</form>
```

### Grid of Cards
```tsx
<div className="grid-cols-3">
  {items.map(item => (
    <div key={item.id} className="glass-card">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  ))}
</div>
```

---

## Troubleshooting

### Glass effect not visible?
✅ Ensure parent has background/image  
✅ Check opacity isn't too high  
✅ Verify browser supports backdrop-filter

### Text not readable?
✅ Use `--text-on-glass` variables  
✅ Increase background opacity  
✅ Add subtle text shadow if needed

### Performance slow?
✅ Reduce blur amount  
✅ Limit number of glass elements  
✅ Use simpler shadows

---

## Browser Support

- ✅ Chrome 76+
- ✅ Safari 9+
- ✅ Firefox 103+
- ✅ Edge 79+

*Note: `-webkit-backdrop-filter` included for Safari*

---

**Full Documentation:** `docs/GLASSMORPHISM_DESIGN_SYSTEM.md`
