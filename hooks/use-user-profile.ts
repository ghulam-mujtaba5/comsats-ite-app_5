import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface UserProfile {
  id: string
  email: string
  fullName: string
  avatarUrl: string
  bio: string
  campusId?: string
  departmentId?: string
  programId?: string
  semester?: number
  batch?: string
  joinDate: string
  isOnline: boolean
  lastSeen: string
  followers: number
  following: number
  posts: number
  comments: number
  likes: number
  achievements: number
  level: number
  totalPoints: number
}

export interface UserActivity {
  id: string
  type: 'post' | 'comment' | 'like' | 'follow' | 'achievement' | 'group_join' | 'event_attend'
  content: string
  createdAt: string
  relatedId?: string
  relatedType?: 'post' | 'comment' | 'group' | 'event' | 'achievement'
}

export interface UserPost {
  id: string
  content: string
  createdAt: string
  likes: number
  comments: number
  tags: string[]
  type: string
  media?: string[]
}

export function useUserProfile(userId?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [posts, setPosts] = useState<UserPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        
        // If no userId provided, get current user
        const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id
        
        if (!targetUserId) {
          throw new Error('No user ID provided')
        }

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select(`
            *,
            campus:campuses(name),
            department:departments(name),
            program:programs(name, code)
          `)
          .eq('id', targetUserId)
          .single()

        if (profileError) throw profileError

        // Transform profile data
        const userProfile: UserProfile = {
          id: profileData.id,
          email: profileData.email,
          fullName: profileData.full_name || profileData.email?.split('@')[0] || 'Anonymous',
          avatarUrl: profileData.avatar_url || '/student-avatar.png',
          bio: profileData.bio || '',
          campusId: profileData.campus_id,
          departmentId: profileData.department_id,
          programId: profileData.program_id,
          semester: profileData.semester,
          batch: profileData.batch,
          joinDate: profileData.created_at,
          isOnline: profileData.is_online || false,
          lastSeen: profileData.last_seen || profileData.updated_at,
          followers: profileData.followers_count || 0,
          following: profileData.following_count || 0,
          posts: profileData.posts_count || 0,
          comments: profileData.comments_count || 0,
          likes: profileData.likes_count || 0,
          achievements: profileData.achievements_count || 0,
          level: profileData.level || 1,
          totalPoints: profileData.total_points || 0
        }

        setProfile(userProfile)

        // Fetch user activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', targetUserId)
          .order('created_at', { ascending: false })
          .limit(20)

        if (activitiesError) throw activitiesError

        setActivities(activitiesData || [])

        // Fetch user posts
        const { data: postsData, error: postsError } = await supabase
          .from('community_posts')
          .select('*')
          .eq('user_id', targetUserId)
          .order('created_at', { ascending: false })
          .limit(10)

        if (postsError) throw postsError

        const userPosts: UserPost[] = (postsData || []).map((post: any) => ({
          id: post.id,
          content: post.content,
          createdAt: post.created_at,
          likes: post.likes || 0,
          comments: post.comments_count || 0,
          tags: Array.isArray(post.tags) ? post.tags : [],
          type: post.type || 'general',
          media: Array.isArray(post.media) ? post.media : undefined
        }))

        setPosts(userPosts)

        // Check if current user is following this user
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (currentUser && currentUser.id !== targetUserId) {
          const { data: followData } = await supabase
            .from('follows')
            .select('id')
            .eq('follower_id', currentUser.id)
            .eq('following_id', targetUserId)
            .maybeSingle()

          setIsFollowing(!!followData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user profile')
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [userId])

  const followUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')
      if (!profile) throw new Error('No profile loaded')

      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', profile.id)

        if (error) throw error

        setIsFollowing(false)
        setProfile(prev => prev ? { 
          ...prev, 
          followers: Math.max(0, prev.followers - 1) 
        } : null)
      } else {
        // Follow
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: profile.id
          })

        if (error) throw error

        setIsFollowing(true)
        setProfile(prev => prev ? { 
          ...prev, 
          followers: prev.followers + 1 
        } : null)
      }
    } catch (err) {
      console.error('Error following user:', err)
      throw err
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('users')
        .update({
          full_name: updates.fullName,
          bio: updates.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      setProfile(prev => prev ? { ...prev, ...updates } : null)
    } catch (err) {
      console.error('Error updating profile:', err)
      throw err
    }
  }

  const updateAvatar = async (file: File) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Upload avatar to storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/avatar.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('users')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      setProfile(prev => prev ? { ...prev, avatarUrl: publicUrl } : null)
    } catch (err) {
      console.error('Error updating avatar:', err)
      throw err
    }
  }

  return {
    profile,
    activities,
    posts,
    loading,
    error,
    isFollowing,
    followUser,
    updateProfile,
    updateAvatar
  }
}