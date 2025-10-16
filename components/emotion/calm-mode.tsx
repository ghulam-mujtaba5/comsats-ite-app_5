"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useEmotion } from "@/contexts/emotion-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BreathingAnimation } from "./breathing-animation"
import { 
  Moon, 
  Sparkles, 
  Music, 
  BookOpen, 
  Coffee,
  Volume2,
  Pause,
  Play
} from "lucide-react"

const CALM_ACTIVITIES = [
  {
    id: "breathing",
    title: "Guided Breathing",
    description: "4-7-8 breathing technique to reduce stress",
    icon: <Volume2 className="w-5 h-5" />,
    duration: "5 min"
  },
  {
    id: "meditation",
    title: "Mindful Meditation",
    description: "10-minute mindfulness session",
    icon: <Sparkles className="w-5 h-5" />,
    duration: "10 min"
  },
  {
    id: "reading",
    title: "Inspirational Reading",
    description: "Positive affirmations and quotes",
    icon: <BookOpen className="w-5 h-5" />,
    duration: "5 min"
  },
  {
    id: "music",
    title: "Relaxing Sounds",
    description: "Nature sounds and ambient music",
    icon: <Music className="w-5 h-5" />,
    duration: "15 min"
  }
]

const REFLECTION_PROMPTS = [
  "What are three things you're grateful for today?",
  "What is one positive thing that happened this week?",
  "What is a skill you've improved recently?",
  "Who has helped you recently? How can you thank them?",
  "What is something you're looking forward to?"
]

export function CalmMode() {
  const { emotionState, deactivateCalmMode } = useEmotion()
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
  const [reflectionPrompt, setReflectionPrompt] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // Set a random reflection prompt
    const randomPrompt = REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)]
    setReflectionPrompt(randomPrompt)
  }, [])

  const startActivity = (activityId: string) => {
    setSelectedActivity(activityId)
    setIsPlaying(true)
  }

  const stopActivity = () => {
    setSelectedActivity(null)
    setIsPlaying(false)
  }

  if (selectedActivity === "breathing") {
    return <BreathingAnimation />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 z-50 flex items-center justify-center p-4"
    >
      <div className="max-w-2xl w-full">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-6 h-6 text-indigo-600" />
                <span className="text-indigo-800">Calm & Relaxation Mode</span>
              </div>
              <Button 
                variant="ghost" 
                onClick={deactivateCalmMode}
                className="text-indigo-600 hover:text-indigo-800"
              >
                Exit Mode
              </Button>
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Take a break and recharge. You deserve this moment of peace.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Mood Status */}
            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="font-medium text-indigo-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Current State
              </h3>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <p className="text-sm text-indigo-700">
                    Mood: <span className="font-medium capitalize">{emotionState.mood}</span>
                  </p>
                  <p className="text-sm text-indigo-700">
                    Stress Level: <span className="font-medium capitalize">{emotionState.stressLevel}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-indigo-600">Calm Mode Active</p>
                  <div className="w-3 h-3 bg-green-500 rounded-full inline-block ml-2"></div>
                </div>
              </div>
            </div>
            
            {/* Activities */}
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Choose an Activity</h3>
              <div className="grid grid-cols-2 gap-3">
                {CALM_ACTIVITIES.map((activity) => (
                  <motion.div
                    key={activity.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer border-2 transition-all ${
                        selectedActivity === activity.id 
                          ? "border-indigo-500 bg-indigo-50" 
                          : "hover:border-indigo-300"
                      }`}
                      onClick={() => startActivity(activity.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            {activity.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800 dark:text-gray-200">{activity.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                            <p className="text-xs text-indigo-600 mt-1">{activity.duration}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Reflection Prompt */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <h3 className="font-medium text-purple-800 flex items-center gap-2">
                <Coffee className="w-4 h-4" />
                Reflection Moment
              </h3>
              <p className="text-purple-700 mt-2 text-sm">{reflectionPrompt}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 border-purple-300 text-purple-700 hover:bg-purple-100"
                onClick={() => {
                  const randomPrompt = REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)]
                  setReflectionPrompt(randomPrompt)
                }}
              >
                New Prompt
              </Button>
            </div>
            
            {/* Quick Tips */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-800">Quick Wellness Tips</h3>
              <ul className="mt-2 text-sm text-blue-700 space-y-1">
                <li>• Take deep breaths when feeling overwhelmed</li>
                <li>• Step away from screens every 30 minutes</li>
                <li>• Stay hydrated throughout your study sessions</li>
                <li>• Celebrate small wins along the way</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}