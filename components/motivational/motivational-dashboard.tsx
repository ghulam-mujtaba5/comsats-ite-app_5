"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Trophy, 
  Heart, 
  Star, 
  Target, 
  Zap, 
  Flame,
  Crown,
  Medal,
  Gift,
  Sparkles,
  Smile,
  Frown,
  Cloud,
  Moon
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useEmotion } from "@/contexts/emotion-context"
import { useAnimation } from "@/contexts/animation-context"
import { useMotivationalFeedback } from "./unified-feedback-system"
import { useAchievements } from "./achievement-celebrations"
import { useAppreciation } from "./appreciation-animations"
import { useEmotionalResponses } from "./emotional-responses"

export function MotivationalDashboard() {
  const { emotionState } = useEmotion()
  const { isAnimationEnabled } = useAnimation()
  const { triggerFeedback, triggerAchievement } = useMotivationalFeedback()
  const { achievements, unlockAchievement, isUnlocked } = useAchievements()
  const { showAppreciation } = useAppreciation()
  const { triggerEmotionalResponse } = useEmotionalResponses()
  
  const [dailyProgress, setDailyProgress] = useState(65)
  const [weeklyStreak, setWeeklyStreak] = useState(3)
  const [motivationLevel, setMotivationLevel] = useState(75)

  // Simulate progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDailyProgress(prev => Math.min(100, prev + Math.random() * 5))
      setMotivationLevel(prev => {
        const change = (Math.random() - 0.5) * 10
        return Math.max(0, Math.min(100, prev + change))
      })
    }, 10000)
    
    return () => clearInterval(interval)
  }, [])

  // Get mood-based color
  const getMoodColor = () => {
    switch (emotionState.mood) {
      case 'happy': return 'text-green-500'
      case 'sad': return 'text-blue-500'
      case 'stressed': return 'text-red-500'
      case 'excited': return 'text-yellow-500'
      default: return 'text-gray-500'
    }
  }

  // Get mood icon
  const getMoodIcon = () => {
    switch (emotionState.mood) {
      case 'happy': return Smile
      case 'sad': return Frown
      case 'stressed': return Flame
      case 'calm': return Cloud
      case 'tired': return Moon
      case 'excited': return Sparkles
      default: return Smile
    }
  }

  const MoodIcon = getMoodIcon()
  const moodColor = getMoodColor()

  return (
    <div className="space-y-6">
      {/* Header with emotional state */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-white/50 dark:bg-white/10">
            <MoodIcon className={`w-6 h-6 ${moodColor}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Your Motivational Dashboard</h2>
            <p className="text-muted-foreground">
              Feeling {emotionState.mood} today. Keep going!
            </p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => {
            triggerFeedback({
              type: 'achievement_unlocked',
              message: 'Dashboard visited!'
              // studentState is automatically determined by the hook
            })
          }}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Boost Motivation
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Daily Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Tasks completed</span>
                <span className="text-sm text-muted-foreground">65%</span>
              </div>
              <Progress value={dailyProgress} className="h-2" />
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => {
                  setDailyProgress(prev => Math.min(100, prev + 20))
                  showAppreciation({
                    type: 'thumbs_up',
                    message: 'Great progress!',
                    position: { x: 50, y: 30 }
                  })
                }}
              >
                Complete Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Streak */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Weekly Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-orange-500">{weeklyStreak}</span>
                <span className="text-sm text-muted-foreground">days in a row</span>
              </div>
              <div className="flex gap-1">
                {[...Array(7)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 flex-1 rounded-full ${
                      i < weeklyStreak ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => {
                  setWeeklyStreak(prev => prev + 1)
                  if (weeklyStreak + 1 === 7) {
                    unlockAchievement('week_streak')
                  }
                }}
              >
                Extend Streak
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Motivation Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Motivation Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Current energy</span>
                <span className="text-sm text-muted-foreground">{Math.round(motivationLevel)}%</span>
              </div>
              <Progress 
                value={motivationLevel} 
                className="h-2"
              />
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => {
                  setMotivationLevel(prev => Math.min(100, prev + 25))
                  triggerEmotionalResponse('happy')
                }}
              >
                Boost Energy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {achievements.slice(0, 6).map((achievement) => {
              const isAchieved = isUnlocked(achievement.id)
              const IconComponent = achievement.icon
              
              return (
                <motion.div
                  key={achievement.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative rounded-lg p-3 text-center border ${
                    isAchieved 
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800/50' 
                      : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
                  }`}
                  onClick={() => {
                    if (isAchieved) {
                      triggerAchievement({
                        title: achievement.title,
                        description: achievement.description,
                        type: 'badge'
                      })
                    }
                  }}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full mx-auto mb-2 ${
                    isAchieved 
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    <IconComponent className={`w-5 h-5 ${isAchieved ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  
                  <h3 className={`text-xs font-semibold mb-1 ${
                    isAchieved ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {achievement.title}
                  </h3>
                  
                  {!isAchieved && (
                    <div className="absolute inset-0 bg-gray-900/50 dark:bg-black/50 rounded-lg flex items-center justify-center">
                      <Lock className="w-4 h-4 text-gray-300" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Quick Motivational Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 gap-2"
              onClick={() => {
                showAppreciation({
                  type: 'heart',
                  message: 'Self-love is important!',
                  position: { x: 50, y: 30 }
                })
              }}
            >
              <Heart className="w-5 h-5 text-pink-500" />
              <span className="text-xs">Self Care</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 gap-2"
              onClick={() => {
                triggerFeedback({
                  type: 'challenge_completed',
                  message: 'Great focus session!'
                  // studentState is automatically determined by the hook
                })
              }}
            >
              <Target className="w-5 h-5 text-blue-500" />
              <span className="text-xs">Focus Mode</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 gap-2"
              onClick={() => {
                triggerEmotionalResponse('calm')
              }}
            >
              <Moon className="w-5 h-5 text-indigo-500" />
              <span className="text-xs">Relax</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 gap-2"
              onClick={() => {
                unlockAchievement('first_post')
              }}
            >
              <Gift className="w-5 h-5 text-green-500" />
              <span className="text-xs">Celebrate</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Import Lock icon
import { Lock } from "lucide-react"