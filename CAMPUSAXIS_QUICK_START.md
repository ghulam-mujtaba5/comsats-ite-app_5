# 🚀 CAMPUSAXIS QUICK START GUIDE

**Version:** 2025.1.0  
**Last Updated:** October 16, 2025  
**Status:** ✅ Production Ready

---

## ⚡ INSTANT USAGE

### 1. Campus Primary Button

```tsx
import { Button } from '@/components/ui/button'

<Button variant="campus-primary">
  Submit Application
</Button>
```

**Features:**
- ✅ 44px minimum height
- ✅ #007BFF (light) / #1F8FFF (dark)
- ✅ Glow effect in dark mode
- ✅ Proper hover states
- ✅ WCAG AA compliant

---

### 2. Campus Secondary Button

```tsx
<Button variant="campus-secondary">
  Learn More
</Button>
```

**Features:**
- ✅ Outline style
- ✅ Brand colors
- ✅ Hover feedback
- ✅ Accessibility focused

---

### 3. Campus Badge

```tsx
import { Badge } from '@/components/ui/badge'

<Badge variant="campus">
  CampusAxis Verified
</Badge>
```

**Features:**
- ✅ Rounded-full
- ✅ Brand colors
- ✅ Proper spacing
- ✅ Smooth animations

---

### 4. Campus Alert

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'

<Alert variant="campus">
  <Info className="h-5 w-5" />
  <AlertTitle>Important Update</AlertTitle>
  <AlertDescription>
    New features are available!
  </AlertDescription>
</Alert>
```

**Features:**
- ✅ Rounded-2xl (16px)
- ✅ 8px grid spacing
- ✅ Brand colors
- ✅ Proper contrast

---

### 5. Campus Input

```tsx
import { Input } from '@/components/ui/input'

<Input 
  variant="campus" 
  placeholder="Search..."
/>
```

**Features:**
- ✅ 44px minimum height
- ✅ Rounded-xl (12px)
- ✅ Enhanced focus states
- ✅ Brand colors

---

## 🎨 UTILITY CLASSES

### Touch Targets

```tsx
// 44px minimum (Apple HIG)
<button className="touch-target">
  Click Me
</button>

// 48px comfortable
<button className="touch-target-comfortable">
  Click Me
</button>

// 56px large
<button className="touch-target-large">
  Click Me
</button>
```

---

### Spacing (8px Grid)

```tsx
// Use Tailwind spacing that follows 8px grid
<div className="p-6">    // 24px padding
<div className="m-8">    // 32px margin
<div className="gap-4">  // 16px gap

// Or use custom classes
<div className="space-md">  // 24px margin + padding
```

---

### Glassmorphism

```tsx
// CampusAxis glass effect
<div className="campus-glass rounded-2xl p-6">
  Frosted glass card
</div>

// With hover
<div className="campus-glass rounded-2xl p-6 hover:shadow-xl">
  Interactive glass card
</div>
```

---

### Typography

```tsx
// Responsive headings
<h1 className="text-campus-h1">
  Main Heading
</h1>

<h2 className="text-campus-h2">
  Subheading
</h2>

<p className="text-campus-body">
  Body text
</p>
```

---

### Content Width

```tsx
// Optimal reading width (65 characters)
<article className="prose-optimal">
  Long-form content...
</article>
```

---

### GPU Acceleration

```tsx
// Smooth hardware-accelerated animations
<div className="gpu-accelerated hover:-translate-y-1">
  Animated element
</div>
```

---

### Loading States

```tsx
// Skeleton loader with shimmer
<div className="campus-skeleton h-8 w-full rounded-2xl" />

// Multiple skeletons
<div className="space-y-4">
  <div className="campus-skeleton h-12 w-3/4 rounded-2xl" />
  <div className="campus-skeleton h-8 w-full rounded-2xl" />
  <div className="campus-skeleton h-8 w-5/6 rounded-2xl" />
</div>
```

---

## 🎯 COMMON PATTERNS

### Form with Campus Styling

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

<form className="space-y-6">
  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input
      id="email"
      variant="campus"
      type="email"
      placeholder="Enter your email"
      required
    />
  </div>
  
  <div className="space-y-2">
    <Label htmlFor="password">Password</Label>
    <Input
      id="password"
      variant="campus"
      type="password"
      placeholder="Enter password"
      required
    />
  </div>
  
  <Button 
    variant="campus-primary" 
    type="submit"
    className="w-full"
  >
    Sign In
  </Button>
</form>
```

