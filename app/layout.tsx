import type React from "react"
import type { Metadata, Viewport } from "next"
import { Suspense } from "react"
import { GeistSans } from "geist/font/sans"
import { Manrope } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header"
import { FooterConditional } from "@/components/layout/footer-conditional"
import { Toaster } from "@/components/ui/toaster"
import { jsonLdOrganization, jsonLdWebSite } from "@/lib/seo"
import Script from "next/script"
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker"

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "CampusAxis - COMSATS University Islamabad",
    description:
      "Your ultimate academic portal. Access past papers, calculate your GPA, read faculty reviews, and explore a wealth of academic resources.",
    siteName: "CampusAxis",
    images: [
      {
        url: "/university-faculty-workshop.png",
        alt: "CampusAxis preview",
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
    images: [
      {
        url: "/university-faculty-workshop.png",
        alt: "CampusAxis preview",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/new%20logo.jpg", type: "image/jpeg" },
    ],
    shortcut: [
      { url: "/new%20logo.jpg", type: "image/jpeg" },
    ],
    apple: [{ url: "/new%20logo.jpg", type: "image/jpeg" }],
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
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
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
    const stored = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored === 'light' || stored === 'dark' ? stored : (systemDark ? 'dark' : 'light');
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  } catch (_) {}
})();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization()) }}
        />
      </head>
      <body className={`${GeistSans.variable} ${manrope.variable} antialiased bg-background text-foreground`}>
        {/* Global decorative background */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        {/* Google Tag Manager (preferred) - only in production */}
        {isProd && (GTM_ID ? (
          <>
            <Script id="gtm-init" strategy="afterInteractive">
              {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `}
            </Script>
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
        ) : (
          /* Google Analytics 4 - only in production */
          (isProd && GA_ID) && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);} 
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
          )
        ))}

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Header />
            <div className="min-h-[60vh]">
              {children}
            </div>
            <FooterConditional />
            <Toaster />
            {/* Client-side route change tracking - only in production */}
          {isProd && (
            <Suspense fallback={null}>
              <AnalyticsTracker />
            </Suspense>
          )}
        </AuthProvider>
      </ThemeProvider>
    </body>
  </html>
)
}
