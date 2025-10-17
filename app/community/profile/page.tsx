"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Users,
  Heart,
  MessageCircle,
  Star,
  Edit3,
  Camera,
  Link as LinkIcon,
  Award,
  TrendingUp,
  Hash,
  Check,
  Plus,
  Settings
} from "lucide-react"
import { useUserProfile } from "@/hooks/use-user-profile"
import { UserAchievements } from "@/components/community/user-achievements"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { cn } from "@/lib/utils"
import layout from "@/app/styles/common.module.css"
import "../community.light.module.css"
import "../community.dark.module.css"

export default function CommunityProfilePage() {
  const { user: currentUser } = useAuth()
  const { 
    profile, 
    activities, 
    posts, 
    loading, 
    error, 
    isFollowing, 
    followUser, 
    updateProfile,
    updateAvatar
  } = useUserProfile(currentUser?.id)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState({
    fullName: '',
    bio: '',
    campus: '',
    department: '',
    program: '',
    semester: ''
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  // Initialize edited profile when profile loads
  useEffect(() => {
    if (profile) {
      setEditedProfile({
        fullName: profile.fullName || '',
        bio: profile.bio || '',
        campus: profile.campusId || '',
        department: profile.departmentId || '',
        program: profile.programId || '',
        semester: profile.semester?.toString() || ''
      })
    }
  }, [profile])

  const handleSaveProfile = async () => {
    try {
      // Update avatar if file selected
      if (avatarFile) {
        await updateAvatar(avatarFile)
      }

      // Update profile info
      await updateProfile({
        fullName: editedProfile.fullName,
        bio: editedProfile.bio
      })

      setIsEditing(false)
      setAvatarFile(null)
    } catch (err) {
      console.error('Error saving profile:', err)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setAvatarFile(files[0])
    }
  }

  if (loading) {
    return <CenteredLoader message="Loading profile..." />
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
        <div className={`${layout.section} py-6`}>
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <User className="h-12 w-12 text-gray-400" />
              <h3 className="font-medium text-gray-900 dark:text-white">
                {error ? "Error loading profile" : "Profile not found"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {error || "Unable to load user profile"}
              </p>
              <Button 
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className={`${layout.section} py-6`}>
        {/* Profile Header */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl mb-8 overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute -bottom-16 left-6">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-800">
                  <AvatarImage 
                    src={avatarFile ? URL.createObjectURL(avatarFile) : profile.avatarUrl} 
                  />
                  <AvatarFallback className="text-2xl">
                    {profile.fullName?.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-2 right-2 h-10 w-10 rounded-full bg-white dark:bg-slate-800 border border-white dark:border-slate-700"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    <Camera className="h-10 w-10" />
                  </Button>
                )}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
          </div>
          
          <CardContent className="pt-20 pb-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div>
                {isEditing ? (
                  <Input
                    value={editedProfile.fullName}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, fullName: e.target.value }))}
                    className="text-2xl font-bold mb-2"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.fullName}
                  </h1>
                )}
                
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                    <Mail className="h-10 w-10" />
                    <span>{profile.email}</span>
                  </div>
                  
                  {profile.campusId && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="h-10 w-10" />
                      <span>Campus</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="h-10 w-10" />
                    <span>Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
                  </div>
                  
                  {profile.isOnline && (
                    <Badge className="bg-green-500 text-white text-xs">
                      Online
                    </Badge>
                  )}
                </div>
                
                {isEditing ? (
                  <Textarea
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    className="mt-3 max-w-10xl"
                    rows={3}
                  />
                ) : (
                  <p className="mt-3 text-gray-700 dark:text-gray-300 max-w-10xl">
                    {profile.bio || "No bio available"}
                  </p>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                {currentUser?.id !== profile.id ? (
                  <Button 
                    onClick={followUser}
                    variant={isFollowing ? "outline" : "default"}
                    className="rounded-full"
                  >
                    {isFollowing ? (
                      <>
                        <Check className="h-10 w-10 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <Plus className="h-10 w-10 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    {isEditing ? (
                      <Button 
                        onClick={handleSaveProfile}
                        className="rounded-full"
                      >
                        Save Changes
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        className="rounded-full"
                      >
                        <Edit3 className="h-10 w-10 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </>
                )}
                
                <Button variant="outline" size="icon" className="rounded-full">
                  <Settings className="h-10 w-10" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl">
            <CardContent className="flex flex-col items-center gap-1 p-4">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {profile.posts}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Posts</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl">
            <CardContent className="flex flex-col items-center gap-1 p-4">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {profile.followers}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Followers</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl">
            <CardContent className="flex flex-col items-center gap-1 p-4">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {profile.following}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Following</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl">
            <CardContent className="flex flex-col items-center gap-1 p-4">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {profile.likes}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Likes</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl">
            <CardContent className="flex flex-col items-center gap-1 p-4">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {profile.comments}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Comments</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}