import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import {
  createItemListSchema,
  createFAQPageSchema,
  createBreadcrumbSchema,
  createCourseSchema
} from '@/lib/advanced-schema'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'

// Past Papers FAQ
const pastPapersFAQs = [
  {
    question: 'Where can I find COMSATS past papers?',
    answer: 'CampusAxis provides the largest collection of COMSATS past papers for all campuses, departments, and courses. Papers are organized by semester, year, and subject for easy access and download.'
  },
  {
    question: 'Are the past papers official and reliable?',
    answer: 'Past papers are contributed by verified COMSATS students who have taken the exams. While we verify all submissions, use them as comprehensive study guides alongside your course materials.'
  },
  {
    question: 'How do I download COMSATS past papers?',
    answer: 'Simply select your campus, department, and course. Browse available papers by semester and year, then click the download button. All past papers are completely free for registered students.'
  },
  {
    question: 'Which COMSATS campuses are covered?',
    answer: 'We have past papers for all COMSATS campuses: Islamabad, Lahore, Attock, Wah, Abbottabad, Sahiwal, and Vehari. Coverage varies by department and course.'
  },
  {
    question: 'Can I contribute my past papers?',
    answer: 'Yes! We encourage students to share their past papers to help the community. Upload through your dashboard and earn contribution points redeemable for premium features.'
  },
  {
    question: 'How effective are past papers for exam preparation?',
    answer: 'Past papers are highly effective! They help you understand exam patterns, identify frequently asked questions, practice time management, and familiarize yourself with different instructor styles.'
  }
]

