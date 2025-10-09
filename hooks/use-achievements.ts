import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  points: number
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  category: 'participation' | 'contribution' | 'exploration' | 'milestone' | 'special'
  createdAt: string
}

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  createdAt: string
  achievement: Achievement
}

export interface LeaderboardEntry {
  userId: string
  userName: string
  userAvatar: string
  totalPoints: number
  rank: number
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true)
        
        // Fetch all achievements
        const { data: achievementsData, error: achievementsError } = await supabase
          .from('achievements')
          .select('*')
          .order('points', { ascending: false })

        if (achievementsError) throw achievementsError

        setAchievements(achievementsData || [])

        // Fetch user achievements
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: userAchievementsData, error: userAchievementsError } = await supabase
            .from('user_achievements')
            .select(`
              *,
              achievement:achievements (*)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (userAchievementsError) throw userAchievementsError

          setUserAchievements(userAchievementsData || [])
        }

        // Fetch leaderboard
        const { data: leaderboardData, error: leaderboardError } = await supabase
          .from('leaderboard')
          .select('*')
          .order('total_points', { ascending: false })
          .limit(50)

        if (leaderboardError) throw leaderboardError

        setLeaderboard(leaderboardData || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch achievements')
      } finally {
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [])

  const unlockAchievement = async (achievementId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Check if user already has this achievement
      const existing = userAchievements.find(
        ua => ua.userId === user.id && ua.achievementId === achievementId
      )
      
      if (existing) {
        return existing
      }

      // Unlock the achievement
      const { data, error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievementId,
        })
        .select(`
          *,
          achievement:achievements (*)
        `)
        .single()

      if (error) throw error

      // Add to user achievements
      const newUserAchievement = data as UserAchievement
      setUserAchievements(prev => [newUserAchievement, ...prev])

      return newUserAchievement
    } catch (err) {
      console.error('Error unlocking achievement:', err)
      throw err
    }
  }

  const getAchievementProgress = (userId: string) => {
    // This would calculate progress toward achievements
    // For now, we'll return a mock implementation
    return {
      posts: 0,
      comments: 0,
      likes: 0,
      groups: 0,
      events: 0,
    }
  }

  const getTotalPoints = () => {
    return userAchievements.reduce((total, ua) => total + (ua.achievement?.points || 0), 0)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-500'
      case 'uncommon': return 'text-green-500'
      case 'rare': return 'text-blue-500'
      case 'epic': return 'text-purple-500'
      case 'legendary': return 'text-yellow-500'
      default: return 'text-gray-500'
    }
  }

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 dark:bg-gray-800'
      case 'uncommon': return 'bg-green-100 dark:bg-green-900/20'
      case 'rare': return 'bg-blue-100 dark:bg-blue-900/20'
      case 'epic': return 'bg-purple-100 dark:bg-purple-900/20'
      case 'legendary': return 'bg-yellow-100 dark:bg-yellow-900/20'
      default: return 'bg-gray-100 dark:bg-gray-800'
    }
  }

  return {
    achievements,
    userAchievements,
    leaderboard,
    loading,
    error,
    unlockAchievement,
    getAchievementProgress,
    getTotalPoints,
    getRarityColor,
    getRarityBg,
  }
}