import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { 
  Users, 
  Star, 
  Calendar, 
  Clock, 
  MessageCircle, 
  BookOpen, 
  Award,
  Send,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import Head from "next/head"
import { GlassCard } from "@/components/admin/glass-card"

export default function MentorProfilePage({ params }: { params: { id: string } }) {
  // In a real implementation, this data would come from an API
  const mentor = {
    id: params.id,
    name: "Ahmed Raza",
    department: "Computer Science",
    program: "BSCS",
    graduationYear: 2024,
    rating: 4.9,
    reviewCount: 32,
    specialization: ["NTS Preparation", "Merit Calculation", "Interview Guidance"],
    availability: "Mon, Wed, Fri - 6PM to 9PM",
    bio: "Successfully guided 15+ students through the admission process. Specialized in NTS preparation.",
    avatarUrl: null
  }

  const reviews = [
    {
      id: 1,
      userName: "Student 1",
      rating: 5,
      comment: "Extremely helpful guidance for my NTS preparation. Provided excellent study materials and tips.",
      date: "2 days ago"
    },
    {
      id: 2,
      userName: "Student 2",
      rating: 5,
      comment: "Very knowledgeable about the admission process. Helped me understand the merit calculation perfectly.",
      date: "1 week ago"
    },
    {
      id: 3,
      userName: "Student 3",
      rating: 4,
      comment: "Good mentor with practical advice. Sessions were well-structured and informative.",
      date: "2 weeks ago"
    }
  ]

  const resources = [
    { title: "NTS Quantitative Guide", type: "PDF", size: "1.2 MB" },
    { title: "Verbal Reasoning Tips", type: "Document", size: "800 KB" },
    { title: "Merit Calculation Sheet", type: "Spreadsheet", size: "200 KB" },
    { title: "Interview Preparation", type: "Guide", size: "1.5 MB" }
  ]

  const successStories = [
    { name: "Fatima Khan", program: "BSCS", year: "2024", score: "85% Merit" },
    { name: "Usman Ali", program: "BSE", year: "2024", score: "82% Merit" },
    { name: "Zara Ahmed", program: "BBA", year: "2024", score: "78% Merit" }
  ]

  return (
    <>
      <Head>
        <title>{mentor.name} - Mentor Profile | CampusAxis Admissions</title>
        <meta name="description" content={`Get admission guidance from ${mentor.name}, a ${mentor.program} graduate from COMSATS. Specialized in ${mentor.specialization.join(", ")}.`} />
        <meta name="keywords" content={`COMSATS mentor, ${mentor.department} mentor, ${mentor.name}, admission guidance, NTS preparation`} />
        <link rel="canonical" href={`https://campusaxis.site/admissions/mentor/${params.id}`} />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="app-container max-w-7xl mx-auto px-4 py-8">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/admissions">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admissions
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mentor Profile */}
            <div className="lg:col-span-1">
              <GlassCard hover={true}>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Users className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">{mentor.name}</h1>
                    <p className="text-muted-foreground">{mentor.department} - {mentor.program} ({mentor.graduationYear})</p>
                    <div className="flex items-center mt-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 font-medium">{mentor.rating}</span>
                      <span className="text-muted-foreground ml-1">({mentor.reviewCount} reviews)</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <h3 className="font-semibold mb-2">Specializations</h3>
                      <div className="flex flex-wrap gap-2">
                        {mentor.specialization.map((spec, index) => (
                          <Badge key={index} variant="secondary">{spec}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Programs Helped With</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• BSCS - Computer Science</li>
                        <li>• BSE - Software Engineering</li>
                        <li>• BBA - Business Administration</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Availability</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{mentor.availability}</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Request Session
                  </Button>
                </CardContent>
              </GlassCard>

              <GlassCard title="Reviews" className="mt-6">
                <CardContent className="p-0">
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{review.userName}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {review.comment}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{review.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </GlassCard>
            </div>

            {/* Mentor Interaction */}
            <div className="lg:col-span-2">
              <GlassCard title="Request Guidance Session" description="Send a message to schedule a mentoring session or ask questions about admissions">
                <CardContent className="p-0">
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Subject</label>
                      <Input placeholder="e.g., NTS Preparation, Merit Calculation, etc." />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Message</label>
                      <Textarea 
                        placeholder="Describe what help you need with your admission process..." 
                        rows={6}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button>
                        <Send className="h-4 w-4 mr-2" />
                        Send Request
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </GlassCard>

              <GlassCard title="Study Resources" description="Resources shared by this mentor" className="mt-6" icon={BookOpen}>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resources.map((resource, index) => (
                      <div key={index} className="flex justify-between items-center p-3 rounded-lg border bg-card/50">
                        <div>
                          <h4 className="font-medium">{resource.title}</h4>
                          <p className="text-sm text-muted-foreground">{resource.type} • {resource.size}</p>
                        </div>
                        <Button size="sm" variant="outline">Download</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </GlassCard>

              <GlassCard title="Success Stories" description="Students who got admission with this mentor's guidance" className="mt-6" icon={Award}>
                <CardContent className="p-0">
                  <div className="space-y-4">
                    {successStories.map((student, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                        <div>
                          <h4 className="font-medium">{student.name}</h4>
                          <p className="text-sm text-muted-foreground">{student.program} • {student.year}</p>
                        </div>
                        <Badge variant="secondary">{student.score}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}