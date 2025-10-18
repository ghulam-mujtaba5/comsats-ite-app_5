# UI/UX Migration Guide

## 🎯 Purpose
This guide helps you migrate existing CampusAxis pages to the new modern design system.

## 📋 Migration Checklist

### Phase 1: Setup ✅ (COMPLETED)
- [x] Install Tailwind Config
- [x] Update globals.css
- [x] Add utility classes
- [x] Create new components
- [x] Update theme toggle

### Phase 2: Component Migration (RECOMMENDED)

#### Step 1: Update Buttons
**Before**:
```tsx
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
  Click Me
</button>
```

**After**:
```tsx
<Button className="campus-btn-primary">
  Click Me
</Button>
```

#### Step 2: Update Cards
**Before**:
```tsx
<div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
  Content
</div>
```

**After**:
```tsx
<Card className="campus-card-primary">
  <CardContent>
    Content
  </CardContent>
</Card>
```

#### Step 3: Update Hero Sections
**Before**:
```tsx
<section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600">
  <h1>Welcome</h1>
  <p>Description</p>
  <button>Get Started</button>
</section>
```

**After**:
```tsx
<ModernHero
  badge="Welcome"
  title="Welcome to CampusAxis"
  description="Your academic success partner"
  primaryCTA={{ text: "Get Started", href: "/start" }}
  stats={[
    { label: "Students", value: "10K+" }
  ]}
/>
```

#### Step 4: Update Feature Sections
**Before**:
```tsx
<div className="grid grid-cols-3 gap-4">
  {features.map(feature => (
    <div key={feature.id} className="bg-white p-6 rounded-lg">
      <Icon className="w-8 h-8" />
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
    </div>
  ))}
</div>
```

**After**:
```tsx
<ModernFeatureGrid>
  {features.map((feature, index) => (
    <ModernFeatureCard
      key={feature.id}
      icon={feature.icon}
      title={feature.title}
      description={feature.description}
      gradient={index % 3 === 0 ? "primary" : index % 3 === 1 ? "secondary" : "accent"}
      delay={index * 0.1}
    />
  ))}
</ModernFeatureGrid>
```

### Phase 3: Page-by-Page Migration

#### Homepage (`app/page.tsx`)
**Priority**: HIGH
**Estimated Time**: 2-3 hours

**Tasks**:
1. Replace hero with `<ModernHero />`
2. Update feature cards to `<ModernFeatureCard />`
3. Add glassmorphism to sections
4. Update button styles
5. Test in both themes

**Example**:
```tsx
import { ModernHero } from "@/components/shared/modern-hero"
import { ModernFeatureCard, ModernFeatureGrid } from "@/components/shared/modern-feature-card"
import { BookOpen, Calculator, Users, GraduationCap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="campus-section-bg">
      <ModernHero
        badge="Welcome to CampusAxis 2025"
        title="Your Ultimate Academic Companion"
        description="Access past papers, calculate GPA, connect with peers"
        primaryCTA={{ text: "Get Started", href: "/signup" }}
        secondaryCTA={{ text: "Learn More", href: "/about" }}
        stats={[
          { label: "Active Students", value: "10K+" },
          { label: "Past Papers", value: "5K+" },
          { label: "Resources", value: "2K+" },
          { label: "Avg Rating", value: "4.8" },
        ]}
      />
      
      <section className="campus-section campus-container">
        <h2 className="campus-heading text-responsive-title text-center mb-12">
          Platform Features
        </h2>
        
        <ModernFeatureGrid>
          <ModernFeatureCard
            icon={BookOpen}
            title="Past Papers"
            description="Access thousands of past papers from all departments"
            gradient="primary"
            href="/past-papers"
          />
          <ModernFeatureCard
            icon={Calculator}
            title="GPA Calculator"
            description="Calculate your semester and cumulative GPA"
            gradient="secondary"
            href="/gpa-calculator"
          />
          <ModernFeatureCard
            icon={Users}
            title="Community"
            description="Connect with fellow COMSATS students"
            gradient="accent"
            href="/community"
          />
          <ModernFeatureCard
            icon={GraduationCap}
            title="Faculty Reviews"
            description="Read honest reviews from students"
            gradient="primary"
            href="/faculty"
          />
        </ModernFeatureGrid>
      </section>
    </div>
  )
}
```

#### About Page
**Priority**: MEDIUM
**Tasks**:
1. Add hero section
2. Update content cards
3. Apply glassmorphism
4. Update team section

#### Resources/Past Papers
**Priority**: HIGH
**Tasks**:
1. Update filter sidebar (glassmorphism)
2. Modernize paper cards
3. Add smooth animations
4. Update search input

#### Profile/Dashboard
**Priority**: MEDIUM
**Tasks**:
1. Update stat cards
2. Add glassmorphism to panels
3. Modernize charts
4. Update navigation

### Phase 4: Component-by-Component Updates

#### Update All Cards
Find: `className="bg-white dark:bg-gray-800"`
Replace with: `className="campus-card-primary"` or `glass-secondary`

