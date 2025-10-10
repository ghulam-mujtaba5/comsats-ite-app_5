"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  TrendingUp, 
  Target, 
  Award, 
  Calendar,
  Edit3,
  Save,
  Sparkles
} from "lucide-react"

interface Milestone {
  id: string
  title: string
  date: Date
  description: string
  achieved: boolean
}

interface ReflectionEntry {
  id: string
  date: Date
  content: string
  mood: string
  insights: string[]
}

const INITIAL_MILESTONES: Milestone[] = [
  {
    id: "1",
    title: "First Past Paper Attempt",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    description: "Completed first practice paper with 60% score",
    achieved: true
  },
  {
    id: "2",
    title: "Concept Mastery",
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    description: "Mastered core concepts in Calculus",
    achieved: true
  },
  {
    id: "3",
    title: "Quiz Excellence",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    description: "Scored 90%+ in weekly quiz",
    achieved: true
  },
  {
    id: "4",
    title: "Final Exam Preparation",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    description: "Complete all practice papers",
    achieved: false
  }
]

const REFLECTION_PROMPTS = [
  "What challenges did I overcome this week?",
  "What study techniques worked best for me?",
  "How have I grown academically and personally?",
  "What am I most proud of accomplishing?",
  "What would I do differently next time?"
]

export function ProgressReflection() {
  const [milestones] = useState<Milestone[]>(INITIAL_MILESTONES)
  const [reflections, setReflections] = useState<ReflectionEntry[]>([])
  const [newReflection, setNewReflection] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState(0)

  const achievedMilestones = milestones.filter(m => m.achieved).length
  const progressPercentage = (achievedMilestones / milestones.length) * 100

  const addReflection = () => {
    if (newReflection.trim()) {
      const reflection: ReflectionEntry = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date(),
        content: newReflection,
        mood: "happy",
        insights: ["Persistence", "Growth mindset"]
      }
      
      setReflections(prev => [reflection, ...prev])
      setNewReflection("")
      setIsEditing(false)
    }
  }

  const changePrompt = () => {
    setSelectedPrompt((prev) => (prev + 1) % REFLECTION_PROMPTS.length)
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Your Journey So Far
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-indigo-700">Overall Progress</span>
                <span className="text-indigo-700">{achievedMilestones}/{milestones.length} milestones</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">12</div>
                <div className="text-xs text-gray-600">Study Hours</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">85%</div>
                <div className="text-xs text-gray-600">Avg. Score</div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">5</div>
                <div className="text-xs text-gray-600">Resources Shared</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Milestones */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  milestone.achieved 
                    ? "bg-green-50 border-green-200" 
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  milestone.achieved 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-300 text-gray-600"
                }`}>
                  {milestone.achieved ? (
                    <Award className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${
                    milestone.achieved ? "text-green-800" : "text-gray-800"
                  }`}>
                    {milestone.title}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {milestone.date.toLocaleDateString()} • {milestone.description}
                  </p>
                </div>
                {milestone.achieved && (
                  <div className="text-green-500">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Reflection Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-pink-600" />
            Reflection Journal
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-3">
              <div className="bg-pink-50 p-3 rounded-lg">
                <p className="text-sm text-pink-700 font-medium">
                  {REFLECTION_PROMPTS[selectedPrompt]}
                </p>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-pink-600 p-0 h-auto"
                  onClick={changePrompt}
                >
                  Try another prompt
                </Button>
              </div>
              
              <Textarea
                value={newReflection}
                onChange={(e) => setNewReflection(e.target.value)}
                placeholder="Write your reflection here..."
                className="min-h-[120px]"
              />
              
              <div className="flex gap-2">
                <Button 
                  onClick={addReflection}
                  className="bg-pink-500 hover:bg-pink-600"
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Reflection
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {reflections.length > 0 ? (
                reflections.map((reflection) => (
                  <div key={reflection.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <p className="text-sm">{reflection.content}</p>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {reflection.date.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {reflection.insights.map((insight, idx) => (
                        <span 
                          key={idx} 
                          className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded"
                        >
                          {insight}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">
                  No reflections yet. Start journaling your academic journey!
                </p>
              )}
              
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline" 
                className="w-full border-dashed"
                size="sm"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Add Reflection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}