import { createMetadata } from '@/lib/seo'
import { createCampusSchema } from '@/lib/advanced-schema'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Users, BookOpen, Award, Building } from 'lucide-react'
import Link from 'next/link'

const SAHIWAL_DESCRIPTION = "Complete guide to COMSATS Sahiwal campus. Explore degree programs, admission requirements, campus facilities, faculty, and student life in South Punjab's premier university."

export const metadata = createMetadata({
  title: "COMSATS University Sahiwal Campus - Programs, Admission & Contact",
  description: SAHIWAL_DESCRIPTION,
  keywords: [
    "COMSATS Sahiwal",
    "COMSATS Sahiwal admission",
    "COMSATS Sahiwal programs",
    "university Sahiwal",
    "engineering Sahiwal",
    "COMSATS South Punjab campus"
  ]
})

const campusJsonLd = createCampusSchema({
  name: "COMSATS University Sahiwal Campus",
  description: SAHIWAL_DESCRIPTION,
  address: {
    streetAddress: "Off GT Road",
    addressLocality: "Sahiwal",
    addressRegion: "Punjab",
    addressCountry: "PK"
  },
  telephone: "+92-40-4300086-7",
  email: "info@sahiwal.comsats.edu.pk",
  areaServed: "Sahiwal District",
  url: "https://sahiwal.comsats.edu.pk"
})

export default function ComsatsAbbottabad() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(campusJsonLd) }} />
      
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-[#0f1115] dark:via-[#181c22] dark:to-[#1a1f27]">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4573df] to-[#667eea] bg-clip-text text-transparent">
              COMSATS University Sahiwal Campus
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Excellence in Education in South Punjab
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <MapPin className="h-5 w-5" />
              <span>Off GT Road, Sahiwal, Punjab, Pakistan</span>
            </div>
          </header>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-10 w-10 text-[#4573df] mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#4573df]">3,000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Students</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <BookOpen className="h-10 w-10 text-[#667eea] mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#667eea]">20+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Programs</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Award className="h-10 w-10 text-[#ff9800] mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#ff9800]">100+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Faculty Members</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Building className="h-10 w-10 text-green-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-600">2009</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Established</div>
              </CardContent>
            </Card>
          </div>

          {/* About Campus */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">About COMSATS Sahiwal</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg leading-relaxed mb-4">
                  COMSATS University Sahiwal campus, established in 2009, serves as a beacon of quality education in South Punjab. 
                  The campus is strategically located to provide accessible higher education to students from Sahiwal and surrounding districts.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  With modern infrastructure and dedicated faculty, COMSATS Sahiwal offers comprehensive programs in engineering, 
                  computer science, and management sciences. The campus features well-equipped laboratories, a digital library, 
                  and state-of-the-art computing facilities.
                </p>
                <p className="text-lg leading-relaxed">
                  The campus has built strong industry partnerships and focuses on producing job-ready graduates through practical 
                  training and internship opportunities.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Programs Offered */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Degree Programs</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-[#4573df]/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-[#4573df]" />
                    Undergraduate Programs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-[#4573df]">•</span>
                      <div>
                        <strong>Computer Science</strong>
                        <p className="text-sm text-gray-600 dark:text-gray-400">4-year BS degree program</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4573df]">•</span>
                      <div>
                        <strong>Software Engineering</strong>
                        <p className="text-sm text-gray-600 dark:text-gray-400">4-year BS degree program</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4573df]">•</span>
                      <div>
                        <strong>Electrical Engineering</strong>
                        <p className="text-sm text-gray-600 dark:text-gray-400">4-year BS degree program</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4573df]">•</span>
                      <div>
                        <strong>Civil Engineering</strong>
                        <p className="text-sm text-gray-600 dark:text-gray-400">4-year BS degree program</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4573df]">•</span>
                      <div>
                        <strong>Management Sciences</strong>
                        <p className="text-sm text-gray-600 dark:text-gray-400">BBA 4-year program</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4573df]">•</span>
                      <div>
                        <strong>Mathematics</strong>
                        <p className="text-sm text-gray-600 dark:text-gray-400">4-year BS degree program</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#667eea]/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-6 w-6 text-[#667eea]" />
                    Graduate Programs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-[#667eea]">•</span>
                      <div>
                        <strong>MS Computer Science</strong>
                        <p className="text-sm text-gray-600 dark:text-gray-400">2-year research degree</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#667eea]">•</span>
                      <div>
                        <strong>MS Electrical Engineering</strong>
                        <p className="text-sm text-gray-600 dark:text-gray-400">2-year research degree</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#667eea]">•</span>
                      <div>
                        <strong>MBA (Executive)</strong>
                        <p className="text-sm text-gray-600 dark:text-gray-400">2-year weekend program</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#667eea]">•</span>
                      <div>
                        <strong>PhD Programs</strong>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Multiple disciplines</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Admission Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Admission Requirements</h2>
            
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-lg mb-3">Merit Criteria</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-[#4573df]">✓</span>
                        <span><strong>Minimum FSc:</strong> 60% marks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#4573df]">✓</span>
                        <span><strong>Entry Test:</strong> COMSATS test or NAT/SAT</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#4573df]">✓</span>
                        <span><strong>Aggregate:</strong> 70-75% for most programs</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-3">Application Process</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-[#667eea]">✓</span>
                        <span>Online application via COMSATS portal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#667eea]">✓</span>
                        <span>Submit required documents</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#667eea]">✓</span>
                        <span>Appear in entry test</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Link href="/admissions">
                    <Button size="lg" className="bg-[#4573df] hover:bg-[#3562ce]">
                      View Complete Admission Guide
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Campus Facilities */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Campus Facilities</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Academic Facilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Modern computer labs</li>
                    <li>✓ Engineering workshops</li>
                    <li>✓ Well-stocked library</li>
                    <li>✓ Smart classrooms</li>
                    <li>✓ Research labs</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Student Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Hostel facilities</li>
                    <li>✓ Cafeteria services</li>
                    <li>✓ Medical center</li>
                    <li>✓ Transport services</li>
                    <li>✓ Career counseling</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sports & Recreation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Indoor sports complex</li>
                    <li>✓ Outdoor playing fields</li>
                    <li>✓ Gymnasium</li>
                    <li>✓ Student societies</li>
                    <li>✓ Cultural activities</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
            
            <Card className="bg-gradient-to-r from-[#4573df] to-[#667eea] text-white">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-6 w-6 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Address</p>
                      <p className="text-sm opacity-90">
                        Off GT Road<br />
                        Sahiwal, Punjab<br />
                        Pakistan
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-6 w-6 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Phone</p>
                      <p className="text-sm opacity-90">+92-40-4300086-7</p>
                      <p className="text-sm opacity-90">Fax: +92-40-4300085</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-6 w-6 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Email</p>
                      <p className="text-sm opacity-90">info@sahiwal.comsats.edu.pk</p>
                      <p className="text-sm opacity-90">admissions@sahiwal.comsats.edu.pk</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* CTA Section */}
          <section className="text-center bg-gray-50 dark:bg-gray-900 p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Ready to Join COMSATS Sahiwal?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Explore our resources to prepare for admission, calculate your merit, and find the best professors.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/admissions">Apply Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/past-papers">Download Past Papers</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/faculty">Browse Faculty</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
