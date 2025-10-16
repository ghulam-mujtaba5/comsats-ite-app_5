"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Save, 
  Loader2,
  Mail,
  MessageSquare,
  Eye,
  Lock,
  Settings as SettingsIcon,
  Activity,
  Trophy,
  Sparkles,
  User,
  Key,
  BookOpen,
  Users,
  Calendar,
  Star,
  Wrench,
  AlertTriangle
} from "lucide-react"
import Link from "next/link"

interface Settings {
  notifications: {
    email: boolean
    push: boolean
    communityPosts: boolean
    facultyReviews: boolean
    helpDeskUpdates: boolean
    lostFoundMatches: boolean
    newPapers: boolean
    weeklyDigest: boolean
    userRegister: boolean
    passwordReset: boolean
    passwordChange: boolean
    postCreated: boolean
    resourceUploaded: boolean
    reviewSubmitted: boolean
    reviewApproved: boolean
    timetableUpdated: boolean
    groupJoined: boolean
    achievementUnlocked: boolean
    maintenanceScheduled: boolean
    newFeature: boolean
  }
  privacy: {
    profileVisible: boolean
    showEmail: boolean
    showActivity: boolean
    allowMessages: boolean
    showStats: boolean
  }
  preferences: {
    theme: string
    language: string
    emailFrequency: string
    digestDay: string
    animationsEnabled: boolean
    animationIntensity: 'low' | 'medium' | 'high'
  }
}

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      email: true,
      push: false,
      communityPosts: true,
      facultyReviews: true,
      helpDeskUpdates: true,
      lostFoundMatches: true,
      newPapers: false,
      weeklyDigest: true,
      userRegister: true,
      passwordReset: true,
      passwordChange: true,
      postCreated: true,
      resourceUploaded: true,
      reviewSubmitted: true,
      reviewApproved: true,
      timetableUpdated: true,
      groupJoined: true,
      achievementUnlocked: true,
      maintenanceScheduled: true,
      newFeature: true
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showActivity: true,
      allowMessages: true,
      showStats: true
    },
    preferences: {
      theme: 'system',
      language: 'en',
      emailFrequency: 'instant',
      digestDay: 'monday',
      animationsEnabled: true,
      animationIntensity: 'medium'
    }
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/profile/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateNotification = (key: keyof Settings['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }))
  }

  const updatePrivacy = (key: keyof Settings['privacy'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value }
    }))
  }

  const updatePreference = (key: keyof Settings['preferences'], value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value }
    }))
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/profile/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ settings })
      })
      
      if (response.ok) {
        toast({
          title: "Settings Saved",
          description: "Your preferences have been updated successfully."
        })
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary mb-4">
              <SettingsIcon className="h-4 w-4" />
              Account Settings
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your notifications, privacy, and preferences
            </p>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-1">
              <TabsTrigger value="notifications" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                <Shield className="h-4 w-4 mr-2" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="preferences" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                <Palette className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="experience" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                <Sparkles className="h-4 w-4 mr-2" />
                Experience
              </TabsTrigger>
            </TabsList>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/20 dark:border-slate-700/30 rounded-2xl">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Choose what notifications you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Notifications
                      </Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => updateNotification('email', checked)}
                    />
                  </div>

                  {/* Push Notifications */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Push Notifications
                      </Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Receive browser push notifications
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => updateNotification('push', checked)}
                    />
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 my-4" />

                  {/* Authentication Events */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Authentication Events
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>User Registration</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Welcome email when you register
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.userRegister}
                        onCheckedChange={(checked) => updateNotification('userRegister', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Password Reset</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Notifications when password reset is requested
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.passwordReset}
                        onCheckedChange={(checked) => updateNotification('passwordReset', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Password Change</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Confirmation when password is changed
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.passwordChange}
                        onCheckedChange={(checked) => updateNotification('passwordChange', checked)}
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 my-4" />

                  {/* Content Updates */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Content Updates
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Post Created</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Confirmation when you create a post
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.postCreated}
                        onCheckedChange={(checked) => updateNotification('postCreated', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Resource Uploaded</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Confirmation when you upload a resource
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.resourceUploaded}
                        onCheckedChange={(checked) => updateNotification('resourceUploaded', checked)}
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 my-4" />

                  {/* Specific Notifications */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Activity Notifications</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Community Posts</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Replies and reactions to your posts
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.communityPosts}
                        onCheckedChange={(checked) => updateNotification('communityPosts', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Faculty Reviews</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Updates on faculty review responses
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.facultyReviews}
                        onCheckedChange={(checked) => updateNotification('facultyReviews', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Review Submitted</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Confirmation when you submit a review
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.reviewSubmitted}
                        onCheckedChange={(checked) => updateNotification('reviewSubmitted', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Review Approved</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Notification when your review is approved
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.reviewApproved}
                        onCheckedChange={(checked) => updateNotification('reviewApproved', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Timetable Updates</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Notifications about timetable changes
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.timetableUpdated}
                        onCheckedChange={(checked) => updateNotification('timetableUpdated', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Group Joined</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Confirmation when you join a group
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.groupJoined}
                        onCheckedChange={(checked) => updateNotification('groupJoined', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Achievement Unlocked</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Notifications when you unlock achievements
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.achievementUnlocked}
                        onCheckedChange={(checked) => updateNotification('achievementUnlocked', checked)}
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 my-4" />

                  {/* System Notifications */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      System Notifications
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Maintenance Scheduled</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Advance notice of system maintenance
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.maintenanceScheduled}
                        onCheckedChange={(checked) => updateNotification('maintenanceScheduled', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>New Features</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Announcements about new platform features
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.newFeature}
                        onCheckedChange={(checked) => updateNotification('newFeature', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Weekly Digest</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Weekly summary of platform activity
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.weeklyDigest}
                        onCheckedChange={(checked) => updateNotification('weeklyDigest', checked)}
                      />
                    </div>
                  </div>

                  <Button onClick={saveSettings} disabled={saving} className="w-full">
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Notification Settings
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/20 dark:border-slate-700/30 rounded-2xl">
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control your profile visibility and data sharing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Profile Visible
                      </Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Make your profile visible to other students
                      </p>
                    </div>
                    <Switch
                      checked={settings.privacy.profileVisible}
                      onCheckedChange={(checked) => updatePrivacy('profileVisible', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Show Email
                      </Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Display your email on your profile
                      </p>
                    </div>
                    <Switch
                      checked={settings.privacy.showEmail}
                      onCheckedChange={(checked) => updatePrivacy('showEmail', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Show Activity
                      </Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Display your recent activity on your profile
                      </p>
                    </div>
                    <Switch
                      checked={settings.privacy.showActivity}
                      onCheckedChange={(checked) => updatePrivacy('showActivity', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Allow Messages
                      </Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Allow other users to send you messages
                      </p>
                    </div>
                    <Switch
                      checked={settings.privacy.allowMessages}
                      onCheckedChange={(checked) => updatePrivacy('allowMessages', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Show Stats
                      </Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Display your achievements and statistics
                      </p>
                    </div>
                    <Switch
                      checked={settings.privacy.showStats}
                      onCheckedChange={(checked) => updatePrivacy('showStats', checked)}
                    />
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 my-4" />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Data & Security
                    </h3>
                    
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Privacy Protected</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Your data is encrypted and stored securely. We never share your personal information with third parties.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/20 dark:border-slate-700/30 rounded-2xl">
                <CardHeader>
                  <CardTitle>Display Preferences</CardTitle>
                  <CardDescription>Customize your experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Theme
                    </Label>
                    <Select
                      value={settings.preferences.theme}
                      onValueChange={(value) => updatePreference('theme', value)}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Select your preferred theme
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Language
                    </Label>
                    <Select
                      value={settings.preferences.language}
                      onValueChange={(value) => updatePreference('language', value)}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ur">Urdu</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Select your preferred language
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Frequency
                    </Label>
                    <Select
                      value={settings.preferences.emailFrequency}
                      onValueChange={(value) => updatePreference('emailFrequency', value)}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instant">Instant</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Digest</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      How often you want to receive email notifications
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Weekly Digest Day</Label>
                    <Select
                      value={settings.preferences.digestDay}
                      onValueChange={(value) => updatePreference('digestDay', value)}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="tuesday">Tuesday</SelectItem>
                        <SelectItem value="wednesday">Wednesday</SelectItem>
                        <SelectItem value="thursday">Thursday</SelectItem>
                        <SelectItem value="friday">Friday</SelectItem>
                        <SelectItem value="saturday">Saturday</SelectItem>
                        <SelectItem value="sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Which day of the week to receive your weekly digest
                    </p>
                  </div>

                  <Button onClick={saveSettings} disabled={saving} className="w-full">
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/20 dark:border-slate-700/30 rounded-2xl">
                <CardHeader>
                  <CardTitle>Experience Settings</CardTitle>
                  <CardDescription>Customize your user experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Animations
                      </Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Enable or disable UI animations
                      </p>
                    </div>
                    <Switch
                      checked={settings.preferences.animationsEnabled}
                      onCheckedChange={(checked) => updatePreference('animationsEnabled', checked)}
                    />
                  </div>

                  {settings.preferences.animationsEnabled && (
                    <div className="space-y-2">
                      <Label>Animation Intensity</Label>
                      <Select
                        value={settings.preferences.animationIntensity}
                        onValueChange={(value: 'low' | 'medium' | 'high') => updatePreference('animationIntensity', value)}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Adjust the intensity of animations
                      </p>
                    </div>
                  )}

                  <div className="border-t border-slate-200 dark:border-slate-700 my-4" />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Performance</h3>
                    
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Wrench className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Optimized Experience</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            CampusAxis is optimized for performance. These settings help customize your experience based on your device capabilities.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button onClick={saveSettings} disabled={saving} className="w-full">
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Experience Settings
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}