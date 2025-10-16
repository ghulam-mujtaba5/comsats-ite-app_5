"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useEmotion } from "@/contexts/emotion-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Smile, 
  Frown, 
  Meh, 
  Heart, 
  Zap, 
  Brain,
  Calendar,
  TrendingUp
} from "lucide-react"

const MOOD_OPTIONS = [
  { value: "happy", label: "Happy", icon: Smile, color: "text-yellow-500", bg: "bg-yellow-100" },
  { value: "sad", label: "Sad", icon: Frown, color: "text-blue-500", bg: "bg-blue-100" },
  { value: "neutral", label: "Neutral", icon: Meh, color: "text-gray-500", bg: "bg-gray-100" },
  { value: "excited", label: "Excited", icon: Heart, color: "text-red-500", bg: "bg-red-100" },
  { value: "stressed", label: "Stressed", icon: Frown, color: "text-orange-500", bg: "bg-orange-100" },
  { value: "calm", label: "Calm", icon: Smile, color: "text-green-500", bg: "bg-green-100" },
  { value: "focused", label: "Focused", icon: Brain, color: "text-purple-500", bg: "bg-purple-100" },
  { value: "tired", label: "Tired", icon: Meh, color: "text-gray-600", bg: "bg-gray-200" },
  { value: "energized", label: "Energized", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-200" },
]

export function MoodTrackerWidget() {
  const { emotionState, updateEmotionState } = useEmotion()
  const [selectedMood, setSelectedMood] = useState(emotionState.mood)

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood as any)
    updateEmotionState({ mood: mood as any })
  }

  const getMoodIcon = (mood: string) => {
    const moodOption = MOOD_OPTIONS.find(m => m.value === mood)
    if (moodOption) {
      const Icon = moodOption.icon
      return <Icon className={`w-5 h-5 ${moodOption.color}`} />
    }
    return <Meh className="w-5 h-5 text-gray-500" />
  }

  const getCurrentMood = () => {
    return MOOD_OPTIONS.find(m => m.value === emotionState.mood) || MOOD_OPTIONS[2] // default to neutral
  }

  const currentMood = getCurrentMood()

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="w-5 h-5 text-pink-500" />
          How are you feeling?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {getMoodIcon(emotionState.mood)}
            <span className="font-medium capitalize">{emotionState.mood}</span>
          </div>
          <div className="text-sm text-gray-500">
            Today
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {MOOD_OPTIONS.map((mood) => {
            const Icon = mood.icon
            return (
              <motion.div
                key={mood.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex flex-col h-auto p-2 ${
                    selectedMood === mood.value 
                      ? `${mood.bg} border-${mood.color.replace('text-', '')} border-2` 
                      : ""
                  }`}
                  onClick={() => handleMoodSelect(mood.value)}
                >
                  <Icon className={`w-5 h-5 ${mood.color}`} />
                  <span className="text-xs mt-1">{mood.label}</span>
                </Button>
              </motion.div>
            )
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Recent Mood Trends</h4>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div 
                key={day} 
                className="flex-1 h-8 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
              >
                <Smile className="w-3 h-3 text-gray-400" />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Mon</span>
            <span>Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}