import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  return {
    name: "CampusAxis",
    short_name: "CampusAxis",
    description:
      "Your ultimate academic portal. Access past papers, calculate your GPA, read faculty reviews, and explore a wealth of academic resources.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b0b0b",
    lang: "en-PK",
    icons: [
      {
        src: "/new%20logo.jpg",
        sizes: "192x192",
        type: "image/jpeg",
        purpose: "maskable any",
      },
      {
        src: "/new%20logo.jpg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "maskable any",
      },
    ],
    categories: ["education", "productivity"],
    dir: "ltr",
    orientation: "portrait-primary",
    prefer_related_applications: false,
    shortcuts: [
      {
        name: "Past Papers",
        short_name: "Papers",
        description: "Browse and download past exam papers",
        url: "/past-papers",
        icons: [{ src: "/new%20logo.jpg", sizes: "96x96" }],
      },
      {
        name: "GPA Calculator",
        short_name: "GPA",
        description: "Calculate your GPA and CGPA",
        url: "/gpa-calculator",
        icons: [{ src: "/new%20logo.jpg", sizes: "96x96" }],
      },
    ],
  }
}
