import type { Metadata } from "next"
import { createMetadata, jsonLdBreadcrumb } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Terms of Service — CampusAxis",
  description: "The rules and conditions for using CampusAxis.",
  path: "/terms",
  keywords: ["terms", "tos", "conditions", "CampusAxis"],
})

export default function TermsPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-muted-foreground mb-6">Please read these terms carefully before using CampusAxis.</p>

      <nav aria-label="Breadcrumb" className="text-sm mb-8 text-muted-foreground">
        <ol className="flex space-x-2">
          <li><a className="hover:underline" href="/">Home</a></li>
          <li>/</li>
          <li aria-current="page" className="text-foreground">Terms of Service</li>
        </ol>
      </nav>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Acceptance of Terms</h2>
        <p className="text-muted-foreground">By accessing or using CampusAxis, you agree to these terms and all applicable policies.</p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">User Responsibilities</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Follow community guidelines and respect others.</li>
          <li>Do not post prohibited or unlawful content.</li>
          <li>Use the platform for academic support purposes only.</li>
        </ul>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Content Moderation</h2>
        <p className="text-muted-foreground">Admins may remove content and restrict features to protect the community.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p className="text-muted-foreground">Questions about these terms? Contact us at campusaxis0@gmail.com.</p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: "Home", path: "/" }, { name: "Terms of Service", path: "/terms" }])) }}
      />
    </main>
  )
}
