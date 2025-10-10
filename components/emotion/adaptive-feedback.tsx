"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useStudyCompanionFeedback } from "@/hooks/use-emotion-detection"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Lightbulb, 
  ThumbsUp, 
  ThumbsDown, 
  Trophy, 
  Sparkles,
  RotateCcw
} from "lucide-react"

interface FeedbackMessage {
  id: string
  type: 'encouragement' | 'tip' | 'celebration' | 'motivation'
  message: string
  action?: string
  timestamp: Date
}

const FEEDBACK_TEMPLATES = {
  encouragement: [
    "You're making great progress! Keep going!",
    "Every mistake is a learning opportunity. Well done!",
    "Your persistence is admirable. Don't give up!",
    "You're improving with each attempt. Keep it up!"
  ],
  tip: [
    "Try breaking this problem into smaller parts.",
    "Review the fundamentals if you're stuck.",
    "Take a short break and come back with fresh eyes.",
    "Ask for help when you need it - that's a sign of wisdom!"
  ],
  celebration: [
    "Excellent work! You've mastered this concept!",
    "Fantastic job! Your hard work is paying off!",
    "Outstanding! You're really getting the hang of this!",
    "Brilliant! That's exactly right!"
  ],
  motivation: [
    "You've come so far already - keep pushing forward!",
    "Believe in yourself - you have what it takes!",
    "Consistency is key. You're on the right track!",
    "Your dedication is inspiring others around you!"
  ]
}

export function AdaptiveFeedback({ context }: { context: 'study' | 'quiz' | 'practice' }) {
  const { onStudyAction } = useStudyCompanionFeedback()
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackMessage[]>([])
  const [errorStreak, setErrorStreak] = useState(0)
  const [successStreak, setSuccessStreak] = useState(0)

  // Simulate user interactions for demonstration
  const simulateInteraction = (type: 'success' | 'error') => {
    if (type === 'error') {
      setErrorStreak(prev => prev + 1)
      setSuccessStreak(0)
      onStudyAction('error')
      
      // Add feedback message
      const encouragement = FEEDBACK_TEMPLATES.encouragement[
        Math.floor(Math.random() * FEEDBACK_TEMPLATES.encouragement.length)
      ]
      
      const tip = FEEDBACK_TEMPLATES.tip[
        Math.floor(Math.random() * FEEDBACK_TEMPLATES.tip.length)
      ]
      
      setFeedbackHistory(prev => [
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'encouragement',
          message: encouragement,
          timestamp: new Date()
        },
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'tip',
          message: tip,
          timestamp: new Date()
        },
        ...prev.slice(0, 3)
      ])
    } else {
      setSuccessStreak(prev => prev + 1)
      setErrorStreak(0)
      onStudyAction('success')
      
      // Add celebration message
      const celebration = FEEDBACK_TEMPLATES.celebration[
        Math.floor(Math.random() * FEEDBACK_TEMPLATES.celebration.length)
      ]
      
      setFeedbackHistory(prev => [
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'celebration',
          message: celebration,
          timestamp: new Date()
        },
        ...prev.slice(0, 3)
      ])
    }
    
    // Check for streaks
    if (successStreak >= 3) {
      onStudyAction('streak')
    }
  }

  const getIconForType = (type: FeedbackMessage['type']) => {
    switch (type) {
      case 'encouragement': return <Sparkles className="w-4 h-4 text-yellow-500" />
      case 'tip': return <Lightbulb className="w-4 h-4 text-blue-500" />
      case 'celebration': return <Trophy className="w-4 h-4 text-green-500" />
      case 'motivation': return <ThumbsUp className="w-4 h-4 text-purple-500" />
      default: return <Sparkles className="w-4 h-4 text-gray-500" />
    }
  }

  const getColorForType = (type: FeedbackMessage['type']) => {
    switch (type) {
      case 'encouragement': return 'bg-yellow-50 border-yellow-200'
      case 'tip': return 'bg-blue-50 border-blue-200'
      case 'celebration': return 'bg-green-50 border-green-200'
      case 'motivation': return 'bg-purple-50 border-purple-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="space-y-4">
      {/* Feedback History */}
      <div className="space-y-2">
        {feedbackHistory.map((feedback) => (
          <motion.div
            key={feedback.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`border rounded-lg p-3 ${getColorForType(feedback.type)}`}
          >
            <div className="flex items-start gap-2">
              {getIconForType(feedback.type)}
              <div className="flex-1">
                <p className="text-sm">{feedback.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {feedback.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Interaction Buttons (for demo) */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardContent className="p-4">
          <h3 className="font-medium text-indigo-800 mb-3">Simulate Study Interactions</h3>
          <div className="flex gap-2">
            <Button 
              onClick={() => simulateInteraction('success')}
              className="flex-1 bg-green-500 hover:bg-green-600"
              size="sm"
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Success
            </Button>
            <Button 
              onClick={() => simulateInteraction('error')}
              variant="outline"
              className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
              size="sm"
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              Mistake
            </Button>
            <Button 
              onClick={() => {
                setFeedbackHistory([])
                setErrorStreak(0)
                setSuccessStreak(0)
              }}
              variant="ghost"
              size="sm"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-green-600">✓</span>
              <span>Success Streak: {successStreak}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-red-600">✗</span>
              <span>Error Streak: {errorStreak}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}