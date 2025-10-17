// Footer is provided by the root layout; avoid importing locally to prevent duplicates
import type { Metadata } from 'next'
import layout from "@/app/styles/common.module.css"
export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms governing the use of CampusAxis platform.',
  alternates: { canonical: '/legal/terms-of-service' },
  openGraph: { title: 'Terms of Service - CampusAxis', description: 'User responsibilities and platform rules.' }
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className={`${layout.section} ${layout.max3xl} space-y-8`}>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
              '@context':'https://schema.org','@type':'WebPage',
              name:'Terms of Service',
              url:(process.env.NEXT_PUBLIC_SITE_URL||'https://campusaxis.site')+'/legal/terms-of-service',
              description:'Contractual terms for using CampusAxis services.'
            }) }} />
            <p className="mt-2 text-lg text-muted-foreground">Last Updated: August 22, 2025</p>
          </div>

          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using CampusAxis, you accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by these terms, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. User Conduct</h2>
              <p>
                You agree to use the platform only for lawful purposes. You are prohibited from posting on or
                transmitting through the site any material that is infringing, threatening, defamatory, obscene, or
                otherwise objectionable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Account Registration</h2>
              <p>
                To access certain features, you must register for an account using a valid university email address
                (@cuilahore.edu.pk). You are responsible for maintaining the confidentiality of your account information
                and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Termination of Use</h2>
              <p>
                We may, in our sole discretion, terminate or suspend your access to all or part of the platform for any
                reason, including, without limitation, breach of these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Disclaimer of Warranties</h2>
              <p>
                The service is provided on an "as is" and "as available" basis. We expressly disclaim all warranties of
                any kind, whether express or implied, including, but not limited to, the implied warranties of
                merchantability, fitness for a particular purpose, and non-infringement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at campusaxis0@gmail.com.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
