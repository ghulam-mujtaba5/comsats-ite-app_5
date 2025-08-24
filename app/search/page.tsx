import type { Metadata } from "next"
import { createMetadata } from "@/lib/seo"
import { SearchClient } from "./search-client"

export const metadata: Metadata = createMetadata({
  title: "Search — CampusAxis",
  description: "Search across CampusAxis: past papers, resources, faculty, and more.",
  path: "/search",
  keywords: ["search", "CampusAxis", "past papers", "resources", "faculty"],
})

export default function SearchPage() {
  return <SearchClient />
}
