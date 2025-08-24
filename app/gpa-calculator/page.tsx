"use client"

import { jsonLdBreadcrumb } from "@/lib/seo"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, TrendingUp, Target, Info, Calendar } from "lucide-react"


export default function GPACalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">GPA Calculator</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculate your semester GPA, cumulative GPA, admission aggregate, and plan your future semesters
            </p>
          </div>

          {/* SEO bullet points */}
          <div className="mb-10 grid gap-3 bg-muted/30 border rounded-lg p-5">
            <div className="font-semibold">Why use our COMSATS GPA calculators?</div>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Accurate GPA calculation based on COMSATS grading scale (A+ to F)</li>
              <li>Semester, cumulative (CGPA), aggregate and GPA planning in one place</li>
              <li>Mobile-friendly and fast — no login required to start</li>
              <li>Plan target GPA with what-if analysis for upcoming semesters</li>
              <li>Free tool for COMSATS University Lahore (CUI Lahore) students</li>
            </ul>
          </div>

          <div className="mb-8">
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  COMSATS Grading System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold">A+/A</div>
                    <div className="text-muted-foreground">4.0</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">A-</div>
                    <div className="text-muted-foreground">3.67</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">B+</div>
                    <div className="text-muted-foreground">3.33</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">B</div>
                    <div className="text-muted-foreground">3.0</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">B-</div>
                    <div className="text-muted-foreground">2.67</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">C+</div>
                    <div className="text-muted-foreground">2.33</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/gpa-calculator/semester">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Calculator className="h-6 w-6 text-primary" />
                    Semester GPA Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Calculate your GPA for the current semester.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/gpa-calculator/cumulative">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    Cumulative GPA Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Track your overall academic performance.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/gpa-calculator/aggregate">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Target className="h-6 w-6 text-primary" />
                    Aggregate Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Calculate your admission aggregate score.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/gpa-calculator/planning">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-primary" />
                    GPA Planning Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Plan your future semesters to achieve your target GPA.</p>
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
