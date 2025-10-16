'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Bell,
  Shield,
  Settings,
  Eye,
  Mail,
  Activity,
  MessageSquare,
  BarChart,
  Globe,
  Palette,
  Loader2,
  Save,
  CheckCircle2
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SettingsState {
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

export function SettingsManagement() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<SettingsState>({
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
        if (data.settings) {
          setSettings(data.settings)
        }
      } else {
        console.error('Failed to fetch settings')
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/profile/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your settings have been saved successfully",
        })
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: "Failed to save your settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const updateNotification = (key: keyof SettingsState['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }))
  }

  const updatePrivacy = (key: keyof SettingsState['privacy'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }))
  }

  const updatePreference = (key: keyof SettingsState['preferences'], value: string) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }))
  }

  if (loading) {
    return (
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-xl">
        <CardContent className="p-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="notifications" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-1">
        <TabsTrigger value="notifications" className="rounded-xl data-[state=active]:bg-white data-[state=active]:dark:bg-slate-700 data-[state=active]:shadow-md transition-all">
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="privacy" className="rounded-xl data-[state=active]:bg-white data-[state=active]:dark:bg-slate-700 data-[state=active]:shadow-md transition-all">
          <Shield className="h-4 w-4 mr-2" />
          Privacy
        </TabsTrigger>
        <TabsTrigger value="preferences" className="rounded-xl data-[state=active]:bg-white data-[state=active]:dark:bg-slate-700 data-[state=active]:shadow-md transition-all">
          <Settings className="h-4 w-4 mr-2" />
          Preferences
        </TabsTrigger>
      </TabsList>

      {/* Notifications Tab */}
      <TabsContent value="notifications">
        <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-200/30">
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              Notification Preferences
            </CardTitle>
            <CardDescription>Choose what notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <Label className="font-medium text-slate-900 dark:text-white">Email Notifications</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => updateNotification('email', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <Label className="font-medium text-slate-900 dark:text-white">Push Notifications</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Receive browser push notifications</p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => updateNotification('push', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <Label className="font-medium text-slate-900 dark:text-white">Community Posts</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Notifications about new community posts</p>
                </div>
                <Switch
                  checked={settings.notifications.communityPosts}
                  onCheckedChange={(checked) => updateNotification('communityPosts', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <Label className="font-medium text-slate-900 dark:text-white">Faculty Reviews</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Get notified about new faculty reviews</p>
                </div>
                <Switch
                  checked={settings.notifications.facultyReviews}
                  onCheckedChange={(checked) => updateNotification('facultyReviews', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <Label className="font-medium text-slate-900 dark:text-white">Help Desk Updates</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Updates on your help desk tickets</p>
                </div>
                <Switch
                  checked={settings.notifications.helpDeskUpdates}
                  onCheckedChange={(checked) => updateNotification('helpDeskUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <Label className="font-medium text-slate-900 dark:text-white">Lost & Found Matches</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Alerts for lost & found matches</p>
                </div>
                <Switch
                  checked={settings.notifications.lostFoundMatches}
                  onCheckedChange={(checked) => updateNotification('lostFoundMatches', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <Label className="font-medium text-slate-900 dark:text-white">New Papers</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Notifications about new uploaded papers</p>
                </div>
                <Switch
                  checked={settings.notifications.newPapers}
                  onCheckedChange={(checked) => updateNotification('newPapers', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <Label className="font-medium text-slate-900 dark:text-white">Weekly Digest</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Weekly summary of platform activity</p>
                </div>
                <Switch
                  checked={settings.notifications.weeklyDigest}
                  onCheckedChange={(checked) => updateNotification('weeklyDigest', checked)}
                />
              </div>
            </div>

            <Button onClick={saveSettings} disabled={saving} className="w-full rounded-xl">
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
        <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-200/30">
                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              Privacy Settings
            </CardTitle>
            <CardDescription>Control your profile visibility and data sharing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <Label className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                    <Eye className="h-4 w-4" />
                    Profile Visible
                  </Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Make your profile visible to other students</p>
                </div>
                <Switch
                  checked={settings.privacy.profileVisible}
                  onCheckedChange={(checked) => updatePrivacy('profileVisible', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <Label className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                    <Mail className="h-4 w-4" />
                    Show Email
                  </Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Display your email on your profile</p>
                </div>
                <Switch
                  checked={settings.privacy.showEmail}
                  onCheckedChange={(checked) => updatePrivacy('showEmail', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <Label className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                    <Activity className="h-4 w-4" />
                    Show Activity
                  </Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Display your recent activity on your profile</p>
                </div>
                <Switch
                  checked={settings.privacy.showActivity}
                  onCheckedChange={(checked) => updatePrivacy('showActivity', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <Label className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                    <MessageSquare className="h-4 w-4" />
                    Allow Messages
                  </Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Allow other users to send you messages</p>
                </div>
                <Switch
                  checked={settings.privacy.allowMessages}
                  onCheckedChange={(checked) => updatePrivacy('allowMessages', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <Label className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                    <BarChart className="h-4 w-4" />
                    Show Stats
                  </Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Display your statistics on your profile</p>
                </div>
                <Switch
                  checked={settings.privacy.showStats}
                  onCheckedChange={(checked) => updatePrivacy('showStats', checked)}
                />
              </div>
            </div>

            <Button onClick={saveSettings} disabled={saving} className="w-full rounded-xl">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Privacy Settings
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Preferences Tab */}
      <TabsContent value="preferences">
        <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-200/30">
                <Settings className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              User Preferences
            </CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <Label className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                  <Palette className="h-4 w-4" />
                  Theme
                </Label>
                <Select value={settings.preferences.theme} onValueChange={(value) => updatePreference('theme', value)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <Label className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                  <Globe className="h-4 w-4" />
                  Language
                </Label>
                <Select value={settings.preferences.language} onValueChange={(value) => updatePreference('language', value)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ur">Urdu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <Label className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                  <Bell className="h-4 w-4" />
                  Email Frequency
                </Label>
                <Select value={settings.preferences.emailFrequency} onValueChange={(value) => updatePreference('emailFrequency', value)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <Label className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                  <CheckCircle2 className="h-4 w-4" />
                  Weekly Digest Day
                </Label>
                <Select value={settings.preferences.digestDay} onValueChange={(value) => updatePreference('digestDay', value)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select day" />
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
              </div>
            </div>

            <Button onClick={saveSettings} disabled={saving} className="w-full rounded-xl">
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
    </Tabs>
  )
}
