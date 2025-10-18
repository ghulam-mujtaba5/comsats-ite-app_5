import { createMetadata } from '@/lib/seo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, MapPin, Users, Building, Award, Zap } from 'lucide-react'
import Link from 'next/link'

export const metadata = createMetadata({
  title: "COMSATS Admission Process 2025: Complete Step-by-Step Guide",
  description: "Everything you need to know about COMSATS University admission 2025. Entry test preparation, merit calculation, campus selection, fee structure, and expert tips from admitted students.",
  keywords: [
    "COMSATS admission 2025",
    "COMSATS entry test",
    "COMSATS merit list",
    "university admission Pakistan",
    "COMSATS fee structure",
    "admission requirements",
    "COMSATS eligibility"
  ]
})

export default function ComsatsAdmissionGuide2025() {
  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-[#0f1115] dark:via-[#181c22] dark:to-[#1a1f27]">
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4573df] to-[#667eea] bg-clip-text text-transparent">
            COMSATS University Admission Process 2025: Complete Guide
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Your step-by-step roadmap to securing admission in Pakistan's top technology university
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>📚 20 min read</span>
            <span>•</span>
            <span>Updated for Fall 2025 Admissions</span>
            <span>•</span>
            <span>Official Information</span>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <Card className="text-center glass-card-info border-0">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-[#4573df]">7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Campuses</div>
            </CardContent>
          </Card>
          <Card className="text-center glass-card-info border-0">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-[#667eea]">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Degree Programs</div>
            </CardContent>
          </Card>
          <Card className="text-center glass-card-info border-0">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-[#ff9800]">15,000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Admitted Annually</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">85%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Employment Rate</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-12">
          {/* Timeline Overview */}
          <section>
            <h2 className="text-3xl font-bold mb-6">📅 Admission Timeline 2025</h2>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="bg-[#4573df] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">June 2025: Application Opens</h3>
                  <p className="text-gray-600 dark:text-gray-400">Submit online application, pay fee, upload documents</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-[#667eea] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">July 2025: Entry Test</h3>
                  <p className="text-gray-600 dark:text-gray-400">Appear in COMSATS entry test or submit SAT/NAT scores</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-[#ff9800] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">August 2025: Merit Lists</h3>
                  <p className="text-gray-600 dark:text-gray-400">Check merit lists, receive admission offers</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">September 2025: Enrollment</h3>
                  <p className="text-gray-600 dark:text-gray-400">Pay fee challan, complete enrollment, start classes</p>
                </div>
              </div>
            </div>
          </section>

          {/* Eligibility Requirements */}
          <section>
            <h2 className="text-3xl font-bold mb-6">✅ Eligibility Requirements</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-[#4573df]/30">
                <CardHeader>
                  <CardTitle>Undergraduate Programs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-[#4573df]">✓</span>
                    <div>
                      <strong>FSc Pre-Engineering/ICS:</strong> Minimum 60% marks
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#4573df]">✓</span>
                    <div>
                      <strong>A-Levels:</strong> Minimum 2 A's and 1 B (or equivalent)
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#4573df]">✓</span>
                    <div>
                      <strong>DAE:</strong> Minimum 60% marks (3-year diploma)
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#4573df]">✓</span>
                    <div>
                      <strong>Age Limit:</strong> No age limit for admissions
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#667eea]/30">
                <CardHeader>
                  <CardTitle>Test Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-[#667eea]">✓</span>
                    <div>
                      <strong>COMSATS Entry Test:</strong> Conduct by university
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#667eea]">✓</span>
                    <div>
                      <strong>SAT I:</strong> Minimum 900/1600 (accepted)
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#667eea]">✓</span>
                    <div>
                      <strong>NAT-I:</strong> Minimum 50% percentile (NTS)
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#667eea]">✓</span>
                    <div>
                      <strong>Test Validity:</strong> 2 years from test date
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Merit Calculation */}
          <section>
            <h2 className="text-3xl font-bold mb-6">🧮 How Merit is Calculated</h2>
            
            <Card className="glass-card-info rounded-3xl">
              <CardHeader>
                <CardTitle>Official COMSATS Merit Formula</CardTitle>
                <CardDescription>Understanding how your aggregate is calculated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-3">For FSc/ICS Students:</h3>
                  <div className="glass-card glass-border-light p-4 rounded-xl space-y-2">
                    <p className="font-mono">Aggregate = (Matric % × 0.10) + (FSc % × 0.40) + (Test Score × 0.50)</p>
                    <div className="glass-callout-primary mt-4 p-4 rounded-xl">
                      <p className="font-semibold text-sm">Example Calculation:</p>
                      <ul className="text-sm space-y-1 mt-2">
                        <li>• Matric: 85% → 85 × 0.10 = 8.5</li>
                        <li>• FSc: 80% → 80 × 0.40 = 32.0</li>
                        <li>• Entry Test: 75% → 75 × 0.50 = 37.5</li>
                        <li className="font-bold text-[#4573df] pt-2">Total Aggregate: 78%</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">For A-Level Students:</h3>
                  <div className="glass-card glass-border-light p-4 rounded-xl">
                    <p className="font-mono">Aggregate = (O-Level % × 0.10) + (A-Level % × 0.40) + (Test Score × 0.50)</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      *A-Level grades converted to percentage: A*=90%, A=85%, B=75%, C=65%
                    </p>
                  </div>
                </div>

                <div className="glass-callout-warning p-4 rounded-xl">
                  <p className="font-semibold">💡 Pro Tip:</p>
                  <p className="text-sm mt-1">
                    The entry test carries 50% weight! Even with moderate FSc marks, a good test score can secure admission. 
                    Preparation is key!
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Application Process */}
          <section>
            <h2 className="text-3xl font-bold mb-6">📝 Step-by-Step Application Process</h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-[#4573df] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
                    Online Registration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li>Visit official COMSATS admission portal: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">admission.comsats.edu.pk</code></li>
                    <li>Create account with valid email and phone number</li>
                    <li>Fill personal information (name, CNIC, address)</li>
                    <li>Choose program(s) and campus preferences (up to 3 choices)</li>
                    <li>Upload required documents (see checklist below)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-[#667eea] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
                    Document Upload
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="font-semibold">Required Documents (Scanned):</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2">
                        <span className="text-[#667eea]">✓</span>
                        <span>Matric Certificate & Marksheet</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#667eea]">✓</span>
                        <span>FSc/A-Level Certificate & Marksheet</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#667eea]">✓</span>
                        <span>CNIC/B-Form</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#667eea]">✓</span>
                        <span>Recent Passport-size Photo</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#667eea]">✓</span>
                        <span>Domicile Certificate</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#667eea]">✓</span>
                        <span>Equivalence (for foreign degrees)</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                      *All documents must be in PDF format, max 500KB each
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-[#ff9800] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
                    Fee Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="glass-callout-warning p-4 rounded-xl">
                      <p className="font-bold text-lg">Application Fee: PKR 2,000</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        (Non-refundable, covers admission processing and entry test)
                      </p>
                    </div>
                    <p className="font-semibold">Payment Methods:</p>
                    <ul className="space-y-2 ml-6 list-disc">
                      <li>Bank deposit at any branch of Allied Bank, MCB, or HBL</li>
                      <li>Online payment via debit/credit card</li>
                      <li>Jazz Cash / Easypaisa mobile wallet</li>
                    </ul>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      ⚠️ Keep your fee challan copy safe - required for test entry and enrollment
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">4</span>
                    Entry Test Preparation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold mb-2">Test Pattern:</p>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="glass-callout-primary p-3 rounded-xl">
                          <p className="font-bold">Mathematics: 60 MCQs</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Algebra, Calculus, Trigonometry</p>
                        </div>
                        <div className="glass-callout-accent p-3 rounded-xl">
                          <p className="font-bold">English: 30 MCQs</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Grammar, Vocabulary, Comprehension</p>
                        </div>
                        <div className="glass-callout-success p-3 rounded-xl">
                          <p className="font-bold">Physics: 25 MCQs</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">FSc Physics syllabus</p>
                        </div>
                        <div className="glass-callout-warning p-3 rounded-xl">
                          <p className="font-bold">Computer/IQ: 25 MCQs</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Basic CS concepts or IQ</p>
                        </div>
                      </div>
                    </div>

                    <div className="glass-callout-primary p-4 rounded-xl">
                      <p className="font-bold mb-2">📚 Test Preparation Resources:</p>
                      <ul className="space-y-1 text-sm">
                        <li>✓ Download past papers from our <Link href="/past-papers" className="underline">Past Papers</Link> section</li>
                        <li>✓ Join COMSATS test preparation groups</li>
                        <li>✓ Practice time management (120 minutes for 140 MCQs)</li>
                        <li>✓ Focus on Mathematics - it's 40% of the test</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Campus Selection Guide */}
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <MapPin className="h-8 w-8 text-[#4573df]" />
              Choosing the Right Campus
            </h2>
            
            <div className="space-y-4">
              {[
                { name: "COMSATS Islamabad", merit: "85-90%", programs: "45+", strength: "Computer Science, Software Engineering, AI", link: "/campus/islamabad" },
                { name: "COMSATS Lahore", merit: "80-85%", programs: "35+", strength: "Business, Engineering, IT", link: "/campus/lahore" },
                { name: "COMSATS Wah", merit: "75-80%", programs: "30+", strength: "Electrical Engineering, Mechanical", link: "/campus/wah" },
                { name: "COMSATS Attock", merit: "70-75%", programs: "25+", strength: "Engineering programs", link: "/campus/attock" }
              ].map((campus, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl mb-2">{campus.name}</h3>
                        <div className="grid md:grid-cols-3 gap-4 mt-3">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Merit Range</p>
                            <p className="font-bold text-[#4573df]">{campus.merit}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Programs</p>
                            <p className="font-bold text-[#667eea]">{campus.programs}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Top Specialization</p>
                            <p className="font-semibold text-sm">{campus.strength}</p>
                          </div>
                        </div>
                      </div>
                      <Link href={campus.link}>
                        <Button variant="outline" size="sm">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Fee Structure */}
          <section>
            <h2 className="text-3xl font-bold mb-6">💰 Fee Structure 2025</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Semester Fee Breakdown</CardTitle>
                <CardDescription>Average costs for undergraduate programs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass-callout-primary p-4 rounded-xl">
                      <p className="font-bold text-lg mb-3">Engineering Programs</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span>Tuition Fee:</span>
                          <span className="font-bold">PKR 85,000</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Lab/Library Fee:</span>
                          <span className="font-bold">PKR 10,000</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Sports/Activities:</span>
                          <span className="font-bold">PKR 3,000</span>
                        </li>
                        <li className="flex justify-between border-t pt-2 mt-2">
                          <span className="font-bold">Total per semester:</span>
                          <span className="font-bold text-[#4573df]">PKR 98,000</span>
                        </li>
                      </ul>
                    </div>

                    <div className="glass-callout-accent p-4 rounded-xl">
                      <p className="font-bold text-lg mb-3">CS/IT/Business Programs</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span>Tuition Fee:</span>
                          <span className="font-bold">PKR 75,000</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Lab/Library Fee:</span>
                          <span className="font-bold">PKR 8,000</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Sports/Activities:</span>
                          <span className="font-bold">PKR 3,000</span>
                        </li>
                        <li className="flex justify-between border-t pt-2 mt-2">
                          <span className="font-bold">Total per semester:</span>
                          <span className="font-bold text-[#667eea]">PKR 86,000</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="glass-callout-success p-4 rounded-xl">
                    <p className="font-semibold text-lg mb-2">💡 Financial Aid Available:</p>
                    <ul className="space-y-1 text-sm">
                      <li>✓ <strong>Merit Scholarships:</strong> 25-100% fee waiver for 3.5+ GPA students</li>
                      <li>✓ <strong>Need-Based Scholarships:</strong> Up to 50% fee reduction</li>
                      <li>✓ <strong>HEC Scholarships:</strong> For top performers</li>
                      <li>✓ <strong>Installment Plans:</strong> Pay fees in 2-3 installments</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Success Tips */}
          <section className="glass-card-info p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-6">🏆 Expert Tips for Admission Success</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-xl mb-3">Before Test:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Zap className="h-5 w-5 mt-1 flex-shrink-0" />
                    <span>Start preparation 2-3 months before test date</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-5 w-5 mt-1 flex-shrink-0" />
                    <span>Solve 10+ past papers under timed conditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-5 w-5 mt-1 flex-shrink-0" />
                    <span>Focus heavily on Mathematics (60 MCQs = 42%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-5 w-5 mt-1 flex-shrink-0" />
                    <span>Join test prep groups for mock tests</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-xl mb-3">During Application:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Award className="h-5 w-5 mt-1 flex-shrink-0" />
                    <span>Apply to 3 campus/program combinations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Award className="h-5 w-5 mt-1 flex-shrink-0" />
                    <span>Keep realistic backup choices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Award className="h-5 w-5 mt-1 flex-shrink-0" />
                    <span>Upload clear, properly named documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Award className="h-5 w-5 mt-1 flex-shrink-0" />
                    <span>Double-check all information before submitting</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-3xl font-bold mb-6">❓ Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I apply with A-Levels result awaited?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Yes! Apply with predicted grades and AS-Level results. Submit final A-Level results before enrollment deadline.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is COMSATS entry test difficult?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    The test is moderately difficult, covering FSc-level concepts. With 2-3 months of focused preparation 
                    and past paper practice, most students score 60-70%. Mathematics is the most important section.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What aggregate do I need for Computer Science?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Merit varies by campus. Islamabad typically requires 85-90% aggregate, Lahore 80-85%, and other campuses 
                    70-80%. Check our <Link href="/merit-list-2025" className="text-[#4573df] hover:underline">Merit List</Link> for specific cutoffs.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How many students get admission each year?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    COMSATS admits approximately 15,000 undergraduate students annually across all 7 campuses. 
                    Computer Science and Software Engineering are the most competitive programs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t pt-8">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">Ready to Start Your COMSATS Journey?</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Use our tools and resources to prepare for COMSATS admission, calculate your aggregate, 
                and access past papers for test preparation.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" className="bg-[#4573df] hover:bg-[#3562ce]">
                  <Link href="/admissions">Admission Test Prep</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/past-papers">Download Past Papers</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/gpa-calculator">Calculate Aggregate</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  )
}
