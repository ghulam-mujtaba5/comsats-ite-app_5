"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useEmotion } from "@/contexts/emotion-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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

const MOOD_ICONS: Record<string, React.ReactNode> = {
  happy: <Smile className="w-5 h-5 text-yellow-500" />,
  sad: <Frown className="w-5 h-5 text-blue-500" />,
  neutral: <Meh className="w-5 h-5 text-gray-500" />,
  excited: <Heart className="w-5 h-5 text-red-500" />,
  stressed: <Frown className="w-5 h-5 text-orange-500" />,
  calm: <Smile className="w-5 h-5 text-green-500" />,
  focused: <Brain className="w-5 h-5 text-purple-500" />,
  tired: <Frown className="w-5 h-5 text-gray-600" />,
  energized: <Zap className="w-5 h-5 text-yellow-400" />,
}

const XP_GOALS = {
  daily: 100,
  weekly: 500,
  monthly: 2000
}

export function DailyTracker() {
  const { emotionState } = useEmotion()
  const [dailyXP, setDailyXP] = useState(45)
  const [weeklyXP, setWeeklyXP] = useState(230)
  const [monthlyXP, setMonthlyXP] = useState(850)
  
  // Simulate XP progression
  useEffect(() => {
    const interval = setInterval(() => {
      if (emotionState.motivationLevel === 'high') {
        setDailyXP(prev => Math.min(XP_GOALS.daily, prev + 2))
      } else if (emotionState.motivationLevel === 'medium') {
        setDailyXP(prev => Math.min(XP_GOALS.daily, prev + 1))
      }
    }, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [emotionState.motivationLevel])

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'from-yellow-400 to-orange-400'
      case 'sad': return 'from-blue-400 to-indigo-400'
      case 'excited': return 'from-red-400 to-pink-400'
      case 'stressed': return 'from-orange-400 to-red-400'
      case 'calm': return 'from-green-400 to-teal-400'
      case 'focused': return 'from-purple-400 to-indigo-400'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getXPColor = (progress: number) => {
    if (progress >= 90) return 'from-green-400 to-emerald-400'
    if (progress >= 70) return 'from-blue-400 to-cyan-400'
    if (progress >= 50) return 'from-yellow-400 to-amber-400'
    return 'from-gray-400 to-gray-500'
  }

  const dailyProgress = Math.min(100, (dailyXP / XP_GOALS.daily) * 100)
  const weeklyProgress = Math.min(100, (weeklyXP / XP_GOALS.weekly) * 100)
  const monthlyProgress = Math.min(100, (monthlyXP / XP_GOALS.monthly) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Mood Tracker */}
      <Card className="bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="w-5 h-5 text-pink-500" />
            Mood Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {MOOD_ICONS[emotionState.mood] || <Meh className="w-5 h-5 text-gray-500" />}
              <span className="font-medium capitalize">{emotionState.mood}</span>
            </div>
            <div className="text-sm text-gray-500">
              Today
            </div>
          </div>
          
          <div className={`h-2 rounded-full bg-gradient-to-r ${getMoodColor(emotionState.mood)}`} />
          
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className="text-xs">
              <div className="flex items-center justify-center gap-1">
                <Brain className="w-3 h-3 text-purple-500" />
                <span className="capitalize">{emotionState.focusLevel}</span>
              </div>
              <div className="text-gray-500 text-xs">Focus</div>
            </div>
            <div className="text-xs">
              <div className="flex items-center justify-center gap-1">
                <Heart className="w-3 h-3 text-pink-500" />
                <span className="capitalize">{emotionState.stressLevel}</span>
              </div>
              <div className="text-gray-500 text-xs">Stress</div>
            </div>
            <div className="text-xs">
              <div className="flex items-center justify-center gap-1">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span className="capitalize">{emotionState.motivationLevel}</span>
              </div>
              <div className="text-gray-500 text-xs">Motivation</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* XP Tracker */}
      <Card className="bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Progress Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Daily XP */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Daily XP</span>
                <span>{dailyXP}/{XP_GOALS.daily}</span>
              </div>
              <Progress value={dailyProgress} className="h-2" />
            </div>
            
            {/* Weekly XP */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Weekly XP</span>
                <span>{weeklyXP}/{XP_GOALS.weekly}</span>
              </div>
              <Progress value={weeklyProgress} className="h-2" />
            </div>
            
            {/* Monthly XP */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Monthly XP</span>
                <span>{monthlyXP}/{XP_GOALS.monthly}</span>
              </div>
              <Progress value={monthlyProgress} className="h-2" />
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full"
            >
              Set Goals
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}