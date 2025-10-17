"use client"

import { useEmotion } from "@/contexts/emotion-context"
import { useAnimation } from "@/contexts/animation-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Brain, 
  Coffee,
  Flame,
  Frown,
  Heart,
  Meh,
  Moon,
  Smile,
  Sparkles,
  Target,
  Trophy,
  Zap
} from "lucide-react"
import { motion } from "framer-motion"

export function EmotionDashboardWidget() {
  const { emotionState, updateEmotionState } = useEmotion()
  const { triggerAnimation } = useAnimation()

  // Get emotion icon and color
  const getEmotionDisplay = () => {
    switch (emotionState.mood) {
      case 'happy':
        return { icon: Smile, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', label: 'Happy' }
      case 'sad':
        return { icon: Frown, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', label: 'Sad' }
      case 'stressed':
        return { icon: Flame, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', label: 'Stressed' }
      case 'focused':
        return { icon: Target, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', label: 'Focused' }
      case 'excited':
        return { icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', label: 'Excited' }
      default:
        return { icon: Meh, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-900/20', label: 'Neutral' }
    }
  }

  const getFocusLevelDisplay = () => {
    switch (emotionState.focusLevel) {
      case 'high':
        return { icon: Brain, color: 'text-green-500', label: 'Highly Focused' }
      case 'medium':
        return { icon: Target, color: 'text-yellow-500', label: 'Moderately Focused' }
      default:
        return { icon: Moon, color: 'text-gray-500', label: 'Low Focus' }
    }
  }

  const getMotivationLevelDisplay = () => {
    switch (emotionState.motivationLevel) {
      case 'high':
        return { icon: Trophy, color: 'text-orange-500', label: 'Highly Motivated' }
      case 'medium':
        return { icon: Zap, color: 'text-yellow-500', label: 'Moderately Motivated' }
      default:
        return { icon: Coffee, color: 'text-gray-500', label: 'Low Motivation' }
    }
  }

  const emotionDisplay = getEmotionDisplay()
  const focusDisplay = getFocusLevelDisplay()
  const motivationDisplay = getMotivationLevelDisplay()
  
  const EmotionIcon = emotionDisplay.icon
  const FocusIcon = focusDisplay.icon
  const MotivationIcon = motivationDisplay.icon

  const improveMood = () => {
    updateEmotionState({
      mood: 'happy',
      stressLevel: 'low'
    })
    
    triggerAnimation({
      type: 'sparkles',
      message: "Feeling better already! ✨",
      duration: 3000
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Emotional Wellness
          </CardTitle>
          <CardDescription>
            Your current emotional state and well-being
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Mood */}
          <div className={`rounded-xl p-4 ${emotionDisplay.bg} transition-colors duration-300`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${emotionDisplay.color} bg-white dark:bg-black/20`}>
                  <EmotionIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">Current Mood</div>
                  <div className="text-sm text-muted-foreground">{emotionDisplay.label}</div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={improveMood}
                className="text-xs"
              >
                Improve
              </Button>
            </div>
          </div>

          {/* Focus Level */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FocusIcon className={`h-4 w-4 ${focusDisplay.color}`} />
              Focus Level
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{focusDisplay.label}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${focusDisplay.color} bg-white dark:bg-black/20`}>
                {emotionState.focusLevel}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${focusDisplay.color.replace('text-', 'bg-')}`}
                style={{ 
                  width: emotionState.focusLevel === 'high' ? '100%' : emotionState.focusLevel === 'medium' ? '60%' : '30%' 
                }}
              ></div>
            </div>
          </div>

          {/* Motivation Level */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MotivationIcon className={`h-4 w-4 ${motivationDisplay.color}`} />
              Motivation
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{motivationDisplay.label}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${motivationDisplay.color} bg-white dark:bg-black/20`}>
                {emotionState.motivationLevel}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${motivationDisplay.color.replace('text-', 'bg-')}`}
                style={{ 
                  width: emotionState.motivationLevel === 'high' ? '100%' : emotionState.motivationLevel === 'medium' ? '60%' : '30%' 
                }}
              ></div>
            </div>
          </div>

          {/* Stress Level */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Flame className={`h-4 w-4 ${emotionState.stressLevel === 'high' ? 'text-red-500' : emotionState.stressLevel === 'medium' ? 'text-yellow-500' : 'text-green-500'}`} />
              Stress Level
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">
                {emotionState.stressLevel === 'high' ? 'High Stress' : 
                 emotionState.stressLevel === 'medium' ? 'Moderate Stress' : 'Low Stress'}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                emotionState.stressLevel === 'high' ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 
                emotionState.stressLevel === 'medium' ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 
                'text-green-500 bg-green-50 dark:bg-green-900/20'
              }`}>
                {emotionState.stressLevel}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => updateEmotionState({ mood: 'focused', focusLevel: 'high' })}
              className="flex-1 text-xs"
            >
              <Target className="h-3 w-3 mr-1" />
              Focus
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}