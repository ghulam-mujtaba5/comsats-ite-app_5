import type React from "react"
import type { Metadata, Viewport } from "next"
import { Suspense } from "react"
import { GeistSans } from "geist/font/sans"
import { Manrope } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { CampusProvider } from "@/contexts/campus-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header"
import { FooterConditional } from "@/components/layout/footer-conditional"
import { Toaster } from "@/components/ui/toaster"
import { jsonLdOrganization, jsonLdWebSite, jsonLdSiteNavigation, jsonLdEducationalOrganization } from "@/lib/seo"
import Script from "next/script"
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker"
import { WebVitalsReporter } from "@/components/analytics/web-vitals-reporter"
// Import polyfills for better browser compatibility
import "@/lib/polyfills"
// Import compatibility components
import { FallbackWarning } from "@/components/compatibility/fallback-warning"
import { PwaFallback } from "@/components/compatibility/pwa-fallback"
// Import AnimationProvider and GlobalAnimationController
import { AnimationProvider } from "@/contexts/animation-context"
import { GlobalAnimationController } from "@/components/animations/global-animation-controller"
// Import emotion system
import { CampusAxisEmotionProvider } from "@/components/emotion/emotion-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { MotivationalProvider } from "@/components/motivational/motivational-provider"

export const dynamic = 'force-dynamic'

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  // Optimize font loading
  preload: true,
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'

// helper to create absolute URLs for images and assets
const asset = (path: string) => new URL(path, siteUrl).toString()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CampusAxis - COMSATS University Islamabad",
    template: "%s | CampusAxis",
  },
  description:
    "Your ultimate academic portal. Access past papers, calculate your GPA, read faculty reviews, and explore a wealth of academic resources.",
  keywords: [
    "COMSATS University Islamabad",
    "CampusAxis",
    "past papers",
    "GPA calculator",
    "faculty reviews",
    "course resources",
    "university guides",
  ],
  applicationName: "CampusAxis",
  generator: "Next.js",
  authors: [{ name: "CampusAxis" }],
  creator: "CampusAxis",
  publisher: "CampusAxis",
  // Note: Do not set a global canonical. We'll set per-page canonicals where needed (e.g., homepage).
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "CampusAxis - COMSATS University Islamabad",
    description:
      "Your ultimate academic portal. Access past papers, calculate your GPA, read faculty reviews, and explore a wealth of academic resources.",
    siteName: "CampusAxis",
    images: [
      {
        // SVG first (scales crisply), many platforms prefer raster but SVG is fine for meta if supported
        url: asset('/og-preview.svg'),
        alt: "CampusAxis preview",
        type: 'image/svg+xml',
        width: 1200,
        height: 630,
      },
      {
        // PNG fallback for platforms that require raster images
        url: asset('/og-preview.png'),
        alt: 'CampusAxis preview (png)',
        type: 'image/png',
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_PK",
  },
  twitter: {
    card: "summary_large_image",
    site: "@CampusAxis",
    creator: "@CampusAxis",
    title: "CampusAxis - COMSATS University Islamabad",
    description:
      "Your ultimate academic portal. Access past papers, calculate your GPA, read faculty reviews, and explore a wealth of academic resources.",
    images: [asset('/og-preview.png')],
  },
  
  // Add theme-color for mobile browsers and PWAs
  other: {
    'theme-color': '#0b0b0b',
    // Mobile web app capable
    'mobile-web-app-capable': 'yes',
    // iOS specific tags
    'apple-mobile-web-app-title': 'CampusAxis',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-capable': 'yes',
    // Windows phone
    'msapplication-TileColor': '#0b0b0b',
    'msapplication-config': '/browserconfig.xml',
    // Format detection
    'format-detection': 'telephone=no',
  },
  icons: {
    icon: [
      // Standard favicon endpoint; we serve the logo here via a route handler
      { url: "/favicon.ico" },
      // Direct logo as a fallback/reference
  { url: "/logo-square.svg", type: "image/svg+xml" },
    ],
    shortcut: [
      { url: "/favicon.ico" },
    ],
    // Apple touch icon endpoint; served via a route handler
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  category: "education",
  manifest: "/manifest.webmanifest",
}

// Next.js 15: Use dedicated viewport export instead of metadata.themeColor/metadata.viewport
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
  // Optimize viewport for better performance
  interactiveWidget: "resizes-visual",
  // Mobile viewport optimizations
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const isProd = process.env.NODE_ENV === 'production'
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-serif: ${manrope.variable};
}
        `}</style>
        {/* Zero-CLS theme pre-injection: sets initial theme class before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(() => {
  try {
    if (typeof localStorage !== 'undefined' && typeof window !== 'undefined' && typeof document !== 'undefined') {
      const stored = localStorage.getItem('theme');
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = stored === 'light' || stored === 'dark' ? stored : (systemDark ? 'dark' : 'light');
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  } catch (_) {}
})();
            `,
          }}
        />
        <meta name="theme-color" content="#0b0b0b" />
        {/* Mobile web app tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="CampusAxis" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        {/* Performance: preconnect to Google Fonts for faster font fetches */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload social preview images (SVG first, PNG fallback) to help crawlers and card renderers */}
        <link rel="preload" as="image" href={asset('/og-preview.svg')} type="image/svg+xml" />
        <link rel="preload" as="image" href={asset('/og-preview.png')} type="image/png" />
        {/* Hint for legacy scrapers */}
        <link rel="image_src" href={asset('/og-preview.png')} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEducationalOrganization()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSiteNavigation([
            { name: 'Home', url: '/' },
            { name: 'Faculty', url: '/faculty' },
            { name: 'Past Papers', url: '/past-papers' },
            { name: 'News', url: '/news' },
            { name: 'Community', url: '/community' },
            { name: 'GPA Calculator', url: '/gpa-calculator' },
            { name: 'Resources', url: '/resources' },
            { name: 'Support', url: '/support' },
          ])) }}
        />
      </head>
      <body className={`${GeistSans.variable} ${manrope.variable} antialiased bg-background text-foreground`}>
        {/* Global decorative background - optimized for performance */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        {/* Google Tag Manager (preferred) - only in production */}
        {isProd && GTM_ID && (
          <>
            <Script 
              id="gtm-init" 
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${GTM_ID}');
                `,
              }}
            />
            {/* GTM noscript fallback */}
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              />
            </noscript>
          </>
        )}
        {/* Google Analytics 4 - only in production */}
        {isProd && GA_ID && !GTM_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script 
              id="ga4-init" 
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);} 
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                `,
              }}
            />
          </>
        )}

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <AnimationProvider>
              <CampusAxisEmotionProvider>
                <TooltipProvider>
                  <MotivationalProvider>
                    <CampusProvider>
                      <Header />
                      <div className="min-h-[60vh] max-w-full overflow-x-hidden">
                        {children}
                      </div>
                      <FooterConditional />
                      <Toaster />
                      {/* Global animation controller */}
                      <GlobalAnimationController />
                      {/* Browser compatibility warnings */}
                      <Suspense fallback={null}>
                        <FallbackWarning />
                      </Suspense>
                      <Suspense fallback={null}>
                        <PwaFallback />
                      </Suspense>
                      {/* Client-side route change tracking - only in production */}
                      {isProd && (
                        <Suspense fallback={null}>
                          <AnalyticsTracker />
                          <WebVitalsReporter />
                        </Suspense>
                      )}
                    </CampusProvider>
                  </MotivationalProvider>
                </TooltipProvider>
              </CampusAxisEmotionProvider>
            </AnimationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}