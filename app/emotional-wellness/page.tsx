"use client"

import { EmotionDashboard } from "@/components/emotion/emotion-dashboard"
import { HealingSpace } from "@/components/emotion/healing-space"
import { PersonalizationEngine } from "@/components/emotion/personalization-engine"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Heart, 
  Home, 
  Settings, 
  Sparkles,
  Brain,
  User
} from "lucide-react"

export default function EmotionalWellnessPage() {
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
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Emotional Wellness Settings</h2>
            <p className="text-gray-600">
              Customize your emotional wellness experience. Settings will be integrated 
              with the main CampusAxis settings page.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}