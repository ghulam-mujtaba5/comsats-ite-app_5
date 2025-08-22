import { Footer } from "@/components/layout/footer";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">About CampusAxis</h1>
            <p className="mt-2 text-lg text-muted-foreground">Empowering COMSATS University Lahore Students</p>
          </div>

          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
              <p>
                Our mission is to provide a centralized, comprehensive academic portal for the students of COMSATS
                University Lahore. We aim to streamline access to essential resources, foster a collaborative learning
                environment, and empower students to achieve academic excellence.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">What We Offer</h2>
              <p>
                CampusAxis is a one-stop solution for all your academic needs. Our platform offers a wide range of
                features, including:
              </p>
              <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                <li>
                  <strong>Past Papers Repository:</strong> Access a vast collection of past exam papers to prepare
                  effectively.
                </li>
                <li>
                  <strong>GPA Tools:</strong> Calculate, plan, and forecast your GPA with our easy-to-use calculators.
                </li>
                <li>
                  <strong>Faculty Reviews:</strong> Share and read honest reviews to make informed decisions about your
                  courses.
                </li>
                <li>
                  <strong>Learning Resources:</strong> Find and share study materials, notes, and other valuable
                  resources.
                </li>
                <li>
                  <strong>Timetable Management:</strong> Organize your class schedule and never miss a lecture.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Our Commitment</h2>
              <p>
                We are dedicated to continuously improving and expanding our platform to meet the evolving needs of the
                student community. Our goal is to create a tool that is not only useful but also an integral part of the
                university experience at COMSATS Lahore.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