#### Update All Buttons
Find: Custom button classes
Replace with: `campus-btn-primary`, `campus-btn-secondary`, or `campus-btn-ghost`

#### Update All Inputs
Find: `className="border rounded px-3 py-2"`
Replace with: `className="campus-input"`

#### Update All Badges
Find: Custom badge classes
Replace with: `campus-badge-primary`, `campus-badge-secondary`, etc.

## 🛠️ Helper Scripts

### Find & Replace Patterns

1. **Replace basic cards**:
```bash
# Find
className="bg-white dark:bg-gray-800 rounded-lg p-6"

# Replace with
className="campus-card-primary"
```

2. **Replace buttons**:
```bash
# Find
className="bg-blue-600 hover:bg-blue-700 text-white"

# Replace with
className="campus-btn-primary"
```

3. **Replace containers**:
```bash
# Find
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"

# Replace with
className="campus-container"
```

## ✅ Testing Checklist

After migrating each page, test:

- [ ] **Light Mode**: All elements visible and styled correctly
- [ ] **Dark Mode**: Perfect theme support, no broken styles
- [ ] **Theme Switch**: Smooth transitions, no flashing
- [ ] **Responsive**: Mobile, tablet, desktop layouts
- [ ] **Accessibility**: Keyboard navigation, screen readers
- [ ] **Performance**: No janky animations, smooth scrolling
- [ ] **Hover States**: All interactive elements respond
- [ ] **Focus States**: Visible focus rings on all inputs/buttons

## 🎨 Common Patterns

### Pattern 1: Hero + Features
```tsx
<div className="campus-section-bg">
  <ModernHero {...heroProps} />
  <section className="campus-section campus-container">
    <ModernFeatureGrid>
      {/* Feature cards */}
    </ModernFeatureGrid>
  </section>
</div>
```

### Pattern 2: Content with Sidebar
```tsx
<div className="campus-container campus-section">
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <aside className="lg:col-span-1">
      <div className="campus-card-secondary sticky top-4">
        {/* Sidebar content */}
      </div>
    </aside>
    <main className="lg:col-span-3">
      {/* Main content */}
    </main>
  </div>
</div>
```

### Pattern 3: Stats Display
```tsx
<div className="campus-stats-grid">
  {stats.map(stat => (
    <div className="glass-subtle rounded-lg p-6 text-center">
      <div className="text-3xl font-bold campus-gradient-text">
        {stat.value}
      </div>
      <div className="text-sm text-muted-foreground">
        {stat.label}
      </div>
    </div>
  ))}
</div>
```

### Pattern 4: Card Grid
```tsx
<div className="campus-feature-grid">
  {items.map(item => (
    <div className="campus-card-primary group cursor-pointer">
      <div className="campus-icon-wrapper mb-4">
        <item.icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
      <p className="text-muted-foreground">{item.description}</p>
    </div>
  ))}
</div>
```

## 🚫 Common Mistakes to Avoid

1. **DON'T** mix old and new styling on same page
2. **DON'T** forget to test dark mode
3. **DON'T** use arbitrary color values (use CSS variables)
4. **DON'T** ignore accessibility (focus states, aria labels)
5. **DON'T** skip responsive testing
6. **DON'T** over-animate (respect `prefers-reduced-motion`)

## ✨ Pro Tips

1. **Start with high-traffic pages** (homepage, past papers)
2. **Migrate one page at a time** to avoid breaking everything
3. **Use the new components** instead of raw HTML
4. **Leverage utility classes** for consistency
5. **Test immediately** after each change
6. **Get feedback** from users on new design
7. **Document** any custom patterns you create

## 📊 Progress Tracker

| Page | Status | Priority | Notes |
|------|--------|----------|-------|
| Homepage | 🟡 In Progress | HIGH | Replace hero section |
| Past Papers | ⚪ Not Started | HIGH | Update card grids |
| GPA Calculator | ⚪ Not Started | MEDIUM | Modernize calculator UI |
| Community | ⚪ Not Started | MEDIUM | Update post cards |
| Profile | ⚪ Not Started | MEDIUM | Update dashboard |
| Faculty | ⚪ Not Started | HIGH | Modernize review cards |
| About | ⚪ Not Started | LOW | Add hero section |
| Contact | ⚪ Not Started | LOW | Update form |

Legend:
- ⚪ Not Started
- 🟡 In Progress
- 🟢 Complete
- 🔴 Blocked

## 🔄 Continuous Improvement

As you migrate:
1. **Document new patterns** you discover
2. **Share learnings** with the team
3. **Improve components** based on real usage
4. **Gather user feedback** on new design
5. **Iterate and refine** continuously

## 📞 Need Help?

- **Design System Docs**: `/docs/DESIGN_SYSTEM.md`
- **Overhaul Guide**: `/docs/UI_UX_OVERHAUL.md`
- **Example Components**: `/components/shared/`
- **Utility Classes**: `/styles/campus-utilities.css`

---

Happy migrating! 🚀
