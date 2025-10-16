/**
 * 🎯 UI/UX FRAMEWORK IMPLEMENTATION EXAMPLES
 * 
 * Real-world examples of using the complete UI/UX framework
 * in CampusAxis components.
 * 
 * @version 3.0.0
 * @updated October 16, 2025
 */

import { uiUxFramework, designSystem } from '@/lib'

// ============================================
// EXAMPLE 1: ACCESSIBLE BUTTON COMPONENT
// ============================================

export function AccessibleButton() {
  const { touchTargets, states } = uiUxFramework.interactionDesign
  
  return (
    <button
      className="
        /* Touch Target (44px minimum) */
        min-h-[44px] min-w-[44px]
        px-6 py-3
        
        /* Visual Hierarchy */
        bg-primary text-white
        font-semibold text-base
        
        /* Glassmorphism */
        rounded-2xl
        
        /* Interactive States */
        hover:bg-primary/90
        hover:scale-102
        active:scale-98
        focus:outline-none
        focus:ring-2
        focus:ring-primary
        focus:ring-offset-2
        disabled:opacity-50
        disabled:cursor-not-allowed
        
        /* Motion Design (200ms smooth) */
        transition-all duration-200 ease-in-out
        
        /* Accessibility */
      "
      aria-label="Submit form"
      tabIndex={0}
    >
      Submit
    </button>
  )
}

// ============================================
// EXAMPLE 2: GLASS CARD WITH HIERARCHY
// ============================================

export function GlassCard() {
  const { glassmorphism2025 } = uiUxFramework
  
  return (
    <div className="
      /* Glassmorphism Secondary */
      glass-secondary
      
      /* Spacing (8px grid) */
      p-6
      
      /* Border Radius */
      rounded-2xl
      
      /* Hover Effect */
      hover:-translate-y-1
      hover:shadow-lg
      
      /* Motion Design */
      transition-all duration-300 ease-in-out
    ">
      {/* Visual Hierarchy: Display */}
      <h2 className="
        text-3xl font-bold
        text-gray-900 dark:text-white
        mb-4
      ">
        Card Title
      </h2>
      
      {/* Visual Hierarchy: Body */}
      <p className="
        text-base font-normal
        leading-relaxed
        text-gray-700 dark:text-gray-300
        mb-6
      ">
        This card demonstrates proper visual hierarchy,
        glassmorphism effects, and responsive design.
      </p>
      
      {/* Visual Hierarchy: CTA */}
      <AccessibleButton />
    </div>
  )
}

// ============================================
// EXAMPLE 3: RESPONSIVE GRID LAYOUT
// ============================================

export function ResponsiveGrid() {
  const { layoutSystem } = uiUxFramework
  
  return (
    <div className="
      /* Container */
      max-w-7xl mx-auto
      px-4 sm:px-6 lg:px-8
      
      /* Vertical Spacing */
      py-12 sm:py-16 lg:py-24
    ">
      {/* Section Title */}
      <h2 className="
        text-3xl sm:text-4xl lg:text-5xl
        font-bold
        text-center
        mb-12
      ">
        Featured Content
      </h2>
      
      {/* Responsive Grid */}
      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-6
      ">
        <GlassCard />
        <GlassCard />
        <GlassCard />
      </div>
    </div>
  )
}

// ============================================
// EXAMPLE 4: ACCESSIBLE FORM INPUT
// ============================================

export function AccessibleInput() {
  const { accessibility } = uiUxFramework
  
  return (
    <div className="space-y-2">
      {/* Label (Always visible) */}
      <label
        htmlFor="email-input"
        className="
          block
          text-sm font-medium
          text-gray-700 dark:text-gray-300
        "
      >
        Email Address
      </label>
      
      {/* Input */}
      <input
        id="email-input"
        type="email"
        placeholder="you@example.com"
        className="
          /* Sizing */
          w-full
          px-4 py-3
          min-h-[44px]
          
          /* Typography */
          text-base
          
          /* Visual */
          border-2 border-gray-300
          rounded-lg
          bg-white dark:bg-gray-900
          text-gray-900 dark:text-white
          
          /* Focus State */
          focus:outline-none
          focus:border-primary
          focus:ring-4
          focus:ring-primary/10
          
          /* Disabled State */
          disabled:opacity-50
          disabled:cursor-not-allowed
          
          /* Motion */
          transition-all duration-200 ease-out
        "
        aria-required="true"
        aria-invalid="false"
      />
      
      {/* Helper Text */}
      <p className="
        text-sm
        text-gray-600 dark:text-gray-400
      ">
        We'll never share your email with anyone else.
      </p>
    </div>
  )
}

