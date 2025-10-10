"use client"

import { useEmotion } from "@/contexts/emotion-context"
import { useStudyCompanionFeedback } from "@/hooks/use-emotion-detection"
import { useAnimation } from "@/contexts/animation-context"
import { useEffect } from "react"

// Example integration with Past Papers module
export function PastPapersEmotionalIntegration({ 
  onViewPaper, 
  onPaperCompleted,
  userId 
}: { 
  onViewPaper: () => void, 
  onPaperCompleted: () => void,
  userId: string 
}) {
  const { emotionState, updateEmotionState } = useEmotion()
  const { onStudyAction } = useStudyCompanionFeedback()
  const { triggerAnimation } = useAnimation()

  // Track when user views a past paper
  const handleViewPaper = () => {
    onViewPaper()
    
    // If it's late night, suggest a break
    const hour = new Date().getHours()
    if (hour >= 22 || hour <= 6) {
      updateEmotionState({ mood: 'tired' })
      triggerAnimation({
        type: 'motivationalText',
        message: "It's late! Consider taking a break and resting 🌙",
        duration: 4000,
      })
    }
  }

  // Track when user completes a paper
  const handlePaperCompleted = () => {
    onPaperCompleted()
    onStudyAction('success')
    
    // Trigger celebration if completed multiple papers
    const completedPapers = parseInt(localStorage.getItem(`papers_completed_${userId}`) || "0")
    if (completedPapers > 0 && (completedPapers + 1) % 3 === 0) {
      triggerAnimation({
        type: 'confetti',
        message: "You've reviewed 3 papers today! Keep going 🌟",
        duration: 5000,
      })
    }
    
    // Update completed papers count
    localStorage.setItem(`papers_completed_${userId}`, (completedPapers + 1).toString())
  }

  return (
    <div className="space-y-2">
      <button 
        onClick={handleViewPaper}
        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded"
      >
        View Past Paper
      </button>
      <button 
        onClick={handlePaperCompleted}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
      >
        Mark as Completed
      </button>
    </div>
  )
}

// Example integration with Community/Events module
export function CommunityEmotionalIntegration({ 
  onContribute, 
  onHelpOthers 
}: { 
  onContribute: () => void, 
  onHelpOthers: () => void 
}) {
  const { triggerAnimation } = useAnimation()
  const { onStudyAction } = useStudyCompanionFeedback()

  const handleContribute = () => {
    onContribute()
    onStudyAction('success')
    
    triggerAnimation({
      type: 'thankYou',
      message: "That's teamwork in action 👏",
      duration: 4000,
    })
  }

  const handleHelpOthers = () => {
    onHelpOthers()
    onStudyAction('streak')
    
    triggerAnimation({
      type: 'handClap',
      message: "Your help makes a difference! 💚",
      duration: 4000,
    })
  }

  return (
    <div className="space-y-2">
      <button 
        onClick={handleContribute}
        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded"
      >
        Contribute Resource
      </button>
      <button 
        onClick={handleHelpOthers}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded"
      >
        Help Another Student
      </button>
    </div>
  )
}

// Example integration with Leaderboard module
export function LeaderboardEmotionalIntegration({ 
  currentRank, 
  previousRank 
}: { 
  currentRank: number, 
  previousRank: number 
}) {
  const { triggerAnimation } = useAnimation()
  
  useEffect(() => {
    // If ranking improved significantly
    if (previousRank > currentRank && previousRank - currentRank > 5) {
      triggerAnimation({
        type: 'fireworks',
        message: "Wow! You've jumped ${previousRank - currentRank} places! 🚀",
        duration: 5000,
      })
    } 
    // If ranking improved
    else if (previousRank > currentRank) {
      triggerAnimation({
        type: 'successGlow',
        message: "Moving on up! Your rank improved 💪",
        duration: 3000,
      })
    }
  }, [currentRank, previousRank, triggerAnimation])

  return null // This component only triggers animations
}

// Example integration with Profile Dashboard
export function ProfileDashboardEmotionalIntegration({ userId }: { userId: string }) {
  const { emotionState, updateEmotionState } = useEmotion()
  const { triggerAnimation } = useAnimation()
  
  // Load user's mood history
  useEffect(() => {
    const moodHistory = localStorage.getItem(`mood_history_${userId}`)
    if (moodHistory) {
      // Could show personalized encouragement based on mood patterns
      const moods = JSON.parse(moodHistory)
      const recentMoods = moods.slice(-5)
      
      // If user has been stressed recently
      if (recentMoods.filter((m: string) => m === 'stressed' || m === 'sad').length > 3) {
        triggerAnimation({
          type: 'motivationalText',
          message: "We've noticed you've been working hard. Remember to take breaks! 🌱",
          duration: 5000,
        })
      }
    }
  }, [userId, triggerAnimation])

  const logMood = (mood: string) => {
    updateEmotionState({ mood: mood as any })
    
    // Save to mood history
    const moodHistory = JSON.parse(localStorage.getItem(`mood_history_${userId}`) || "[]")
    moodHistory.push({
      mood,
      timestamp: new Date().toISOString()
    })
    localStorage.setItem(`mood_history_${userId}`, JSON.stringify(moodHistory.slice(-30))) // Keep last 30 entries
    
    triggerAnimation({
      type: 'successGlow',
      message: "Thanks for sharing how you feel! 💖",
      duration: 3000,
    })
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="font-medium mb-3">How are you feeling today?</h3>
      <div className="grid grid-cols-5 gap-2">
        {['happy', 'calm', 'neutral', 'stressed', 'sad'].map((mood) => (
          <button
            key={mood}
            onClick={() => logMood(mood)}
            className={`py-2 rounded text-sm capitalize ${
              emotionState.mood === mood
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  )
}