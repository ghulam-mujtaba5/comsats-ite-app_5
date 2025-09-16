import type { Metadata } from "next"
import { jsonLdBreadcrumb, createMetadata } from "@/lib/seo"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, TrendingUp, Target, Info, Calendar } from "lucide-react"


export const metadata: Metadata = createMetadata({
  title: "GPA Calculator — CampusAxis",
  description: "Calculate semester GPA, cumulative GPA, admission aggregate, and plan your future semesters.",
  path: "/gpa-calculator",
  keywords: ["GPA calculator", "CGPA", "aggregate", "COMSATS"],
})

export default function GPACalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-mesh">
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary mb-6">
              <Calculator className="h-4 w-4" />
              Academic Tools
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6">
              GPA <span className="text-gradient">Calculator</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto font-serif leading-relaxed">
              Calculate your semester GPA, cumulative GPA, admission aggregate, and plan your future semesters
            </p>
          </div>

          {/* Enhanced SEO bullet points */}
          <div className="mb-12 grid gap-4 card-modern p-8 rounded-3xl border-0 backdrop-blur-sm">
            <div className="font-bold text-lg text-foreground flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Why use our COMSATS GPA calculators?
            </div>
            <ul className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
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
                Free tool for COMSATS University Lahore (CUI Lahore) students
              </li>
            </ul>
          </div>

          <div className="mb-12">
            <Card className="card-modern border-0 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20">
                    <Info className="h-5 w-5 text-primary" />
                  </div>
                  COMSATS Grading System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-6 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-300">
                    <div className="font-bold text-lg text-green-600">A+/A</div>
                    <div className="text-sm text-muted-foreground font-mono">4.0</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300">
                    <div className="font-bold text-lg text-blue-600">A-</div>
                    <div className="text-sm text-muted-foreground font-mono">3.67</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300">
                    <div className="font-bold text-lg text-purple-600">B+</div>
                    <div className="text-sm text-muted-foreground font-mono">3.33</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20 transition-all duration-300">
                    <div className="font-bold text-lg text-orange-600">B</div>
                    <div className="text-sm text-muted-foreground font-mono">3.0</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 transition-all duration-300">
                    <div className="font-bold text-lg text-yellow-600">B-</div>
                    <div className="text-sm text-muted-foreground font-mono">2.67</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-500/10 to-slate-500/10 hover:from-gray-500/20 hover:to-slate-500/20 transition-all duration-300">
                    <div className="font-bold text-lg text-gray-600">C+</div>
                    <div className="text-sm text-muted-foreground font-mono">2.33</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/gpa-calculator/semester" className="group">
              <Card className="card-modern hover-lift transition-all duration-500 border-0 h-full group-hover:shadow-2xl group-hover:shadow-primary/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="pb-4 relative z-10">
                  <CardTitle className="flex items-center gap-4 text-xl">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 text-primary group-hover:scale-110 transition-transform duration-300">
                      <Calculator className="h-7 w-7" />
                    </div>
                    Semester GPA Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-muted-foreground font-serif text-lg">Calculate your GPA for the current semester with precision and ease.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/gpa-calculator/cumulative" className="group">
              <Card className="card-modern hover-lift transition-all duration-500 border-0 h-full group-hover:shadow-2xl group-hover:shadow-blue-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="pb-4 relative z-10">
                  <CardTitle className="flex items-center gap-4 text-xl">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="h-7 w-7" />
                    </div>
                    Cumulative GPA Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-muted-foreground font-serif text-lg">Track your overall academic performance across all semesters.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/gpa-calculator/aggregate" className="group">
              <Card className="card-modern hover-lift transition-all duration-500 border-0 h-full group-hover:shadow-2xl group-hover:shadow-green-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="pb-4 relative z-10">
                  <CardTitle className="flex items-center gap-4 text-xl">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-500 group-hover:scale-110 transition-transform duration-300">
                      <Target className="h-7 w-7" />
                    </div>
                    Aggregate Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-muted-foreground font-serif text-lg">Calculate your admission aggregate score for university applications.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/gpa-calculator/planning" className="group">
              <Card className="card-modern hover-lift transition-all duration-500 border-0 h-full group-hover:shadow-2xl group-hover:shadow-purple-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="pb-4 relative z-10">
                  <CardTitle className="flex items-center gap-4 text-xl">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="h-7 w-7" />
                    </div>
                    GPA Planning Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-muted-foreground font-serif text-lg">Plan your future semesters strategically to achieve your target GPA.</p>
                </CardContent>
              </Card>
            </Link>
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