---

### Card with Campus Glass

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

<Card className="campus-glass rounded-2xl">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Course Title</CardTitle>
      <Badge variant="campus">Featured</Badge>
    </div>
  </CardHeader>
  <CardContent className="space-y-4">
    <p className="text-campus-body">
      Course description goes here...
    </p>
    <Button variant="campus-primary" size="sm">
      Enroll Now
    </Button>
  </CardContent>
</Card>
```

---

### Alert Variations

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Info, AlertTriangle, CheckCircle } from 'lucide-react'

// Campus brand alert
<Alert variant="campus">
  <Info className="h-5 w-5" />
  <AlertTitle>CampusAxis Notification</AlertTitle>
  <AlertDescription>Important message</AlertDescription>
</Alert>

// Success alert
<Alert variant="success">
  <CheckCircle className="h-5 w-5" />
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>Action completed successfully</AlertDescription>
</Alert>

// Warning alert
<Alert variant="warning">
  <AlertTriangle className="h-5 w-5" />
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>Please review this information</AlertDescription>
</Alert>
```

---

### Status Badges

```tsx
import { Badge } from '@/components/ui/badge'

<div className="flex gap-2">
  <Badge variant="campus">CampusAxis</Badge>
  <Badge variant="success">Active</Badge>
  <Badge variant="warning">Pending</Badge>
  <Badge variant="info">New</Badge>
</div>
```

---

### Button Group

```tsx
import { Button } from '@/components/ui/button'

<div className="flex gap-3">
  <Button variant="campus-primary">
    Primary Action
  </Button>
  <Button variant="campus-secondary">
    Secondary Action
  </Button>
  <Button variant="outline">
    Cancel
  </Button>
</div>
```

---

## 📊 COMPONENT SIZES

### Buttons

```tsx
// Extra small (36px)
<Button size="xs">Extra Small</Button>

// Small (40px)
<Button size="sm">Small</Button>

// Default (44px) - Meets Apple HIG
<Button>Default</Button>

// Large (48px)
<Button size="lg">Large</Button>

// Icon only (44x44px)
<Button size="icon">
  <Icon className="h-4 w-4" />
</Button>
```

---

### Inputs

```tsx
// Small (40px)
<Input size="sm" placeholder="Small input" />

// Default (44px) - Meets Apple HIG
<Input placeholder="Default input" />

// Large (48px)
<Input size="lg" placeholder="Large input" />
```

---

## 🎨 COLOR REFERENCE

### Brand Colors

```typescript
// Light Mode
Primary: #007BFF
Hover: #0056b3
Glass: rgba(255, 255, 255, 0.7)
Blur: 15px

// Dark Mode
Primary: #1F8FFF
Hover: #1F8FFF (90% opacity)
Glass: rgba(255, 255, 255, 0.05)
Blur: 25px
Glow: 0 0 20px rgba(31, 143, 255, 0.5)
```

---

### Status Colors

```typescript
Success: #22C55E  // Green
Warning: #F59E0B  // Amber
Error: #EF4444    // Red
Info: #3B82F6     // Blue
```

---

## ♿ ACCESSIBILITY CHECKLIST

### Every Interactive Element Should Have:

- ✅ Minimum 44px touch target
- ✅ Visible focus indicator
- ✅ Proper ARIA labels
- ✅ Keyboard navigation support
- ✅ Screen reader friendly text
- ✅ 4.5:1 contrast ratio minimum

### Example:

```tsx
<Button
  variant="campus-primary"
  aria-label="Submit application form"
  className="touch-target"
>
  Submit
</Button>
```

---

## 🚀 PERFORMANCE TIPS

### 1. Use GPU Acceleration

```tsx
<div className="gpu-accelerated hover:-translate-y-1">
  Fast animation
</div>
```

### 2. Respect Reduced Motion

```tsx
// Animations automatically respect prefers-reduced-motion
// No additional code needed!
```

### 3. Use Lazy Loading

```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <div className="campus-skeleton h-32 rounded-2xl" />,
})
```

---

