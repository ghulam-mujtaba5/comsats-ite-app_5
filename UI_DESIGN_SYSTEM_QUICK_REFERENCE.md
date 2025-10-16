# 🎨 6-Level Design System - Quick Reference
## CampusAxis UI Standards Cheat Sheet

---

## 📐 THE 6 LEVELS

### Level 1: 🩶 Minimalist SaaS (Base Layout)
**Purpose:** Overall structure, grids, spacing, typography

**Classes to Use:**
```tsx
container mx-auto max-w-7xl
px-4 py-12
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
text-3xl md:text-5xl lg:text-7xl font-bold
```

**When to Apply:** Every page, all structural elements

---

### Level 2: 🧊 Glassmorphism (Surface Components)
**Purpose:** Panels, cards, modals - depth and modernity

**Classes to Use:**
```tsx
glass-card glass-border-light glass-hover
backdrop-blur-sm backdrop-blur-3xl
bg-white/60 dark:bg-slate-900/60
border border-white/30 dark:border-slate-700/30
```

**When to Apply:** Cards, panels, modals, overlays

---

### Level 3: ☁️ Neumorphism (Interactive Elements)
**Purpose:** Buttons, toggles, inputs - tactile feel

**Classes to Use:**
```tsx
rounded-xl rounded-2xl rounded-3xl
shadow-clean-lg shadow-xl
hover-lift
transition-all duration-300
border border-white/30
```

**When to Apply:** Buttons, inputs, switches, interactive cards

---

### Level 4: ⚡ AI Interface (Accent & Motion)
**Purpose:** CTAs, AI sections, charts - gradients and glow

**Classes to Use:**
```tsx
bg-gradient-to-r from-primary to-blue-600
bg-gradient-to-br from-blue-500/20 to-cyan-500/20
animate-pulse
blur-3xl opacity-50
group-hover:scale-110 transition-transform
```

**When to Apply:** Hero sections, stat cards, CTAs, highlights

---

### Level 5: 🧭 Flat Design 3.0 (Supporting Visual)
**Purpose:** Icons, secondary pages, low-priority UI

**Classes to Use:**
```tsx
<FileText className="h-4 w-4 text-muted-foreground" />
<Badge variant="outline">Label</Badge>
text-muted-foreground
```

**When to Apply:** Icons, badges, labels, secondary text

---

### Level 6: 🎓 CampusAxis Brand (Brand Layer)
**Purpose:** Visual balance - tech + academic aesthetic

**Colors to Use:**
```tsx
#4573df  // Megicode Blue (Primary)
from-blue-600 via-indigo-600 to-purple-600  // Brand gradient
text-primary
bg-gradient-to-r from-primary/10 to-blue-500/10
```

**When to Apply:** Brand elements, primary accents, hero sections

---

## 🎯 PRACTICAL EXAMPLES

### Dashboard Card (All Levels Combined)
```tsx
<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
  {/* Level 4: Background gradient */}
  
  <div className="container mx-auto max-w-7xl px-4 py-12">
    {/* Level 1: Base layout */}
    
    <Card className="glass-card glass-border-light glass-hover rounded-2xl hover-lift transition-all duration-300">
      {/* Level 2: Glassmorphism */}
      {/* Level 3: Neumorphism (rounded, shadow, hover) */}
      
      <CardContent className="flex items-center gap-4 p-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-300/30 text-blue-500 group-hover:scale-110 transition-transform">
          {/* Level 4: Gradient accent, animation */}
          
          <FileText className="h-6 w-6" />
          {/* Level 5: Flat icon */}
        </div>
        
        <div>
          <div className="text-2xl font-bold text-foreground">
            {/* Level 6: Brand typography */}
            42
          </div>
          <div className="text-xs text-muted-foreground">
            {/* Level 5: Secondary text */}
            Your Posts
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</div>
```

### Hero Section (Full Implementation)
```tsx
<div className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50 dark:from-slate-950 dark:to-blue-950">
  {/* Level 4: Background */}
  
  {/* Animated gradient orbs */}
  <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
  {/* Level 4: Accent layer */}
  
  <div className="container mx-auto max-w-7xl px-4 py-16">
    {/* Level 1: Structure */}
    
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 mb-6">
      {/* Level 2: Glass badge */}
      {/* Level 3: Rounded */}
      {/* Level 4: Gradient */}
      
      <User className="h-4 w-4 text-primary" />
      {/* Level 5: Icon */}
      
      <span className="text-sm font-medium text-primary">
        {/* Level 6: Brand color */}
        Student Dashboard
      </span>
    </div>
    
    <h1 className="text-5xl lg:text-7xl font-bold mb-6">
      {/* Level 1: Typography */}
      
      Welcome to{" "}
      <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
        {/* Level 4: Gradient text */}
        {/* Level 6: Brand gradient */}
        CampusAxis
      </span>
    </h1>
  </div>
</div>
```

---

## ✅ CHECKLIST FOR NEW PAGES

### Before Creating a New Page:

- [ ] **Level 1:** Add container and grid structure
- [ ] **Level 1:** Set responsive breakpoints (md:, lg:)
- [ ] **Level 1:** Define typography hierarchy
- [ ] **Level 2:** Apply glass-card to main sections
- [ ] **Level 2:** Add backdrop-blur effects
- [ ] **Level 3:** Use rounded-xl/2xl for corners
- [ ] **Level 3:** Add shadow effects
- [ ] **Level 3:** Include hover-lift transitions
- [ ] **Level 4:** Add gradient backgrounds
- [ ] **Level 4:** Include animated elements
- [ ] **Level 4:** Add glow effects to icons
- [ ] **Level 5:** Use Lucide icons consistently
- [ ] **Level 5:** Add simple badges/labels
- [ ] **Level 6:** Use primary brand color (#4573df)
- [ ] **Level 6:** Include brand gradients
- [ ] **Level 6:** Balance tech + academic aesthetics

---

## 🎨 COLOR PALETTE

### Primary Colors
```tsx
--primary: #4573df           // Megicode Blue
--foreground: hsl(0 0% 10%)  // Dark text (light mode)
--background: hsl(0 0% 100%) // Light bg (light mode)
```

### Gradients
```tsx
// Brand gradient
from-blue-600 via-indigo-600 to-purple-600

// Stat card gradients
from-blue-500/20 to-cyan-500/20      // Blue
from-amber-500/20 to-orange-500/20   // Orange
from-purple-500/20 to-pink-500/20    // Purple
from-green-500/20 to-emerald-500/20  // Green
```

### Glassmorphism
```tsx
bg-white/60 dark:bg-slate-900/60              // Light glass
bg-white/80 dark:bg-slate-800/80              // Medium glass
bg-white/95 dark:bg-slate-800/95              // Heavy glass
border border-white/30 dark:border-slate-700/30
```

---

## 🚀 QUICK START TEMPLATES

### Basic Page Template
```tsx
export default function MyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Page <span className="text-primary">Title</span>
          </h1>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="glass-card glass-border-light rounded-2xl">
            <CardContent className="p-6">
              {/* Stat content */}
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <Card className="glass-card rounded-2xl">
          <CardHeader>
            <CardTitle>Section Title</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Content */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

---

## 📚 REFERENCE PAGES

**Study these pages for best practices:**

- **Homepage** - Glassmorphism mastery
- **Faculty** - Complete design system
- **Profile** - Gamification UI
- **Resources** - Card design excellence
- **Dashboard** - All levels combined

---

**Quick Reference Created:** October 16, 2025  
**Status:** ✅ Production Ready
