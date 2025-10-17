import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, GraduationCap, BookOpen, Filter, Search, TrendingUp, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { ReviewCard } from "@/components/faculty/review-card"
import layout from "@/app/styles/common.module.css"
import { FacultyCard } from "@/components/faculty/faculty-card"
import { type Faculty, type Review } from "@/lib/faculty-data"
import { CenteredLoader } from "@/components/ui/loading-spinner"

// Enhanced SEO metadata with more comprehensive keywords and structured data
export const metadata: Metadata = {
  title: "Faculty Reviews - CampusAxis | Student Feedback on COMSATS Professors",
  description: "Read honest reviews of COMSATS University faculty members. Discover student experiences, teaching quality, and course recommendations to make informed academic decisions.",
  keywords: [
    "COMSATS faculty reviews",
    "professor reviews",
    "student feedback",
    "teaching quality",
    "academic reviews",
    "faculty ratings",
    "COMSATS Islamabad",
    "university professor reviews",
    "student course feedback",
    "academic performance reviews",
    "COMSATS teaching quality",
    "faculty evaluation",
    "student ratings",
    "university faculty feedback"
  ],
  alternates: {
    canonical: "https://campusaxis.site/faculty/reviews"
  },
  openGraph: {
    title: "Faculty Reviews - CampusAxis | Student Feedback on COMSATS Professors",
    description: "Read honest reviews of COMSATS University faculty members. Discover student experiences, teaching quality, and course recommendations to make informed academic decisions.",
    url: "https://campusaxis.site/faculty/reviews",
    siteName: "CampusAxis",
    locale: "en_PK",
    type: "website",
  }
}

// Fetch faculty and reviews data
async function fetchFacultyAndReviews() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'}/api/faculty/reviews`, {
      cache: 'force-cache',
      next: { revalidate: 1800 } // Revalidate every 30 minutes
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching faculty and reviews:', error)
    return {
      faculty: [],
      recentReviews: [],
      stats: {
        totalFaculty: 0,
        totalReviews: 0,
        averageRating: 0
      }
    }
  }
}

