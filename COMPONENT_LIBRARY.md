# 🧩 CampusAxis Component Library

Quick reference for all available glassmorphic components and utilities.

---

## 🎴 Cards

### Glass Card (Default)
```html
<div class="glass-card p-6">
  Content with medium glass effect
</div>
```

### Glass Card Subtle
```html
<div class="glass-card-subtle p-4">
  Lighter glass effect for nested elements
</div>
```

### Glass Card Heavy
```html
<div class="glass-card-heavy p-8">
  Strong glass effect for modals/overlays
</div>
```

---

## 🔘 Buttons

### Primary Button
```html
<button class="glass-button">
  Primary Action
</button>
```

### Secondary Button
```html
<button class="glass-button-secondary">
  Secondary Action
</button>
```

### Outline Button
```html
<button class="glass-button-outline">
  Outlined
</button>
```

### Ghost Button
```html
<button class="glass-button-ghost">
  Minimal
</button>
```

### With Icons
```html
<button class="glass-button flex items-center gap-2">
  <svg class="w-4 h-4"><!-- icon --></svg>
  Create Project
</button>
```

---

## 📝 Form Elements

### Text Input
```html
<input 
  type="text" 
  class="glass-input w-full" 
  placeholder="Enter text..."
/>
```

### Textarea
```html
<textarea 
  class="glass-input w-full" 
  rows="4"
  placeholder="Enter description..."
></textarea>
```

### Select Dropdown
```html
<select class="glass-input w-full">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### Search Input
```html
<div class="relative">
  <input 
    type="search" 
    class="glass-input w-full pl-10" 
    placeholder="Search..."
  />
  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4">
    <!-- search icon -->
  </svg>
</div>
```

---

## 🏷️ Badges

### Success Badge
```html
<span class="glass-badge badge-success">Active</span>
```

### Warning Badge
```html
<span class="glass-badge badge-warning">Pending</span>
```

### Info Badge
```html
<span class="glass-badge badge-info">New</span>
```

### Error Badge
```html
<span class="glass-badge badge-error">Failed</span>
```

### Custom Badge
```html
<span class="glass-badge">
  Custom
</span>
```

---

## 🧭 Navigation

### Glass Navigation Bar
```html
<nav class="glass-nav px-6 py-4">
  <div class="container mx-auto flex items-center justify-between">
    <div class="flex items-center space-x-8">
      <img src="/logo.svg" alt="Logo" class="h-10" />
      <div class="flex space-x-6">
        <a href="/dashboard">Dashboard</a>
        <a href="/projects">Projects</a>
      </div>
    </div>
    <div class="flex items-center space-x-4">
      <button class="glass-button">Sign In</button>
    </div>
  </div>
</nav>
```

### Glass Sidebar
```html
<aside class="glass-sidebar w-64 h-screen p-6">
  <nav class="space-y-2">
    <a href="/dashboard" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10">
      <svg class="w-5 h-5"><!-- icon --></svg>
      <span>Dashboard</span>
    </a>
  </nav>
</aside>
```

---

## 💬 Modals & Dialogs

### Glass Modal
```html
<div class="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
  <div class="glass-modal max-w-md w-full p-8">
    <h2 class="text-2xl font-bold mb-4">Modal Title</h2>
    <p class="mb-6">Modal content goes here...</p>
    <div class="flex space-x-4">
      <button class="glass-button flex-1">Confirm</button>
      <button class="glass-button-ghost flex-1">Cancel</button>
    </div>
  </div>
</div>
```

### Tooltip
```html
<div class="relative group">
  <button class="glass-button">Hover me</button>
  <div class="glass-tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
    Helpful tooltip text
  </div>
</div>
```

---

## 🎨 Visual Effects

### Gradient Text
```html
<h1 class="gradient-text text-4xl font-bold">
  Beautiful Gradient Text
</h1>
```

### Gradient Text Secondary
```html
<h2 class="gradient-text-secondary text-2xl">
  Secondary Gradient
</h2>
```

### Gradient Border
```html
<div class="gradient-border">
  <div class="p-6">
    Content with gradient border
  </div>
</div>
```

### Glow Effects
```html
<div class="glow-primary p-6">Primary glow</div>
<div class="glow-secondary p-6">Secondary glow</div>
<div class="glow-accent p-6">Accent glow</div>
<div class="hover-glow p-6">Glows on hover</div>
```

---

## ✨ Animations

### Micro-Interactions
```html
<!-- Magnetic hover effect -->
<button class="magnetic glass-button">
  Magnetic Button
</button>

<!-- Lift on hover -->
<div class="lift-hover glass-card p-6">
  Lifts on hover
</div>

<!-- Scale on hover -->
<div class="scale-hover glass-card p-6">
  Scales on hover
