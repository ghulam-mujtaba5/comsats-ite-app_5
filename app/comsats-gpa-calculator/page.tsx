import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import {
  createGPACalculatorSchema,
  createGPACalculationHowTo,
  createGPACalculatorFAQs,
  createBreadcrumbSchema,
  createWebSiteSearchSchema
} from '@/lib/advanced-schema'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'

export const metadata: Metadata = {
  title: 'COMSATS GPA Calculator - Free Online CGPA Calculator 2025',
  description: 'Calculate your COMSATS University GPA and CGPA instantly with our free, accurate calculator. Works for all COMSATS campuses: Islamabad, Lahore, Attock, Wah, Abbottabad, Sahiwal, Vehari. Get semester GPA, cumulative CGPA, and grade predictions.',
  keywords: [
    'COMSATS GPA calculator',
    'COMSATS CGPA calculator',
    'COMSATS University GPA',
    'calculate COMSATS GPA',
    'COMSATS grading system',
    'COMSATS semester GPA',
    'COMSATS cumulative GPA',
    'GPA calculator Pakistan',
    'COMSATS Lahore GPA',
    'COMSATS Islamabad GPA',
    'free GPA calculator',
    'university GPA calculator'
  ],
  alternates: {
    canonical: '/gpa-calculator'
  },
  openGraph: {
    title: 'COMSATS GPA Calculator - Calculate Your CGPA Instantly',
    description: 'Free, accurate GPA calculator for COMSATS University students. Calculate semester and cumulative GPA for all campuses.',
    url: `${siteUrl}/gpa-calculator`,
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-gpa-calculator.png`,
        width: 1200,
        height: 630,
        alt: 'COMSATS GPA Calculator'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'COMSATS GPA Calculator - Free CGPA Calculator',
    description: 'Calculate your COMSATS GPA instantly. Works for all campuses. Free and accurate.',
    images: [`${siteUrl}/og-gpa-calculator.png`]
  }
}

export default function ComsatsGPACalculatorPage() {
  const breadcrumbs = [
    { name: 'Home', url: siteUrl },
    { name: 'Tools', url: `${siteUrl}/resources` },
    { name: 'GPA Calculator', url: `${siteUrl}/gpa-calculator` }
  ]

  return (
    <>
      {/* Structured Data */}
      <Script
        id="gpa-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createGPACalculatorSchema())
        }}
      />
      <Script
        id="gpa-howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createGPACalculationHowTo())
        }}
      />
      <Script
        id="gpa-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createGPACalculatorFAQs())
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createBreadcrumbSchema(breadcrumbs))
        }}
      />

      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-[#0f1115] dark:via-[#181c22] dark:to-[#1a1f27]">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              COMSATS GPA Calculator
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              Calculate your semester GPA and cumulative CGPA for COMSATS University instantly. 
              Free, accurate, and works for all campuses.
            </p>
            
            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold mb-1">Instant Results</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Calculate in seconds</p>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold mb-1">100% Accurate</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Official COMSATS formula</p>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="text-3xl mb-2">🌍</div>
                <h3 className="font-semibold mb-1">All Campuses</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Works everywhere</p>
              </div>
            </div>

            {/* CTA to actual calculator */}
            <Link
              href="/gpa-calculator"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-lg text-lg hover:shadow-xl transition-all"
            >
              Open GPA Calculator →
            </Link>
          </div>
        </section>

        {/* How to Calculate Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/40 dark:bg-slate-900/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">How to Calculate Your COMSATS GPA</h2>
            
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Enter Your Courses</h3>
                    <p className="text-slate-600 dark:text-slate-400">Add all courses from your current semester with their course codes and credit hours.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Input Your Grades</h3>
                    <p className="text-slate-600 dark:text-slate-400">Select the letter grade (A, A-, B+, B, etc.) you received in each course.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Add Previous CGPA (Optional)</h3>
                    <p className="text-slate-600 dark:text-slate-400">For cumulative GPA, enter your previous CGPA and completed credit hours.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">4</div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Get Instant Results</h3>
                    <p className="text-slate-600 dark:text-slate-400">Click calculate to see your semester GPA and updated CGPA immediately.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMSATS Grading Scale */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">COMSATS Grading System</h2>
            <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">Letter Grade</th>
                    <th className="px-6 py-3 text-left">Marks Range</th>
                    <th className="px-6 py-3 text-left">Grade Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {[
                    { grade: 'A', range: '85-100%', points: '4.00' },
                    { grade: 'A-', range: '80-84%', points: '3.67' },
                    { grade: 'B+', range: '75-79%', points: '3.33' },
                    { grade: 'B', range: '71-74%', points: '3.00' },
                    { grade: 'B-', range: '68-70%', points: '2.67' },
                    { grade: 'C+', range: '64-67%', points: '2.33' },
                    { grade: 'C', range: '61-63%', points: '2.00' },
                    { grade: 'C-', range: '58-60%', points: '1.67' },
                    { grade: 'D+', range: '54-57%', points: '1.33' },
                    { grade: 'D', range: '50-53%', points: '1.00' },
                    { grade: 'F', range: 'Below 50%', points: '0.00' }
                  ].map((item) => (
                    <tr key={item.grade} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                      <td className="px-6 py-4 font-semibold">{item.grade}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.range}</td>
                      <td className="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">{item.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/40 dark:bg-slate-900/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'How do I calculate my COMSATS GPA?',
                  a: 'Enter your courses with credit hours, input letter grades, and optionally add previous CGPA. The calculator uses the official COMSATS grading formula to compute your results instantly.'
                },
                {
                  q: 'What\'s the difference between GPA and CGPA?',
                  a: 'GPA is your Grade Point Average for one semester, while CGPA (Cumulative GPA) is your overall performance across all completed semesters.'
                },
                {
                  q: 'What GPA do I need for a scholarship?',
                  a: 'COMSATS scholarships require: 100% waiver (CGPA ≥ 3.75), 50% waiver (CGPA ≥ 3.50), 25% waiver (CGPA ≥ 3.25).'
                },
                {
                  q: 'Does this work for all COMSATS campuses?',
                  a: 'Yes! Works for Islamabad, Lahore, Attock, Wah, Abbottabad, Sahiwal, and Vehari as they all use the same grading system.'
                }
              ].map((faq, idx) => (
                <details key={idx} className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                  <summary className="font-semibold cursor-pointer">{faq.q}</summary>
                  <p className="mt-3 text-slate-600 dark:text-slate-400">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Related Tools */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Related Tools & Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/gpa-calculator/cumulative" className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all">
                <h3 className="font-semibold text-lg mb-2">Cumulative GPA Calculator</h3>
                <p className="text-slate-600 dark:text-slate-400">Calculate your overall CGPA across all semesters</p>
              </Link>
              <Link href="/gpa-calculator/planning" className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all">
                <h3 className="font-semibold text-lg mb-2">GPA Planner</h3>
                <p className="text-slate-600 dark:text-slate-400">Plan future semesters to reach your target GPA</p>
              </Link>
              <Link href="/past-papers" className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all">
                <h3 className="font-semibold text-lg mb-2">Past Papers</h3>
                <p className="text-slate-600 dark:text-slate-400">Download COMSATS past papers for exam prep</p>
              </Link>
              <Link href="/blog/comsats-grading-system" className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all">
                <h3 className="font-semibold text-lg mb-2">Grading System Guide</h3>
                <p className="text-slate-600 dark:text-slate-400">Learn about COMSATS grading in detail</p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
