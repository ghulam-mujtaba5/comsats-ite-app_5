import type { Metadata } from "next"
import { createMetadata, jsonLdBreadcrumb, jsonLdFAQ } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Help Center — COMSATS ITE",
  description:
    "Find answers to common questions about CampusAxis: community moderation, past papers, GPA calculator, faculty reviews, and more.",
  path: "/help",
  keywords: ["help center", "faq", "support", "CampusAxis", "COMSATS ITE"],
})

export default function HelpPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Help Center</h1>
      <p className="text-muted-foreground mb-6">
        Answers to common questions about using CampusAxis. If you can't find what you're looking for, please
        visit <a className="underline" href="/support">Support</a> or <a className="underline" href="/contact">Contact Us</a>.
      </p>

      <nav aria-label="Breadcrumb" className="text-sm mb-8 text-muted-foreground">
        <ol className="flex space-x-2">
          <li><a className="hover:underline" href="/">Home</a></li>
          <li>/</li>
          <li aria-current="page" className="text-foreground">Help Center</li>
        </ol>
      </nav>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-2">Community moderation</h2>
          <p className="text-muted-foreground">
            Students and users can post in the community. Admins monitor and moderate to keep the platform safe and helpful.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">FAQs</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">How do I find past papers?</h3>
              <p className="text-muted-foreground">Go to the Past Papers section and filter by course, semester, or instructor.</p>
            </div>
            <div>
              <h3 className="font-semibold">Is the GPA calculator accurate?</h3>
              <p className="text-muted-foreground">Yes, it follows the COMSATS grading scale. Double‑check your course credits and grades for best results.</p>
            </div>
            <div>
              <h3 className="font-semibold">Can I submit feedback or report bugs?</h3>
              <p className="text-muted-foreground">Use the <a className="underline" href="/report-issue">Report an Issue</a> page for bugs or suggestions.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Need more help?</h2>
          <p className="text-muted-foreground">Visit the <a className="underline" href="/support">Support</a> page or <a className="underline" href="/contact">Contact Us</a>.</p>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: "Home", path: "/" }, { name: "Help Center", path: "/help" }])) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ([
          { question: "How do I find past papers?", answer: "Go to the Past Papers section and filter by course, semester, or instructor." },
          { question: "Is the GPA calculator accurate?", answer: "Yes, it follows the COMSATS grading scale. Ensure credits and grades are correct." },
          { question: "Can I submit feedback or report bugs?", answer: "Use the Report an Issue page to submit bugs or suggestions." },
        ])) }}
      />
    </main>
  )
}
