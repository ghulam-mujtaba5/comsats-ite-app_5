"use client"

import { useState, useEffect } from "react"
import { useEmotion } from "@/contexts/emotion-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { 
  Sun, 
  Moon, 
  Zap, 
  Heart,
  Coffee,
  BookOpen,
  Calendar,
  Clock,
  Palette,
  Music,
  Volume2
} from "lucide-react"

const PERSONALIZATION_RULES = [
  {
    id: "exam_week",
    name: "Exam Week Mode",
    description: "Boost motivation during exam periods",
    icon: <BookOpen className="w-4 h-4" />,
    conditions: [
      { type: "calendar", value: "exam_week" },
      { type: "stress", value: "high" }
    ],
    actions: [
      { type: "theme", value: "focus" },
      { type: "motivation", value: "high" },
      { type: "animations", value: "subtle" }
    ]
  },
  {
    id: "late_night",
    name: "Late Night Mode",
    description: "Reduce eye strain during late study sessions",
    icon: <Coffee className="w-4 h-4" />,
    conditions: [
      { type: "time", value: "22:00-06:00" },
      { type: "activity", value: "study" }
    ],
    actions: [
      { type: "theme", value: "evening" },
      { type: "brightness", value: "low" },
      { type: "animations", value: "minimal" }
    ]
  },
  {
    id: "achievement",
    name: "Celebration Mode",
    description: "Celebrate milestones and achievements",
    icon: <Zap className="w-4 h-4" />,
    conditions: [
      { type: "milestone", value: "completed" },
      { type: "mood", value: "happy" }
    ],
    actions: [
      { type: "theme", value: "positive" },
      { type: "animations", value: "celebration" },
      { type: "notifications", value: "motivational" }
    ]
  },
  {
    id: "stress_recovery",
    name: "Stress Recovery",
    description: "Gentle transition after high-stress periods",
    icon: <Heart className="w-4 h-4" />,
    conditions: [
      { type: "stress_change", value: "high_to_low" }
    ],
    actions: [
      { type: "theme", value: "calm" },
      { type: "animations", value: "soothing" },
      { type: "suggestions", value: "break" }
    ]
  }
]

const THEMES = [
  {
    id: "default",
    name: "Default Theme",
    description: "Balanced and neutral",
    colors: {
      primary: "indigo",
      secondary: "purple",
      background: "white"
    }
  },
  {
    id: "calm",
    name: "Calm Theme",
    description: "Soft blues and greens for relaxation",
    colors: {
      primary: "blue",
      secondary: "teal",
      background: "blue-50"
    }
  },
  {
    id: "focus",
    name: "Focus Theme",
    description: "Deep purples for concentration",
    colors: {
      primary: "purple",
      secondary: "indigo",
      background: "purple-50"
    }
  },
  {
    id: "positive",
    name: "Positive Theme",
    description: "Warm yellows and oranges for energy",
    colors: {
      primary: "yellow",
      secondary: "orange",
      background: "yellow-50"
    }
  },
  {
    id: "evening",
    name: "Evening Theme",
    description: "Dark mode for late night study",
    colors: {
      primary: "indigo",
      secondary: "purple",
      background: "gray-900"
    }
  }
]

export function PersonalizationEngine() {
  const { emotionState } = useEmotion()
  const [activeRules, setActiveRules] = useState<string[]>([])
  const [preferences, setPreferences] = useState({
    autoTheme: true,
    adaptiveMusic: true,
    timeBasedAdjustments: true,
    stressAwareness: true
  })

  // Check which personalization rules should be active
  useEffect(() => {
    const active = PERSONALIZATION_RULES.filter(rule => {
      // In a real implementation, this would check actual conditions
      // For demo, we'll activate based on emotion state
      if (rule.id === "exam_week" && emotionState.stressLevel === "high") return true
      if (rule.id === "achievement" && emotionState.mood === "happy") return true
      if (rule.id === "stress_recovery" && emotionState.stressLevel === "low") return true
      return false
    }).map(rule => rule.id)
    
    setActiveRules(active)
  }, [emotionState])

  const togglePreference = (pref: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [pref]: !prev[pref]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Personalization Engine</h1>
        <p className="text-gray-600">
          Customize your CampusAxis experience based on your needs and preferences
        </p>
      </div>
      
      {/* Active Personalizations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-500" />
            Active Personalizations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeRules.length > 0 ? (
            <div className="space-y-3">
              {PERSONALIZATION_RULES.filter(rule => activeRules.includes(rule.id)).map(rule => (
                <div key={rule.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                      {rule.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-purple-800">{rule.name}</h3>
                      <p className="text-sm text-purple-700">{rule.description}</p>
                    </div>
                  </div>
                  <div className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                    Active
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Palette className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No active personalizations</p>
              <p className="text-sm mt-1">Your settings will adapt based on your activity</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Theme Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-yellow-500" />
            Theme Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Auto Theme Adjustment</h3>
                <p className="text-sm text-gray-600">
                  Automatically switch themes based on your mood and time
                </p>
              </div>
              <Switch
                checked={preferences.autoTheme}
                onCheckedChange={() => togglePreference('autoTheme')}
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {THEMES.map((theme) => (
                <Card 
                  key={theme.id}
                  className="cursor-pointer border-2 transition-all hover:border-indigo-300"
                >
                  <CardContent className="p-3">
                    <div 
                      className="w-full h-12 rounded mb-2"
                      style={{
                        background: `linear-gradient(to right, ${
                          theme.id === "evening" 
                            ? "#1f2937, #111827" 
                            : theme.id === "calm" 
                              ? "#dbeafe, #ccfbf1"
                              : theme.id === "focus"
                                ? "#ede9fe, #e0e7ff"
                                : theme.id === "positive"
                                  ? "#fef3c7, #fed7aa"
                                  : "#e0e7ff, #ede9fe"
                        })`
                      }}
                    />
                    <h4 className="font-medium text-sm text-center">{theme.name}</h4>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Adaptive Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-blue-500" />
            Adaptive Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Adaptive Music</h3>
                <p className="text-sm text-gray-600">
                  Play background music based on your focus level
                </p>
              </div>
              <Switch
                checked={preferences.adaptiveMusic}
                onCheckedChange={() => togglePreference('adaptiveMusic')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Time-Based Adjustments</h3>
                <p className="text-sm text-gray-600">
                  Adjust interface based on time of day
                </p>
              </div>
              <Switch
                checked={preferences.timeBasedAdjustments}
                onCheckedChange={() => togglePreference('timeBasedAdjustments')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Stress Awareness</h3>
                <p className="text-sm text-gray-600">
                  Suggest breaks when stress is detected
                </p>
              </div>
              <Switch
                checked={preferences.stressAwareness}
                onCheckedChange={() => togglePreference('stressAwareness')}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Schedule Personalizations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            Schedule Personalizations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
              <div>
                <h3 className="font-medium text-green-800">Exam Week: May 15-22</h3>
                <p className="text-sm text-green-700">
                  Focus theme and reduced distractions will be activated
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-800">Daily Evening Mode</h3>
                <p className="text-sm text-blue-700">
                  Dark theme from 9 PM to 7 AM
                </p>
              </div>
            </div>
            
            <Button variant="outline" className="w-full border-dashed">
              <Calendar className="w-4 h-4 mr-2" />
              Add Custom Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}