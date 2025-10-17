import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calculator, 
  MessageCircle, 
  FileText, 
  Trophy,
  ArrowRight,
  Search,
  Filter,
  Star,
  Clock,
  Award
} from "lucide-react"
import Link from "next/link"
import Script from "next/script"
import { GlassCard } from "@/components/admin/glass-card"
import { MentorCard } from "@/components/admissions/mentor-card"
import { ResourceCard } from "@/components/admissions/resource-card"
import { MeritCalculator } from "@/components/admissions/merit-calculator"
import { NtsPreparation } from "@/components/admissions/nts-preparation"
import { AdmissionsDisclaimer } from "@/components/admissions/disclaimer"
import { PeerMentoring } from "@/components/admissions/peer-mentoring"
import { QueryAnswering } from "@/components/admissions/query-answering"
import { ResourceSharing } from "@/components/admissions/resource-sharing"
import { AdmissionsStructuredData } from "@/components/admissions/structured-data"
import layout from "@/app/styles/common.module.css"

export const metadata: Metadata = {
  title: "Admissions - CampusAxis | COMSATS Admission Guidance",
  description: "Get admission guidance for COMSATS University. Connect with senior students, access NTS preparation materials, calculate merit scores, and find study resources for entrance exams.",
  keywords: [
    "COMSATS admission",
    "COMSATS NTS preparation",
    "COMSATS merit calculator",
    "admission guidance",
    "peer mentoring",
    "study resources",
    "entrance exam preparation",
    "COMSATS Islamabad",
    "university admission help"
  ],
  alternates: {
    canonical: "https://campusaxis.site/admissions"
  },
  openGraph: {
    title: "Admissions - CampusAxis | COMSATS Admission Guidance",
    description: "Get admission guidance for COMSATS University. Connect with senior students, access NTS preparation materials, calculate merit scores, and find study resources for entrance exams.",
    url: "https://campusaxis.site/admissions",
    siteName: "CampusAxis",
    locale: "en_PK",
    type: "website",
  }
}

