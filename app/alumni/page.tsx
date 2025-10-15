"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  GraduationCap, 
  Mail, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Calendar,
  Zap,
  Sparkles,
  Award,
  Users,
  BookOpen
} from "lucide-react"
import { motion } from "framer-motion"
import { notifyFetch } from "@/lib/notify"
import { AnimatedCard, FadeInScroll } from "@/components/animations/enhanced"

export default function AlumniPortal() {
  const { user, isAuthenticated } = useAuth()
  const [emails, setEmails] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newEmail, setNewEmail] = useState("")
  const [isAddingEmail, setIsAddingEmail] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch user emails
  useEffect(() => {
    const fetchEmails = async () => {
      if (!isAuthenticated) return
      
      try {
        setLoading(true)
        const response = await notifyFetch("/api/user-emails", undefined, {
          errorMessage: "Failed to load email addresses"
        })
        
        if (!response.ok) {
          throw new Error("Failed to fetch emails")
        }
        
        const data = await response.json()
        setEmails(data)
      } catch (err) {
        setError("Failed to load email addresses")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchEmails()
  }, [isAuthenticated])

  // Add new email
  const handleAddEmail = async () => {
    if (!newEmail) return
    
    try {
      setIsAddingEmail(true)
      setError(null)
      
      const response = await fetch("/api/user-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: newEmail,
          email_type: "personal"
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to add email")
      }
      
      // Add to local state
      setEmails([...emails, data])
      setNewEmail("")
      setSuccess("Email added successfully! Please verify it via the email we sent.")
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000)
    } catch (err: any) {
      setError(err.message || "Failed to add email")
    } finally {
      setIsAddingEmail(false)
    }
  }

  // Set primary email
  const handleSetPrimary = async (email: string) => {
    try {
      setError(null)
      
      const response = await fetch("/api/user-emails/set-primary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to set primary email")
      }
      
      setSuccess(data.message || "Primary email updated successfully!")
      
      // Refresh email list
      const refreshResponse = await notifyFetch("/api/user-emails", undefined, {
        errorMessage: "Failed to refresh email addresses"
      })
      
      if (refreshResponse.ok) {
        const refreshedData = await refreshResponse.json()
        setEmails(refreshedData)
      }
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000)
    } catch (err: any) {
      setError(err.message || "Failed to set primary email")
    }
  }

  // Delete email
  const handleDeleteEmail = async (emailId: string) => {
    try {
      setError(null)
      
      const response = await fetch(`/api/user-emails?id=${emailId}`, {
        method: "DELETE"
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete email")
      }
      
      // Remove from local state
      setEmails(emails.filter(email => email.id !== emailId))
      setSuccess("Email deleted successfully!")
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000)
    } catch (err: any) {
      setError(err.message || "Failed to delete email")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-mesh overflow-hidden relative flex flex-col items-center justify-center py-12 px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <AnimatedCard className="card-modern border-0 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl">
            <CardContent className="p-12 lg:p-16 space-y-8">
              <div className="flex flex-col items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-20" />
                  <GraduationCap className="h-16 w-16 text-primary relative z-10" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Alumni <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">Portal</span>
                </h1>
              </div>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Access your alumni account to maintain connection with COMSATS University.
              </p>

              <div className="pt-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 hover-lift shadow-xl font-semibold text-base h-auto"
                  onClick={() => window.location.href = '/auth'}
                >
                  Sign In to Access Alumni Portal
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
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '4s' }} />
      </div>

      <main className="flex-1 py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <FadeInScroll className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary mb-6 hover:from-primary/20 hover:to-blue-500/20 transition-all duration-300 hover-lift">
              <GraduationCap className="h-4 w-4" />
              Alumni Portal
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Welcome, <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">Alumnus</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Manage your account access and stay connected with the COMSATS community.
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
              {/* Email Management Card */}
              <AnimatedCard className="glass-card-premium glass-hover glass-gradient border border-white/20 rounded-3xl shadow-xl backdrop-blur-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Mail className="h-6 w-6 text-primary" />
                    <span>Email Management</span>
                  </CardTitle>
                  <CardDescription>
                    Add and manage email addresses for continued access after graduation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add Email Form */}
                  <div className="space-y-4">
                    <Label htmlFor="new-email">Add Personal Email</Label>
                    <div className="flex gap-3">
                      <Input
                        id="new-email"
                        type="email"
                        placeholder="your.personal@email.com"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="flex-1 glass-card border-white/20"
                      />
                      <Button 
                        onClick={handleAddEmail}
                        disabled={isAddingEmail || !newEmail}
                        className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700"
                      >
                        {isAddingEmail ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Adding...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Email
                          </div>
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add a personal email to maintain access after your institutional email becomes inactive
                    </p>
                  </div>

                  {/* Email List */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Your Email Addresses</h3>
                    
                    {loading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-16 bg-muted rounded-2xl animate-pulse" />
                        ))}
                      </div>
                    ) : emails.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No email addresses found. Add your personal email to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {emails.map((email) => (
                          <div 
                            key={email.id} 
                            className="flex items-center justify-between p-4 rounded-2xl glass-card border border-white/20 hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-xl bg-primary/10">
                                <Mail className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  {email.email}
                                  {email.email_type === 'primary' && (
                                    <Badge variant="default" className="text-xs">
                                      Primary
                                    </Badge>
                                  )}
                                  {email.is_verified && (
                                    <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-700 dark:text-green-300">
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                                {!email.is_verified && (
                                  <p className="text-sm text-muted-foreground">Pending verification</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {email.email_type !== 'primary' && email.is_verified && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleSetPrimary(email.email)}
                                  className="text-xs"
                                >
                                  Set Primary
                                </Button>
                              )}
                              {email.email_type !== 'primary' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDeleteEmail(email.id)}
                                  className="text-xs"
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </AnimatedCard>

              {/* Alumni Benefits */}
              <AnimatedCard className="glass-card-premium glass-hover glass-gradient border border-white/20 rounded-3xl shadow-xl backdrop-blur-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Award className="h-6 w-6 text-primary" />
                    <span>Alumni Benefits</span>
                  </CardTitle>
                  <CardDescription>
                    Exclusive features and resources available to COMSATS alumni
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        icon: Users,
                        title: "Alumni Network",
                        description: "Connect with fellow graduates and expand your professional network"
                      },
                      {
                        icon: BookOpen,
                        title: "Lifetime Access",
                        description: "Continue accessing academic resources and past papers"
                      },
                      {
                        icon: Calendar,
                        title: "Events & Reunions",
                        description: "Stay informed about alumni events and campus reunions"
                      },
                      {
                        icon: Zap,
                        title: "Career Services",
                        description: "Access career counseling and job placement services"
                      }
                    ].map((benefit, index) => {
                      const Icon = benefit.icon
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-2xl glass-card border border-white/20 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-primary/10 mt-1">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold mb-1">{benefit.title}</h4>
                              <p className="text-sm text-muted-foreground">{benefit.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </AnimatedCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* User Profile Card */}
              <AnimatedCard className="glass-card-premium glass-hover glass-gradient border border-white/20 rounded-3xl shadow-xl backdrop-blur-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <User className="h-6 w-6 text-primary" />
                    <span>Your Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {user?.user_metadata?.full_name || "COMSATS Alumnus"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Status</span>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-300">
                        Active
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member Since</span>
                      <span>
                        {user?.created_at 
                          ? new Date(user.created_at).toLocaleDateString() 
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </AnimatedCard>

              {/* Beta Feature Card */}
              <AnimatedCard className="glass-card-premium glass-hover glass-gradient border border-amber-500/30 rounded-3xl shadow-xl backdrop-blur-2xl transition-all duration-300 bg-amber-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-amber-500" />
                    <span>Beta Feature</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    The Alumni Portal is currently in beta. We're continuously improving features based on your feedback.
                  </p>
                  <Button variant="outline" size="sm" className="w-full border-amber-500/30 text-amber-700 dark:text-amber-300">
                    Send Feedback
                  </Button>
                </CardContent>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}