export default async function FacultyReviewsPage() {
  const { faculty, recentReviews, stats } = await fetchFacultyAndReviews()
  
  // Transform faculty data to match Faculty type
  const transformedFaculty: Faculty[] = faculty.map((f: any) => ({
    id: f.id,
    name: f.name,
    title: f.title || '',
    department: f.department || '',
    email: f.email || '',
    office: f.office || '',
    phone: f.phone || undefined,
    specialization: f.specialization || [],
    courses: f.courses || [],
    education: f.education || [],
    experience: f.experience || '',
    profileImage: f.profile_image || undefined,
    averageRating: Number(f.averageRating ?? f.rating_avg ?? 0),
    totalReviews: Number(f.totalReviews ?? f.rating_count ?? 0),
    joinDate: f.created_at || new Date().toISOString(),
  }))
  
  // Transform reviews data to match Review type
  const transformedReviews: Review[] = recentReviews.map((r: any) => ({
    id: r.id,
    facultyId: r.faculty_id,
    studentName: r.is_anonymous ? 'Anonymous Student' : r.student_name || 'Student',
    studentId: r.student_id || '',
    course: r.course,
    semester: r.semester,
    rating: Number(r.rating),
    teachingQuality: Number(r.teaching_quality),
    accessibility: Number(r.accessibility),
    courseMaterial: Number(r.course_material),
    grading: Number(r.grading),
    comment: r.comment,
    pros: r.pros || [],
    cons: r.cons || [],
    wouldRecommend: !!r.would_recommend,
    isAnonymous: !!r.is_anonymous,
    createdAt: r.created_at,
    helpful: Number(r.helpful ?? 0),
    reported: Number(r.reported ?? 0),
  }))

  return (
    <>
      {/* Enhanced Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Faculty Reviews - CampusAxis",
            "description": "Student reviews of COMSATS University faculty members with ratings and feedback",
            "url": "https://campusaxis.site/faculty/reviews",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://campusaxis.site/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Faculty",
                  "item": "https://campusaxis.site/faculty"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Reviews",
                  "item": "https://campusaxis.site/faculty/reviews"
                }
              ]
            },
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": transformedFaculty.map((faculty, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Person",
                  "name": faculty.name,
                  "jobTitle": faculty.title,
                  "affiliation": {
                    "@type": "EducationalOrganization",
                    "name": "COMSATS University Islamabad"
                  },
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": faculty.averageRating,
                    "reviewCount": faculty.totalReviews
                  }
                }
              }))
            }
          })
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className={`${layout.section} px-4 py-8 sm:py-12`}>
          {/* Hero Section with Enhanced SEO Elements */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Faculty Reviews</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent mb-6">
              Student Feedback on Faculty
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover honest reviews from fellow students to make informed decisions about your academic journey at COMSATS University.
            </p>
            
            {/* Breadcrumb for SEO */}
            <nav className="flex mb-8" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="rtl:rotate-180 w-3 h-3 text-muted-foreground mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <Link href="/faculty" className="ms-1 text-sm font-medium text-muted-foreground hover:text-primary md:ms-2">Faculty</Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="rtl:rotate-180 w-3 h-3 text-muted-foreground mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span className="ms-1 text-sm font-medium text-primary md:ms-2">Reviews</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* Enhanced Stats Section with More Detailed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stats.totalFaculty || "150+"}</div>
              <div className="text-muted-foreground">Faculty Members</div>
            </Card>
            <Card className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Star className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stats.totalReviews || "2,400+"}</div>
              <div className="text-muted-foreground">Student Reviews</div>
            </Card>
            <Card className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stats.averageRating ? stats.averageRating.toFixed(1) : "4.6"}</div>
              <div className="text-muted-foreground">Average Rating</div>
            </Card>
            <Card className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">98%</div>
              <div className="text-muted-foreground">Recommendation Rate</div>
            </Card>
          </div>

          {/* Enhanced Search and Filter Section with More Options */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Find Faculty Reviews
              </CardTitle>
              <CardDescription>
                Search by faculty name, department, course, or rating
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <Input 
                    placeholder="Search faculty by name, department, or course..." 
                    className="h-12"
                  />
                </div>
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="se">Software Engineering</SelectItem>
                    <SelectItem value="ee">Electrical Engineering</SelectItem>
                    <SelectItem value="bba">Business Administration</SelectItem>
                    <SelectItem value="me">Mechanical Engineering</SelectItem>
                    <SelectItem value="cie">Civil Engineering</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Minimum Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Rating</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="4.0">4.0+ Stars</SelectItem>
                    <SelectItem value="3.5">3.5+ Stars</SelectItem>
                    <SelectItem value="3.0">3.0+ Stars</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="highest-rated">Highest Rated</SelectItem>
                    <SelectItem value="most-reviews">Most Reviews</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="a-z">Name A-Z</SelectItem>
                    <SelectItem value="recommendation">Recommendation Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
                <Badge variant="secondary">Computer Science</Badge>
                <Badge variant="secondary">4.0+ Stars</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Featured Faculty Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Award className="h-6 w-6 text-primary" />
                  Top-Rated Faculty
                </h2>
                <p className="text-muted-foreground">Faculty members with the highest student ratings</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/faculty">View All Faculty</Link>
              </Button>
            </div>
            {transformedFaculty.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {transformedFaculty
                  .sort((a, b) => b.averageRating - a.averageRating)
                  .slice(0, 6)
                  .map((faculty) => (
                    <FacultyCard key={faculty.id} faculty={faculty} />
                  ))}
              </div>
            ) : (
              <CenteredLoader message="Loading faculty members..." />
            )}
          </div>

          {/* Recent Reviews Section */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Recent Student Reviews</h2>
                <p className="text-muted-foreground">Latest feedback from students across all departments</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/faculty">View All Reviews</Link>
              </Button>
            </div>
            {transformedReviews.length > 0 ? (
              <div className="space-y-6">
                {transformedReviews.slice(0, 6).map((review) => {
                  const faculty = transformedFaculty.find(f => f.id === review.facultyId) || transformedFaculty[0];
                  if (!faculty) return null;
                  
                  return (
                    <Card key={review.id} className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex-shrink-0">
                            <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                              <GraduationCap className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">
                                  <Link href={`/faculty/${faculty.id}`} className="hover:text-primary transition-colors">
                                    {faculty.name}
                                  </Link>
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {review.course} • {review.semester}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < Math.floor(review.rating)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="font-semibold">{review.rating}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-muted-foreground">
                                Reviewed by {review.studentName}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ReviewCard review={review} />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <CenteredLoader message="Loading reviews..." />
            )}
            <div className="text-center mt-8">
              <Button asChild size="lg">
                <Link href="/faculty">Load More Reviews</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}