// ============================================
// EXAMPLE 5: LOADING STATES
// ============================================

export function LoadingStates() {
  const { performanceOptimization } = uiUxFramework
  
  return (
    <div className="space-y-8">
      {/* Skeleton Loading */}
      <div className="glass-secondary p-6 rounded-2xl">
        <div className="animate-pulse space-y-4">
          {/* Title Skeleton */}
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          
          {/* Content Skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
          </div>
          
          {/* Button Skeleton */}
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
      </div>
      
      {/* Spinner Loading */}
      <div className="flex items-center justify-center p-12">
        <div className="
          animate-spin
          w-12 h-12
          border-4
          border-primary
          border-t-transparent
          rounded-full
        "></div>
      </div>
    </div>
  )
}

// ============================================
// EXAMPLE 6: DARK MODE TOGGLE
// ============================================

export function DarkModeToggle() {
  const { themeStrategy } = uiUxFramework
  
  return (
    <button
      className="
        /* Size */
        w-14 h-7
        
        /* Visual */
        bg-gray-300 dark:bg-gray-700
        rounded-full
        
        /* Position for toggle */
        relative
        
        /* Interactive */
        cursor-pointer
        
        /* Focus */
        focus:outline-none
        focus:ring-2
        focus:ring-primary
        focus:ring-offset-2
        
        /* Motion */
        transition-colors duration-200
      "
      role="switch"
      aria-checked="false"
      aria-label="Toggle dark mode"
    >
      {/* Toggle Circle */}
      <span className="
        absolute
        top-1 left-1
        w-5 h-5
        bg-white
        rounded-full
        dark:translate-x-7
        transition-transform duration-200
        shadow-md
      " />
    </button>
  )
}

// ============================================
// EXAMPLE 7: MOBILE-FIRST NAVIGATION
// ============================================

export function MobileNavigation() {
  const { responsiveDesign } = uiUxFramework
  
  return (
    <nav className="
      /* Glass Effect */
      glass-primary
      
      /* Positioning */
      fixed top-0 left-0 right-0
      z-50
      
      /* Spacing */
      px-4 py-3
      sm:px-6 sm:py-4
    ">
      <div className="
        max-w-7xl mx-auto
        flex items-center justify-between
      ">
        {/* Logo */}
        <div className="
          flex items-center
          space-x-3
        ">
          <img
            src="/logo.svg"
            alt="CampusAxis Logo"
            className="
              w-8 h-8
              sm:w-10 sm:h-10
            "
          />
          <span className="
            text-lg sm:text-xl
            font-bold
            text-gray-900 dark:text-white
          ">
            CampusAxis
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="
          hidden lg:flex
          items-center
          space-x-6
        ">
          <a href="/about" className="nav-link">About</a>
          <a href="/community" className="nav-link">Community</a>
          <a href="/resources" className="nav-link">Resources</a>
          <AccessibleButton />
        </div>
        
        {/* Mobile Menu Button */}
        <button
          className="
            lg:hidden
            min-w-[44px] min-h-[44px]
            flex items-center justify-center
          "
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  )
}

// ============================================
// EXAMPLE 8: PERFORMANCE-OPTIMIZED IMAGE
// ============================================