export default function AdmissionsPage() {
  // Mock data for mentors
  const mockMentors = [
    {
      id: 1,
      name: "Ahmed Raza",
      department: "Computer Science",
      program: "BSCS",
      rating: 4.9,
      reviewCount: 32,
      specialization: ["NTS Preparation", "Merit Calculation", "Interview Guidance"],
      availability: "Mon, Wed, Fri - 6PM to 9PM",
      bio: "Successfully guided 15+ students through the admission process. Specialized in NTS preparation."
    },
    {
      id: 2,
      name: "Sarah Khan",
      department: "Software Engineering",
      program: "BSE",
      rating: 4.8,
      reviewCount: 28,
      specialization: ["Subject Guides", "Merit Calculation", "Department Insights"],
      availability: "Tue, Thu - 5PM to 8PM",
      bio: "Expert in helping students understand different departments and their requirements."
    },
    {
      id: 3,
      name: "Mohsin Ali",
      department: "Business Administration",
      program: "BBA",
      rating: 4.7,
      reviewCount: 24,
      specialization: ["Interview Preparation", "Application Process", "Career Guidance"],
      availability: "Mon, Wed - 4PM to 7PM",
      bio: "Focuses on interview preparation and application process for business programs."
    },
    {
      id: 4,
      name: "Fatima Siddiqui",
      department: "Electrical Engineering",
      program: "BEE",
      rating: 4.9,
      reviewCount: 35,
      specialization: ["NTS Math", "Merit Calculation", "Subject Tests"],
      availability: "Tue, Thu, Sat - 3PM to 6PM",
      bio: "Specialized in engineering program admissions with focus on mathematics and physics."
    },
    {
      id: 5,
      name: "Bilal Ahmed",
      department: "Computer Science",
      program: "BSCS",
      rating: 4.6,
      reviewCount: 29,
      specialization: ["NTS English", "Interview Prep", "Study Planning"],
      availability: "Mon, Fri - 5PM to 8PM",
      bio: "Helps students improve their English skills for NTS and develop effective study plans."
    },
    {
      id: 6,
      name: "Ayesha Malik",
      department: "Business Administration",
      program: "BBA",
      rating: 4.8,
      reviewCount: 31,
      specialization: ["GAT Preparation", "Merit Calculation", "Department Selection"],
      availability: "Wed, Fri - 4PM to 7PM",
      bio: "Guides students in business program admissions with focus on analytical and verbal skills."
    }
  ]

  // Mock data for resources
  const mockResources = [
    {
      id: 1,
      title: "NTS Preparation Guide",
      description: "Comprehensive guide for National Testing Service preparation with practice questions and tips",
      type: "PDF",
      size: "2.4 MB",
      url: "#",
      downloads: 1240
    },
    {
      id: 2,
      title: "Merit Calculation Tool",
      description: "Interactive calculator to estimate your admission merit based on academic performance",
      type: "Calculator",
      size: "Online",
      url: "#",
      downloads: 890
    },
    {
      id: 3,
      title: "Past Entrance Papers",
      description: "Collection of previous years' entrance exam papers with solutions",
      type: "Collection",
      size: "15 files",
      url: "#",
      downloads: 2100
    },
    {
      id: 4,
      title: "Department Guides",
      description: "Detailed information about different departments and their admission requirements",
      type: "Documents",
      size: "8 files",
      url: "#",
      downloads: 750
    },
    {
      id: 5,
      title: "Interview Tips",
      description: "Video guide with tips and common questions for admission interviews",
      type: "Video",
      size: "45 min",
      url: "#",
      downloads: 620
    },
    {
      id: 6,
      title: "Subject-wise Notes",
      description: "Comprehensive notes for key subjects tested in entrance exams",
      type: "Notes",
      size: "12 files",
      url: "#",
      downloads: 1800
    }
  ]

  // Structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    "name": "COMSATS University Admission Guidance",
    "description": "Peer-to-peer admission guidance for COMSATS University students including mentoring, NTS preparation, merit calculation, and study resources",
    "provider": {
      "@type": "Organization",
      "name": "CampusAxis",
      "url": "https://campusaxis.site"
    },
    "occupationalCategory": "Education",
    "offers": {
      "@type": "Offer",
      "category": "EducationalOccupationalProgram",
      "price": 0,
      "priceCurrency": "PKR"
    },
    "programPrerequisites": "Intermediate education or equivalent",
    "educationalCredentialAwarded": "University Admission",
    "occupationalCredentialAwarded": "Educational Support Services"
  }

  return (
    <>
      <Script
        id="admissions-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className={`${layout.section} px-4 py-8 sm:py-12`}>
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Admissions Guidance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent mb-6">
              Your Path to COMSATS
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Connect with senior students, get admission guidance, access study resources, and prepare for entrance exams with our peer-to-peer support system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-6 text-base rounded-xl" asChild>
                <Link href="#mentors">
                  Find a Mentor <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-6 text-base rounded-xl" asChild>
                <Link href="#resources">
                  Explore Resources
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 sm:mb-16">
            {[
              { icon: Users, value: "500+", label: "Active Mentors" },
              { icon: BookOpen, value: "100+", label: "Study Resources" },
              { icon: Trophy, value: "95%", label: "Success Rate" },
              { icon: MessageCircle, value: "2000+", label: "Guidance Sessions" }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <GlassCard key={index} title={stat.value} description={stat.label} icon={Icon} hover={false}>
                  <div className="p-2 sm:p-3 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </GlassCard>
              )
            })}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-8 sm:mb-12">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="mentors">Find Mentors</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="prep">Exam Prep</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Mentoring Section */}
                <GlassCard title="Peer-to-Peer Mentoring" description="Connect with senior students who've successfully navigated the COMSATS admission process" icon={Users}>
                  <CardContent className="p-0">
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-primary mt-0.5">
                          <Star className="h-4 w-4" />
                        </div>
                        <span className="ml-2 text-muted-foreground">One-on-one guidance sessions</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-primary mt-0.5">
                          <Star className="h-4 w-4" />
                        </div>
                        <span className="ml-2 text-muted-foreground">Personalized admission strategy</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-primary mt-0.5">
                          <Star className="h-4 w-4" />
                        </div>
                        <span className="ml-2 text-muted-foreground">Real-time Q&A support</span>
                      </li>
                    </ul>
                    <Button asChild>
                      <Link href="#mentors">Find Your Mentor</Link>
                    </Button>
                  </CardContent>
                </GlassCard>

                {/* Resources Section */}
                <GlassCard title="Study Resources" description="Access past papers, study guides, and preparation materials" icon={FileText}>
                  <CardContent className="p-0">
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-primary mt-0.5">
                          <Star className="h-4 w-4" />
                        </div>
                        <span className="ml-2 text-muted-foreground">NTS preparation materials</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-primary mt-0.5">
                          <Star className="h-4 w-4" />
                        </div>
                        <span className="ml-2 text-muted-foreground">Merit calculation tools</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-primary mt-0.5">
                          <Star className="h-4 w-4" />
                        </div>
                        <span className="ml-2 text-muted-foreground">Subject-wise study guides</span>
                      </li>
                    </ul>
                    <Button variant="outline" asChild>
                      <Link href="#resources">Browse Resources</Link>
                    </Button>
                  </CardContent>
                </GlassCard>
              </div>

              {/* Exam Preparation Section */}
              <GlassCard title="Entrance Exam Preparation" description="Comprehensive preparation tools for NTS and other entrance exams" icon={Trophy}>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { 
                        title: "NTS Preparation", 
                        description: "Practice tests and study materials for National Testing Service exams",
                        icon: Calculator
                      },
                      { 
                        title: "Merit Calculator", 
                        description: "Calculate your admission chances based on previous years' data",
                        icon: Award
                      },
                      { 
                        title: "Success Tips", 
                        description: "Learn from students who secured admission in top programs",
                        icon: Clock
                      }
                    ].map((item, index) => {
                      const Icon = item.icon
                      return (
                        <div key={index} className="p-4 rounded-xl border bg-card/50 backdrop-blur-sm">
                          <div className="flex items-center mb-3">
                            <div className="p-2 rounded-lg bg-primary/10 mr-3">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-semibold">{item.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-6">
                    <AdmissionsDisclaimer />
                  </div>
                </CardContent>
              </GlassCard>
            </TabsContent>

            <TabsContent value="mentors" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold">Find Your Mentor</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
              <PeerMentoring />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {mockMentors.map((mentor) => (
                  <MentorCard key={mentor.id} {...mentor} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Study Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockResources.map((resource) => (
                  <ResourceCard key={resource.id} {...resource} />
                ))}
              </div>
              <div className="mt-8">
                <ResourceSharing />
              </div>
              <div className="mt-8">
                <QueryAnswering />
              </div>
            </TabsContent>

            <TabsContent value="prep" className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Exam Preparation</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Merit Calculator</h3>
                  <MeritCalculator />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">NTS Preparation</h3>
                  <NtsPreparation />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}