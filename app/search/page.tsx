import type { Metadata } from "next"
import { createMetadata } from "@/lib/seo"
import { SearchClient } from "./search-client"

// We generally don't want search result pages indexed to avoid thin / duplicate content
// and preserve crawl budget. The global WebSite schema already exposes a SearchAction.
export const metadata: Metadata = createMetadata({
  title: "Search — CampusAxis",
  description: "Search across CampusAxis: past papers, resources, faculty, and more.",
  path: "/search",
  keywords: ["search", "CampusAxis", "past papers", "resources", "faculty"],
  noindex: true,
})

export default function SearchPage() {
  return <SearchClient />
}
