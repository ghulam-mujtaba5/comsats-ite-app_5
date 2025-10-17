"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import layout from "@/app/styles/common.module.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar,
  GraduationCap,
  Award,
  Briefcase,
  Edit3,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedCard, FadeInScroll } from "@/components/animations/enhanced"
import { notifyFetch } from "@/lib/notify"

export default function AlumniProfile() {
  const { user, isAuthenticated } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    company: "",
    position: "",
    graduation_year: "",
    degree: ""
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return
      
      try {
        setLoading(true)
        const response = await notifyFetch("/api/profile", undefined, {
          errorMessage: "Failed to load profile"
        })
        
        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }
        
        const data = await response.json()
        setProfile(data)
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          address: data.address || "",
          company: data.company || "",
          position: data.position || "",
          graduation_year: data.graduation_year || "",
          degree: data.degree || ""
        })
      } catch (err) {
        setError("Failed to load profile")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [isAuthenticated])

  const handleSave = async () => {
    try {
      setError(null)
      
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile")
      }
      
      setProfile(data)
      setSuccess("Profile updated successfully!")
      setEditing(false)
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000)
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
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

        <div className={`${layout.section} ${layout.max3xl} text-center relative z-10`}>
          <AnimatedCard className="card-modern border-0 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl">
            <CardContent className="p-12 lg:p-16 space-y-8">
              <div className="flex flex-col items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-20" />
                  <User className="h-16 w-16 text-primary relative z-10" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Alumni <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">Profile</span>
                </h1>
              </div>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Access your alumni profile to maintain your information and stay connected.
              </p>

              <div className="pt-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 hover-lift shadow-xl font-semibold text-base h-auto"
                  onClick={() => window.location.href = '/auth'}
                >
                  Sign In to Access Profile
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
        <div className={`${layout.section} ${layout.max6xl}`}>
          {/* Header */}
          <FadeInScroll className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 text-sm font-medium text-primary mb-6 hover:from-primary/20 hover:to-blue-500/20 transition-all duration-300 hover-lift">
              <User className="h-4 w-4" />
              Alumni Profile
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Your <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">Profile</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Manage your personal and professional information
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
              {/* Personal Information Card */}
              <AnimatedCard className="glass-card-premium glass-hover glass-gradient border border-white/20 rounded-3xl shadow-xl backdrop-blur-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <User className="h-6 w-6 text-primary" />
                    <span>Personal Information</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-auto"
                      onClick={() => setEditing(!editing)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      {editing ? "Cancel" : "Edit"}
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Your basic personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-12 bg-muted rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="full_name">Full Name</Label>
                          {editing ? (
                            <Input
                              id="full_name"
                              value={formData.full_name}
                              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                              className="glass-card border-white/20 mt-1"
                            />
                          ) : (
                            <div className="mt-1 p-3 rounded-2xl glass-card border border-white/20">
                              {profile?.full_name || "Not provided"}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          {editing ? (
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="glass-card border-white/20 mt-1"
                            />
                          ) : (
                            <div className="mt-1 p-3 rounded-2xl glass-card border border-white/20">
                              {profile?.phone || "Not provided"}
                            </div>
                          )}
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label htmlFor="address">Address</Label>
                          {editing ? (
                            <Input
                              id="address"
                              value={formData.address}
                              onChange={(e) => setFormData({...formData, address: e.target.value})}
                              className="glass-card border-white/20 mt-1"
                            />
                          ) : (
                            <div className="mt-1 p-3 rounded-2xl glass-card border border-white/20">
                              {profile?.address || "Not provided"}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {editing && (
                        <div className="pt-4">
                          <Button 
                            onClick={handleSave}
                            className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700"
                          >
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </AnimatedCard>

              {/* Professional Information Card */}
              <AnimatedCard className="glass-card-premium glass-hover glass-gradient border border-white/20 rounded-3xl shadow-xl backdrop-blur-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Briefcase className="h-6 w-6 text-primary" />
                    <span>Professional Information</span>
                  </CardTitle>
                  <CardDescription>
                    Your career and professional details
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="company">Company</Label>
                          {editing ? (
                            <Input
                              id="company"
                              value={formData.company}
                              onChange={(e) => setFormData({...formData, company: e.target.value})}
                              className="glass-card border-white/20 mt-1"
                            />
                          ) : (
                            <div className="mt-1 p-3 rounded-2xl glass-card border border-white/20">
                              {profile?.company || "Not provided"}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="position">Position</Label>
                          {editing ? (
                            <Input
                              id="position"
                              value={formData.position}
                              onChange={(e) => setFormData({...formData, position: e.target.value})}
                              className="glass-card border-white/20 mt-1"
                            />
                          ) : (
                            <div className="mt-1 p-3 rounded-2xl glass-card border border-white/20">
                              {profile?.position || "Not provided"}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </AnimatedCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Academic Information Card */}
              <AnimatedCard className="glass-card-premium glass-hover glass-gradient border border-white/20 rounded-3xl shadow-xl backdrop-blur-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    <span>Academic Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-8 bg-muted rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-2xl glass-card border border-white/20">
                        <Award className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Degree</p>
                          {editing ? (
                            <Input
                              value={formData.degree}
                              onChange={(e) => setFormData({...formData, degree: e.target.value})}
                              className="glass-card border-white/20 text-sm h-8 mt-1"
                            />
                          ) : (
                            <p className="font-medium">{profile?.degree || "Not provided"}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-2xl glass-card border border-white/20">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Graduation Year</p>
                          {editing ? (
                            <Input
                              value={formData.graduation_year}
                              onChange={(e) => setFormData({...formData, graduation_year: e.target.value})}
                              className="glass-card border-white/20 text-sm h-8 mt-1"
                            />
                          ) : (
                            <p className="font-medium">{profile?.graduation_year || "Not provided"}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-2xl glass-card border border-white/20">
                        <Building className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">University</p>
                          <p className="font-medium">COMSATS University</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </AnimatedCard>

              {/* Contact Information Card */}
              <AnimatedCard className="glass-card-premium glass-hover glass-gradient border border-white/20 rounded-3xl shadow-xl backdrop-blur-2xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Mail className="h-6 w-6 text-primary" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-8 bg-muted rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-2xl glass-card border border-white/20">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{user?.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-2xl glass-card border border-white/20">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{profile?.phone || "Not provided"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-2xl glass-card border border-white/20">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Address</p>
                          <p className="font-medium">{profile?.address || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}