export function OptimizedImage() {
  const { performanceOptimization } = uiUxFramework
  
  return (
    <picture>
      {/* WebP for modern browsers */}
      <source
        srcSet="/image.webp"
        type="image/webp"
      />
      
      {/* JPEG fallback */}
      <img
        src="/image.jpg"
        alt="Description"
        loading="lazy"
        className="
          w-full h-auto
          rounded-2xl
          object-cover
        "
        width={1200}
        height={630}
      />
    </picture>
  )
}

// ============================================
// EXAMPLE 9: ACCESSIBLE MODAL
// ============================================

export function AccessibleModal({ isOpen, onClose, children }: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  const { accessibility, motionDesign } = uiUxFramework
  
  if (!isOpen) return null
  
  return (
    <>
      {/* Backdrop */}
      <div
        className="
          fixed inset-0
          bg-black/50
          backdrop-blur-sm
          z-40
          
          /* Animation */
          animate-fade-in
        "
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        className="
          fixed inset-0
          z-50
          flex items-center justify-center
          p-4
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="
          /* Glass Effect */
          glass-primary
          
          /* Sizing */
          w-full max-w-lg
          max-h-[90vh]
          overflow-y-auto
          
          /* Spacing */
          p-6
          
          /* Visual */
          rounded-2xl
          shadow-2xl
          
          /* Animation */
          animate-scale-in
        ">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="
              absolute top-4 right-4
              min-w-[44px] min-h-[44px]
              flex items-center justify-center
              rounded-full
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition-colors duration-150
            "
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Content */}
          {children}
        </div>
      </div>
    </>
  )
}

// ============================================
// EXAMPLE 10: COLOR CONTRAST CHECKER
// ============================================

export function ContrastChecker() {
  const { checkContrast } = uiUxFramework
  
  const foreground = '#111827'
  const background = '#FFFFFF'
  
  const result = checkContrast(foreground, background)
  
  return (
    <div className="glass-secondary p-6 rounded-2xl space-y-4">
      <h3 className="text-xl font-semibold">Contrast Checker</h3>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm">Contrast Ratio:</span>
          <span className="font-mono font-bold">{result.ratio}:1</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm">WCAG AA:</span>
          <span className={result.AA ? 'text-green-600' : 'text-red-600'}>
            {result.AA ? '✓ Pass' : '✗ Fail'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm">WCAG AAA:</span>
          <span className={result.AAA ? 'text-green-600' : 'text-red-600'}>
            {result.AAA ? '✓ Pass' : '✗ Fail'}
          </span>
        </div>
      </div>
    </div>
  )
}

// ============================================
// USAGE EXAMPLE IN A PAGE
// ============================================

export function ExamplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-950 dark:to-gray-900">
      {/* Navigation */}
      <MobileNavigation />
      
      {/* Main Content */}
      <main className="pt-24 pb-12">
        {/* Hero Section */}
        <section className="
          max-w-7xl mx-auto
          px-4 sm:px-6 lg:px-8
          text-center
          mb-24
        ">
          <h1 className="
            text-4xl sm:text-5xl lg:text-6xl
            font-bold
            text-gray-900 dark:text-white
            mb-6
          ">
            Welcome to CampusAxis
          </h1>
          
          <p className="
            text-lg sm:text-xl
            text-gray-700 dark:text-gray-300
            max-w-3xl mx-auto
            mb-8
          ">
            A complete UI/UX framework for building modern,
            accessible, and performant web applications.
          </p>
          
          <AccessibleButton />
        </section>
        
        {/* Features Grid */}
        <ResponsiveGrid />
        
        {/* Form Section */}
        <section className="
          max-w-md mx-auto
          px-4
          mt-24
        ">
          <div className="glass-secondary p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6">Get Started</h2>
            <form className="space-y-6">
              <AccessibleInput />
              <AccessibleButton />
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}

// ============================================
// EXPORT ALL EXAMPLES
// ============================================

export const examples = {
  AccessibleButton,
  GlassCard,
  ResponsiveGrid,
  AccessibleInput,
  LoadingStates,
  DarkModeToggle,
  MobileNavigation,
  OptimizedImage,
  AccessibleModal,
  ContrastChecker,
  ExamplePage,
}

export default examples
