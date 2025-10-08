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
  Settings as SettingsIcon
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
      weeklyDigest: true
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
      digestDay: 'monday'
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
      console.error('Error fetching settings:', error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/profile/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Settings saved successfully"
        })
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
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

  const updatePreference = (key: keyof Settings['preferences'], value: string) => {
    setSettings(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value }
    }))
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
            <TabsList className="grid w-full grid-cols-3 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-1">
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
                        <Label>Help Desk Updates</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Status changes on your tickets
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.helpDeskUpdates}
                        onCheckedChange={(checked) => updateNotification('helpDeskUpdates', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Lost & Found Matches</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Potential matches for your items
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.lostFoundMatches}
                        onCheckedChange={(checked) => updateNotification('lostFoundMatches', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>New Past Papers</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          New papers in your department
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.newPapers}
                        onCheckedChange={(checked) => updateNotification('newPapers', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Weekly Digest</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Weekly summary of campus activity
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.weeklyDigest}
                        onCheckedChange={(checked) => updateNotification('weeklyDigest', checked)}
                      />
                    </div>
                  </div>
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
                        Display your recent activity timeline
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
                        Allow other students to message you
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
                        Display your activity statistics
                      </p>
                    </div>
                    <Switch
                      checked={settings.privacy.showStats}
                      onCheckedChange={(checked) => updatePrivacy('showStats', checked)}
                    />
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 my-4" />

                  <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Lock className="h-5 w-5 text-slate-600 dark:text-slate-400 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-medium text-slate-900 dark:text-white">Data Privacy</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Your data is encrypted and stored securely. We never share your personal information with third parties.
                        </p>
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
                      Choose your preferred color scheme
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
                      Day of the week to receive your weekly digest
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex items-center justify-between mt-8">
            <Link href="/profile">
              <Button variant="outline" className="rounded-xl">
                Back to Profile
              </Button>
            </Link>
            <Button
              onClick={saveSettings}
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
