import { createMetadata } from '@/lib/seo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, GraduationCap, Calendar, Users, Award, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export const metadata = createMetadata({
  title: "How to Succeed in Your First Semester at COMSATS University",
  description: "Complete guide to excelling in your first semester at COMSATS. Learn study strategies, time management tips, resource utilization, and insider advice from successful COMSATS students.",
  keywords: "COMSATS first semester, COMSATS study tips, university success guide, COMSATS student advice, first year COMSATS, academic success strategies"
})

export default function FirstSemesterSuccessGuide() {
  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-[#0f1115] dark:via-[#181c22] dark:to-[#1a1f27]">
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4573df] to-[#667eea] bg-clip-text text-transparent">
            How to Succeed in Your First Semester at COMSATS University
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Your complete roadmap to academic excellence, social integration, and personal growth
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>📚 15 min read</span>
            <span>•</span>
            <span>Updated October 2025</span>
          </div>
        </header>

        {/* Introduction */}
        <section className="prose dark:prose-invert max-w-none mb-12">
          <p className="text-lg leading-relaxed">
            Starting your journey at COMSATS University is both exciting and challenging. Your first semester sets the foundation 
            for your entire academic career. This comprehensive guide, compiled from successful COMSATS students and faculty advice, 
            will help you navigate your first semester with confidence and achieve outstanding results.
          </p>
        </section>

        {/* Quick Tips Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="glass-effect border-2 border-[#4573df]/20">
            <CardHeader>
              <GraduationCap className="h-10 w-10 text-[#4573df] mb-2" />
              <CardTitle className="text-lg">Academic Excellence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Master COMSATS grading system, study smart, and utilize all academic resources
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-2 border-[#667eea]/20">
            <CardHeader>
              <Users className="h-10 w-10 text-[#667eea] mb-2" />
              <CardTitle className="text-lg">Social Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Build meaningful relationships, join societies, and network effectively
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-2 border-[#ff9800]/20">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-[#ff9800] mb-2" />
              <CardTitle className="text-lg">Personal Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Develop time management, resilience, and professional skills
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Section 1: Before Semester Starts */}
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Calendar className="h-8 w-8 text-[#4573df]" />
              Before Your First Day: Essential Preparations
            </h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border-l-4 border-[#4573df]">
                <h3 className="text-xl font-semibold mb-3">1. Understand the COMSATS Grading System</h3>
                <p className="mb-4">
                  COMSATS uses a 4.0 GPA scale. Understanding this early is crucial:
                </p>
                <ul className="space-y-2 ml-6 list-disc">
                  <li><strong>A Grade (4.0):</strong> 85-100 marks - Your target for scholarships</li>
                  <li><strong>A- Grade (3.67):</strong> 80-84 marks - Still excellent</li>
                  <li><strong>B+ Grade (3.33):</strong> 75-79 marks - Good performance</li>
                  <li><strong>B Grade (3.0):</strong> 71-74 marks - Above average</li>
                  <li><strong>Passing:</strong> Minimum 50 marks (D grade, 1.0 GPA)</li>
                </ul>
                <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded">
                  <p className="font-semibold text-[#4573df]">💡 Pro Tip:</p>
                  <p>Use our <Link href="/gpa-calculator" className="text-[#4573df] hover:underline">GPA Calculator</Link> to plan your target grades from day one!</p>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950/20 p-6 rounded-lg border-l-4 border-[#667eea]">
                <h3 className="text-xl font-semibold mb-3">2. Get Your Study Materials Ready</h3>
                <ul className="space-y-3 ml-6 list-disc">
                  <li>
                    <strong>Download Past Papers:</strong> Access <Link href="/past-papers" className="text-[#667eea] hover:underline">COMSATS past papers</Link> for all your courses
                  </li>
                  <li>
                    <strong>Recommended Books:</strong> Check your course outlines on LMS for required textbooks
                  </li>
                  <li>
                    <strong>Online Resources:</strong> Bookmark YouTube channels, Khan Academy, and MIT OpenCourseWare
                  </li>
                  <li>
                    <strong>Note-taking Tools:</strong> Set up OneNote, Notion, or traditional notebooks
                  </li>
                </ul>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg border-l-4 border-[#ff9800]">
                <h3 className="text-xl font-semibold mb-3">3. Campus Familiarization</h3>
                <ul className="space-y-2 ml-6 list-disc">
                  <li>Visit campus before first day if possible</li>
                  <li>Locate your classrooms, library, cafeteria, and computer labs</li>
                  <li>Understand the timetable system (check our <Link href="/timetable" className="text-[#ff9800] hover:underline">Timetable Tool</Link>)</li>
                  <li>Know where administrative offices are (Accounts, Exams, HOD offices)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: First Week Strategies */}
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-[#4573df]" />
              First Week: Setting Strong Foundations
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Week 1 Checklist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-[#4573df] text-xl mt-1">✓</span>
                    <div>
                      <strong>Attend ALL Lectures:</strong> First impressions matter. Professors notice who's present from day one.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#4573df] text-xl mt-1">✓</span>
                    <div>
                      <strong>Introduce Yourself:</strong> Sit in front rows and introduce yourself to professors after class.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#4573df] text-xl mt-1">✓</span>
                    <div>
                      <strong>Form Study Groups:</strong> Connect with 3-4 serious students in each class for collaborative learning.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#4573df] text-xl mt-1">✓</span>
                    <div>
                      <strong>Download Course Outlines:</strong> Get all syllabi from LMS and print/save them.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#4573df] text-xl mt-1">✓</span>
                    <div>
                      <strong>Set Up LMS Access:</strong> Ensure you can access all course materials online.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#4573df] text-xl mt-1">✓</span>
                    <div>
                      <strong>Library Tour:</strong> Get your library card and learn how to access digital resources.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 3: Study Strategies */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Proven Study Strategies for COMSATS Success</h2>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4">The 50-30-20 Study Method</h3>
                <p className="mb-4">This method has helped hundreds of COMSATS students achieve 3.5+ GPAs:</p>
                <ul className="space-y-3 ml-6 list-disc">
                  <li>
                    <strong>50% - Active Learning (Lectures & Practice):</strong> Attend lectures, take detailed notes, solve examples immediately
                  </li>
                  <li>
                    <strong>30% - Self-Study (Past Papers & Textbooks):</strong> Solve past papers, read recommended chapters, watch online tutorials
                  </li>
                  <li>
                    <strong>20% - Revision & Group Discussion:</strong> Weekly revision, study group sessions, teaching concepts to others
                  </li>
                </ul>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Time Management: The COMSATS Student's Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <strong>6:00 AM - 8:00 AM:</strong> Morning study session (most productive time)
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <strong>8:00 AM - 2:00 PM:</strong> Classes and campus activities
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <strong>2:00 PM - 4:00 PM:</strong> Lunch, rest, and social time
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <strong>4:00 PM - 7:00 PM:</strong> Library study session (assignments & practice)
                    </div>
                    <div className="border-l-4 border-red-500 pl-4">
                      <strong>7:00 PM - 9:00 PM:</strong> Dinner, exercise, relaxation
                    </div>
                    <div className="border-l-4 border-indigo-500 pl-4">
                      <strong>9:00 PM - 11:00 PM:</strong> Light revision or group study
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    * Adjust based on your commute time and personal productivity patterns
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 4: Resource Utilization */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Maximize COMSATS Resources</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-6 w-6 text-[#4573df]" />
                    Academic Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>✅ Library: 50,000+ books & digital resources</li>
                    <li>✅ Computer Labs: Free software & high-speed internet</li>
                    <li>✅ LMS Portal: Lectures, assignments, announcements</li>
                    <li>✅ Faculty Office Hours: Personalized help</li>
                    <li>✅ Online Journals: IEEE, ACM, Springer access</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-[#667eea]" />
                    Student Support Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>✅ Counseling Center: Mental health support</li>
                    <li>✅ Career Services: Internship guidance</li>
                    <li>✅ Student Societies: 20+ active clubs</li>
                    <li>✅ Sports Facilities: Gym, courts, grounds</li>
                    <li>✅ Financial Aid: Scholarship opportunities</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 5: Common Mistakes to Avoid */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-red-600 dark:text-red-400">
              ⚠️ Common First Semester Mistakes (And How to Avoid Them)
            </h2>
            
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-950/20 p-5 rounded-lg border-l-4 border-red-500">
                <h3 className="font-bold text-lg mb-2">❌ Mistake #1: Skipping Early Lectures</h3>
                <p className="mb-2"><strong>Why it's bad:</strong> You miss foundational concepts that are assumed knowledge later.</p>
                <p><strong>✅ Solution:</strong> Treat the first month as non-negotiable. Attend every single class.</p>
              </div>

              <div className="bg-red-50 dark:bg-red-950/20 p-5 rounded-lg border-l-4 border-red-500">
                <h3 className="font-bold text-lg mb-2">❌ Mistake #2: Ignoring Assignments</h3>
                <p className="mb-2"><strong>Why it's bad:</strong> Assignments typically count 10-20% of your grade and build understanding.</p>
                <p><strong>✅ Solution:</strong> Complete assignments the day they're assigned, not the day before deadline.</p>
              </div>

              <div className="bg-red-50 dark:bg-red-950/20 p-5 rounded-lg border-l-4 border-red-500">
                <h3 className="font-bold text-lg mb-2">❌ Mistake #3: Last-Minute Exam Preparation</h3>
                <p className="mb-2"><strong>Why it's bad:</strong> Cramming leads to poor retention and high stress.</p>
                <p><strong>✅ Solution:</strong> Start solving past papers 3 weeks before midterms/finals.</p>
              </div>

              <div className="bg-red-50 dark:bg-red-950/20 p-5 rounded-lg border-l-4 border-red-500">
                <h3 className="font-bold text-lg mb-2">❌ Mistake #4: Isolating Yourself</h3>
                <p className="mb-2"><strong>Why it's bad:</strong> You miss study resources, notes, and emotional support.</p>
                <p><strong>✅ Solution:</strong> Join at least one society and maintain a study group.</p>
              </div>

              <div className="bg-red-50 dark:bg-red-950/20 p-5 rounded-lg border-l-4 border-red-500">
                <h3 className="font-bold text-lg mb-2">❌ Mistake #5: Neglecting Faculty Feedback</h3>
                <p className="mb-2"><strong>Why it's bad:</strong> You repeat the same mistakes in every assignment/exam.</p>
                <p><strong>✅ Solution:</strong> Review graded work carefully and visit faculty during office hours for clarification.</p>
              </div>
            </div>
          </section>

          {/* Section 6: Success Stories */}
          <section>
            <h2 className="text-3xl font-bold mb-6">🌟 Success Stories: Learn from Top Performers</h2>
            
            <div className="space-y-6">
              <Card className="border-2 border-[#4573df]/30">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#4573df] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                      AK
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Ali Khan - Computer Science (4.0 GPA)</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        "I attended every lecture, solved past papers from week 1, and formed a study group of 5 students. 
                        We would quiz each other weekly. The key is consistency, not cramming."
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm">Daily Revision</span>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm">Study Groups</span>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm">Past Papers</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#667eea]/30">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#667eea] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                      SF
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Sara Fatima - Electrical Engineering (3.89 GPA)</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        "Time management was my secret. I created a detailed weekly schedule and stuck to it religiously. 
                        Also, I never hesitated to ask professors for help during office hours."
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 rounded-full text-sm">Time Blocking</span>
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 rounded-full text-sm">Office Hours</span>
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 rounded-full text-sm">Detailed Notes</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 7: Week-by-Week Action Plan */}
          <section>
            <h2 className="text-3xl font-bold mb-6">📅 Your First Semester Week-by-Week Action Plan</h2>
            
            <div className="space-y-4">
              {[
                { week: "Week 1-2", title: "Orientation & Setup", tasks: ["Attend all lectures", "Form study groups", "Set up study schedule", "Get all textbooks"] },
                { week: "Week 3-4", title: "Building Momentum", tasks: ["Start assignment work early", "Review notes daily", "Identify weak areas", "Join one society"] },
                { week: "Week 5-6", title: "Midterm Preparation", tasks: ["Solve past midterm papers", "Group study sessions", "Consult faculty on doubts", "Review all lecture notes"] },
                { week: "Week 7-8", title: "Midterm Exams", tasks: ["Take exams seriously", "Manage exam stress", "Review graded work", "Adjust study strategies"] },
                { week: "Week 9-12", title: "Post-Midterm Push", tasks: ["Improve on midterm feedback", "Stay consistent with attendance", "Start final exam prep early", "Maintain GPA tracker"] },
                { week: "Week 13-14", title: "Final Preparation", tasks: ["Intensive past paper solving", "Group mock exams", "Revision sessions", "Manage sleep & health"] },
                { week: "Week 15-16", title: "Final Exams", tasks: ["Execute exam strategies", "Time management in exams", "Stay calm and confident", "Finish strong"] }
              ].map((phase, idx) => (
                <Card key={idx} className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-3">
                      <span className="bg-[#4573df] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                        {idx + 1}
                      </span>
                      {phase.week}: {phase.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {phase.tasks.map((task, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-[#4573df]">✓</span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Conclusion & CTA */}
          <section className="bg-gradient-to-r from-[#4573df] to-[#667eea] text-white p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Excel at COMSATS?</h2>
            <p className="text-lg mb-6">
              Your first semester is the foundation of your academic journey. Follow this guide, stay consistent, 
              and don't hesitate to seek help when needed. Thousands of COMSATS students have succeeded before you, 
              and with the right approach, you will too!
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="secondary" size="lg">
                <Link href="/gpa-calculator">
                  Calculate Your Target GPA
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/30 hover:bg-white/20">
                <Link href="/past-papers">
                  Access Past Papers
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/30 hover:bg-white/20">
                <Link href="/faculty">
                  Find Great Professors
                </Link>
              </Button>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Q: What GPA should I target in my first semester?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Aim for at least 3.0 GPA (B grade average) in your first semester. However, if you follow this guide 
                    consistently, 3.5+ is very achievable. Remember, many scholarships require 3.5+ CGPA.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Q: How many hours should I study daily?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Plan for 6-8 hours of study outside of class time. This includes attending lectures (4-5 hours), 
                    self-study (3-4 hours), and group study (1-2 hours). Quality matters more than quantity.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Q: Is it necessary to join societies in the first semester?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    While not mandatory, joining one society (preferably related to your field) is highly recommended. 
                    It helps with networking, skill development, and maintaining work-life balance. Just don't overcommit 
                    to multiple societies in your first semester.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Q: What if I fail a course in my first semester?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    First, don't panic. COMSATS allows you to repeat the course. However, prevention is better than cure - 
                    use our guide to avoid this situation. If you're struggling, seek help immediately from professors, 
                    seniors, or academic counselors.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Related Articles */}
          <section className="border-t pt-8">
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/blog/comsats-grading-system" className="group">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="group-hover:text-[#4573df]">
                      COMSATS Grading System Explained
                    </CardTitle>
                    <CardDescription>
                      Understand how GPA is calculated and plan your grades strategically
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              
              <Link href="/blog/comsats-gpa-calculator-guide" className="group">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="group-hover:text-[#4573df]">
                      How to Use COMSATS GPA Calculator
                    </CardTitle>
                    <CardDescription>
                      Master the GPA calculator tool for academic planning
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </section>
        </div>
      </article>
    </div>
  )
}
