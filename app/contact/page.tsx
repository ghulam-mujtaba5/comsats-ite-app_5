import type { Metadata } from "next";
import { createMetadata, jsonLdBreadcrumb } from "@/lib/seo";
import { ContactPageClient } from "./contact-client";

export const metadata: Metadata = createMetadata({
  title: "Contact Us — CampusAxis",
  description: "Get in touch with the CampusAxis team. We typically reply within 24 hours.",
  path: "/contact",
  keywords: ["contact", "support", "CampusAxis", "COMSATS"],
})

export default function ContactPage() {
  return (
    <>
      <ContactPageClient />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])) }}
      />
    </>
  );
}
