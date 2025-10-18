"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import layout from "@/app/styles/common.module.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { 
  Settings, 
  Bell, 
  Lock, 
  Shield, 
  Eye, 
  EyeOff,
  Mail,
  Smartphone,
  Globe,
  Trash2,
  LogOut,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedCard, FadeInScroll } from "@/components/animations/enhanced"
import { notifyFetch } from "@/lib/notify"

export default function AlumniSettings() {
  const { user, isAuthenticated, logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  })
  const [privacy, setPrivacy] = useState({
    profile_visibility: "alumni",
    show_email: false,
    show_phone: false
  })
  const [security, setSecurity] = useState({
    two_factor: false,
    password_reset_required: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch user settings
  useEffect(() => {
    const fetchSettings = async () => {
      if (!isAuthenticated) return
      
      try {
        setLoading(true)
        // In a real implementation, you would fetch actual settings from an API
        // For now, we'll use default values
        setTimeout(() => {
          setLoading(false)
        }, 500)
      } catch (err) {
        setError("Failed to load settings")
        console.error(err)
        setLoading(false)
      }
    }

    fetchSettings()
  }, [isAuthenticated])

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handlePrivacyChange = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: typeof prev[key] === 'boolean' ? !prev[key] : prev[key]
    }))
  }

  const handleSecurityChange = (key: keyof typeof security) => {
    setSecurity(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      setError(null)
      // In a real implementation, you would call an API to change the password
      setSuccess("Password updated successfully!")
      
      // Reset form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000)
    } catch (err: any) {
      setError(err.message || "Failed to update password")
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    try {
      setError(null)
      // In a real implementation, you would call an API to delete the account
      setSuccess("Account deleted successfully. You will be logged out.")
      
      // Log out user after account deletion
      setTimeout(async () => {
        await logout()
        window.location.href = "/"
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to delete account")
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      window.location.href = "/"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-mesh overflow-hidden relative flex flex-col items-center justify-center py-12 px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse float animate-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse float animate-delay-4000" />
        </div>

        <div className={`${layout.section} ${layout.max3xl} text-center relative z-10`}>
          <AnimatedCard className="card-modern border-0 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl">
            <CardContent className="p-12 lg:p-16 space-y-8">
              <div className="flex flex-col items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-20" />
                  <Settings className="h-16 w-16 text-primary relative z-10" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Alumni <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">Settings</span>
                </h1>
              </div>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Access your alumni account settings to customize your experience.
              </p>

              <div className="pt-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 hover-lift shadow-xl font-semibold text-base h-auto"
                  onClick={() => window.location.href = '/auth'}
                >
                  Sign In to Access Settings
                </Button>
              </div>
            </CardContent>
          </AnimatedCard>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mesh overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse float animate-delay-2000" />
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse float animate-delay-4000" />
      </div>

      <main className="flex-1 py-16 px-4 relative z-10">
        <div className={`${layout.section} ${layout.max6xl}`}>
          {/* Header */}
          <FadeInScroll className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary mb-6 hover:from-primary/20 hover:to-blue-500/20 transition-all duration-300 hover-lift">
              <Settings className="h-4 w-4" />
              Alumni Settings
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Account <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">Settings</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Manage your account preferences and security settings
            </p>
          </FadeInScroll>

          {/* Success/Error Messages */}
          {success && (
            <FadeInScroll className="mb-8">
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-500">{success}</span>
              </div>
            </FadeInScroll>
          )}

          {error && (
            <FadeInScroll className="mb-8">
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-500">{error}</span>
              </div>
            </FadeInScroll>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Notification Settings Card */}
              <AnimatedCard className="glass-card-premium glass-hover glass-gradient border border-white/20 rounded-3xl shadow-xl backdrop-blur-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Bell className="h-6 w-6 text-primary" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to be notified about important updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-muted rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-2xl glass-card border border-white/20">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive updates via email</p>
                          </div>
                        </div>
                        <Switch 
                          checked={notifications.email}
                          onCheckedChange={() => handleNotificationChange('email')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 rounded-2xl glass-card border border-white/20">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">SMS Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                          </div>
                        </div>
                        <Switch 
                          checked={notifications.sms}
                          onCheckedChange={() => handleNotificationChange('sms')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 rounded-2xl glass-card border border-white/20">
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Push Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive push notifications</p>
                          </div>
                        </div>
                        <Switch 
                          checked={notifications.push}
                          onCheckedChange={() => handleNotificationChange('push')}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </AnimatedCard>

              {/* Privacy Settings Card */}
              <AnimatedCard className="glass-card-premium glass-hover glass-gradient border border-white/20 rounded-3xl shadow-xl backdrop-blur-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-primary" />
                    <span>Privacy Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Control who can see your information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-muted rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-2xl glass-card border border-white/20">
                        <div>
                          <p id="profile-visibility-label" className="font-medium">Profile Visibility</p>
                          <p id="profile-visibility-description" className="text-sm text-muted-foreground">Who can see your profile</p>
                        </div>
                        <select 
                          id="profile-visibility-select"
                          value={privacy.profile_visibility}
                          onChange={(e) => setPrivacy({...privacy, profile_visibility: e.target.value})}
                          aria-labelledby="profile-visibility-label"
                          aria-describedby="profile-visibility-description"
                          className="glass-card border border-white/20 rounded-2xl px-3 py-2"
                        >
                          <option value="public">Public</option>
                          <option value="alumni">Alumni Only</option>
                          <option value="private">Private</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 rounded-2xl glass-card border border-white/20">
                        <div>
                          <p className="font-medium">Show Email Address</p>
                          <p className="text-sm text-muted-foreground">Display your email publicly</p>
                        </div>
                        <Switch 
                          checked={privacy.show_email}
                          onCheckedChange={() => handlePrivacyChange('show_email')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 rounded-2xl glass-card border border-white/20">
                        <div>
                          <p className="font-medium">Show Phone Number</p>
                          <p className="text-sm text-muted-foreground">Display your phone publicly</p>
                        </div>
                        <Switch 
                          checked={privacy.show_phone}
                          onCheckedChange={() => handlePrivacyChange('show_phone')}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </AnimatedCard>

              {/* Security Settings Card */}
              <AnimatedCard className="glass-card-premium glass-hover glass-gradient border border-white/20 rounded-3xl shadow-xl backdrop-blur-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Lock className="h-6 w-6 text-primary" />
                    <span>Security Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Manage your account security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-12 bg-muted rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-2xl glass-card border border-white/20">
                          <div>
                            <p className="font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                          </div>
                          <Switch 
                            checked={security.two_factor}
                            onCheckedChange={() => handleSecurityChange('two_factor')}
                          />
                        </div>
                        
                        <div className="space-y-4 p-4 rounded-2xl glass-card border border-white/20">
                          <h3 className="font-semibold">Change Password</h3>
                          
                          <div>
                            <Label htmlFor="current-password">Current Password</Label>
                            <div className="relative mt-1">
                              <Input
                                id="current-password"
                                type={showPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="glass-card border-white/20 pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-5 w-5 text-muted-foreground" />
                                )}
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                              id="new-password"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="glass-card border-white/20 mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="glass-card border-white/20 mt-1"
                            />
                          </div>
                          
                          <Button 
                            onClick={handlePasswordChange}
                            className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 mt-2"
                          >
                            Update Password
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </AnimatedCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Account Management Card */}
              <AnimatedCard className="glass-card-premium glass-hover glass-gradient border border-white/20 rounded-3xl shadow-xl backdrop-blur-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Settings className="h-6 w-6 text-primary" />
                    <span>Account Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3 border-red-500/30 text-red-700 dark:text-red-300 hover:bg-red-500/10"
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 className="h-5 w-5" />
                    Delete Account
                  </Button>
                  
                  <Separator className="my-2" />
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </Button>
                </CardContent>
              </AnimatedCard>

              {/* Account Information Card */}
              <AnimatedCard className="glass-card-premium glass-hover glass-gradient border border-white/20 rounded-3xl shadow-xl backdrop-blur-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-primary" />
                    <span>Account Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 rounded-2xl glass-card border border-white/20">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium truncate">{user?.email}</p>
                    </div>
                    
                    <div className="p-3 rounded-2xl glass-card border border-white/20">
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">
                        {"Unknown"}
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-2xl glass-card border border-white/20">
                      <p className="text-sm text-muted-foreground">Last Login</p>
                      <p className="font-medium">
                        {"Unknown"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}