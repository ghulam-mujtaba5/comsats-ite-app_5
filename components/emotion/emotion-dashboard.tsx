"use client"

import { useEmotion } from "@/contexts/emotion-context"
import { useEmotionDetection } from "@/hooks/use-emotion-detection"
import { DailyTracker } from "./daily-tracker"
import { GoalTracker } from "./goal-tracker"
import { MotivationalPopup } from "./motivational-popup"
import { AdaptiveFeedback } from "./adaptive-feedback"
import { ProgressReflection } from "./progress-reflection"
import { ThankYouCard } from "./thank-you-card"
import { MoodWall } from "./mood-wall"
import { MoodTrackerWidget } from "./mood-tracker-widget"
import { SupportButton } from "./support-button"
import { AIListener } from "./ai-listener"
import { AdaptiveTheme } from "./adaptive-theme"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Heart, 
  Target, 
  Trophy, 
  MessageCircle,
  Sparkles,
  Brain,
  Settings
} from "lucide-react"

export function EmotionDashboard() {
  const { emotionState } = useEmotion()
  const { trackActivity } = useEmotionDetection()

  // Track activity when dashboard is viewed
  trackActivity("dashboard_view")

  return (
    <div className="space-y-6">
      {/* Motivational Popup */}
      <MotivationalPopup />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emotional Wellness Hub</h1>
          <p className="text-gray-600">Your supportive companion for academic success</p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
      
      {/* Mood Status Banner */}
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">How are you feeling today?</h2>
              <p className="text-indigo-100 capitalize">
                Mood: {emotionState.mood} • Stress: {emotionState.stressLevel} • 
                Focus: {emotionState.focusLevel} • Motivation: {emotionState.motivationLevel}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                <Brain className="w-4 h-4 mr-2" />
                Mindfulness
              </Button>
              <Button variant="secondary" size="sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Boost Mood
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Tracker and Goals */}
          <DailyTracker />
          <GoalTracker />
          
          {/* Progress Reflection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Progress Reflection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressReflection />
            </CardContent>
          </Card>
          
          {/* Social & Gratitude */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                Community & Gratitude
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ThankYouCard />
                <MoodWall />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Mood Tracker */}
          <MoodTrackerWidget />
          
          {/* Support Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                Support Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <SupportButton />
              <AIListener />
            </CardContent>
          </Card>
          
          {/* Adaptive Theme */}
          <AdaptiveTheme />
          
          {/* Adaptive Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-500" />
                Study Companion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdaptiveFeedback context="study" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}