import { createMetadata } from "@/lib/seo";
import { ContactPageClient } from "./contact-client";

export const metadata = createMetadata({
  title: "Contact Us",
  description: "Get in touch with the CampusAxis team. We typically reply within 24 hours.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageClient />;
}
