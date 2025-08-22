import { Footer } from "@/components/layout/footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="mt-2 text-lg text-muted-foreground">Last Updated: August 22, 2025</p>
          </div>

          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
              <p>
                Welcome to CampusAxis. This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you use our platform. We are committed to protecting your personal data and your right
                to privacy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
              <p>
                We may collect personal information that you voluntarily provide to us when you register on the
                platform, including your name, university email address (@cuilahore.edu.pk), and password. We may also
                collect non-personal information, such as browser type, operating system, and usage details.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                <li>Create and manage your account.</li>
                <li>Provide, operate, and maintain our services.</li>
                <li>Improve, personalize, and expand our services.</li>
                <li>Communicate with you, including for customer service and to provide you with updates.</li>
                <li>Ensure the security of our platform and prevent fraud.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Sharing and Disclosure</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personally identifiable information to outside
                parties. This does not include trusted third parties who assist us in operating our platform, so long as
                those parties agree to keep this information confidential.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
              <p>
                We implement a variety of security measures to maintain the safety of your personal information. However,
                no electronic transmission or storage is 100% secure, and we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at support@campusaxis.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
