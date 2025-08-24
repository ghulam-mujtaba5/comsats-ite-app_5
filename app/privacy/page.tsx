import type { Metadata } from "next"
import { createMetadata, jsonLdBreadcrumb } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy — CampusAxis",
  description: "How CampusAxis collects, uses, and protects your data.",
  path: "/privacy",
  keywords: ["privacy policy", "data", "cookies", "CampusAxis"],
})

export default function PrivacyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-muted-foreground mb-6">We value your privacy. The following explains what we collect and how we use it.</p>

      <nav aria-label="Breadcrumb" className="text-sm mb-8 text-muted-foreground">
        <ol className="flex space-x-2">
          <li><a className="hover:underline" href="/">Home</a></li>
          <li>/</li>
          <li aria-current="page" className="text-foreground">Privacy Policy</li>
        </ol>
      </nav>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Information We Collect</h2>
        <p className="text-muted-foreground">Account details (name, email) if you create an account. Basic usage analytics to improve the product.</p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Use of Cookies</h2>
        <p className="text-muted-foreground">We use essential cookies for authentication and preferences. You may disable non-essential cookies in your browser.</p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Data Retention</h2>
        <p className="text-muted-foreground">We retain data only as long as necessary to provide the service and comply with legal obligations.</p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="text-xl font-semibold">Your Rights</h2>
        <p className="text-muted-foreground">You may request access, correction, or deletion of your personal data by contacting us.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p className="text-muted-foreground">Questions about this policy? Reach us at campusaxis0@gmail.com.</p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy" }])) }}
      />
    </main>
  )
}