</div>
```

### Loading States
```html
<!-- Shimmer loading skeleton -->
<div class="shimmer-loading rounded-lg" style="height: 120px;"></div>

<!-- Pulse animation -->
<div class="pulse glass-badge badge-info">
  Loading...
</div>
```

### Entrance Animations
```html
<!-- Fade in -->
<div class="fade-in glass-card p-6">
  Fades in on mount
</div>

<!-- Slide up -->
<div class="slide-up glass-card p-6">
  Slides up on mount
</div>

<!-- Bounce -->
<div class="bounce glass-badge badge-success">
  New!
</div>
```

---

## 📊 Dashboard Components

### Stat Card
```html
<div class="glass-card p-6">
  <div class="flex items-center justify-between mb-2">
    <p class="text-sm text-muted-foreground">Total Users</p>
    <svg class="w-5 h-5 text-primary"><!-- icon --></svg>
  </div>
  <p class="text-3xl font-bold gradient-text">12,458</p>
  <p class="text-sm flex items-center gap-1 mt-2">
    <span class="glass-badge badge-success text-xs">+12%</span>
    <span class="text-muted-foreground">from last month</span>
  </p>
</div>
```

### Progress Card
```html
<div class="glass-card p-6">
  <div class="flex items-center justify-between mb-4">
    <h3 class="font-semibold">Project Progress</h3>
    <span class="glass-badge badge-info">In Progress</span>
  </div>
  
  <div class="space-y-3">
    <div>
      <div class="flex justify-between text-sm mb-1">
        <span>Design Phase</span>
        <span>100%</span>
      </div>
      <div class="h-2 bg-muted rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-primary to-secondary" style="width: 100%"></div>
      </div>
    </div>
    
    <div>
      <div class="flex justify-between text-sm mb-1">
        <span>Development</span>
        <span>65%</span>
      </div>
      <div class="h-2 bg-muted rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-primary to-secondary" style="width: 65%"></div>
      </div>
    </div>
  </div>
</div>
```

### Activity Feed
```html
<div class="glass-card p-6">
  <h3 class="font-semibold mb-4">Recent Activity</h3>
  
  <div class="space-y-4">
    <div class="flex items-start gap-3">
      <div class="glass-badge badge-success">✓</div>
      <div class="flex-1">
        <p class="font-medium">Project completed</p>
        <p class="text-sm text-muted-foreground">2 hours ago</p>
      </div>
    </div>
    
    <div class="flex items-start gap-3">
      <div class="glass-badge badge-info">i</div>
      <div class="flex-1">
        <p class="font-medium">New comment received</p>
        <p class="text-sm text-muted-foreground">5 hours ago</p>
      </div>
    </div>
  </div>
</div>
```

---

## 📋 Table Components

### Glass Table
```html
<div class="glass-card overflow-hidden">
  <table class="w-full">
    <thead class="bg-white/5">
      <tr>
        <th class="px-6 py-3 text-left text-sm font-semibold">Name</th>
        <th class="px-6 py-3 text-left text-sm font-semibold">Status</th>
        <th class="px-6 py-3 text-left text-sm font-semibold">Date</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-border/50">
      <tr class="hover:bg-white/5 transition-colors">
        <td class="px-6 py-4">Project Alpha</td>
        <td class="px-6 py-4">
          <span class="glass-badge badge-success">Active</span>
        </td>
        <td class="px-6 py-4 text-muted-foreground">Jan 15, 2025</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 🎭 Profile Components

### Avatar
```html
<div class="relative">
  <img 
    src="/avatar.jpg" 
    alt="User" 
    class="w-12 h-12 rounded-full border-2 border-white/20"
  />
  <div class="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-background"></div>
</div>
```

### Profile Card
```html
<div class="glass-card p-6 text-center">
  <img 
    src="/avatar.jpg" 
    alt="User" 
    class="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white/20"
  />
  <h3 class="font-bold text-lg">John Doe</h3>
  <p class="text-sm text-muted-foreground mb-4">Software Engineer</p>
  
  <div class="flex justify-center gap-2">
    <button class="glass-button-outline">View Profile</button>
    <button class="glass-button">Message</button>
  </div>
</div>
```

---

## 🔔 Notifications

### Toast Notification
```html
<div class="glass-card flex items-start gap-3 p-4 max-w-sm shadow-lg">
  <div class="glass-badge badge-success">✓</div>
  <div class="flex-1">
    <p class="font-semibold">Success!</p>
    <p class="text-sm text-muted-foreground">Your changes have been saved.</p>
  </div>
  <button class="text-muted-foreground hover:text-foreground">×</button>
</div>
```

### Notification Badge
```html
<div class="relative">
  <button class="glass-button-ghost">
    <svg class="w-5 h-5"><!-- bell icon --></svg>
  </button>
  <span class="absolute -top-1 -right-1 glass-badge badge-error text-xs w-5 h-5 flex items-center justify-center p-0">
    3
  </span>
</div>
```

