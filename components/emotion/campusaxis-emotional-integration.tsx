"use client"

import { useEmotion } from "@/contexts/emotion-context"
import { useStudyCompanionFeedback, useMotivationBooster, useCalmMode } from "@/hooks/use-emotion-detection"
import { useAnimation } from "@/contexts/animation-context"
import { useEffect, useState } from "react"

// Integration with Past Papers module
export function PastPapersEmotionalIntegration({ 
  userId,
  onPaperView,
  onPaperComplete
}: { 
  userId: string,
  onPaperView: () => void,
  onPaperComplete: () => void
}) {
  const { emotionState, updateEmotionState } = useEmotion()
  const { onStudyAction } = useStudyCompanionFeedback()
  const { triggerAnimation } = useAnimation()
  const [papersCompleted, setPapersCompleted] = useState(0)

  // Initialize papers completed count
  useEffect(() => {
    const count = parseInt(localStorage.getItem(`papers_completed_${userId}`) || "0")
    setPapersCompleted(count)
  }, [userId])

  const handleViewPaper = () => {
    onPaperView()
    
    // Check for late night studying
    const hour = new Date().getHours()
    if (hour >= 22 || hour <= 6) {
      triggerAnimation({
        type: 'motivationalText',
        message: "It's late! Consider taking a break and resting 🌙",
        duration: 4000,
      })
    }
    
    // Update emotion state to focused
    updateEmotionState({ focusLevel: 'high', mood: 'focused' })
  }

  const handleCompletePaper = () => {
    onPaperComplete()
    onStudyAction('success')
    
    // Update papers completed count
    const newCount = papersCompleted + 1
    setPapersCompleted(newCount)
    localStorage.setItem(`papers_completed_${userId}`, newCount.toString())
    
    // Trigger celebration for milestones
    if (newCount > 0 && newCount % 3 === 0) {
      onStudyAction('streak')
      triggerAnimation({
        type: 'confetti',
        message: `You've reviewed ${newCount} papers today! Keep going 🌟`,
        duration: 5000,
      })
    }
  }

  return (
    <div className="space-y-3">
      <button 
        onClick={handleViewPaper}
        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors"
      >
        View Past Paper
      </button>
      <button 
        onClick={handleCompletePaper}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
      >
        Mark as Completed
      </button>
      
      {papersCompleted > 0 && (
        <div className="text-center text-sm text-gray-600 mt-2">
          Papers completed today: {papersCompleted}
        </div>
      )}
    </div>
  )
}

// Integration with Community/Events module
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
    <div className="flex flex-col sm:flex-row gap-2">
      <button 
        onClick={handleContribute}
        className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors"
      >
        Share Resource
      </button>
      <button 
        onClick={handleHelpOthers}
        className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg transition-colors"
      >
        Help Classmate
      </button>
    </div>
  )
}

// Integration with Leaderboard module
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
        message: `Wow! You've jumped ${previousRank - currentRank} places! 🚀`,
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

// Integration with Profile Dashboard
export function ProfileDashboardEmotionalIntegration({ userId }: { userId: string }) {
  const { emotionState, updateEmotionState } = useEmotion()
  const { triggerAnimation } = useAnimation()
  
  // Load user's mood history and provide personalized encouragement
  useEffect(() => {
    const moodHistory = localStorage.getItem(`mood_history_${userId}`)
    if (moodHistory) {
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
      <h3 className="font-medium mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        How are you feeling today?
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {['happy', 'calm', 'neutral', 'stressed', 'sad'].map((mood) => (
          <button
            key={mood}
            onClick={() => logMood(mood)}
            className={`py-2 rounded-lg text-sm capitalize transition-colors ${
              emotionState.mood === mood
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {mood}
          </button>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t text-sm text-gray-600">
        <p>Current mood: <span className="font-medium capitalize">{emotionState.mood}</span></p>
        <p>Stress level: <span className="font-medium capitalize">{emotionState.stressLevel}</span></p>
      </div>
    </div>
  )
}

// Integration with Daily Goals/Study Tracker
export function StudyTrackerEmotionalIntegration({ 
  studyHours,
  goalHours
}: { 
  studyHours: number,
  goalHours: number
}) {
  const { emotionState, updateEmotionState } = useEmotion()
  const { triggerAnimation } = useAnimation()
  const { boostMotivation } = useMotivationBooster()
  
  // Detect overworking
  useEffect(() => {
    if (studyHours > 3 && emotionState.stressLevel !== 'high') {
      updateEmotionState({ stressLevel: 'high', mood: 'tired' })
      
      triggerAnimation({
        type: 'motivationalText',
        message: "You've been studying for a while. Time for a break! ☕",
        duration: 4000,
      })
    }
    
    // Celebrate goal achievement
    if (studyHours >= goalHours && goalHours > 0) {
      boostMotivation("Great job reaching your study goal! 🎯")
    }
  }, [studyHours, goalHours, emotionState, updateEmotionState, triggerAnimation, boostMotivation])

  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="font-medium mb-2">Study Tracker</h3>
      <div className="flex justify-between text-sm">
        <span>Today: {studyHours}h</span>
        <span>Goal: {goalHours}h</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div 
          className="bg-indigo-500 h-2 rounded-full" 
          style={{ width: `${Math.min(100, (studyHours / goalHours) * 100)}%` }}
        ></div>
      </div>
      
      {studyHours > 3 && (
        <div className="mt-3 text-xs text-orange-600 bg-orange-50 p-2 rounded">
          💡 You've been studying for a while. Consider taking a break to recharge!
        </div>
      )}
    </div>
  )
}