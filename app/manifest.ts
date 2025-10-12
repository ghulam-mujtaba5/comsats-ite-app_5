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
      // Fallback icons for better browser support
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon", purpose: "any" },
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