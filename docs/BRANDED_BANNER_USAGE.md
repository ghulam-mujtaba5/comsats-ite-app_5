# Branded Banner Component - Usage Guide

## Overview
The `BrandedBanner` component is a reusable, branded promotional banner that includes the CampusAxis logo and can be used across various pages for announcements, CTAs, and feature highlights.

## Import

```tsx
import { BrandedBanner } from "@/components/layout/branded-banner"
```

## Basic Usage

```tsx
<BrandedBanner
  title="Welcome to CampusAxis"
  description="Your ultimate academic portal for COMSATS University"
/>
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `title` | `string` | - | ✅ Yes | Main heading text (gradient styled) |
| `subtitle` | `string` | - | ❌ No | Badge text above title |
| `description` | `string` | - | ✅ Yes | Body text content |
| `ctaText` | `string` | - | ❌ No | Call-to-action button text |
| `ctaLink` | `string` | - | ❌ No | Button destination URL |
| `variant` | `"default" \| "gradient" \| "glass"` | `"gradient"` | ❌ No | Visual style variant |
| `showLogo` | `boolean` | `true` | ❌ No | Show/hide logo watermark |
| `className` | `string` | `""` | ❌ No | Additional CSS classes |

## Variants

### 1. Gradient (Default)
Modern gradient background with blur effects
```tsx
<BrandedBanner
  variant="gradient"
  title="Feature Announcement"
  description="Check out our new features"
/>
```

### 2. Glass Morphism
Semi-transparent glass effect
```tsx
<BrandedBanner
  variant="glass"
  title="Clean & Modern"
  description="Glass-like appearance"
/>
```

### 3. Default
Subtle colored background
```tsx
<BrandedBanner
  variant="default"
  title="Simple Design"
  description="Clean and minimal"
/>
```

## Full Example

```tsx
<BrandedBanner
  title="Join CampusAxis Community"
  subtitle="🎓 Student Platform"
  description="Connect with thousands of COMSATS students. Share resources, read faculty reviews, and excel in your academic journey."
  ctaText="Get Started Free"
  ctaLink="/auth"
  variant="gradient"
  showLogo={true}
  className="my-12"
/>
```

## Use Cases

### 1. Homepage CTA
```tsx
<BrandedBanner
  title="Start Your Academic Journey"
  subtitle="Welcome"
  description="Access past papers, calculate GPA, and explore resources designed for COMSATS students."
  ctaText="Sign Up Now"
  ctaLink="/auth"
  variant="gradient"
/>
```

### 2. Feature Announcement
```tsx
<BrandedBanner
  title="New: Faculty Reviews System"
  subtitle="✨ Latest Feature"
  description="Read and share honest reviews about faculty members and courses."
  ctaText="Explore Reviews"
  ctaLink="/faculty"
  variant="gradient"
  showLogo={false}
/>
```

### 3. Coming Soon Section
```tsx
<BrandedBanner
  title="More Features Coming Soon"
  subtitle="🚀 In Development"
  description="We're working on exciting new tools to enhance your academic experience."
  variant="glass"
/>
```

### 4. About Section
```tsx
<BrandedBanner
  title="About CampusAxis"
  subtitle="Our Mission"
  description="Empowering COMSATS students with comprehensive academic resources and tools."
  ctaText="Learn More"
  ctaLink="/about"
  variant="default"
/>
```

### 5. Support Banner
```tsx
<BrandedBanner
  title="Need Help?"
  subtitle="Support"
  description="Our support team is here to assist you with any questions or issues."
  ctaText="Contact Support"
  ctaLink="/support"
  variant="glass"
  className="mb-8"
/>
```

## Styling Notes

### Background Effects
- Gradient orbs animate with pulse effect
- Mesh pattern overlay for texture
- Logo watermark (optional, low opacity)

### Typography
- Title: Large, gradient text (blue → indigo → purple)
- Subtitle: Badge with icon support
- Description: Readable serif font

### Interactive Elements
- Hover effects on CTA button
- Smooth transitions (500ms)
- Shadow lift on hover

## Responsive Behavior

- **Mobile (< 640px):**
  - Padding reduced to `p-8`
  - Title size: `text-3xl`
  - Stacked layout

- **Desktop (≥ 1024px):**
  - Full padding `p-12`
  - Title size: `text-5xl`
  - Horizontal layout

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy
- Focus states on interactive elements
- Color contrast compliant
- Logo watermark uses `aria-hidden`

## Performance Tips

1. **Logo Loading:**
   - Logo is lazy-loaded as watermark
   - Use `showLogo={false}` if not needed

2. **Animations:**
   - CSS-based (GPU accelerated)
   - Reduced motion respected

3. **Bundle Size:**
   - Component is tree-shakable
   - No heavy dependencies

## Common Patterns

### Newsletter Signup
```tsx
<BrandedBanner
  title="Stay Updated"
  subtitle="📧 Newsletter"
  description="Get the latest news, updates, and resources delivered to your inbox."
  ctaText="Subscribe Now"
  ctaLink="/newsletter"
  variant="gradient"
/>
```

### Event Promotion
```tsx
<BrandedBanner
  title="Upcoming Campus Event"
  subtitle="📅 This Week"
  description="Join us for an exciting workshop on career development and networking."
  ctaText="Register Now"
  ctaLink="/events/workshop"
  variant="glass"
  showLogo={false}
/>
```

### Beta Feature
```tsx
<BrandedBanner
  title="Try Our Beta Features"
  subtitle="🧪 Beta Testing"
  description="Be among the first to try our new features and provide feedback."
  ctaText="Join Beta"
  ctaLink="/beta"
  variant="default"
/>
```

## Advanced Customization

### Custom Styling
```tsx
<BrandedBanner
  title="Custom Styled Banner"
  description="Example with custom classes"
  className="my-16 mx-auto max-w-5xl rounded-3xl"
  variant="gradient"
/>
```

### No Logo Watermark
```tsx
<BrandedBanner
  title="Clean Design"
  description="Banner without logo watermark"
  showLogo={false}
  variant="glass"
/>
```

### Minimal Version
```tsx
<BrandedBanner
  title="Simple Announcement"
  description="No subtitle, no CTA, just information"
  variant="default"
  showLogo={false}
/>
```

## Best Practices

1. ✅ Use descriptive titles (3-7 words)
2. ✅ Keep descriptions concise (1-2 sentences)
3. ✅ Include CTAs for action-oriented banners
4. ✅ Choose appropriate variant for context
5. ✅ Consider logo visibility per page
6. ❌ Don't overuse on single page (1-2 max)
7. ❌ Avoid extremely long text
8. ❌ Don't nest banners

## Examples in Context

### Homepage
```tsx
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureCards />
      
      {/* Branded Banner */}
      <section className="app-container py-12">
        <BrandedBanner
          title="Join Our Growing Community"
          subtitle="🎓 CampusAxis"
          description="Connect with fellow students and access exclusive resources"
          ctaText="Get Started"
          ctaLink="/auth"
          variant="gradient"
        />
      </section>
      
      <NewsSection />
    </>
  )
}
```

### Resources Page
```tsx
<BrandedBanner
  title="Need More Resources?"
  subtitle="📚 Resource Library"
  description="Explore our comprehensive collection of study materials and guides"
  ctaText="Browse Library"
  ctaLink="/resources"
  variant="glass"
  className="mb-12"
/>
```

---

**Component Location:** `/components/layout/branded-banner.tsx`  
**Created:** October 10, 2025  
**Status:** ✅ Production Ready
