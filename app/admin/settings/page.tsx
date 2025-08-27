"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminGuard } from "@/components/admin/admin-guard"
import { useToast } from "@/hooks/use-toast"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { Settings, Globe, Shield, Mail, Database, Palette, Sparkles, Activity, TrendingUp, Zap, Crown, Save, Lock, Eye, EyeOff } from "lucide-react"


interface SiteSettings {
  site_name: string
  site_description: string
  site_logo_url: string
  contact_email: string
  maintenance_mode: boolean
  registration_enabled: boolean
  max_file_size_mb: number
  allowed_file_types: string[]
  theme_color: string
  announcement_text: string
  announcement_enabled: boolean
  social_links: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: "CampusAxis",
    site_description: "Academic portal for COMSATS University",
    site_logo_url: "",
    contact_email: "admin@comsats.edu.pk",
    maintenance_mode: false,
    registration_enabled: true,
    max_file_size_mb: 10,
    allowed_file_types: ["pdf", "doc", "docx", "jpg", "png"],
    theme_color: "#3b82f6",
    announcement_text: "",
    announcement_enabled: false,
    social_links: {}
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (section: string) => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, settings })
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
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: keyof SiteSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const updateSocialLink = (platform: string, url: string) => {
    setSettings(prev => ({
      ...prev,
      social_links: { ...prev.social_links, [platform]: url }
    }))
  }

  if (loading) {
    return <CenteredLoader message="Loading settings..." />
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20">
        {/* Hero Section with Glassmorphism */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 backdrop-blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          
          <div className="relative app-container pt-12 pb-8">
            <div className="glass-card border border-white/20 dark:border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
                      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-2xl">
                        <Settings className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 id="settings-heading" className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-purple-800 to-indigo-800 dark:from-white dark:via-purple-200 dark:to-indigo-200 bg-clip-text text-transparent">
                        System Settings
                      </h1>
                      <p className="text-slate-600 dark:text-slate-300 text-lg">
                        Configure platform settings and preferences
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-purple-200 dark:border-purple-800">
                      <Activity className="h-3 w-3 mr-1" />
                      Live Configuration
                    </Badge>
                    <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-green-200 dark:border-green-800">
                      <Lock className="h-3 w-3 mr-1" />
                      Secure Settings
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button size="sm" variant="outline" className="glass-button bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border-white/40 dark:border-slate-600/40 hover:bg-white/50 dark:hover:bg-slate-700/50">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Changes
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300" disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save All"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Settings Interface */}
        <div className="app-container space-y-6 pb-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Configuration Panels</h2>
              <p className="text-slate-600 dark:text-slate-300">Organize and manage all platform settings</p>
            </div>
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
              <Sparkles className="h-3 w-3 mr-1" />
              Auto-save Enabled
            </Badge>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="glass-card bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/40 dark:border-slate-600/40 grid w-full grid-cols-5">
              <TabsTrigger value="general" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg">
                <Globe className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="files" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg">
                <Database className="h-4 w-4" />
                Files
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
                
                <CardHeader className="relative">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-30" />
                      <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-xl">
                        <Globe className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-xl text-slate-900 dark:text-white">General Settings</CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-300">Basic site configuration and branding</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-6" {...(saving ? { 'aria-busy': 'true' } as any : {})}>
                  <div className="grid gap-6">
                    <div>
                      <Label htmlFor="site_name" className="text-sm font-medium text-slate-700 dark:text-slate-200">Site Name</Label>
                      <Input
                        id="site_name"
                        value={settings.site_name}
                        onChange={(e) => updateSetting('site_name', e.target.value)}
                        className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                      />
                    </div>
                    <div>
                      <Label htmlFor="site_description" className="text-sm font-medium text-slate-700 dark:text-slate-200">Site Description</Label>
                      <Textarea
                        id="site_description"
                        value={settings.site_description}
                        onChange={(e) => updateSetting('site_description', e.target.value)}
                        rows={3}
                        className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                      />
                    </div>
                    <div>
                      <Label htmlFor="site_logo_url" className="text-sm font-medium text-slate-700 dark:text-slate-200">Site Logo URL</Label>
                      <Input
                        id="site_logo_url"
                        value={settings.site_logo_url}
                        onChange={(e) => updateSetting('site_logo_url', e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_email" className="text-sm font-medium text-slate-700 dark:text-slate-200">Contact Email</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={settings.contact_email}
                        onChange={(e) => updateSetting('contact_email', e.target.value)}
                        className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-white/40 dark:border-slate-600/40">
                      <div className="space-y-1">
                        <Label htmlFor="maintenance_mode" className="text-sm font-medium text-slate-700 dark:text-slate-200">Maintenance Mode</Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Temporarily disable site access for maintenance</p>
                      </div>
                      <Switch
                        id="maintenance_mode"
                        checked={settings.maintenance_mode}
                        onCheckedChange={(checked) => updateSetting('maintenance_mode', checked)}
                      />
                    </div>
                  </div>
                  <Button onClick={() => handleSave('general')} disabled={saving} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0 w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save General Settings"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
                
                <CardHeader className="relative">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl blur-lg opacity-30" />
                      <div className="relative bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-xl">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-xl text-slate-900 dark:text-white">Security Settings</CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-300">User registration and access controls</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-6" {...(saving ? { 'aria-busy': 'true' } as any : {})}>
                  <div className="grid gap-6">
                    <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-white/40 dark:border-slate-600/40">
                      <div className="space-y-1">
                        <Label htmlFor="registration_enabled" className="text-sm font-medium text-slate-700 dark:text-slate-200">Allow User Registration</Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Enable new users to create accounts on the platform</p>
                      </div>
                      <Switch
                        id="registration_enabled"
                        checked={settings.registration_enabled}
                        onCheckedChange={(checked) => updateSetting('registration_enabled', checked)}
                      />
                    </div>
                  </div>
                  <Button onClick={() => handleSave('security')} disabled={saving} className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 border-0 w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Security Settings"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email">
              <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
                
                <CardHeader className="relative">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl blur-lg opacity-30" />
                      <div className="relative bg-gradient-to-r from-green-500 to-teal-500 p-2 rounded-xl">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-xl text-slate-900 dark:text-white">Email Settings</CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-300">Configure email notifications and templates</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-6" {...(saving ? { 'aria-busy': 'true' } as any : {})}>
                  <div className="grid gap-6">
                    <div>
                      <Label id="email_provider_label" className="text-sm font-medium text-slate-700 dark:text-slate-200">Email Provider</Label>
                      <Select defaultValue="supabase">
                        <SelectTrigger aria-labelledby="email_provider_label" className="glass-button bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="supabase">Supabase (Default)</SelectItem>
                          <SelectItem value="sendgrid">SendGrid</SelectItem>
                          <SelectItem value="smtp">Custom SMTP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={() => handleSave('email')} disabled={saving} className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 border-0 w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Email Settings"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files">
              <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
                
                <CardHeader className="relative">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur-lg opacity-30" />
                      <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-xl">
                        <Database className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-xl text-slate-900 dark:text-white">File Upload Settings</CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-300">Configure file upload limits and allowed types</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-6" {...(saving ? { 'aria-busy': 'true' } as any : {})}>
                  <div className="grid gap-6">
                    <div>
                      <Label htmlFor="max_file_size" className="text-sm font-medium text-slate-700 dark:text-slate-200">Maximum File Size (MB)</Label>
                      <Input
                        id="max_file_size"
                        type="number"
                        value={settings.max_file_size_mb}
                        onChange={(e) => updateSetting('max_file_size_mb', parseInt(e.target.value) || 10)}
                        min="1"
                        max="100"
                        className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                      />
                    </div>
                    <div>
                      <Label htmlFor="allowed_types" className="text-sm font-medium text-slate-700 dark:text-slate-200">Allowed File Types (comma-separated)</Label>
                      <Input
                        id="allowed_types"
                        value={settings.allowed_file_types.join(', ')}
                        onChange={(e) => updateSetting('allowed_file_types', e.target.value.split(',').map(t => t.trim()))}
                        placeholder="pdf, doc, docx, jpg, png"
                        className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                      />
                    </div>
                  </div>
                  <Button onClick={() => handleSave('files')} disabled={saving} className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 border-0 w-full">
                    <Database className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save File Settings"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card className="glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
                
                <CardHeader className="relative">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-30" />
                      <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                        <Palette className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-xl text-slate-900 dark:text-white">Appearance Settings</CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-300">Customize the look and feel of your site</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-6" {...(saving ? { 'aria-busy': 'true' } as any : {})}>
                  <div className="grid gap-6">
                    <div>
                      <Label id="theme_color_label" htmlFor="theme_color" className="text-sm font-medium text-slate-700 dark:text-slate-200">Primary Theme Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="theme_color"
                          type="color"
                          value={settings.theme_color}
                          onChange={(e) => updateSetting('theme_color', e.target.value)}
                          className="w-20 h-10 glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40"
                        />
                        <Input
                          value={settings.theme_color}
                          onChange={(e) => updateSetting('theme_color', e.target.value)}
                          placeholder="#3b82f6"
                          aria-labelledby="theme_color_label"
                          className="flex-1 glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-white/40 dark:border-slate-600/40">
                        <div className="space-y-1">
                          <Label htmlFor="announcement_enabled" className="text-sm font-medium text-slate-700 dark:text-slate-200">Show Site Announcement</Label>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Display an announcement banner across the site</p>
                        </div>
                        <Switch
                          id="announcement_enabled"
                          checked={settings.announcement_enabled}
                          onCheckedChange={(checked) => updateSetting('announcement_enabled', checked)}
                        />
                      </div>
                      {settings.announcement_enabled && (
                        <div>
                          <Label htmlFor="announcement_text" className="text-sm font-medium text-slate-700 dark:text-slate-200">Announcement Text</Label>
                          <Textarea
                            id="announcement_text"
                            placeholder="Enter announcement text..."
                            value={settings.announcement_text}
                            onChange={(e) => updateSetting('announcement_text', e.target.value)}
                            rows={2}
                            className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Social Media Links</Label>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="facebook" className="text-xs text-slate-600 dark:text-slate-400">Facebook</Label>
                          <Input
                            id="facebook"
                            value={settings.social_links.facebook || ''}
                            onChange={(e) => updateSocialLink('facebook', e.target.value)}
                            placeholder="https://facebook.com/..."
                            className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                          />
                        </div>
                        <div>
                          <Label htmlFor="twitter" className="text-xs text-slate-600 dark:text-slate-400">Twitter</Label>
                          <Input
                            id="twitter"
                            value={settings.social_links.twitter || ''}
                            onChange={(e) => updateSocialLink('twitter', e.target.value)}
                            placeholder="https://twitter.com/..."
                            className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                          />
                        </div>
                        <div>
                          <Label htmlFor="instagram" className="text-xs text-slate-600 dark:text-slate-400">Instagram</Label>
                          <Input
                            id="instagram"
                            value={settings.social_links.instagram || ''}
                            onChange={(e) => updateSocialLink('instagram', e.target.value)}
                            placeholder="https://instagram.com/..."
                            className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                          />
                        </div>
                        <div>
                          <Label htmlFor="linkedin" className="text-xs text-slate-600 dark:text-slate-400">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            value={settings.social_links.linkedin || ''}
                            onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                            placeholder="https://linkedin.com/..."
                            className="glass-input bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/40 dark:border-slate-600/40 focus:bg-white/70 dark:focus:bg-slate-800/70"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => handleSave('appearance')} disabled={saving} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 w-full">
                    <Palette className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Appearance Settings"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminGuard>
  )
}
