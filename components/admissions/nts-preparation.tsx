import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Clock, FileText } from "lucide-react"
import { GlassCard } from "@/components/admin/glass-card"

interface NtsTest {
  id: number
  title: string
  subject: string
  description: string
  questionCount: number
  timeLimit: number // in minutes
  difficulty: string
  url: string
  attempts: number
  averageScore: number
}

const mockNtsTests: NtsTest[] = [
  {
    id: 1,
    title: "Quantitative Reasoning Practice Test",
    subject: "Quantitative",
    description: "20 questions covering basic arithmetic, algebra, and geometry concepts",
    questionCount: 20,
    timeLimit: 30,
    difficulty: "Medium",
    url: "#",
    attempts: 1250,
    averageScore: 75
  },
  {
    id: 2,
    title: "Verbal Reasoning Practice Test",
    subject: "Verbal",
    description: "20 questions testing English comprehension and vocabulary skills",
    questionCount: 20,
    timeLimit: 30,
    difficulty: "Medium",
    url: "#",
    attempts: 980,
    averageScore: 68
  },
  {
    id: 3,
    title: "Analytical Reasoning Practice Test",
    subject: "Analytical",
    description: "15 questions testing logical reasoning and problem-solving skills",
    questionCount: 15,
    timeLimit: 25,
    difficulty: "Hard",
    url: "#",
    attempts: 720,
    averageScore: 62
  },
  {
    id: 4,
    title: "Subject Knowledge (Mathematics)",
    subject: "Mathematics",
    description: "25 questions covering intermediate level mathematics concepts",
    questionCount: 25,
    timeLimit: 40,
    difficulty: "Hard",
    url: "#",
    attempts: 850,
    averageScore: 71
  }
]

export function NtsPreparation() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockNtsTests.map((test) => (
          <GlassCard key={test.id} hover={true}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{test.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {test.description}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-center text-muted-foreground mb-1">
                    <Trophy className="h-4 w-4 mr-1" />
                    <span className="text-xs">Questions</span>
                  </div>
                  <div className="font-semibold">{test.questionCount}</div>
                </div>
                
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-center text-muted-foreground mb-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-xs">Time</span>
                  </div>
                  <div className="font-semibold">{test.timeLimit} min</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm px-2 py-1 bg-primary/10 rounded-full text-primary">
                  {test.difficulty}
                </span>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{test.averageScore}%</span> avg. score
                </div>
              </div>
              
              <Button size="sm" variant="outline" className="w-full" asChild>
                <a href={test.url}>Start Practice Test</a>
              </Button>
            </CardContent>
          </GlassCard>
        ))}
      </div>
      
      <GlassCard title="NTS Preparation Tips" description="Expert advice for success in entrance exams">
        <CardContent className="p-0">
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-primary mt-0.5">•</div>
              <span className="ml-2 text-muted-foreground">
                Start preparation at least 2-3 months before the test date
              </span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-primary mt-0.5">•</div>
              <span className="ml-2 text-muted-foreground">
                Practice with timed tests to improve speed and accuracy
              </span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-primary mt-0.5">•</div>
              <span className="ml-2 text-muted-foreground">
                Focus on weak areas identified through practice tests
              </span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-primary mt-0.5">•</div>
              <span className="ml-2 text-muted-foreground">
                Review basic concepts in mathematics, English, and analytical reasoning
              </span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-primary mt-0.5">•</div>
              <span className="ml-2 text-muted-foreground">
                Take full-length mock tests under exam conditions
              </span>
            </li>
          </ul>
        </CardContent>
      </GlassCard>
    </div>
  )
}