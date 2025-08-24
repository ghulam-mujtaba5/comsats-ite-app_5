import type { Metadata } from "next"
import { createMetadata, jsonLdBreadcrumb, jsonLdFAQ } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Support — CampusAxis",
  description:
    "Get support for CampusAxis: account help, reporting issues, feature requests, and general guidance.",
  path: "/support",
  keywords: ["support", "help", "report issue", "feature request", "CampusAxis"],
})

export default function SupportPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Support</h1>
      <p className="text-muted-foreground mb-6">How can we help you today?</p>

      <nav aria-label="Breadcrumb" className="text-sm mb-8 text-muted-foreground">
        <ol className="flex space-x-2">
          <li><a className="hover:underline" href="/">Home</a></li>
          <li>/</li>
          <li aria-current="page" className="text-foreground">Support</li>
        </ol>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="text-xl font-semibold mb-2">Report an Issue</h2>
          <p className="text-muted-foreground mb-3">Found a bug or want to suggest an improvement?</p>
          <a className="underline" href="/report-issue">Go to Report an Issue</a>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Help Center</h2>
          <p className="text-muted-foreground mb-3">Browse FAQs and common questions.</p>
          <a className="underline" href="/help">Visit Help Center</a>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
          <p className="text-muted-foreground mb-3">Need direct assistance? Reach out to our team.</p>
          <a className="underline" href="/contact">Open Contact Page</a>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Policies</h2>
          <p className="text-muted-foreground mb-3">Review our Privacy Policy and Terms of Service.</p>
          <div className="space-x-4">
            <a className="underline" href="/privacy">Privacy Policy</a>
            <a className="underline" href="/terms">Terms of Service</a>
          </div>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Top Support FAQs</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>How to calculate GPA accurately using CampusAxis</li>
          <li>Where to find past papers for a specific course</li>
          <li>How to submit faculty reviews responsibly</li>
        </ul>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: "Home", path: "/" }, { name: "Support", path: "/support" }])) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ([
          { question: "How do I report a bug?", answer: "Go to the Report an Issue page and provide a clear title and description." },
          { question: "How can I contact the team?", answer: "Use the Contact page — we typically respond within 24 hours." },
          { question: "Where are the policies?", answer: "Read our Privacy Policy and Terms of Service accessible from Support." },
        ])) }}
      />
    </main>
  )
}
