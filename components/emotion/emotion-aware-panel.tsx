"use client"

import { ReactNode, useEffect } from "react"
import { useEmotion } from "@/contexts/emotion-context"
import { motion } from "framer-motion"
import { 
  Heart, 
  Brain, 
  Zap, 
  Moon, 
  Sun, 
  Coffee, 
  Wind, 
  Sparkles,
  Smile,
  Frown,
  Meh,
  Target,
  Trophy,
  Flame
} from "lucide-react"

interface EmotionAwarePanelProps {
  children: ReactNode
  title?: string
  className?: string
}

export function EmotionAwarePanel({ children, title, className = "" }: EmotionAwarePanelProps) {
  const { emotionState } = useEmotion()

  // Get styling based on current emotion state
  const getEmotionStyling = () => {
    switch (emotionState.mood) {
      case 'happy':
        return {
          background: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
          border: "border-yellow-200 dark:border-yellow-700/50",
          text: "text-yellow-800 dark:text-yellow-200",
          icon: <Smile className="h-5 w-5 text-yellow-500" />,
          animation: { scale: 1.02 }
        }
      case 'sad':
        return {
          background: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
          border: "border-blue-200 dark:border-blue-700/50",
          text: "text-blue-800 dark:text-blue-200",
          icon: <Frown className="h-5 w-5 text-blue-500" />,
          animation: { scale: 1 }
        }
      case 'stressed':
        return {
          background: "bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20",
          border: "border-red-200 dark:border-red-700/50",
          text: "text-red-800 dark:text-red-200",
          icon: <Flame className="h-5 w-5 text-red-500" />,
          animation: { scale: 1 }
        }
      case 'focused':
        return {
          background: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
          border: "border-green-200 dark:border-green-700/50",
          text: "text-green-800 dark:text-green-200",
          icon: <Target className="h-5 w-5 text-green-500" />,
          animation: { scale: 1.01 }
        }
      case 'excited':
        return {
          background: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
          border: "border-purple-200 dark:border-purple-700/50",
          text: "text-purple-800 dark:text-purple-200",
          icon: <Zap className="h-5 w-5 text-purple-500" />,
          animation: { scale: 1.03 }
        }
      default:
        return {
          background: "bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20",
          border: "border-gray-200 dark:border-gray-700/50",
          text: "text-gray-800 dark:text-gray-200",
          icon: <Meh className="h-5 w-5 text-gray-500" />,
          animation: { scale: 1 }
        }
    }
  }

  const emotionStyle = getEmotionStyling()

  // Get motivational message based on emotion state
  const getMotivationalMessage = () => {
    switch (emotionState.mood) {
      case 'happy':
        return "Great energy! Keep up the excellent work."
      case 'sad':
        return "It's okay to feel down. You're doing better than you think."
      case 'stressed':
        return "You've got this, one step at a time."
      case 'focused':
        return "Your concentration is impressive. Keep going!"
      case 'excited':
        return "That enthusiasm is contagious! Channel it into your studies."
      default:
        return "Stay positive and keep learning."
    }
  }

  return (
    <motion.div
      className={`rounded-2xl border ${emotionStyle.background} ${emotionStyle.border} ${className} transition-all duration-500`}
      animate={emotionStyle.animation}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="p-6">
        {title && (
          <div className="flex items-center gap-3 mb-4">
            {emotionStyle.icon}
            <h3 className={`text-xl font-bold ${emotionStyle.text}`}>
              {title}
            </h3>
          </div>
        )}
        
        <div className="mb-4">
          {children}
        </div>
        
        <div className={`text-sm ${emotionStyle.text} flex items-center gap-2`}>
          <Sparkles className="h-4 w-4" />
          <span>{getMotivationalMessage()}</span>
        </div>
      </div>
    </motion.div>
  )
}