import type { Metadata } from "next"
import { jsonLdBreadcrumb, jsonLdFAQ, createMetadata } from "@/lib/seo"
import { STRUCTURED_DATA } from "@/lib/seo"
import { pageTemplates, GPA_CALCULATOR_FAQS, GPA_CALCULATOR_HOWTO } from "@/lib/seo-config"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, TrendingUp, Target, Info, Calendar, BookOpen, Lightbulb, HelpCircle } from "lucide-react"
import styles from './gpa-calculator.module.css'
import './gpa-calculator.light.module.css'
import './gpa-calculator.dark.module.css'

export const metadata: Metadata = createMetadata({
  title: "COMSATS GPA Calculator - Free Online CGPA Calculator 2025 | CampusAxis",
  description: "Calculate your COMSATS GPA/CGPA instantly with our free online calculator. Supports latest grading scale, semester-wise calculation, and credit hours. Accurate results for COMSATS students.",
  path: "/gpa-calculator",
  keywords: [
    "COMSATS GPA calculator",
    "CUI GPA calculator", 
    "COMSATS CGPA calculator",
    "GPA calculator online free",
    "semester GPA calculator COMSATS",
    "cumulative GPA calculator",
    "aggregate calculator COMSATS",
    "COMSATS grading system",
    "GPA planning calculator",
    "COMSATS University calculator",
    "CUI Lahore GPA calculator",
    "free GPA calculator Pakistan"
  ],
})

