"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminGuard } from "@/components/admin/admin-guard"
import { useToast } from "@/hooks/use-toast"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { Settings, Globe, Shield, Mail, Database, Palette } from "lucide-react"


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
      <div className="app-container section" role="main" aria-labelledby="settings-heading">
        <div className="mb-8">
          <h1 id="settings-heading" className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Site Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure site-wide settings and preferences
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">
              <Globe className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="files">
              <Database className="h-4 w-4 mr-2" />
              Files
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic site configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" {...(saving ? { 'aria-busy': 'true' } as any : {})}>
                <div>
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={settings.site_name}
                    onChange={(e) => updateSetting('site_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="site_description">Site Description</Label>
                  <Textarea
                    id="site_description"
                    value={settings.site_description}
                    onChange={(e) => updateSetting('site_description', e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="site_logo_url">Site Logo URL</Label>
                  <Input
                    id="site_logo_url"
                    value={settings.site_logo_url}
                    onChange={(e) => updateSetting('site_logo_url', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => updateSetting('contact_email', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenance_mode"
                    checked={settings.maintenance_mode}
                    onCheckedChange={(checked) => updateSetting('maintenance_mode', checked)}
                  />
                  <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
                </div>
                <Button onClick={() => handleSave('general')} disabled={saving}>
                  {saving ? "Saving..." : "Save General Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>User registration and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" {...(saving ? { 'aria-busy': 'true' } as any : {})}>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="registration_enabled"
                    checked={settings.registration_enabled}
                    onCheckedChange={(checked) => updateSetting('registration_enabled', checked)}
                  />
                  <Label htmlFor="registration_enabled">Allow User Registration</Label>
                </div>
                <Button onClick={() => handleSave('security')} disabled={saving}>
                  {saving ? "Saving..." : "Save Security Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Configure email notifications and templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" {...(saving ? { 'aria-busy': 'true' } as any : {})}>
                <div>
                  <Label id="email_provider_label">Email Provider</Label>
                  <Select defaultValue="supabase">
                    <SelectTrigger aria-labelledby="email_provider_label">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supabase">Supabase (Default)</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="smtp">Custom SMTP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => handleSave('email')} disabled={saving}>
                  {saving ? "Saving..." : "Save Email Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>File Upload Settings</CardTitle>
                <CardDescription>Configure file upload limits and allowed types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" {...(saving ? { 'aria-busy': 'true' } as any : {})}>
                <div>
                  <Label htmlFor="max_file_size">Maximum File Size (MB)</Label>
                  <Input
                    id="max_file_size"
                    type="number"
                    value={settings.max_file_size_mb}
                    onChange={(e) => updateSetting('max_file_size_mb', parseInt(e.target.value) || 10)}
                    min="1"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="allowed_types">Allowed File Types (comma-separated)</Label>
                  <Input
                    id="allowed_types"
                    value={settings.allowed_file_types.join(', ')}
                    onChange={(e) => updateSetting('allowed_file_types', e.target.value.split(',').map(t => t.trim()))}
                    placeholder="pdf, doc, docx, jpg, png"
                  />
                </div>
                <Button onClick={() => handleSave('files')} disabled={saving}>
                  {saving ? "Saving..." : "Save File Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" {...(saving ? { 'aria-busy': 'true' } as any : {})}>
                <div>
                  <Label id="theme_color_label" htmlFor="theme_color">Primary Theme Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="theme_color"
                      type="color"
                      value={settings.theme_color}
                      onChange={(e) => updateSetting('theme_color', e.target.value)}
                      className="w-20"
                    />
                    <Input
                      value={settings.theme_color}
                      onChange={(e) => updateSetting('theme_color', e.target.value)}
                      placeholder="#3b82f6"
                      aria-labelledby="theme_color_label"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="announcement_enabled"
                      checked={settings.announcement_enabled}
                      onCheckedChange={(checked) => updateSetting('announcement_enabled', checked)}
                    />
                    <Label htmlFor="announcement_enabled">Show Site Announcement</Label>
                  </div>
                  {settings.announcement_enabled && (
                    <div>
                      <Label htmlFor="announcement_text">Announcement Text</Label>
                      <Textarea
                        id="announcement_text"
                        placeholder="Enter announcement text..."
                        value={settings.announcement_text}
                        onChange={(e) => updateSetting('announcement_text', e.target.value)}
                        rows={2}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Social Media Links</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={settings.social_links.facebook || ''}
                        onChange={(e) => updateSocialLink('facebook', e.target.value)}
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        value={settings.social_links.twitter || ''}
                        onChange={(e) => updateSocialLink('twitter', e.target.value)}
                        placeholder="https://twitter.com/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={settings.social_links.instagram || ''}
                        onChange={(e) => updateSocialLink('instagram', e.target.value)}
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={settings.social_links.linkedin || ''}
                        onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/..."
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('appearance')} disabled={saving}>
                  {saving ? "Saving..." : "Save Appearance Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminGuard>
  )
}
