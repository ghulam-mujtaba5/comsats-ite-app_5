'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEmotionState, EmotionType } from '@/hooks/use-emotion-state'
import { Smile, Frown, Meh, Heart, Zap, Focus, Sparkles } from 'lucide-react'

const emotionIcons: Record<EmotionType, { icon: React.ElementType; color: string; label: string }> = {
  happy: { icon: Smile, color: 'text-yellow-500', label: 'Happy' },
  calm: { icon: Heart, color: 'text-blue-500', label: 'Calm' },
  stressed: { icon: Frown, color: 'text-red-500', label: 'Stressed' },
  motivated: { icon: Zap, color: 'text-orange-500', label: 'Motivated' },
  lonely: { icon: Meh, color: 'text-purple-500', label: 'Lonely' },
  focused: { icon: Focus, color: 'text-indigo-500', label: 'Focused' },
  neutral: { icon: Sparkles, color: 'text-gray-500', label: 'Neutral' },
}

export function MoodWidget() {
  const { emotionState, setEmotion, getMotivationalMessage } = useEmotionState()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  const CurrentIcon = emotionIcons[emotionState.current].icon

  const handleEmotionSelect = (emotion: EmotionType) => {
    setEmotion(emotion, 70)
    setShowMessage(true)
    setIsExpanded(false)
    setTimeout(() => setShowMessage(false), 5000)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-72 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 mb-2"
          >
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {getMotivationalMessage()}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 mb-2"
          >
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3">
              How are you feeling?
            </p>
            <div className="grid grid-cols-4 gap-2">
              {(Object.entries(emotionIcons) as [EmotionType, typeof emotionIcons[EmotionType]][]).map(
                ([emotion, { icon: Icon, color, label }]) => (
                  <button
                    key={emotion}
                    onClick={() => handleEmotionSelect(emotion)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      emotionState.current === emotion ? 'bg-gray-100 dark:bg-gray-700 ring-2 ring-offset-2 ring-indigo-500' : ''
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${color}`} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                  </button>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center ${emotionIcons[emotionState.current].color} text-white`}
      >
        <CurrentIcon className="w-7 h-7" />
      </motion.button>
    </div>
  )
}
