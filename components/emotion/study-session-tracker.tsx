"use client"

import { useState, useEffect } from "react"
import { useEmotion } from "@/contexts/emotion-context"
import { useAnimation } from "@/contexts/animation-context"
import { useMotivationalFeedback } from "@/components/motivational/unified-feedback-system"
import { useCelebrationAnimations } from "@/hooks/use-celebration-animations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Brain, 
  Zap, 
  Moon,
  Flame,
  Target,
  Trophy
} from "lucide-react"
import { motion } from "framer-motion"

export function StudySessionTracker() {
  const [isStudying, setIsStudying] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0) // in seconds
  const [sessionGoal, setSessionGoal] = useState(25) // in minutes
  const [breakTime, setBreakTime] = useState(0) // in seconds
  
  const { emotionState, updateEmotionState } = useEmotion()
  const { triggerAnimation } = useAnimation()
  const { triggerFeedback } = useMotivationalFeedback()
  const { triggerConfetti, triggerBalloons } = useCelebrationAnimations()

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isStudying) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isStudying])

  // Break timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (breakTime > 0) {
      interval = setInterval(() => {
        setBreakTime(prev => {
          if (prev <= 1) {
            // Break finished
            triggerAnimation({
              type: 'sparkles',
              message: "Break over! Ready to focus? ✨",
              duration: 3000
            })
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [breakTime, triggerAnimation])

  // Check for achievements and emotional updates
  useEffect(() => {
    const minutesStudied = Math.floor(elapsedTime / 60)
    
    // Update emotion based on study time
    if (minutesStudied > 0 && minutesStudied % 5 === 0) {
      updateEmotionState({
        focusLevel: emotionState.focusLevel === 'low' ? 'medium' : emotionState.focusLevel,
        motivationLevel: emotionState.motivationLevel === 'low' ? 'medium' : emotionState.motivationLevel
      })
    }
    
    // Milestone achievements
    if (minutesStudied === 15) {
      triggerFeedback({
        type: 'streak_maintained',
        message: "15 minutes of focused study! Great job!"
      })
    } else if (minutesStudied === 30) {
      triggerConfetti({
        message: "Half an hour of study! 🎉",
        duration: 5000,
        particleCount: 200
      })
      
      triggerFeedback({
        type: 'achievement_unlocked',
        message: "30 minutes of focused study completed!"
      })
    } else if (minutesStudied === 60) {
      triggerBalloons({
        message: "Full hour of study! Incredible! 🎈",
        duration: 6000,
        balloonCount: 20
      })
      
      triggerFeedback({
        type: 'achievement_unlocked',
        message: "1 hour of focused study completed!"
      })
    }
  }, [elapsedTime, emotionState, updateEmotionState, triggerAnimation, triggerFeedback])

  const startStudying = () => {
    setIsStudying(true)
    
    triggerFeedback({
      type: 'focus_achieved',
      message: "Study session started! Time to focus."
    })
  }

  const pauseStudying = () => {
    setIsStudying(false)
    
    triggerFeedback({
      type: 'break_needed',
      message: "Taking a break is important for productivity."
    })
  }

  const resetSession = () => {
    setIsStudying(false)
    setElapsedTime(0)
    setBreakTime(0)
  }

  const takeBreak = () => {
    setIsStudying(false)
    const breakDuration = 5 * 60 // 5 minutes
    setBreakTime(breakDuration)
    
    triggerAnimation({
      type: 'successGlow',
      message: "Taking a well-deserved break! ☕",
      duration: 3000
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = Math.min(100, (elapsedTime / (sessionGoal * 60)) * 100)
  const breakProgress = breakTime > 0 ? ((5 * 60 - breakTime) / (5 * 60)) * 100 : 0

  // Get emotion-based styling
  const getEmotionStyle = () => {
    if (breakTime > 0) {
      return {
        background: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30",
        border: "border-blue-200 dark:border-blue-700/50",
        text: "text-blue-700 dark:text-blue-300",
        icon: <Coffee className="h-5 w-5 text-blue-500" />
      }
    }
    
    switch (emotionState.focusLevel) {
      case 'high':
        return {
          background: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30",
          border: "border-green-200 dark:border-green-700/50",
          text: "text-green-700 dark:text-green-300",
          icon: <Target className="h-5 w-5 text-green-500" />
        }
      case 'medium':
        return {
          background: "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30",
          border: "border-yellow-200 dark:border-yellow-700/50",
          text: "text-yellow-700 dark:text-yellow-300",
          icon: <Brain className="h-5 w-5 text-yellow-500" />
        }
      default:
        return {
          background: "bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30",
          border: "border-gray-200 dark:border-gray-700/50",
          text: "text-gray-700 dark:text-gray-300",
          icon: <Moon className="h-5 w-5 text-gray-500" />
        }
    }
  }

  const emotionStyle = getEmotionStyle()

  return (
    <motion.div
      className={`rounded-2xl border ${emotionStyle.background} ${emotionStyle.border} transition-all duration-500`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {emotionStyle.icon}
            Study Session Tracker
          </CardTitle>
          <CardDescription>
            Track your focused study time and take breaks when needed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {breakTime > 0 ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
                <Coffee className="h-6 w-6" />
                <span className="text-xl font-bold">Break Time</span>
              </div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatTime(breakTime)}
              </div>
              <Progress value={breakProgress} className="h-3" />
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Take a moment to relax and recharge
              </p>
            </div>
          ) : (
            <>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold tracking-tighter">
                  {formatTime(elapsedTime)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {Math.floor(elapsedTime / 60)} minutes studied
                </div>
                <Progress value={progress} className="h-3" />
                <div className="text-sm text-muted-foreground">
                  {sessionGoal} minute goal • {Math.max(0, sessionGoal - Math.floor(elapsedTime / 60))} min left
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                {isStudying ? (
                  <Button onClick={pauseStudying} variant="outline" size="lg">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                ) : (
                  <Button onClick={startStudying} size="lg" className="bg-gradient-to-r from-primary to-blue-600">
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                )}
                <Button onClick={takeBreak} variant="outline" size="lg">
                  <Coffee className="h-4 w-4 mr-2" />
                  Break
                </Button>
                <Button onClick={resetSession} variant="outline" size="lg">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
          
          {/* Emotional state indicator */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Focus:</span>
              <span className={`font-medium ${emotionStyle.text}`}>
                {emotionState.focusLevel.charAt(0).toUpperCase() + emotionState.focusLevel.slice(1)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-muted-foreground">Motivation:</span>
              <span className={`font-medium ${emotionStyle.text}`}>
                {emotionState.motivationLevel.charAt(0).toUpperCase() + emotionState.motivationLevel.slice(1)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}