export const metadata: Metadata = {
  title: 'COMSATS Past Papers - Download Previous Years Papers Free',
  description: 'Download COMSATS University past papers for all campuses, departments, and courses. Complete collection of previous years\' papers, mid-term, final exams. Free access for Islamabad, Lahore, Attock, Wah, Abbottabad, Sahiwal, Vehari campuses.',
  keywords: [
    'COMSATS past papers',
    'COMSATS previous papers',
    'COMSATS old papers',
    'COMSATS exam papers',
    'download COMSATS papers',
    'COMSATS Islamabad past papers',
    'COMSATS Lahore past papers',
    'COMSATS CS past papers',
    'COMSATS engineering papers',
    'COMSATS mid term papers',
    'COMSATS final papers',
    'free past papers Pakistan'
  ],
  alternates: {
    canonical: '/past-papers'
  },
  openGraph: {
    title: 'COMSATS Past Papers - Complete Collection Free Download',
    description: 'Access the largest collection of COMSATS past papers. All campuses, all departments, all courses. Download free.',
    url: `${siteUrl}/past-papers`,
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-past-papers.png`,
        width: 1200,
        height: 630,
        alt: 'COMSATS Past Papers Collection'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'COMSATS Past Papers - Free Download',
    description: 'Complete collection of COMSATS past papers. All campuses, all courses. Free access.',
    images: [`${siteUrl}/og-past-papers.png`]
  }
}

export default function ComcatsPastPapersPage() {
  const breadcrumbs = [
    { name: 'Home', url: siteUrl },
    { name: 'Resources', url: `${siteUrl}/resources` },
    { name: 'Past Papers', url: `${siteUrl}/past-papers` }
  ]

  const popularDepartments = [
    { name: 'Computer Science (CS)', url: '/past-papers?dept=cs', papers: 450 },
    { name: 'Software Engineering (SE)', url: '/past-papers?dept=se', papers: 380 },
    { name: 'Electrical Engineering (EE)', url: '/past-papers?dept=ee', papers: 320 },
    { name: 'Business Administration (BBA)', url: '/past-papers?dept=bba', papers: 290 },
    { name: 'Mathematics', url: '/past-papers?dept=math', papers: 250 },
    { name: 'Physics', url: '/past-papers?dept=physics', papers: 220 }
  ]

  const campuses = [
    { name: 'Islamabad', slug: 'islamabad', papers: 1200 },
    { name: 'Lahore', slug: 'lahore', papers: 950 },
    { name: 'Attock', slug: 'attock', papers: 680 },
    { name: 'Wah', slug: 'wah', papers: 590 },
    { name: 'Abbottabad', slug: 'abbottabad', papers: 520 },
    { name: 'Sahiwal', slug: 'sahiwal', papers: 450 },
    { name: 'Vehari', slug: 'vehari', papers: 380 }
  ]

  return (
    <>
      {/* Structured Data */}
      <Script
        id="pastpapers-itemlist-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createItemListSchema(
            popularDepartments.map(dept => ({
              name: `COMSATS ${dept.name} Past Papers`,
              url: `${siteUrl}${dept.url}`,
              description: `${dept.papers}+ past papers available`
            })),
            'COMSATS Past Papers by Department'
          ))
        }}
      />
      <Script
        id="pastpapers-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createFAQPageSchema(pastPapersFAQs))
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
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              COMSATS Past Papers
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-4">
              Download previous years' exam papers for all COMSATS campuses
            </p>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8">
              5,000+ past papers • All departments • Mid-term & Final exams • 100% Free
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-600">5,000+</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Past Papers</div>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-600">7</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Campuses</div>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-600">50+</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Departments</div>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-600">Free</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Always</div>
              </div>
            </div>

            <Link
              href="/past-papers"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-8 py-4 rounded-lg text-lg hover:shadow-xl transition-all"
            >
              Browse Past Papers →
            </Link>
          </div>
        </section>

        {/* Search by Campus */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/40 dark:bg-slate-900/40">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Browse by Campus</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campuses.map((campus) => (
                <Link
                  key={campus.slug}
                  href={`/past-papers?campus=${campus.slug}`}
                  className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all border-2 border-transparent hover:border-purple-500"
                >
                  <h3 className="text-xl font-semibold mb-2">COMSATS {campus.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    {campus.papers}+ papers available
                  </p>
                  <div className="text-purple-600 dark:text-purple-400 font-medium">
                    View Papers →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Departments */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Popular Departments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularDepartments.map((dept) => (
                <Link
                  key={dept.url}
                  href={dept.url}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all"
                >
                  <h3 className="text-lg font-semibold mb-2">{dept.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    {dept.papers}+ past papers
                  </p>
                  <div className="text-purple-600 dark:text-purple-400 font-medium">
                    Browse Papers →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How to Use Past Papers */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/40 dark:bg-slate-900/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">How to Use Past Papers Effectively</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="font-semibold text-lg mb-2">Study Question Patterns</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Identify frequently asked questions and important topics that appear regularly in exams.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
                <div className="text-4xl mb-4">⏱️</div>
                <h3 className="font-semibold text-lg mb-2">Practice Time Management</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Simulate exam conditions by timing yourself while solving past papers.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-semibold text-lg mb-2">Understand Exam Format</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Familiarize yourself with question types, marking schemes, and exam structure.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
                <div className="text-4xl mb-4">✍️</div>
                <h3 className="font-semibold text-lg mb-2">Self-Assessment</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Test your knowledge and identify weak areas that need more preparation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {pastPapersFAQs.map((faq, idx) => (
                <details key={idx} className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                  <summary className="font-semibold cursor-pointer text-lg">{faq.question}</summary>
                  <p className="mt-3 text-slate-600 dark:text-slate-400">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Contribute to the Community</h2>
            <p className="text-lg mb-8 opacity-90">
              Have past papers to share? Help thousands of students by contributing your papers.
            </p>
            <Link
              href="/contribute"
              className="inline-block bg-white text-purple-600 font-semibold px-8 py-4 rounded-lg text-lg hover:shadow-xl transition-all"
            >
              Upload Past Papers
            </Link>
          </div>
        </section>

        {/* Related Resources */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Related Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/gpa-calculator" className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all text-center">
                <div className="text-4xl mb-3">🧮</div>
                <h3 className="font-semibold mb-2">GPA Calculator</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Calculate your COMSATS GPA</p>
              </Link>
              <Link href="/timetable" className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all text-center">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="font-semibold mb-2">Timetable</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">View class schedules</p>
              </Link>
              <Link href="/faculty" className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all text-center">
                <div className="text-4xl mb-3">👨‍🏫</div>
                <h3 className="font-semibold mb-2">Faculty Reviews</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Read teacher reviews</p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
