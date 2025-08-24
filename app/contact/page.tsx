import type { Metadata } from "next";
import { createMetadata, jsonLdBreadcrumb } from "@/lib/seo";
import { Footer } from "@/components/layout/footer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = createMetadata({
  title: "Contact Us — CampusAxis",
  description: "Get in touch with the CampusAxis team. We typically reply within 24 hours.",
  path: "/contact",
  keywords: ["contact", "support", "CampusAxis", "COMSATS"],
})

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              We're here to help. Reach out with any questions or feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Get in Touch</h2>
                <p className="text-muted-foreground">
                  Fill out the form and our team will get back to you within 24 hours.
                </p>
              </div>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Enter your message" className="min-h-[120px]" />
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong>Address:</strong> COMSATS University Lahore, Defence Road, Off Raiwind Road, Lahore.
                  </p>
                  <p>
                    <strong>Email:</strong> campusaxis0@gmail.com
                  </p>
                  <p>
                    <strong>Phone:</strong> +92-42-111-001-007
                  </p>
                  <p>
                    <strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])) }}
      />
      <Footer />
    </div>
  );
}
