"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Star, Clock, Search } from "lucide-react"
import { GlassCard } from "@/components/admin/glass-card"
import { MentorCard } from "@/components/admissions/mentor-card"

interface Mentor {
  id: number
  user_id: string
  name: string
  department: string
  program: string
  graduation_year: number
  rating: number
  review_count: number
  specialization: string[]
  availability: string
  bio: string
  avatar_url: string | null
}

export function PeerMentoring() {
  const [department, setDepartment] = useState("")
  const [program, setProgram] = useState("")
  const [interests, setInterests] = useState("")
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(false)
  const [matched, setMatched] = useState(false)

  const findMentors = async () => {
    setLoading(true)
    try {
      // In a real implementation, this would call the API
      // For now, we'll use mock data
      const mockMentors = [
        {
          id: 1,
          user_id: 'mentor_1',
          name: 'Ahmed Raza',
          department: 'Computer Science',
          program: 'BSCS',
          graduation_year: 2024,
          rating: 4.9,
          review_count: 32,
          specialization: ['NTS Preparation', 'Merit Calculation', 'Interview Guidance'],
          availability: 'Mon, Wed, Fri - 6PM to 9PM',
          bio: 'Successfully guided 15+ students through the admission process. Specialized in NTS preparation.',
          avatar_url: null
        },
        {
          id: 2,
          user_id: 'mentor_2',
          name: 'Sarah Khan',
          department: 'Software Engineering',
          program: 'BSE',
          graduation_year: 2023,
          rating: 4.8,
          review_count: 28,
          specialization: ['Subject Guides', 'Merit Calculation', 'Department Insights'],
          availability: 'Tue, Thu - 5PM to 8PM',
          bio: 'Expert in helping students understand different departments and their requirements.',
          avatar_url: null
        },
        {
          id: 3,
          user_id: 'mentor_3',
          name: 'Mohsin Ali',
          department: 'Business Administration',
          program: 'BBA',
          graduation_year: 2024,
          rating: 4.7,
          review_count: 24,
          specialization: ['Interview Preparation', 'Application Process', 'Career Guidance'],
          availability: 'Mon, Wed - 4PM to 7PM',
          bio: 'Focuses on interview preparation and application process for business programs.',
          avatar_url: null
        }
      ]

      setMentors(mockMentors)
      setMatched(true)
    } catch (error) {
      console.error("Error finding mentors:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <GlassCard 
        title="Find Your Peer Mentor" 
        description="Get matched with senior students based on your department and interests"
        icon={Users}
      >
        <CardContent className="p-0">
          <div className="space-y-4">
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="e.g., Computer Science, Electrical Engineering"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="program">Program (Optional)</Label>
              <Input
                id="program"
                placeholder="e.g., BSCS, BEE, BBA"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="interests">Interests & Areas of Help Needed</Label>
              <Textarea
                id="interests"
                placeholder="e.g., NTS preparation, merit calculation, interview tips"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                rows={3}
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={findMentors}
              disabled={loading || !department}
            >
              {loading ? "Finding Mentors..." : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Find Mentors
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </GlassCard>

      {matched && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Recommended Mentors</h3>
          {mentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold">{mentor.name}</h3>
                        <p className="text-sm text-muted-foreground">{mentor.program}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-slate-700 dark:text-slate-300 mb-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span>{mentor.rating} ({mentor.review_count} reviews)</span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {mentor.specialization.slice(0, 2).map((spec, index) => (
                          <span 
                            key={index} 
                            className="text-xs px-2 py-1 bg-primary/10 rounded-full text-primary"
                          >
                            {spec}
                          </span>
                        ))}
                        {mentor.specialization.length > 2 && (
                          <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-900 rounded-full text-muted-foreground">
                            +{mentor.specialization.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 line-clamp-2">
                      {mentor.bio}
                    </p>
                    
                    <div className="flex items-center text-xs text-slate-700 dark:text-slate-300 mb-4">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{mentor.availability}</span>
                    </div>
                    
                    <Button size="sm" className="w-full">
                      Connect with Mentor
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Users className="h-12 w-12 text-slate-700 dark:text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Mentors Found</h3>
              <p className="text-muted-foreground">
                We couldn't find any mentors matching your criteria. Try adjusting your search.
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}