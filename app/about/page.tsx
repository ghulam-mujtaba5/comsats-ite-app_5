import type { Metadata } from "next"
import { createMetadata, jsonLdBreadcrumb } from "@/lib/seo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Target, Sparkles, ArrowRight, Heart, CheckCircle, Clock, Flag, Rocket, Mail, Download, Github, Linkedin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = createMetadata({
  title: "About — CampusAxis",
  description: "Learn about CampusAxis: our mission, what we offer, and our commitment to COMSATS University Lahore students.",
  path: "/about",
  keywords: ["About CampusAxis", "COMSATS Lahore", "student portal", "mission", "features"],
})

export default function AboutUsPage() {
  // features removed from About page to avoid duplication with Home

  // Top-of-page numeric stats removed to avoid duplication with other site sections

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <main className="flex-1 relative">
        {/* Hero Section */}
        <section className="py-20 px-4 relative">
          <div className="app-container">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="soft" className="mb-6 animate-fade-in">
                <Sparkles className="h-3 w-3 mr-1" />
                About CampusAxis
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6 text-balance animate-slide-up" style={{ animationDelay: '200ms' }}>
                Empowering Your 
                <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Academic Journey
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-serif leading-relaxed animate-slide-up" style={{ animationDelay: '400ms' }}>
                CampusAxis is designed to help COMSATS University Lahore students access academic resources and make informed decisions through faculty reviews, enhancing their learning experience with best faculty.
              </p>

              {/* Top stats removed to avoid duplication with home and other pages */}
            </div>
          </div>
        </section>
      
        {/* Megicode / Powered By Section moved down */}

        {/* Mission Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5">
          <div className="app-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Target className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-foreground ml-2">Mission</h2>
                </div>
                
                <p className="text-lg text-muted-foreground leading-relaxed font-serif">
                  Our mission is to make academic resources and faculty reviews easily accessible for COMSATS students, supporting their learning and growth.
                </p>

                <div className="space-y-3">
                  {[
                    "Academic resources in one place",
                    "Verified faculty reviews",
                    "Easy GPA planning tools"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Card variant="glass" className="p-8 hover-lift transition-all duration-500">
                  <div className="text-center space-y-4">
                    <GraduationCap className="h-16 w-16 mx-auto text-primary" />
                    <h3 className="text-2xl font-semibold">Built for Students</h3>
                    <p className="text-muted-foreground font-serif">
                      Designed for students: simple, useful, and focused on what matters most for your academic journey.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values & Principles */}
        <section className="py-12 px-4">
          <div className="app-container">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl lg:text-3xl font-semibold mt-2">Our Values & Principles</h3>
              <p className="text-lg text-muted-foreground leading-relaxed font-serif mt-4">
                At CampusAxis, our foundation is built on values that guide how we create, grow, and serve our student community.
              </p>
              <div className="space-y-6 text-left mt-8">
                {[
                  { title: "Integrity", description: "We always stay truthful, transparent, and responsible in everything we do." },
                  { title: "Innovation & Creativity", description: "We continuously explore modern, creative solutions to improve learning experiences and enhance campus life." },
                  { title: "Excellence", description: "We strive for the highest quality in every feature, service, and interaction." },
                  { title: "Adaptability", description: "We stay flexible and open to change, evolving with the needs of students and the education ecosystem." },
                  { title: "Accessibility & Inclusivity", description: "We believe every student should have equal access to opportunities, resources, and support—regardless of background or ability." },
                  { title: "Transparency & Trust", description: "Clear, open, and reliable information is at the heart of our platform." },
                  { title: "Collaboration & Community", description: "We encourage teamwork, peer-to-peer learning, and collective growth to strengthen the campus experience." },
                  { title: "Student-Centric Approach", description: "Every feature and update is designed with students’ needs, challenges, and future goals in mind." },
                ].map((value, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{value.title}</h4>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* New User Privacy Section */}
        <section className="py-12 px-4 bg-muted/5">
          <div className="app-container">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl lg:text-3xl font-semibold mt-2">User Privacy</h3>
              <p className="text-lg text-muted-foreground leading-relaxed font-serif mt-4">
                At CampusAxis, we prioritize user privacy. Our platform ensures anonymity and fosters confidence, allowing students to engage and learn without concerns about data security or misuse.
              </p>
            </div>
          </div>
        </section>

        {/* How We Help Students */}
        <div className="my-12 border-t border-muted-foreground/10" />
        <section className="py-12 px-4 bg-muted/5">
          <div className="app-container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="mb-4">
                <Badge variant="soft" className="uppercase tracking-wide text-xs">Students</Badge>
                <h3 className="text-2xl lg:text-3xl font-semibold mt-2">How CampusAxis Helps Students</h3>
              </div>
              <div className="space-y-3 text-left">
                  {["Study resources and past papers","GPA planning tools","Faculty reviews","Timetable & event coordination"].map((t, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div className="text-muted-foreground">{t}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials removed per request */}

        <div className="my-12 border-t border-muted-foreground/10" />

        {/* Leadership section moved up for better visual hierarchy */}
        <section className="py-12 px-4">
          <div className="app-container">
            <div className="text-center mb-8">
              <Badge variant="soft" className="uppercase tracking-wide text-xs">Leadership</Badge>
              <h3 className="text-2xl lg:text-3xl font-semibold mt-2">Megicode Leadership</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
                The team behind CampusAxis — leading with vision, engineering excellence, and student-first focus.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  name: 'Ghulam Mujtaba',
                  role: 'Founder & CTO',
                  img: '/pictures/portfolio-picture.png',
                  bio: 'Driving technological excellence and innovation to create impactful solutions for our clients.',
                  github: '#',
                  linkedin: '#'
                },
                {
                  name: 'Azan Wahla',
                  role: 'Founder & CEO',
                  img: '/pictures/azan1.png',
                  bio: "Leading Megicode's vision to transform businesses through innovative technology solutions.",
                  github: '#',
                  linkedin: '#'
                },
                {
                  name: 'Muhammad Waqar ul Mulk',
                  role: 'Founder & COO/CMO',
                  img: '/pictures/waqar.png',
                  bio: 'Building strategic partnerships and ensuring operational excellence in everything we do.',
                  github: '#',
                  linkedin: '#'
                }
              ].map((person, i) => (
                <Card
                  key={i}
                  className="text-center p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-transparent hover:border-primary/20 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  <CardContent>
                    <div className="mx-auto w-28 h-28 rounded-full p-[2px] mb-4 bg-gradient-to-br from-blue-500/60 via-primary/60 to-purple-500/60 group-hover:from-blue-500 group-hover:to-purple-500 transition-colors">
                      <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-white/80 dark:ring-slate-900/80">
                        <Image src={person.img} alt={person.name} fill className="object-cover" sizes="112px" />
                      </div>
                    </div>
                    <div className="font-semibold text-lg">{person.name}</div>
                    <div className="text-xs inline-flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 text-primary font-medium mt-1 mb-2">
                      {person.role}
                    </div>
                    <div className="text-sm text-muted-foreground mb-4 leading-relaxed">{person.bio}</div>
                    <div className="flex items-center justify-center gap-3">
                      <a aria-label={`${person.name} on GitHub`} href={person.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/40 dark:border-slate-700/60 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-colors">
                        <Github className="h-4 w-4" />
                      </a>
                      <a aria-label={`${person.name} on LinkedIn`} href={person.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/40 dark:border-slate-700/60 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-colors">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partners & FAQ */}
        <section className="py-12 px-4 bg-muted/5">
          <div className="app-container">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div>
                <div className="mb-4">
                  <Badge variant="soft" className="uppercase tracking-wide text-xs">Partners</Badge>
                  <h4 className="text-xl lg:text-2xl font-semibold mt-2">Partners & Integrations</h4>
                </div>
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="w-32 h-12 relative">
                    <Image src={'/new logo.jpg'} alt="Megicode" fill style={{ objectFit: 'contain' }} />
                  </div>
                  <div className="w-32 h-12 relative">
                    <Image src={'/placeholder-logo.png'} alt="Partner" fill style={{ objectFit: 'contain' }} />
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <Badge variant="soft" className="uppercase tracking-wide text-xs">FAQ</Badge>
                  <h4 className="text-xl lg:text-2xl font-semibold mt-2">Frequently asked questions</h4>
                </div>
                <div className="space-y-3">
                  <Card className="p-4">
                    <CardContent>
                      <div className="font-semibold">Is CampusAxis free to use?</div>
                      <div className="text-sm text-muted-foreground">Yes — CampusAxis is free for students. Some partner services may be paid.</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Megicode / Powered By Section (moved down) */}
    <div className="my-12 border-t border-muted-foreground/10" />
    <section className="py-12 px-4 bg-muted/5">
          <div className="app-container">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 relative">
                  <Image src={'/new logo.jpg'} alt="Megicode logo" fill style={{ objectFit: 'contain' }} />
                </div>
                <h2 className="text-3xl font-bold">Powered by <a href="https://megicode.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Megicode</a></h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">Built and maintained by the Megicode team — supporting students and campus communities.</p>
            </div>
            {/* Leadership grid moved above; Ambassador CTA removed */}
          </div>
        </section>

        {/* Structured data for Megicode (replace placeholders with real values) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Megicode",
              url: "https://megicode.com",
              logo: "/new logo.jpg",
              sameAs: [
                "https://twitter.com/megicode",
                "https://facebook.com/megicode",
                "https://linkedin.com/company/megicode"
              ],
              description: "Megicode — building CampusAxis and student-focused tools to help learners succeed.",
            })
          }}
        />
        
        {/* Commitment Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-accent/10 via-background to-primary/5">
          <div className="app-container">
            <Card variant="glass" className="max-w-4xl mx-auto p-8 lg:p-12">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">Our Commitment</h2>
                </div>
                
                <p className="text-lg text-muted-foreground leading-relaxed font-serif max-w-3xl mx-auto">
                  We are dedicated to continuously improving and expanding our platform to meet the evolving needs of the 
                  student community. Our goal is to create a tool that is not only useful but also an integral part of the 
                  university experience at COMSATS Lahore.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Button size="lg" className="interactive hover-lift" asChild>
                    <Link href="/contact">
                      Get in Touch
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="interactive hover-lift" asChild>
                    <Link href="/contribute">Contribute to CampusAxis</Link>
                  </Button>
                </div>

                {/* ...existing code... */}
              </div>
            </Card>
          </div>
        </section>
      </main>
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])) }}
      />
    </div>
  );
}
