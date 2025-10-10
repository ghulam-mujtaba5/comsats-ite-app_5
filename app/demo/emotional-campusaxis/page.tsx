"use client"

import { useState } from "react"
import { useEmotion } from "@/contexts/emotion-context"
import { useMotivationBooster, useCalmMode, useStudyCompanionFeedback } from "@/hooks/use-emotion-detection"
import { useAnimation } from "@/contexts/animation-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  BookOpen, 
  Users, 
  Trophy, 
  User, 
  Heart, 
  Zap, 
  Brain,
  Coffee,
  Moon,
  Star,
  Target,
  Calendar,
  Award
} from "lucide-react"

export default function EmotionalCampusAxisDemo() {
  const { emotionState, updateEmotionState } = useEmotion()
  const { boostMotivation } = useMotivationBooster()
  const { activateCalmMode } = useCalmMode()
  const { onStudyAction } = useStudyCompanionFeedback()
  const { triggerAnimation } = useAnimation()
  const [studyStreak, setStudyStreak] = useState(0)
  const [studyHours, setStudyHours] = useState(0)
  const [papersCompleted, setPapersCompleted] = useState(0)

  // Simulate viewing a past paper
  const handleViewPastPaper = () => {
    updateEmotionState({ focusLevel: 'high', mood: 'focused' })
    triggerAnimation({
      type: 'spotlight',
      duration: 3000,
    })
    
    // Check if it's late night
    const hour = new Date().getHours()
    if (hour >= 22 || hour <= 6) {
      triggerAnimation({
        type: 'motivationalText',
        message: "It's late! Consider taking a break and resting 🌙",
        duration: 4000,
      })
    }
  }

  // Simulate completing a past paper
  const handleCompletePastPaper = () => {
    setPapersCompleted(prev => prev + 1)
    setStudyStreak(prev => prev + 1)
    onStudyAction('success')
    
    if (studyStreak > 0 && (studyStreak + 1) % 3 === 0) {
      onStudyAction('streak')
    }
  }

  // Simulate contributing to community
  const handleContribute = () => {
    updateEmotionState({ mood: 'happy' })
    triggerAnimation({
      type: 'thankYou',
      message: "That's teamwork in action 👏",
      duration: 4000,
    })
  }

  // Simulate helping others
  const handleHelpOthers = () => {
    updateEmotionState({ mood: 'happy', motivationLevel: 'high' })
    triggerAnimation({
      type: 'handClap',
      message: "Your help makes a difference! 💚",
      duration: 4000,
    })
  }

  // Simulate leaderboard improvement
  const handleRankImprovement = () => {
    updateEmotionState({ mood: 'excited' })
    triggerAnimation({
      type: 'fireworks',
      message: "Moving on up! Your rank improved 💪",
      duration: 5000,
    })
  }

  // Simulate quiz failure
  const handleQuizFailure = () => {
    updateEmotionState({ mood: 'sad' })
    onStudyAction('error')
  }

  // Simulate long study session
  const handleLongStudySession = () => {
    const newHours = studyHours + 1
    setStudyHours(newHours)
    
    if (newHours > 3) {
      updateEmotionState({ stressLevel: 'high', mood: 'tired' })
      activateCalmMode(5 * 60 * 1000) // 5 minutes
      
      triggerAnimation({
        type: 'motivationalText',
        message: "You've been studying for a while. Time for a break! ☕",
        duration: 4000,
      })
    } else {
      updateEmotionState({ focusLevel: 'high' })
      triggerAnimation({
        type: 'successGlow',
        message: "Great focus! Keep it up! 🎯",
        duration: 3000,
      })
    }
  }

  // Log mood
  const logMood = (mood: string) => {
    updateEmotionState({ mood: mood as any })
    triggerAnimation({
      type: 'successGlow',
      message: "Thanks for sharing how you feel! 💖",
      duration: 3000,
    })
  }

  // Reset demo
  const resetDemo = () => {
    setStudyStreak(0)
    setStudyHours(0)
    setPapersCompleted(0)
    updateEmotionState({ 
      mood: 'neutral',
      stressLevel: 'low',
      focusLevel: 'medium',
      motivationLevel: 'medium'
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Emotional CampusAxis Demo</h1>
        <p className="text-gray-600">
          Experience how CampusAxis becomes an emotionally intelligent companion
        </p>
      </div>
      
      {/* Emotion Status */}
      <Card className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-medium">Your Emotional State</h2>
              <p className="text-indigo-100 capitalize mt-1">
                Mood: {emotionState.mood} • Stress: {emotionState.stressLevel} • 
                Focus: {emotionState.focusLevel} • Motivation: {emotionState.motivationLevel}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={resetDemo}
              >
                <Moon className="w-4 h-4 mr-2" />
                Reset Demo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Modules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              Academic Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Past Papers
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                View and complete past papers with emotional support
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={handleViewPastPaper}>
                  View Paper
                </Button>
                <Button size="sm" variant="outline" onClick={handleCompletePastPaper}>
                  Complete Paper
                </Button>
              </div>
              {papersCompleted > 0 && (
                <div className="mt-2 text-sm text-blue-700">
                  Papers completed: {papersCompleted}
                </div>
              )}
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Study Goals
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Track study hours and receive wellness feedback
              </p>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Study Hours: {studyHours}/4h</span>
                </div>
                <Progress value={(studyHours / 4) * 100} className="h-2" />
              </div>
              <Button size="sm" className="mt-3 bg-green-500 hover:bg-green-600" onClick={handleLongStudySession}>
                <Coffee className="w-4 h-4 mr-2" />
                Study for 1 Hour
              </Button>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-medium text-red-800 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Quiz Challenge
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Experience support during academic challenges
              </p>
              <Button size="sm" variant="outline" className="mt-3 border-red-300 text-red-700 hover:bg-red-100" onClick={handleQuizFailure}>
                Fail Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Community Modules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              Community & Recognition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-800 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Community Contributions
              </h3>
              <p className="text-sm text-purple-700 mt-1">
                Share resources and help fellow students
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={handleContribute}>
                  Share Resource
                </Button>
                <Button size="sm" onClick={handleHelpOthers}>
                  Help Classmate
                </Button>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-800 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Leaderboard
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                See how emotional support enhances achievements
              </p>
              <Button size="sm" className="mt-3 bg-yellow-500 hover:bg-yellow-600" onClick={handleRankImprovement}>
                <Star className="w-4 h-4 mr-2" />
                Rank Improvement
              </Button>
            </div>
            
            <div className="p-4 bg-pink-50 rounded-lg">
              <h3 className="font-medium text-pink-800 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Profile Dashboard
              </h3>
              <p className="text-sm text-pink-700 mt-1">
                Track your emotional wellness journey
              </p>
              <div className="grid grid-cols-5 gap-2 mt-3">
                {['happy', 'calm', 'neutral', 'stressed', 'sad'].map((mood) => (
                  <Button
                    key={mood}
                    size="sm"
                    variant="outline"
                    onClick={() => logMood(mood)}
                    className={`capitalize ${
                      emotionState.mood === mood
                        ? 'bg-pink-500 text-white border-pink-500'
                        : ''
                    }`}
                  >
                    {mood}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Motivation & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Study Streak</h3>
                <p className="text-sm text-gray-600">Complete papers to build your streak</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">{studyStreak}</div>
                <div className="text-sm text-gray-500">days</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Motivation Level</h3>
                <p className="text-sm text-gray-600">Boost your motivation</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 capitalize">{emotionState.motivationLevel}</div>
                <div className="text-sm text-gray-500">current</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Focus Level</h3>
                <p className="text-sm text-gray-600">Maintain concentration</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 capitalize">{emotionState.focusLevel}</div>
                <div className="text-sm text-gray-500">current</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Motivation Boosters */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Motivation Boosters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => boostMotivation("You're doing great! Keep pushing forward! 🌟")}>
              General Encouragement
            </Button>
            <Button variant="outline" onClick={() => boostMotivation("Don't give up — your progress matters 💪")}>
              Perseverance Boost
            </Button>
            <Button onClick={() => activateCalmMode()}>
              Activate Calm Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}