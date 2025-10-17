"use client"
import "./settings.light.module.css"
import "./settings.dark.module.css"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Settings } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

/**
 * Settings Page - Redirects to Profile Settings Tab
 * 
 * This page has been consolidated into the Profile page under the Settings tab.
 * Users visiting /settings will be automatically redirected to /profile with the settings tab active.
 */
export default function SettingsPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to profile settings tab
    router.replace('/profile?tab=settings')
  }, [router])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-4">
      <Card className="max-w-md w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-2xl shadow-2xl">
        <CardContent className="p-12">
          <div className="text-center space-y-6">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl animate-pulse"></div>
              <div className="relative flex items-center justify-center h-full">
                <Settings className="h-10 w-10 text-blue-600 dark:text-blue-400 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Redirecting...
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Taking you to your profile settings
              </p>
            </div>
            
            <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
