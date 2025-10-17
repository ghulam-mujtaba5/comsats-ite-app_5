"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useEmotion } from "@/contexts/emotion-context"
import { 
  Smile, 
  Frown, 
  Heart, 
  Zap, 
  Coffee, 
  Moon, 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow,
  Wind,
  Sparkles,
  Star,
  Music,
  BookOpen,
  Dumbbell,
  Palette,
  Gamepad2,
  Target
} from "lucide-react"

// Define emotional states and responses
type EmotionalState = 
  | 'happy'
  | 'sad'
  | 'stressed'
  | 'calm'
  | 'focused'
  | 'distracted'
  | 'tired'
  | 'energized'
  | 'anxious'
  | 'excited'

interface EmotionalResponse {
  state: EmotionalState
  message: string
  icon: React.ElementType
  color: string
  backgroundColor: string
  suggestions: string[]
  activities: {
    title: string
    icon: React.ElementType
    description: string
  }[]
}

export function EmotionalResponseSystem() {
  const { emotionState, updateEmotionState } = useEmotion()
  const [isVisible, setIsVisible] = useState(false)
  const [currentResponse, setCurrentResponse] = useState<EmotionalResponse | null>(null)
  // Track the last emotion state that triggered a notification
  const [lastNotifiedEmotion, setLastNotifiedEmotion] = useState<string | null>(null)

  // Define emotional responses
  const emotionalResponses: EmotionalResponse[] = [
    {
      state: 'happy',
      message: 'Feeling great today!',
      icon: Smile,
      color: 'text-yellow-500',
      backgroundColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      suggestions: [
        'Share your energy',
        'Help a classmate',
        'Celebrate achievements'
      ],
      activities: [
        {
          title: 'Spread Joy',
          icon: Heart,
          description: 'Send a kind message'
        },
        {
          title: 'Creative Outlet',
          icon: Palette,
          description: 'Express yourself'
        },
        {
          title: 'Socialize',
          icon: Gamepad2,
          description: 'Connect with friends'
        }
      ]
    },
    {
      state: 'sad',
      message: 'Feeling down? It\'s okay.',
      icon: Frown,
      color: 'text-blue-500',
      backgroundColor: 'bg-blue-50 dark:bg-blue-900/20',
      suggestions: [
        'Take a break',
        'Reach out',
        'Be kind to yourself'
      ],
      activities: [
        {
          title: 'Listen',
          icon: Music,
          description: 'Uplifting songs'
        },
        {
          title: 'Write',
          icon: BookOpen,
          description: 'Journal thoughts'
        }
      ]
    },
    {
      state: 'stressed',
      message: 'Feeling overwhelmed?',
      icon: CloudRain,
      color: 'text-purple-500',
      backgroundColor: 'bg-purple-50 dark:bg-purple-900/20',
      suggestions: [
        'Take breaks',
        'Manage time',
        'Focus on priorities'
      ],
      activities: [
        {
          title: 'Relax',
          icon: Moon,
          description: 'Muscle relaxation'
        },
        {
          title: 'Walk',
          icon: Coffee,
          description: 'Fresh air'
        },
        {
          title: 'Organize',
          icon: BookOpen,
          description: 'Break tasks down'
        }
      ]
    },
    {
      state: 'calm',
      message: 'Peaceful state of mind.',
      icon: Cloud,
      color: 'text-green-500',
      backgroundColor: 'bg-green-50 dark:bg-green-900/20',
      suggestions: [
        'Deep focus work',
        'Practice gratitude',
        'Mindful activities'
      ],
      activities: [
        {
          title: 'Meditate',
          icon: Moon,
          description: 'Quiet reflection'
        },
        {
          title: 'Read',
          icon: BookOpen,
          description: 'Inspiring book'
        },
        {
          title: 'Nature',
          icon: Sun,
          description: 'Time outdoors'
        }
      ]
    },
    {
      state: 'focused',
      message: 'Sharp concentration!',
      icon: Target,
      color: 'text-indigo-500',
      backgroundColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      suggestions: [
        'Tackle challenges',
        'Minimize distractions',
        'Use productive state'
      ],
      activities: [
        {
          title: 'Deep Work',
          icon: Zap,
          description: 'Complex problems'
        },
        {
          title: 'Practice',
          icon: Dumbbell,
          description: 'Difficult skill'
        },
        {
          title: 'Research',
          icon: BookOpen,
          description: 'Detailed research'
        }
      ]
    },
    {
      state: 'tired',
      message: 'Need some rest.',
      icon: Moon,
      color: 'text-gray-500',
      backgroundColor: 'bg-gray-50 dark:bg-gray-900/20',
      suggestions: [
        'Take a nap',
        'Stay hydrated',
        'Reschedule tasks'
      ],
      activities: [
        {
          title: 'Power Nap',
          icon: Moon,
          description: '20-minute rest'
        },
        {
          title: 'Hydrate',
          icon: Coffee,
          description: 'Drink water'
        },
        {
          title: 'Stretch',
          icon: Wind,
          description: 'Gentle movement'
        }
      ]
    },
    {
      state: 'energized',
      message: 'Buzzing with energy!',
      icon: Zap,
      color: 'text-orange-500',
      backgroundColor: 'bg-orange-50 dark:bg-orange-900/20',
      suggestions: [
        'Physical activity',
        'Tackle tasks',
        'Share energy'
      ],
      activities: [
        {
          title: 'Exercise',
          icon: Dumbbell,
          description: 'Sports activity'
        },
        {
          title: 'Create',
          icon: Palette,
          description: 'Creative project'
        },
        {
          title: 'Connect',
          icon: Gamepad2,
          description: 'Social engagement'
        }
      ]
    }
  ]

  // Update response when emotion state changes
  useEffect(() => {
    // Only show notification if this is a new emotion state we haven't notified about yet
    if (emotionState.mood !== lastNotifiedEmotion) {
      const response = emotionalResponses.find(r => r.state === emotionState.mood)
      if (response) {
        setCurrentResponse(response)
        setIsVisible(true)
        setLastNotifiedEmotion(emotionState.mood)
        
        // Auto-hide after 8 seconds
        const timer = setTimeout(() => {
          setIsVisible(false)
        }, 8000)
        
        return () => clearTimeout(timer)
      }
    }
  }, [emotionState.mood, emotionalResponses, lastNotifiedEmotion])

  if (!isVisible || !currentResponse) return null

  const IconComponent = currentResponse.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 300, scale: 0.9 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="fixed bottom-4 right-4 z-50 max-w-xs w-full"
      >
        <div className={`${currentResponse.backgroundColor} rounded-2xl p-5 shadow-2xl border border-white/30 backdrop-blur-xl glass-card`}>
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 p-2.5 rounded-full ${currentResponse.backgroundColor.replace('bg-', 'bg-').replace('50', '200').replace('900/20', '800/30')}`}>
              <IconComponent className={`w-5 h-5 ${currentResponse.color}`} />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                Emotional Check-in
              </h3>
              
              <p className="text-gray-700 dark:text-gray-300 text-xs mb-3">
                {currentResponse.message}
              </p>
              
              <div className="mb-3">
                <div className="flex flex-wrap gap-1 mb-2">
                  {currentResponse.suggestions.map((suggestion, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-white/50 dark:bg-white/20 text-gray-700 dark:text-gray-300"
                    >
                      <Sparkles className="w-3 h-3 text-yellow-500" />
                      {suggestion}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="grid grid-cols-3 gap-1.5">
                  {currentResponse.activities.map((activity, index) => {
                    const ActivityIcon = activity.icon
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          // In a real implementation, this would trigger the activity
                          console.log('Activity selected:', activity.title)
                          setIsVisible(false)
                        }}
                        className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 transition-all duration-200"
                      >
                        <ActivityIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        <span className="text-[10px] text-gray-700 dark:text-gray-300 text-center leading-tight">
                          {activity.title}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
              
              <div className="flex justify-end mt-3">
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-[10px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Hook for triggering emotional responses
export function useEmotionalResponses() {
  const { emotionState, updateEmotionState } = useEmotion()
  
  const triggerEmotionalResponse = (state: EmotionalState) => {
    // Map EmotionalState to MoodType
    let moodType: import("@/contexts/emotion-context").MoodType;
    switch (state) {
      case 'happy':
        moodType = 'happy';
        break;
      case 'sad':
        moodType = 'sad';
        break;
      case 'stressed':
      case 'anxious':
        moodType = 'stressed';
        break;
      case 'calm':
        moodType = 'calm';
        break;
      case 'focused':
        moodType = 'focused';
        break;
      case 'distracted':
        moodType = 'distracted';
        break;
      case 'tired':
        moodType = 'tired';
        break;
      case 'energized':
        moodType = 'energized';
        break;
      case 'excited':
        moodType = 'excited';
        break;
      default:
        moodType = 'neutral';
    }
    
    updateEmotionState({
      mood: moodType
    })
  }
  
  const detectAndRespondToEmotion = () => {
    // This would be called periodically to check emotional state
    // and trigger appropriate responses
    console.log('Checking emotional state...')
  }
  
  return {
    triggerEmotionalResponse,
    detectAndRespondToEmotion,
    currentEmotion: emotionState.mood
  }
}