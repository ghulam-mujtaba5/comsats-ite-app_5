/**
 * Advanced Performance Configuration
 * 
 * This file contains advanced performance optimizations
 * that can be applied across the application
 */

/**
 * Route-based Code Splitting Configuration
 * 
 * Define which routes should be lazy-loaded and which should be prefetched
 */
export const routeOptimization = {
  // Routes that should be prefetched on hover/focus
  prefetchRoutes: [
    '/dashboard',
    '/community',
    '/faculty',
    '/past-papers',
    '/gpa-calculator',
  ],

  // Routes that should be lazy-loaded
  lazyRoutes: [
    '/admin/**',
    '/settings/**',
    '/profile/**',
  ],

  // Critical routes that should be preloaded immediately
  criticalRoutes: [
    '/',
    '/auth/login',
    '/auth/register',
  ],
}

/**
 * Component-level Code Splitting Configuration
 * 
 * Define which components should be dynamically imported
 */
export const componentOptimization = {
  // Heavy components that should always be lazy-loaded
  alwaysLazy: [
    'Recharts', // Chart library
    'ReactPlayer', // Video player
    'ReactImageGallery', // Image gallery
    'EmojiMart', // Emoji picker
    'Lexical', // Rich text editor
    'ReactConfetti', // Confetti animation
  ],

  // Components that should be lazy-loaded below the fold
  belowFold: [
    'Footer',
    'CommunitySection',
    'NewsSection',
    'FAQSection',
    'ComingSoonSection',
  ],

  // Components that need SSR
  requireSSR: [
    'Header',
    'Hero',
    'SEO',
    'Metadata',
  ],
}

/**
 * Image Optimization Configuration
 */
export const imageOptimization = {
  // Default quality for images
  defaultQuality: 85,

  // Quality for thumbnails
  thumbnailQuality: 70,

  // Quality for hero images
  heroQuality: 90,

  // Supported formats (in order of preference)
  formats: ['webp', 'jpg', 'png'],

  // Device sizes for responsive images
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],

  // Image sizes for srcset
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

  // Blur placeholder configuration
  blurPlaceholder: {
    enabled: true,
    quality: 10,
  },
}

/**
 * Bundle Optimization Configuration
 */
export const bundleOptimization = {
  // Packages that should be in separate chunks
  splitChunks: [
    'react',
    'react-dom',
    'next',
    'framer-motion',
    'recharts',
    '@radix-ui',
  ],

  // Packages that should be combined
  combineChunks: [
    'lucide-react',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
  ],

  // Tree-shaking targets
  treeShake: [
    'lodash',
    'date-fns',
    'recharts',
  ],
}

/**
 * Caching Strategy Configuration
 */
export const cacheOptimization = {
  // Static assets cache duration (1 day for free tier)
  staticAssets: 86400, // 1 day

  // API cache duration
  api: 60, // 1 minute

  // Image cache duration
  images: 30, // 30 seconds (optimized for free tier)

  // Service worker cache strategy
  serviceWorker: {
    staticAssets: 'CacheFirst',
    api: 'NetworkFirst',
    images: 'CacheFirst',
    fonts: 'CacheFirst',
  },
}

/**
 * Performance Budget Configuration
 */
export const performanceBudget = {
  // Maximum bundle size (KB)
  maxBundleSize: 100,

  // Maximum initial load time (ms)
  maxInitialLoad: 2000,

  // Maximum time to interactive (ms)
  maxTimeToInteractive: 3500,

  // Maximum first contentful paint (ms)
  maxFirstContentfulPaint: 1800,

  // Maximum largest contentful paint (ms)
  maxLargestContentfulPaint: 2500,

  // Maximum cumulative layout shift
  maxCumulativeLayoutShift: 0.1,

  // Maximum first input delay (ms)
  maxFirstInputDelay: 100,
}

/**
 * Prefetch Strategy Configuration
 */
export const prefetchStrategy = {
  // Enable automatic prefetching
  enabled: true,

  // Prefetch on hover delay (ms)
  hoverDelay: 100,

  // Prefetch on focus delay (ms)
  focusDelay: 50,

  // Maximum concurrent prefetches
  maxConcurrent: 3,

  // Prefetch threshold (distance from viewport)
  threshold: 0.5,
}

/**
 * Database Query Optimization Configuration
 */
export const dbOptimization = {
  // Connection pool settings
  pool: {
    min: 2,
    max: 10,
    idle: 10000,
  },

  // Query timeout (ms)
  timeout: 8000,

  // Query result cache duration (seconds)
  cacheTime: 60,

  // Batch query size
  batchSize: 100,

  // Enable query logging (development only)
  logging: process.env.NODE_ENV === 'development',
}

/**
 * Lazy Loading Configuration
 */
export const lazyLoadingConfig = {
  // Intersection observer root margin
  rootMargin: '50px',

  // Intersection observer threshold
  threshold: 0.01,

  // Loading placeholder type
  placeholder: 'blur' as const,

  // Enable lazy loading for images
  images: true,

  // Enable lazy loading for iframes
  iframes: true,

  // Enable lazy loading for videos
  videos: true,
}

/**
 * Animation Performance Configuration
 */
export const animationConfig = {
  // Respect prefers-reduced-motion
  respectReducedMotion: true,

  // Use GPU acceleration
  useGPU: true,

  // Default animation duration (ms)
  duration: 300,

  // Default easing
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',

  // Disable animations on low-end devices
  disableOnLowEnd: true,
}

/**
 * Web Vitals Thresholds
 */
export const webVitalsThresholds = {
  LCP: {
    good: 2500,
    needsImprovement: 4000,
  },
  FID: {
    good: 100,
    needsImprovement: 300,
  },
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  TTFB: {
    good: 800,
    needsImprovement: 1800,
  },
  FCP: {
    good: 1800,
    needsImprovement: 3000,
  },
  INP: {
    good: 200,
    needsImprovement: 500,
  },
}

/**
 * Resource Hints Configuration
 */
export const resourceHints = {
  // DNS prefetch domains
  dnsPrefetch: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ],

  // Preconnect domains
  preconnect: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ],

  // Preload critical resources
  preload: [
    '/Campus Axis 1.svg',
    '/og-preview.png',
  ],

  // Prefetch next page resources
  prefetch: [
    '/dashboard',
    '/community',
  ],
}

/**
 * Compression Configuration
 */
export const compressionConfig = {
  // Enable Brotli compression
  brotli: true,

  // Enable Gzip compression
  gzip: true,

  // Compression quality (0-11)
  quality: 6,

  // Minimum size for compression (bytes)
  threshold: 1024,
}

/**
 * Export all configuration
 */
export const performanceConfig = {
  routes: routeOptimization,
  components: componentOptimization,
  images: imageOptimization,
  bundles: bundleOptimization,
  cache: cacheOptimization,
  budget: performanceBudget,
  prefetch: prefetchStrategy,
  database: dbOptimization,
  lazyLoading: lazyLoadingConfig,
  animations: animationConfig,
  webVitals: webVitalsThresholds,
  resourceHints,
  compression: compressionConfig,
}

export default performanceConfig
