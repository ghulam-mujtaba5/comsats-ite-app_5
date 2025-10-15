import { createClient } from '@supabase/supabase-js'

/**
 * Check user stats against achievement criteria and unlock achievements automatically
 * @param supabase Supabase client instance
 * @param userId User ID to check achievements for
 * @returns Array of unlocked achievements
 */
export async function checkAndUnlockAchievements(supabase: any, userId: string): Promise<any[]> {
  try {
    // Get user stats
    const { data: userStats, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (statsError || !userStats) {
      console.error('Error fetching user stats for userId:', userId, statsError)
      return []
    }

    // Get all active achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)

    if (achievementsError) {
      console.error('Error fetching achievements:', achievementsError)
      return []
    }

    // Get user's already unlocked achievements
    const { data: userAchievements, error: userAchievementsError } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId)

    if (userAchievementsError) {
      console.error('Error fetching user achievements for userId:', userId, userAchievementsError)
      return []
    }

    const unlockedAchievements: any[] = []
    const alreadyUnlockedIds = userAchievements?.map((ua: any) => ua.achievement_id) || []

    // Check each achievement
    for (const achievement of achievements) {
      // Skip if already unlocked
      if (alreadyUnlockedIds.includes(achievement.id)) {
        continue
      }

      // Check if criteria are met
      if (checkAchievementCriteria(userStats, achievement.criteria)) {
        // Unlock the achievement
        const { data: unlocked, error: unlockError } = await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id,
          })
          .select(`
            *,
            achievement:achievements (*)
          `)
          .single()

        if (!unlockError && unlocked) {
          // Update total points
          const newTotalPoints = userStats.total_points + achievement.points
          const { error: pointsError } = await supabase
            .from('user_stats')
            .update({ 
              total_points: newTotalPoints
            })
            .eq('user_id', userId)

          if (pointsError) {
            console.error('Error updating total points for userId:', userId, pointsError)
          }

          unlockedAchievements.push(unlocked)
          
          // Log achievement unlock
          console.log(`Achievement unlocked for user ${userId}: ${achievement.title} (+${achievement.points} points)`);
          
          // Send achievement email notification (async - don't wait)
          try {
            fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'}/api/email/send`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'achievement',
                recipient_id: userId,
                data: {
                  achievement: {
                    title: achievement.title,
                    description: achievement.description,
                    icon: achievement.icon,
                    points: achievement.points,
                    total_points: newTotalPoints
                  }
                }
              })
            }).catch(err => console.log('Failed to send achievement email:', err))
          } catch (emailError) {
            console.log('Failed to send achievement email:', emailError)
          }
        } else {
          console.error('Error unlocking achievement for userId:', userId, unlockError)
        }
      }
    }

    if (unlockedAchievements.length > 0) {
      console.log(`Unlocked ${unlockedAchievements.length} achievements for user ${userId}`);
    }

    return unlockedAchievements
  } catch (error) {
    console.error('Error checking achievements for userId:', userId, error)
    return []
  }
}

/**
 * Check if user stats meet achievement criteria
 * @param userStats User stats object
 * @param criteria Achievement criteria JSON
 * @returns Boolean indicating if criteria are met
 */
function checkAchievementCriteria(userStats: any, criteria: any): boolean {
  if (!criteria) return false
  
  try {
    const parsedCriteria = typeof criteria === 'string' ? JSON.parse(criteria) : criteria
    
    // Check each criterion
    for (const [key, value] of Object.entries(parsedCriteria)) {
      const numericValue = Number(value);
      if (isNaN(numericValue)) continue;
      
      switch (key) {
        case 'posts':
          if (userStats.posts_count < numericValue) return false
          break
        case 'comments':
          if (userStats.comments_count < numericValue) return false
          break
        case 'likes_received':
          if (userStats.likes_received < numericValue) return false
          break
        case 'resources':
          if (userStats.resources_uploaded < numericValue) return false
          break
        case 'papers':
          if (userStats.papers_uploaded < numericValue) return false
          break
        case 'groups':
          if (userStats.groups_joined < numericValue) return false
          break
        case 'events':
          if (userStats.events_attended < numericValue) return false
          break
        case 'total_points':
          if (userStats.total_points < numericValue) return false
          break
        default:
          // Unknown criterion, skip
          break
      }
    }
    
    return true
  } catch (error) {
    console.error('Error parsing achievement criteria:', error)
    return false
  }
}