---

## 📱 Responsive Utilities

### Hide on Mobile
```html
<div class="hide-mobile">
  Only visible on desktop
</div>
```

### Hide on Desktop
```html
<div class="hide-desktop">
  Only visible on mobile
</div>
```

### Responsive Text
```html
<p class="text-responsive-sm">
  14px on mobile, 16px on desktop
</p>

<h1 class="text-responsive-lg">
  18px mobile, 20px tablet, 24px desktop
</h1>
```

---

## ♿ Accessibility Components

### Skip to Main Content
```html
<a href="#main-content" class="skip-to-main">
  Skip to main content
</a>

<main id="main-content">
  <!-- Main content -->
</main>
```

### Focus Visible
All interactive elements automatically get focus styles. No additional classes needed.

---

## 🎯 Common Patterns

### Login Form
```html
<div class="glass-modal max-w-md mx-auto p-8">
  <h2 class="text-2xl font-bold mb-2 gradient-text">Welcome Back</h2>
  <p class="text-muted-foreground mb-6">Sign in to your account</p>
  
  <form class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-2">Email</label>
      <input type="email" class="glass-input w-full" placeholder="you@example.com" />
    </div>
    
    <div>
      <label class="block text-sm font-medium mb-2">Password</label>
      <input type="password" class="glass-input w-full" placeholder="••••••••" />
    </div>
    
    <button type="submit" class="glass-button w-full magnetic">
      Sign In
    </button>
  </form>
  
  <div class="mt-4 text-center">
    <a href="/forgot-password" class="text-sm text-primary hover:underline">
      Forgot password?
    </a>
  </div>
</div>
```

### Search Bar
```html
<div class="glass-card flex items-center gap-3 px-4 py-2">
  <svg class="w-5 h-5 text-muted-foreground"><!-- search icon --></svg>
  <input 
    type="search" 
    class="flex-1 bg-transparent border-0 outline-none" 
    placeholder="Search projects, users, content..."
  />
  <kbd class="glass-badge text-xs">⌘K</kbd>
</div>
```

### Pricing Card
```html
<div class="glass-card p-8 hover-glow">
  <div class="mb-6">
    <h3 class="text-xl font-bold mb-2">Pro Plan</h3>
    <div class="flex items-baseline gap-2">
      <span class="text-4xl font-bold gradient-text">$29</span>
      <span class="text-muted-foreground">/month</span>
    </div>
  </div>
  
  <ul class="space-y-3 mb-8">
    <li class="flex items-center gap-2">
      <svg class="w-5 h-5 text-success"><!-- check icon --></svg>
      <span>Unlimited projects</span>
    </li>
    <li class="flex items-center gap-2">
      <svg class="w-5 h-5 text-success"><!-- check icon --></svg>
      <span>Priority support</span>
    </li>
    <li class="flex items-center gap-2">
      <svg class="w-5 h-5 text-success"><!-- check icon --></svg>
      <span>Advanced analytics</span>
    </li>
  </ul>
  
  <button class="glass-button w-full">Get Started</button>
</div>
```

---

## 🚀 Quick Start Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CampusAxis - Corporate Glassmorphic UI</title>
  <!-- Your CSS imports -->
</head>
<body class="bg-background text-foreground">
  
  <!-- Skip to main content -->
  <a href="#main" class="skip-to-main">Skip to main content</a>
  
  <!-- Navigation -->
  <nav class="glass-nav px-6 py-4">
    <!-- Nav content -->
  </nav>
  
  <!-- Main Content -->
  <main id="main" class="container mx-auto px-6 py-12">
    
    <!-- Hero Section -->
    <div class="glass-card-heavy p-12 mb-12 text-center">
      <h1 class="text-4xl font-bold gradient-text mb-4">
        Welcome to CampusAxis
      </h1>
      <p class="text-lg text-muted-foreground mb-8">
        Your AI-powered academic and freelancing platform
      </p>
      <button class="glass-button magnetic">
        Get Started
      </button>
    </div>
    
    <!-- Content Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="glass-card lift-hover p-6">
        <h3 class="font-semibold mb-2">Feature 1</h3>
        <p class="text-sm text-muted-foreground">Description</p>
      </div>
      
      <div class="glass-card lift-hover p-6">
        <h3 class="font-semibold mb-2">Feature 2</h3>
        <p class="text-sm text-muted-foreground">Description</p>
      </div>
      
      <div class="glass-card lift-hover p-6">
        <h3 class="font-semibold mb-2">Feature 3</h3>
        <p class="text-sm text-muted-foreground">Description</p>
      </div>
    </div>
    
  </main>
  
</body>
</html>
```

---

**Component Library v1.0**  
*Built for CampusAxis with corporate glassmorphic design*
