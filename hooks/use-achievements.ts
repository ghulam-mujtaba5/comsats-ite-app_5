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
        
        // Fetch all achievements via API
        const achievementsRes = await fetch('/api/gamification/achievements')
        const achievementsJson = await achievementsRes.json()
        
        if (!achievementsRes.ok) throw new Error(achievementsJson.error || 'Failed to fetch achievements')
        
        setAchievements(achievementsJson.achievements || [])

        // Fetch user achievements via API
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const userAchievementsRes = await fetch('/api/gamification/unlock')
          const userAchievementsJson = await userAchievementsRes.json()
          
          if (userAchievementsRes.ok) {
            setUserAchievements(userAchievementsJson.achievements || [])
          }
        }

        // Fetch leaderboard via API
        const leaderboardRes = await fetch('/api/gamification/leaderboard?limit=50')
        const leaderboardJson = await leaderboardRes.json()
        
        if (leaderboardRes.ok) {
          setLeaderboard(leaderboardJson.leaderboard || [])
        }
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

      // Unlock the achievement via API
      const response = await fetch('/api/gamification/unlock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          achievement_id: achievementId,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to unlock achievement')
      }

      // Add to user achievements
      const newUserAchievement = result.achievement as UserAchievement
      setUserAchievements(prev => [newUserAchievement, ...prev])

      return newUserAchievement
    } catch (err) {
      console.error('Error unlocking achievement:', err)
      throw err
    }
  }

  const getAchievementProgress = async (userId: string) => {
    try {
      const response = await fetch('/api/gamification/progress')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch progress')
      }
      
      return result.progress?.stats || {
        posts: 0,
        comments: 0,
        likes: 0,
        groups: 0,
        events: 0,
      }
    } catch (err) {
      console.error('Error fetching achievement progress:', err)
      return {
        posts: 0,
        comments: 0,
        likes: 0,
        groups: 0,
        events: 0,
      }
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