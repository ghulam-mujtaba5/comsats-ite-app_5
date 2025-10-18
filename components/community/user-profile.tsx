import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  MapPin, 
  Building2, 
  GraduationCap, 
  Calendar, 
  Award, 
  Trophy, 
  Flame,
  Crown,
  Star,
  Users,
  MessageCircle,
  Heart,
  Share2
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

interface UserProfileData {
  id: string
  full_name: string
  avatar_url: string
  bio: string
  location: string
  campus_id: string
  department_id: string
  program_id: string
  semester: number
  batch: string
  join_date: string
  posts_count: number
  comments_count: number
  likes_given: number
  likes_received: number
  level: number
  experience: number
  next_level_exp: number
  achievements: any[]
  badges: any[]
}

interface Campus {
  id: string
  name: string
  location: string
}

interface Department {
  id: string
  name: string
  code: string
}

interface Program {
  id: string
  name: string
  code: string
}

export function UserProfile({ userId }: { userId?: string }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfileData | null>(null)
  const [campus, setCampus] = useState<Campus | null>(null)
  const [department, setDepartment] = useState<Department | null>(null)
  const [program, setProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const targetUserId = userId || user?.id
        
        if (!targetUserId) return
        
        setIsOwnProfile(targetUserId === user?.id)
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select(`
            *,
            achievements:user_achievements(*),
            badges:user_badges(*)
          `)
          .eq('user_id', targetUserId)
          .single()
        
        if (profileError) throw profileError
        if (!profileData) return
        
        // Fetch campus
        if (profileData.campus_id) {
          const { data: campusData, error: campusError } = await supabase
            .from('campuses')
            .select('*')
            .eq('id', profileData.campus_id)
            .single()
          
          if (!campusError && campusData) {
            setCampus(campusData)
          }
        }
        
        // Fetch department
        if (profileData.department_id) {
          const { data: departmentData, error: departmentError } = await supabase
            .from('departments')
            .select('*')
            .eq('id', profileData.department_id)
            .single()
          
          if (!departmentError && departmentData) {
            setDepartment(departmentData)
          }
        }
        
        // Fetch program
        if (profileData.program_id) {
          const { data: programData, error: programError } = await supabase
            .from('programs')
            .select('*')
            .eq('id', profileData.program_id)
            .single()
          
          if (!programError && programData) {
            setProgram(programData)
          }
        }
        
        // Calculate stats
        const { count: postsCount } = await supabase
          .from('community_posts_enhanced')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', targetUserId)
        
        const { count: commentsCount } = await supabase
          .from('post_comments_enhanced')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', targetUserId)
        
        const { count: likesGivenCount } = await supabase
          .from('post_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', targetUserId)
        
        // Count likes received on user's posts
        let likesReceivedCount = 0;
        const { data: userPosts } = await supabase
          .from('community_posts_enhanced')
          .select('id')
          .eq('user_id', targetUserId)
        
        if (userPosts && userPosts.length > 0) {
          const postIds = userPosts.map(post => post.id);
          const { count } = await supabase
            .from('post_reactions')
            .select('*', { count: 'exact', head: true })
            .in('post_id', postIds)
          likesReceivedCount = count || 0;
        }
        
        setProfile({
          ...profileData,
          posts_count: postsCount || 0,
          comments_count: commentsCount || 0,
          likes_given: likesGivenCount || 0,
          likes_received: likesReceivedCount || 0
        })
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfile()
  }, [userId, user?.id])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <User className="h-12 w-12 mx-auto text-slate-700 dark:text-slate-300 mb-4" />
          <h3 className="font-medium">Profile not found</h3>
          <p className="text-sm text-muted-foreground">This user profile doesn't exist or is private</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {profile.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              
              {/* Level Badge */}
              <div className="mt-3 flex items-center gap-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Level {profile.level || 1}
                </div>
                <div className="text-xs text-muted-foreground">
                  {profile.experience || 0}/{profile.next_level_exp || 100} XP
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{profile.full_name}</h2>
                  <p className="text-muted-foreground">{profile.bio || "No bio available"}</p>
                </div>
                
                {isOwnProfile && (
                  <Button>Edit Profile</Button>
                )}
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {profile.location || campus?.location || "Not specified"}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {campus?.name || "Not specified"}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {department?.name || program?.name || "Not specified"}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Joined {new Date(profile.join_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats and Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Posts</span>
              </div>
              <span className="font-medium">{profile.posts_count}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Comments</span>
              </div>
              <span className="font-medium">{profile.comments_count}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Likes Given</span>
              </div>
              <span className="font-medium">{profile.likes_given}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Likes Received</span>
              </div>
              <span className="font-medium">{profile.likes_received}</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Achievements */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements
            </CardTitle>
            <CardDescription>
              Badges and accomplishments earned in the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profile.achievements && profile.achievements.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {profile.achievements.slice(0, 8).map((achievement: any) => (
                  <div 
                    key={achievement.id} 
                    className="flex flex-col items-center p-3 bg-slate-100 dark:bg-slate-900 rounded-lg border"
                  >
                    <div className="bg-primary/10 p-2 rounded-full mb-2">
                      {achievement.type === 'top_contributor' && <Crown className="h-5 w-5 text-yellow-500" />}
                      {achievement.type === 'rising_star' && <Star className="h-5 w-5 text-blue-500" />}
                      {achievement.type === 'community_leader' && <Users className="h-5 w-5 text-green-500" />}
                      {achievement.type === 'engagement_master' && <Flame className="h-5 w-5 text-red-500" />}
                    </div>
                    <h4 className="text-xs font-medium text-center">{achievement.name}</h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 text-center mt-1">
                      {new Date(achievement.earned_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-700 dark:text-slate-300 text-center py-4">
                No achievements yet. Participate in the community to earn badges!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest posts and comments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-700 dark:text-slate-300 text-center py-8">
            Activity feed would be displayed here
          </div>
        </CardContent>
      </Card>
    </div>
  )
}