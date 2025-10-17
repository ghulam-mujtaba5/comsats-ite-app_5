"use client"

import { useEmotion } from "@/contexts/emotion-context"
import { useMotivationBooster, useAdvancedEmotionDetection } from "@/hooks/use-emotion-detection"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Heart, 
  Zap, 
  Brain, 
  Frown, 
  Smile,
  Trophy,
  Target,
  Sparkles,
  Activity
} from "lucide-react"
import { AdvancedEmotionDashboard } from "./advanced-emotion-dashboard"

export function EmotionDemo() {
  const { emotionState, updateEmotionState } = useEmotion()
  const { boostMotivation } = useMotivationBooster()
  const { detectEmotionState } = useAdvancedEmotionDetection()

  const simulateStress = () => {
    updateEmotionState({
      mood: "stressed",
      stressLevel: "high",
      focusLevel: "low",
      motivationLevel: "low"
    })
  }

  const simulateSuccess = () => {
    updateEmotionState({
      mood: "happy",
      stressLevel: "low",
      focusLevel: "high",
      motivationLevel: "high"
    })
    boostMotivation("Great job on your achievement!")
  }

  const simulateCalm = () => {
    updateEmotionState({
      mood: "calm",
      stressLevel: "low",
      focusLevel: "medium",
      motivationLevel: "medium"
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Emotion System Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Emotion State */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Current Emotion State</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span>Mood</span>
                  </div>
                  <span className="font-medium capitalize">{emotionState.mood}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>Stress Level</span>
                  </div>
                  <span className="font-medium capitalize">{emotionState.stressLevel}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-500" />
                    <span>Focus Level</span>
                  </div>
                  <span className="font-medium capitalize">{emotionState.focusLevel}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-green-500" />
                    <span>Motivation Level</span>
                  </div>
                  <span className="font-medium capitalize">{emotionState.motivationLevel}</span>
                </div>
              </div>
            </div>
            
            {/* Demo Controls */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Try Different Scenarios</h3>
              
              <div className="space-y-3">
                <Button 
                  onClick={simulateStress}
                  variant="outline" 
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Frown className="w-4 h-4 text-orange-500" />
                    <span>Simulate Stress</span>
                  </div>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    High Stress
                  </span>
                </Button>
                
                <Button 
                  onClick={simulateSuccess}
                  variant="outline" 
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Smile className="w-4 h-4 text-green-500" />
                    <span>Simulate Success</span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    High Motivation
                  </span>
                </Button>
                
                <Button 
                  onClick={simulateCalm}
                  variant="outline" 
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span>Simulate Calm</span>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Relaxation
                  </span>
                </Button>
                
                <Button 
                  onClick={detectEmotionState}
                  variant="outline" 
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-500" />
                    <span>Detect Emotion</span>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    Auto-Detect
                  </span>
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Reset to Neutral</h4>
                <Button 
                  onClick={() => updateEmotionState({
                    mood: "neutral",
                    stressLevel: "low",
                    focusLevel: "medium",
                    motivationLevel: "medium"
                  })}
                  variant="outline"
                  className="w-full"
                >
                  Reset Emotion State
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Advanced Emotion Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Advanced Emotion Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdvancedEmotionDashboard />
        </CardContent>
      </Card>
      
      {/* Integration Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            Integration Example
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium mb-2">How to use in your components:</h3>
            <pre className="text-sm bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto">
{`import { useEmotion } from "@/contexts/emotion-context"
import { useMotivationBooster, useAdvancedEmotionDetection } from "@/hooks/use-emotion-detection"

export function MyComponent() {
  const { emotionState, updateEmotionState } = useEmotion()
  const { boostMotivation } = useMotivationBooster()
  const { detectEmotionState } = useAdvancedEmotionDetection()
  
  return (
    <div>
      <p>Current mood: {emotionState.mood}</p>
      <button onClick={() => boostMotivation("Great work!")}>
        Boost Motivation
      </button>
      <button onClick={detectEmotionState}>
        Detect Emotion
      </button>
    </div>
  )
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}