export default function GPACalculatorPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
  
  // Structured data for better SEO
  const breadcrumbJsonLd = jsonLdBreadcrumb([
    { name: 'Home', path: '/' },
    { name: 'GPA Calculator', path: '/gpa-calculator' }
  ])
  
  const faqJsonLd = jsonLdFAQ(GPA_CALCULATOR_FAQS.map(faq => ({ question: faq.question, answer: faq.answer })))
  
  const howToJsonLd = STRUCTURED_DATA.howTo(
    GPA_CALCULATOR_HOWTO.name,
    GPA_CALCULATOR_HOWTO.description,
    [...GPA_CALCULATOR_HOWTO.steps]
  )
  
  const webAppJsonLd = STRUCTURED_DATA.webApplication(
    'COMSATS GPA Calculator Suite',
    'Free online GPA calculator for COMSATS University students. Calculate semester GPA, cumulative CGPA, admission aggregate, and plan your academic future.',
    `${siteUrl}/gpa-calculator`,
    [
      'Semester GPA calculator',
      'Cumulative CGPA calculator',
      'Admission aggregate calculator',
      'Future GPA planning',
      'What-if scenario modeling',
      'Credit hours calculation',
      'Grade point conversion'
    ]
  )

  return (
    <div className={`${styles.page} bg-mesh`}>
      {/* Structured Data */}
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, faqJsonLd, howToJsonLd, webAppJsonLd]) }} />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-xs md:text-sm font-medium text-primary mb-4 md:mb-6">
              <Calculator className="h-3 w-3 md:h-4 md:w-4" />
              Academic Tools
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-foreground mb-4 md:mb-6">
              COMSATS <span className="text-gradient">GPA Calculator</span>
            </h1>
            <p className="text-base md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto font-serif leading-relaxed">
              Calculate your semester GPA, cumulative CGPA, admission aggregate, and plan your future semesters with our free COMSATS GPA calculator
            </p>
          </div>

          {/* Enhanced SEO content section */}
          <div className="mb-8 md:mb-12 card-modern p-4 md:p-8 rounded-2xl md:rounded-3xl border-0 backdrop-blur-sm">
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              About COMSATS GPA Calculator
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
              Our COMSATS GPA calculator is specifically designed for students at COMSATS University Islamabad (CUI) 
              to accurately calculate their academic performance according to the university's official grading system. 
              Whether you need to calculate your semester GPA, cumulative CGPA, or admission aggregate, our tools provide 
              precise results based on the latest COMSATS grading scale.
            </p>
            <p className="text-sm md:text-base text-muted-foreground">
              The calculator supports all major GPA calculations including semester GPA, cumulative GPA (CGPA), 
              admission aggregate, and GPA planning for future semesters. It's completely free to use and requires 
              no registration or login.
            </p>
          </div>

          {/* Enhanced SEO bullet points */}
          <div className="mb-8 md:mb-12 grid gap-3 md:gap-4 card-modern p-4 md:p-8 rounded-2xl md:rounded-3xl border-0 backdrop-blur-sm">
            <div className="font-bold text-base md:text-lg text-foreground flex items-center gap-2">
              <Info className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Why use our COMSATS GPA calculators?
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                Accurate GPA calculation based on COMSATS grading scale (A+ to F)
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                Semester, cumulative (CGPA), aggregate and GPA planning in one place
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                Mobile-friendly and fast — no login required to start
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                Plan target GPA with what-if analysis for upcoming semesters
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                Free tool for COMSATS University Islamabad (CUI) students
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                Based on official COMSATS grading system and formulas
              </li>
            </ul>
          </div>

          {/* FAQ Section for SEO */}
          <div className="mb-8 md:mb-12 card-modern p-4 md:p-8 rounded-2xl md:rounded-3xl border-0 backdrop-blur-sm">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-2">How is GPA calculated at COMSATS?</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  COMSATS uses an absolute grading system where GPA is calculated using the formula: 
                  (Sum of Grade Points × Credit Hours) / Total Credit Hours. Our calculator automates 
                  this process for accurate results.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-2">What is the grading scale at COMSATS?</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  COMSATS uses a 4.0 grading scale with grades from A+ (4.0) to F (0.0). 
                  The detailed grading scale is displayed below for reference.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-2">How to improve my GPA at COMSATS?</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Focus on consistent performance across all components: quizzes, assignments, 
                  midterms, and finals. Use our GPA planning calculator to set targets for 
                  upcoming semesters.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-2">Is this calculator accurate for CUI Lahore?</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Yes, our GPA calculator is specifically designed for COMSATS University Islamabad, 
                  including the Lahore campus, and follows the official grading system and formulas.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8 md:mb-12">
            <Card className="card-modern border-0 backdrop-blur-sm">
              <CardHeader className="pb-4 md:pb-6">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl">
                  <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20">
                    <Info className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  COMSATS Grading System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-6 text-center">
                  <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-300">
                    <div className="font-bold text-base md:text-lg text-green-600">A+/A</div>
                    <div className="text-xs md:text-sm text-muted-foreground font-mono">4.0</div>
                  </div>
                  <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300">
                    <div className="font-bold text-base md:text-lg text-blue-600">A-</div>
                    <div className="text-xs md:text-sm text-muted-foreground font-mono">3.67</div>
                  </div>
                  <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300">
                    <div className="font-bold text-base md:text-lg text-purple-600">B+</div>
                    <div className="text-xs md:text-sm text-muted-foreground font-mono">3.33</div>
                  </div>
                  <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20 transition-all duration-300">
                    <div className="font-bold text-base md:text-lg text-orange-600">B</div>
                    <div className="text-xs md:text-sm text-muted-foreground font-mono">3.0</div>
                  </div>
                  <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 transition-all duration-300">
                    <div className="font-bold text-base md:text-lg text-yellow-600">B-</div>
                    <div className="text-xs md:text-sm text-muted-foreground font-mono">2.67</div>
                  </div>
                  <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-gray-500/10 to-slate-500/10 hover:from-gray-500/20 hover:to-slate-500/20 transition-all duration-300">
                    <div className="font-bold text-base md:text-lg text-gray-600">C+</div>
                    <div className="text-xs md:text-sm text-muted-foreground font-mono">2.33</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <Link href="/gpa-calculator/semester" className="group">
              <Card className="card-modern hover-lift transition-all duration-300 border-0 h-full group-hover:shadow-xl group-hover:shadow-primary/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="pb-3 md:pb-4 relative z-10">
                  <CardTitle className="flex items-center gap-3 md:gap-4 text-base md:text-xl">
                    <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 text-primary group-hover:scale-110 transition-transform duration-300">
                      <Calculator className="h-5 w-5 md:h-7 md:w-7" />
                    </div>
                    Semester GPA Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-sm md:text-base text-muted-foreground">Calculate your GPA for the current semester with precision and ease using the COMSATS grading scale.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/gpa-calculator/cumulative" className="group">
              <Card className="card-modern hover-lift transition-all duration-300 border-0 h-full group-hover:shadow-xl group-hover:shadow-blue-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="pb-3 md:pb-4 relative z-10">
                  <CardTitle className="flex items-center gap-3 md:gap-4 text-base md:text-xl">
                    <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="h-5 w-5 md:h-7 md:w-7" />
                    </div>
                    Cumulative GPA Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-sm md:text-base text-muted-foreground">Track your overall academic performance across all semesters with our cumulative CGPA calculator.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/gpa-calculator/aggregate" className="group">
              <Card className="card-modern hover-lift transition-all duration-300 border-0 h-full group-hover:shadow-xl group-hover:shadow-green-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="pb-3 md:pb-4 relative z-10">
                  <CardTitle className="flex items-center gap-3 md:gap-4 text-base md:text-xl">
                    <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-500 group-hover:scale-110 transition-transform duration-300">
                      <Target className="h-5 w-5 md:h-7 md:w-7" />
                    </div>
                    Aggregate Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-sm md:text-base text-muted-foreground">Calculate your admission aggregate score for university applications using the official COMSATS formula.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/gpa-calculator/planning" className="group">
              <Card className="card-modern hover-lift transition-all duration-300 border-0 h-full group-hover:shadow-xl group-hover:shadow-purple-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="pb-3 md:pb-4 relative z-10">
                  <CardTitle className="flex items-center gap-3 md:gap-4 text-base md:text-xl">
                    <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="h-5 w-5 md:h-7 md:w-7" />
                    </div>
                    GPA Planning Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-sm md:text-base text-muted-foreground">Plan your future semesters strategically to achieve your target GPA with our planning tool.</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Tips Section for SEO */}
          <div className="mt-8 md:mt-12 card-modern p-4 md:p-8 rounded-2xl md:rounded-3xl border-0 backdrop-blur-sm">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              Tips for Improving Your COMSATS GPA
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
              <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500/5 to-blue-500/10 border border-blue-200/20">
                <h3 className="font-semibold text-sm md:text-base mb-2">Consistent Performance</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Maintain steady performance across all assessments including quizzes, assignments, midterms, and finals.
                </p>
              </div>
              <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-green-500/5 to-green-500/10 border border-green-200/20">
                <h3 className="font-semibold text-sm md:text-base mb-2">Time Management</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Create a study schedule and stick to it. Allocate time for each subject based on credit hours and difficulty.
                </p>
              </div>
              <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500/5 to-purple-500/10 border border-purple-200/20">
                <h3 className="font-semibold text-sm md:text-base mb-2">Seek Help When Needed</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Don't hesitate to ask faculty members or classmates for help when you're struggling with a concept.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: "Home", path: "/" }, { name: "GPA Calculator", path: "/gpa-calculator" }])) }}
      />
    </div>
  )
}