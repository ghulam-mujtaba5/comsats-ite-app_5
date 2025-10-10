"use client"

import { useState, useEffect } from "react"
import { useEmotion } from "@/contexts/emotion-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Sun, 
  Moon, 
  Zap, 
  Heart,
  Coffee,
  MoonIcon,
  SunIcon
} from "lucide-react"

const THEMES = [
  {
    id: "default",
    name: "Default Theme",
    description: "Balanced and neutral",
    colors: {
      primary: "indigo",
      secondary: "purple",
      background: "white"
    },
    icon: <Sun className="w-4 h-4" />
  },
  {
    id: "calm",
    name: "Calm Theme",
    description: "Soft blues and greens for relaxation",
    colors: {
      primary: "blue",
      secondary: "teal",
      background: "blue-50"
    },
    icon: <Moon className="w-4 h-4" />
  },
  {
    id: "focus",
    name: "Focus Theme",
    description: "Deep purples for concentration",
    colors: {
      primary: "purple",
      secondary: "indigo",
      background: "purple-50"
    },
    icon: <Zap className="w-4 h-4" />
  },
  {
    id: "positive",
    name: "Positive Theme",
    description: "Warm yellows and oranges for energy",
    colors: {
      primary: "yellow",
      secondary: "orange",
      background: "yellow-50"
    },
    icon: <Heart className="w-4 h-4" />
  },
  {
    id: "evening",
    name: "Evening Theme",
    description: "Dark mode for late night study",
    colors: {
      primary: "indigo",
      secondary: "purple",
      background: "gray-900"
    },
    icon: <MoonIcon className="w-4 h-4" />
  }
]

export function AdaptiveTheme() {
  const { emotionState, getRecommendedTheme } = useEmotion()
  const [currentTheme, setCurrentTheme] = useState("default")
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "evening">("afternoon")

  // Detect time of day
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) {
      setTimeOfDay("morning")
    } else if (hour < 18) {
      setTimeOfDay("afternoon")
    } else {
      setTimeOfDay("evening")
    }
  }, [])

  // Apply recommended theme based on emotion state
  useEffect(() => {
    const recommended = getRecommendedTheme()
    if (recommended !== currentTheme) {
      setCurrentTheme(recommended)
    }
  }, [emotionState, getRecommendedTheme, currentTheme])

  const applyTheme = (themeId: string) => {
    setCurrentTheme(themeId)
    // In a real implementation, this would update CSS variables or class names
    document.documentElement.setAttribute('data-theme', themeId)
  }

  const getRecommendedThemeId = () => {
    if (emotionState.stressLevel === "high" || emotionState.mood === "sad") {
      return "calm"
    }
    if (emotionState.mood === "happy" || emotionState.motivationLevel === "high") {
      return "positive"
    }
    if (emotionState.focusLevel === "high") {
      return "focus"
    }
    if (timeOfDay === "evening") {
      return "evening"
    }
    return "default"
  }

  const recommendedThemeId = getRecommendedThemeId()

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <SunIcon className="w-5 h-5 text-yellow-500" />
          Adaptive Theme
        </CardTitle>
        <p className="text-sm text-gray-600">
          Theme adapts to your mood and time of day
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Theme Status */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">Current Theme</h3>
                <p className="text-xs text-gray-600 capitalize">
                  {currentTheme} • {timeOfDay}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {THEMES.find(t => t.id === currentTheme)?.icon}
                <span className="text-sm capitalize">{currentTheme}</span>
              </div>
            </div>
          </div>
          
          {/* Recommended Theme */}
          {recommendedThemeId !== currentTheme && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
              <h3 className="font-medium text-sm text-blue-800 flex items-center gap-2">
                <Coffee className="w-4 h-4" />
                Recommended for you
              </h3>
              <p className="text-xs text-blue-700 mt-1">
                Based on your current mood and time
              </p>
              <Button 
                size="sm" 
                className="mt-2 bg-blue-500 hover:bg-blue-600"
                onClick={() => applyTheme(recommendedThemeId)}
              >
                Switch to {recommendedThemeId} theme
              </Button>
            </div>
          )}
          
          {/* Theme Options */}
          <div>
            <h3 className="font-medium text-sm mb-2">Theme Options</h3>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((theme) => (
                <Card 
                  key={theme.id}
                  className={`cursor-pointer border-2 transition-all ${
                    currentTheme === theme.id 
                      ? "border-indigo-500 bg-indigo-50" 
                      : "hover:border-indigo-300"
                  }`}
                  onClick={() => applyTheme(theme.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-gray-100 rounded-lg">
                        {theme.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{theme.name}</h4>
                        <p className="text-xs text-gray-600">{theme.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Mood-Based Theme Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
            <h3 className="font-medium text-sm text-purple-800">How it works</h3>
            <ul className="text-xs text-purple-700 mt-1 space-y-1">
              <li>• High stress → Calm theme (blues)</li>
              <li>• Happy mood → Positive theme (yellows)</li>
              <li>• Focused state → Focus theme (purples)</li>
              <li>• Evening hours → Dark theme</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}