## 📱 RESPONSIVE BREAKPOINTS

```typescript
xs: <600px    // Mobile
sm: <960px    // Tablet
md: <1280px   // Laptop
lg: <1920px   // Desktop
```

### Usage:

```tsx
<div className="
  text-base         // Mobile: 16px
  sm:text-lg        // Tablet: 18px
  lg:text-xl        // Desktop: 20px
">
  Responsive text
</div>
```

---

## 🎯 SPACING SCALE (8px Grid)

```typescript
xs: 8px    (class: space-xs  or p-2)
sm: 16px   (class: space-sm  or p-4)
md: 24px   (class: space-md  or p-6)
lg: 32px   (class: space-lg  or p-8)
xl: 40px   (class: space-xl  or p-10)
2xl: 48px  (class: space-2xl or p-12)
3xl: 64px  (class: space-3xl or p-16)
```

---

## 💡 PRO TIPS

### 1. Always Use Brand Colors

```tsx
// ✅ Good
<Button variant="campus-primary">Action</Button>

// ❌ Avoid
<Button className="bg-blue-500">Action</Button>
```

---

### 2. Maintain Touch Targets

```tsx
// ✅ Good - Default button is 44px
<Button>Click Me</Button>

// ⚠️ Careful - Only use xs for secondary actions
<Button size="xs">Small Action</Button>
```

---

### 3. Use Proper Spacing

```tsx
// ✅ Good - 8px grid
<div className="p-6 gap-4 space-y-8">

// ❌ Avoid - Non-standard spacing
<div className="p-5 gap-3 space-y-7">
```

---

### 4. Combine Variants Wisely

```tsx
// ✅ Good - Clear hierarchy
<Button variant="campus-primary">Primary</Button>
<Button variant="campus-secondary">Secondary</Button>
<Button variant="outline">Tertiary</Button>

// ❌ Avoid - Confusing hierarchy
<Button variant="campus-primary">Action 1</Button>
<Button variant="campus-primary">Action 2</Button>
<Button variant="campus-primary">Action 3</Button>
```

---

## 🔍 DEBUGGING

### Check if Components are CampusAxis Compliant:

```tsx
// 1. Inspect in DevTools
// 2. Verify:
//    - Height ≥ 44px
//    - Border radius: 16px (rounded-2xl)
//    - Brand colors: #007BFF / #1F8FFF
//    - Proper spacing (multiples of 8)
//    - Focus ring visible
```

---

## 📚 ADDITIONAL RESOURCES

### Documentation Files

- `CAMPUSAXIS_MASTER_CHECKLIST.md` - Complete 12-section checklist
- `CAMPUSAXIS_CHECKLIST_IMPLEMENTATION.md` - Implementation details
- `lib/campusaxis-standards.ts` - Standards API
- `CAMPUSAXIS_IMPLEMENTATION_COMPLETE.md` - Achievement summary

### Usage

```typescript
// Import standards
import { campusAxisStandards } from '@/lib/campusaxis-standards'

// Use in components
const { colors, spacing, components } = campusAxisStandards
```

---

## ✅ QUICK VALIDATION

Before deploying, verify:

- [ ] All buttons ≥ 44px height
- [ ] Border radius consistent (16-24px)
- [ ] Brand colors used (#007BFF / #1F8FFF)
- [ ] Spacing follows 8px grid
- [ ] Focus states visible
- [ ] Dark mode tested
- [ ] Mobile responsive (320px+)
- [ ] Accessibility compliant

---

## 🎉 YOU'RE READY!

Start building with CampusAxis standards:

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

export default function MyComponent() {
  return (
    <div className="campus-glass rounded-2xl p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-campus-h1">Welcome</h1>
        <Badge variant="campus">CampusAxis</Badge>
      </div>
      
      <Input variant="campus" placeholder="Search..." />
      
      <Alert variant="campus">
        <AlertTitle>Ready to Go!</AlertTitle>
        <AlertDescription>
          You're using CampusAxis standards.
        </AlertDescription>
      </Alert>
      
      <Button variant="campus-primary">
        Get Started
      </Button>
    </div>
  )
}
```

**Happy Coding! 🚀**

---

**Version:** 2025.1.0  
**Last Updated:** October 16, 2025  
**Maintained By:** CampusAxis Development Team
