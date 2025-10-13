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
  Gamepad2
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
      message: 'You\'re feeling great today! Keep that positive energy going.',
      icon: Smile,
      color: 'text-yellow-500',
      backgroundColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      suggestions: [
        'Share your positive energy with others',
        'Try helping a classmate with their studies',
        'Celebrate your recent achievements'
      ],
      activities: [
        {
          title: 'Spread Joy',
          icon: Heart,
          description: 'Send a kind message to a friend'
        },
        {
          title: 'Creative Outlet',
          icon: Palette,
          description: 'Express yourself through art or writing'
        },
        {
          title: 'Social Connection',
          icon: Gamepad2,
          description: 'Connect with friends or community'
        }
      ]
    },
    {
      state: 'sad',
      message: 'We noticed you might be feeling down. Remember, it\'s okay to feel this way.',
      icon: Frown,
      color: 'text-blue-500',
      backgroundColor: 'bg-blue-50 dark:bg-blue-900/20',
      suggestions: [
        'Take a break and do something you enjoy',
        'Reach out to a friend or counselor',
        'Practice self-compassion and be kind to yourself'
      ],
      activities: [
        {
          title: 'Mindful Breathing',
          icon: Wind,
          description: 'Take 5 minutes for deep breathing'
        },
        {
          title: 'Listen to Music',
          icon: Music,
          description: 'Play your favorite uplifting songs'
        },
        {
          title: 'Journaling',
          icon: BookOpen,
          description: 'Write down your thoughts and feelings'
        }
      ]
    },
    {
      state: 'stressed',
      message: 'Feeling overwhelmed? Let\'s find ways to help you feel more balanced.',
      icon: CloudRain,
      color: 'text-purple-500',
      backgroundColor: 'bg-purple-50 dark:bg-purple-900/20',
      suggestions: [
        'Take regular breaks during study sessions',
        'Practice time management techniques',
        'Prioritize tasks and focus on what\'s most important'
      ],
      activities: [
        {
          title: 'Progressive Relaxation',
          icon: Moon,
          description: 'Tense and release muscle groups'
        },
        {
          title: 'Take a Walk',
          icon: Coffee,
          description: 'Get some fresh air and movement'
        },
        {
          title: 'Organize Tasks',
          icon: BookOpen,
          description: 'Break down large tasks into smaller steps'
        }
      ]
    },
    {
      state: 'calm',
      message: 'You\'re in a peaceful state of mind. This is a great time for reflection.',
      icon: Cloud,
      color: 'text-green-500',
      backgroundColor: 'bg-green-50 dark:bg-green-900/20',
      suggestions: [
        'Use this calm state for deep focus work',
        'Practice gratitude for the present moment',
        'Engage in mindful activities'
      ],
      activities: [
        {
          title: 'Meditation',
          icon: Moon,
          description: 'Spend time in quiet reflection'
        },
        {
          title: 'Reading',
          icon: BookOpen,
          description: 'Dive into an inspiring book'
        },
        {
          title: 'Nature Connection',
          icon: Sun,
          description: 'Spend time outdoors'
        }
      ]
    },
    {
      state: 'focused',
      message: 'Your concentration is sharp! This is the perfect time for intensive study.',
      icon: Target,
      color: 'text-indigo-500',
      backgroundColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      suggestions: [
        'Tackle your most challenging assignments now',
        'Minimize distractions to maintain this focus',
        'Take advantage of your productive state'
      ],
      activities: [
        {
          title: 'Deep Work Session',
          icon: Zap,
          description: 'Work on complex problems'
        },
        {
          title: 'Skill Practice',
          icon: Dumbbell,
          description: 'Practice a difficult skill'
        },
        {
          title: 'Research Project',
          icon: BookOpen,
          description: 'Dive into detailed research'
        }
      ]
    },
    {
      state: 'tired',
      message: 'Feeling fatigued? Your body and mind need some rest and rejuvenation.',
      icon: Moon,
      color: 'text-gray-500',
      backgroundColor: 'bg-gray-50 dark:bg-gray-900/20',
      suggestions: [
        'Take a short nap if possible',
        'Stay hydrated and have a healthy snack',
        'Consider rescheduling demanding tasks for later'
      ],
      activities: [
        {
          title: 'Power Nap',
          icon: Moon,
          description: '20-minute restorative nap'
        },
        {
          title: 'Hydration Break',
          icon: Coffee,
          description: 'Drink water and refresh yourself'
        },
        {
          title: 'Light Movement',
          icon: Wind,
          description: 'Gentle stretching or walking'
        }
      ]
    },
    {
      state: 'energized',
      message: 'You\'re buzzing with energy! Channel this into productive activities.',
      icon: Zap,
      color: 'text-orange-500',
      backgroundColor: 'bg-orange-50 dark:bg-orange-900/20',
      suggestions: [
        'Use this energy for physical activities',
        'Tackle tasks that require enthusiasm',
        'Share your energy with group projects'
      ],
      activities: [
        {
          title: 'Physical Activity',
          icon: Dumbbell,
          description: 'Exercise or sports'
        },
        {
          title: 'Creative Project',
          icon: Palette,
          description: 'Start a creative endeavor'
        },
        {
          title: 'Social Engagement',
          icon: Gamepad2,
          description: 'Connect with others'
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
        
        // Auto-hide after 10 seconds
        const timer = setTimeout(() => {
          setIsVisible(false)
        }, 10000)
        
        return () => clearTimeout(timer)
      }
    }
  }, [emotionState.mood, emotionalResponses, lastNotifiedEmotion])

  if (!isVisible || !currentResponse) return null

  const IconComponent = currentResponse.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed bottom-4 right-4 z-50 max-w-sm w-full"
      >
        <div className={`${currentResponse.backgroundColor} rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl`}>
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 p-3 rounded-full ${currentResponse.backgroundColor.replace('bg-', 'bg-').replace('50', '200').replace('900/20', '800/30')}`}>
              <IconComponent className={`w-6 h-6 ${currentResponse.color}`} />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Emotional Check-in
              </h3>
              
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                {currentResponse.message}
              </p>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2">
                  Suggestions:
                </h4>
                <ul className="space-y-1">
                  {currentResponse.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm">
                      <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-500" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2">
                  Activities:
                </h4>
                <div className="grid grid-cols-3 gap-2">
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
                        className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 transition-colors"
                      >
                        <ActivityIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        <span className="text-xs text-gray-700 dark:text-gray-300 text-center">
                          {activity.title}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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

// Import Target icon for the focused state
import { Target } from "lucide-react"