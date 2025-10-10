import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
  return {
    name: "CampusAxis - COMSATS Community Platform",
    short_name: "CampusAxis",
    description:
      "Your ultimate academic portal. Access past papers, calculate your GPA, read faculty reviews, and explore a wealth of academic resources. Connect with fellow students in our community platform.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b0b0b",
    lang: "en-PK",
    orientation: "portrait-primary",
    display_override: ["window-controls-overlay", "minimal-ui"],
    shortcuts: [
      {
        name: "Community Feed",
        url: "/community",
        description: "View latest community discussions"
      },
      {
        name: "Faculty Reviews",
        url: "/faculty",
        description: "Browse faculty member reviews"
      },
      {
        name: "Past Papers",
        url: "/past-papers",
        description: "Access past exam papers"
      },
      {
        name: "GPA Calculator",
        url: "/gpa-calculator",
        description: "Calculate your GPA"
      }
    ],
    categories: ["education", "social", "productivity", "utilities"],
    icons: [
      // Primary square logo for PWA
      { src: "/logo-square.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      // PNG icons generated from square logo
      { src: "/icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
      // Fallback icons for better browser support
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon", purpose: "any" },
      // Maskable icons for better PWA experience
      { src: "/icon-maskable-192x192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      // Additional sizes for better device support
      { src: "/icon-72x72.png", sizes: "72x72", type: "image/png", purpose: "any" },
      { src: "/icon-96x96.png", sizes: "96x96", type: "image/png", purpose: "any" },
      { src: "/icon-128x128.png", sizes: "128x128", type: "image/png", purpose: "any" },
      { src: "/icon-144x144.png", sizes: "144x144", type: "image/png", purpose: "any" },
      { src: "/icon-152x152.png", sizes: "152x152", type: "image/png", purpose: "any" },
      { src: "/icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-384x384.png", sizes: "384x384", type: "image/png", purpose: "any" },
      { src: "/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
    screenshots: [
      {
        src: "/screenshots/community-feed.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Community Feed"
      },
      {
        src: "/screenshots/community-mobile.png",
        sizes: "720x1280",
        type: "image/png",
        form_factor: "narrow",
        label: "Community on Mobile"
      },
      {
        src: "/screenshots/faculty-reviews.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Faculty Reviews"
      }
    ],
    related_applications: [
      {
        platform: "webapp",
        url: `${siteUrl}/manifest.webmanifest`
      }
    ],
    // Additional properties for better cross-browser compatibility
    prefer_related_applications: false,
  }
}