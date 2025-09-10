import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
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
        sizes: "any",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
  }
}
