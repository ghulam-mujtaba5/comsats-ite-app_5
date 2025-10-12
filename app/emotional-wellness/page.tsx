"use client"

import { useState, useEffect } from "react"
import { useEmotion } from "@/contexts/emotion-context"
import { EmotionDashboard } from "@/components/emotion/emotion-dashboard"
import { HealingSpace } from "@/components/emotion/healing-space"
import { PersonalizationEngine } from "@/components/emotion/personalization-engine"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Heart, 
  Home, 
  Settings, 
  Sparkles,
  Brain,
  User,
  Bell,
  Eye,
  Zap
} from "lucide-react"

export default function EmotionalWellnessPage() {
  const { emotionState, resetEmotionState } = useEmotion()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [calmModeEnabled, setCalmModeEnabled] = useState(true)

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('emotionalWellnessSettings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setNotificationsEnabled(settings.notificationsEnabled ?? true)
      setAnimationsEnabled(settings.animationsEnabled ?? true)
      setCalmModeEnabled(settings.calmModeEnabled ?? true)
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    const settings = {
      notificationsEnabled,
      animationsEnabled,
      calmModeEnabled
    }
    localStorage.setItem('emotionalWellnessSettings', JSON.stringify(settings))
  }, [notificationsEnabled, animationsEnabled, calmModeEnabled])

  const handleResetEmotionState = () => {
    if (confirm("Are you sure you want to reset your emotional state? This will clear all emotion data.")) {
      resetEmotionState()
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="dashboard" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Emotional Wellness Center</h1>
            <p className="text-gray-600">
              Your supportive companion for academic and emotional success
            </p>
          </div>
          
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="healing" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Healing</span>
            </TabsTrigger>
            <TabsTrigger value="personalization" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="dashboard" className="mt-0">
          <EmotionDashboard />
        </TabsContent>
        
        <TabsContent value="healing" className="mt-0">
          <HealingSpace />
        </TabsContent>
        
        <TabsContent value="personalization" className="mt-0">
          <PersonalizationEngine />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Emotional Wellness Settings
                </CardTitle>
                <CardDescription>
                  Customize your emotional wellness experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Wellness Notifications
                    </Label>
                    <p className="text-sm text-gray-500">
                      Receive gentle reminders and wellness tips
                    </p>
                  </div>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Emotional Animations
                    </Label>
                    <p className="text-sm text-gray-500">
                      Show supportive animations based on your emotional state
                    </p>
                  </div>
                  <Switch
                    checked={animationsEnabled}
                    onCheckedChange={setAnimationsEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Calm Mode
                    </Label>
                    <p className="text-sm text-gray-500">
                      Enable stress-reduction features during intense study sessions
                    </p>
                  </div>
                  <Switch
                    checked={calmModeEnabled}
                    onCheckedChange={setCalmModeEnabled}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Emotion Data
                </CardTitle>
                <CardDescription>
                  Manage your emotional wellness data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Current Emotional State</Label>
                    <p className="text-sm text-gray-500">
                      Mood: {emotionState.mood} | Stress: {emotionState.stressLevel} | 
                      Focus: {emotionState.focusLevel} | Motivation: {emotionState.motivationLevel}
                    </p>
                  </div>
                </div>
                
                <Button 
                  variant="destructive" 
                  onClick={handleResetEmotionState}
                >
                  Reset Emotional State
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}