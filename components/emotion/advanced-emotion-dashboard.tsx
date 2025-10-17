"use client"

import { useState, useEffect } from "react"
import { useEmotion } from "@/contexts/emotion-context"
import { useAdvancedEmotionDetection } from "@/hooks/use-emotion-detection"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  Heart, 
  Zap, 
  Brain, 
  Trophy,
  Activity,
  MousePointer,
  Type,
  Scroll,
  Mouse
} from "lucide-react"

export function AdvancedEmotionDashboard() {
  const { emotionState } = useEmotion()
  const { 
    detectStress, 
    detectMotivation, 
    detectFocus,
    predictMood
  } = useAdvancedEmotionDetection()
  
  const [stressData, setStressData] = useState<ReturnType<typeof detectStress> | null>(null)
  const [motivationData, setMotivationData] = useState<ReturnType<typeof detectMotivation> | null>(null)
  const [focusData, setFocusData] = useState<ReturnType<typeof detectFocus> | null>(null)
  const [moodData, setMoodData] = useState<ReturnType<typeof predictMood> | null>(null)

  // Update detection data periodically
  useEffect(() => {
    const updateData = () => {
      setStressData(detectStress())
      setMotivationData(detectMotivation())
      setFocusData(detectFocus())
      setMoodData(predictMood())
    }

    updateData()
    const interval = setInterval(updateData, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [detectStress, detectMotivation, detectFocus, predictMood])

  // Get emotion icon based on mood
  const getMoodIcon = () => {
    switch (emotionState.mood) {
      case 'happy': return '😊'
      case 'sad': return '😢'
      case 'stressed': return '😰'
      case 'calm': return '😌'
      case 'focused': return '🧐'
      case 'excited': return '🤩'
      case 'tired': return '😴'
      default: return '😐'
    }
  }

  // Get confidence level color
  const getConfidenceColor = (confidence: number) => {
    if (confidence > 80) return 'text-green-500'
    if (confidence > 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Current Emotion State */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Current Emotional State
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emotion Summary */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getMoodIcon()}</span>
                  <div>
                    <h3 className="font-medium text-lg capitalize">{emotionState.mood}</h3>
                    <p className="text-sm text-gray-600">Current Mood</p>
                  </div>
                </div>
                {moodData && (
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getConfidenceColor(moodData.confidence)}`}>
                      {Math.round(moodData.confidence)}% Confidence
                    </p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">Stress</span>
                  </div>
                  <p className="text-lg font-bold capitalize">{emotionState.stressLevel}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Focus</span>
                  </div>
                  <p className="text-lg font-bold capitalize">{emotionState.focusLevel}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Motivation</span>
                  </div>
                  <p className="text-lg font-bold capitalize">{emotionState.motivationLevel}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">Updated</span>
                  </div>
                  <p className="text-lg font-bold">
                    {new Date(emotionState.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Behavioral Indicators */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Behavioral Indicators</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MousePointer className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Mouse Movement</span>
                  </div>
                  <span className="text-sm text-gray-500">Tracked</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Keystrokes</span>
                  </div>
                  <span className="text-sm text-gray-500">Tracked</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scroll className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Scrolling</span>
                  </div>
                  <span className="text-sm text-gray-500">Tracked</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mouse className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Clicks</span>
                  </div>
                  <span className="text-sm text-gray-500">Tracked</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Detailed Analysis */}
      {stressData && motivationData && focusData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Detailed Behavioral Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stress Analysis */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Stress Analysis
                </h3>
                <span className={`text-sm font-medium ${
                  stressData.stressLevel === 'high' ? 'text-red-500' : 
                  stressData.stressLevel === 'medium' ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {stressData.stressLevel} ({Math.round(stressData.stressPercentage)}%)
                </span>
              </div>
              <Progress 
                value={stressData.stressPercentage} 
                className={
                  stressData.stressLevel === 'high' ? 'bg-red-200' : 
                  stressData.stressLevel === 'medium' ? 'bg-yellow-200' : 'bg-green-200'
                }
              />
              <div className="mt-2 text-xs text-gray-500">
                {stressData.isStressed ? 'Stress indicators detected' : 'No significant stress detected'}
              </div>
            </div>
            
            {/* Motivation Analysis */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-green-500" />
                  Motivation Analysis
                </h3>
                <span className={`text-sm font-medium ${
                  motivationData.motivationLevel === 'high' ? 'text-green-500' : 
                  motivationData.motivationLevel === 'medium' ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {motivationData.motivationLevel} ({Math.round(motivationData.motivationPercentage)}%)
                </span>
              </div>
              <Progress 
                value={motivationData.motivationPercentage} 
                className={
                  motivationData.motivationLevel === 'high' ? 'bg-green-200' : 
                  motivationData.motivationLevel === 'medium' ? 'bg-yellow-200' : 'bg-red-200'
                }
              />
              <div className="mt-2 text-xs text-gray-500">
                Based on activity patterns and engagement
              </div>
            </div>
            
            {/* Focus Analysis */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-500" />
                  Focus Analysis
                </h3>
                <span className={`text-sm font-medium ${
                  focusData.focusLevel === 'high' ? 'text-green-500' : 
                  focusData.focusLevel === 'medium' ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {focusData.focusLevel} ({Math.round(focusData.focusPercentage)}%)
                </span>
              </div>
              <Progress 
                value={focusData.focusPercentage} 
                className={
                  focusData.focusLevel === 'high' ? 'bg-green-200' : 
                  focusData.focusLevel === 'medium' ? 'bg-yellow-200' : 'bg-red-200'
                }
              />
              <div className="mt-2 text-xs text-gray-500">
                {focusData.actionsPerMinute?.toFixed(1)} actions per minute
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emotionState.mood === 'stressed' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  💡 Take a break and practice deep breathing. Consider switching to a less intensive task.
                </p>
              </div>
            )}
            
            {emotionState.focusLevel === 'high' && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  🎯 You're in a focused state! This is the perfect time for complex problem-solving.
                </p>
              </div>
            )}
            
            {emotionState.motivationLevel === 'high' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  🚀 Your motivation is high! Tackle challenging goals now while momentum is strong.
                </p>
              </div>
            )}
            
            {emotionState.mood === 'tired' && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  😴 You seem tired. Consider taking a short nap or doing a light activity to refresh.
                </p>
              </div>
            )}
            
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-800">
                🔄 Emotion state updates automatically every 30 seconds based on your behavior.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}