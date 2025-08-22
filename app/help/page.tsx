export default function HelpPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Help & Support</h1>
      <p className="text-muted-foreground mb-6">
        Find answers to common questions. Add FAQs and guidance specific to your app.
      </p>
      <div className="space-y-4">
        <section>
          <h2 className="text-xl font-semibold">Community moderation</h2>
          <p className="text-muted-foreground">
            Students and users can post in the community. Admins can monitor, moderate, and control features to
            keep the platform safe and helpful.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Need more help?</h2>
          <p className="text-muted-foreground">Contact the ITE team via the Contact page.</p>
        </section>
      </div>
    </main>
  )
}
