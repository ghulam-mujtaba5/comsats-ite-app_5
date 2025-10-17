"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useEmotion } from "@/contexts/emotion-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  Clock, 
  Frown, 
  Heart, 
  Music, 
  Pause, 
  Phone, 
  Sparkles,
  Volume2,
  VolumeX
} from "lucide-react"

const HEALING_ACTIVITIES = [
  {
    id: "journaling",
    title: "Gratitude Journal",
    description: "Write 3 things you're grateful for",
    icon: <BookOpen className="w-4 h-4" />,
    duration: "10 min",
    category: "reflection"
  },
  {
    id: "affirmations",
    title: "Positive Affirmations",
    description: "Boost your confidence and mood",
    icon: <Heart className="w-4 h-4" />,
    duration: "5 min",
    category: "positivity"
  },
  {
    id: "music",
    title: "Relaxing Music",
    description: "Calm your mind with nature sounds",
    icon: <Music className="w-4 h-4" />,
    duration: "15 min",
    category: "relaxation"
  },
  {
    id: "campus_support",
    title: "Campus Counseling",
    description: "24/7 mental health support",
    icon: <Phone className="w-4 h-4" />,
    duration: "Ongoing",
    category: "support"
  },
  {
    id: "mindfulness",
    title: "Mindful Walking",
    description: "10-minute mindful walk exercise",
    icon: <Clock className="w-4 h-4" />,
    duration: "10 min",
    category: "mindfulness"
  }
]

const AFFIRMATIONS = [
  "I am capable of achieving my goals",
  "I deserve love and respect from others",
  "I am resilient and can overcome challenges",
  "I am worthy of success and happiness",
  "I trust in my ability to make good decisions",
  "I am grateful for the opportunities in my life",
  "I choose to focus on positive thoughts",
  "I am growing and learning every day"
]

export function HealingSpace() {
  const { emotionState, updateEmotionState } = useEmotion()
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
  const [currentAffirmation, setCurrentAffirmation] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const selectActivity = (activityId: string) => {
    setSelectedActivity(activityId)
    
    // Update emotion state based on activity
    if (activityId === "music") {
      updateEmotionState({
        stressLevel: "low",
        mood: "calm"
      })
    } else if (activityId === "affirmations") {
      updateEmotionState({
        mood: "happy"
      })
    }
  }

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % AFFIRMATIONS.length)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Healing Space</h1>
          <p className="text-gray-600">A safe place to recharge and reflect</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => updateEmotionState({ mood: "calm", stressLevel: "low" })}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Reset Mood
        </Button>
      </div>
      
      {/* Mood Status */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-indigo-800">Current State</h3>
              <p className="text-sm text-indigo-700 capitalize">
                Mood: {emotionState.mood} • Stress: {emotionState.stressLevel}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                onClick={() => {
                  updateEmotionState({
                    mood: emotionState.mood === "sad" ? "neutral" : "sad",
                    stressLevel: emotionState.stressLevel === "high" ? "medium" : emotionState.stressLevel
                  })
                }}
              >
                <Frown className="w-4 h-4 mr-2" />
                I'm struggling
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Healing Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Healing Activities
          </CardTitle>
          <p className="text-sm text-gray-600">
            Choose an activity to support your emotional well-being
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {HEALING_ACTIVITIES.map((activity) => (
              <motion.div
                key={activity.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer border-2 transition-all ${
                    selectedActivity === activity.id 
                      ? "border-pink-500 bg-pink-50" 
                      : "hover:border-pink-300"
                  }`}
                  onClick={() => selectActivity(activity.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
                        {activity.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">{activity.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
                            {activity.category}
                          </span>
                          <span className="text-xs text-gray-500">{activity.duration}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Positive Affirmations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Positive Affirmations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-6 text-center">
            <p className="text-lg font-medium text-yellow-800 mb-4">
              "{AFFIRMATIONS[currentAffirmation]}"
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={nextAffirmation}
              >
                Next Affirmation
              </Button>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <VolumeX className="w-4 h-4 text-yellow-600" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-yellow-600" />
                  )}
                </Button>
                <span className="text-xs text-yellow-700">
                  {isPlaying ? "Playing" : "Tap to speak"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Emergency Support */}
      <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-500" />
            Need Immediate Support?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <h3 className="font-medium text-red-800">Campus Counseling Center</h3>
              <p className="text-sm text-red-700 mt-1">
                Available 24/7 for students in crisis
              </p>
              <Button 
                className="mt-3 bg-red-500 hover:bg-red-600"
                onClick={() => alert("Connecting to campus counseling services...")}
              >
                Call Now: (555) 123-4567
              </Button>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-red-800">Crisis Text Line</h3>
              <p className="text-sm text-red-700 mt-1">
                Text HOME to 741741 for immediate support
              </p>
              <Button 
                variant="outline" 
                className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
                onClick={() => alert("Opening text messaging app...")}
              >
                Text HOME to 741741
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}