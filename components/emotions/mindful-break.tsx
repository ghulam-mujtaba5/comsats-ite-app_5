'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Coffee, Wind, Music, Moon, X } from 'lucide-react'
import { useEmotionState } from '@/hooks/use-emotion-state'

export interface MindfulBreakProps {
  autoTrigger?: boolean
  onClose?: () => void
}

export function MindfulBreak({ autoTrigger = false, onClose }: MindfulBreakProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [breathCount, setBreathCount] = useState(0)
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const { resetSession } = useEmotionState()

  useEffect(() => {
    if (autoTrigger) {
      setIsOpen(true)
    }
  }, [autoTrigger])

  useEffect(() => {
    if (!isOpen) return

    const breathCycle = () => {
      // Inhale (4s) -> Hold (7s) -> Exhale (8s)
      const phases = [
        { phase: 'inhale', duration: 4000 },
        { phase: 'hold', duration: 7000 },
        { phase: 'exhale', duration: 8000 },
      ]

      let currentPhaseIndex = 0

      const interval = setInterval(() => {
        const currentPhase = phases[currentPhaseIndex]
        setBreathPhase(currentPhase.phase as 'inhale' | 'hold' | 'exhale')

        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length
        if (currentPhaseIndex === 0) {
          setBreathCount((prev) => prev + 1)
        }
      }, phases[currentPhaseIndex].duration)

      return () => clearInterval(interval)
    }

    breathCycle()
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false)
    resetSession()
    onClose?.()
  }

  const breakActivities = [
    { icon: Coffee, label: 'Grab a drink', color: 'text-amber-600' },
    { icon: Wind, label: 'Take a walk', color: 'text-blue-600' },
    { icon: Music, label: 'Listen to music', color: 'text-purple-600' },
    { icon: Moon, label: 'Rest your eyes', color: 'text-indigo-600' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl p-8 max-w-lg mx-4 border border-blue-200 dark:border-gray-700"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            <div className="text-center mb-8">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="text-6xl mb-4"
              >
                🧘
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Time for a Mindful Break
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                You've been working hard. Let's take a moment to breathe.
              </p>
            </div>

            {/* Breathing Circle Animation */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative w-48 h-48">
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-30"
                  animate={{
                    scale:
                      breathPhase === 'inhale'
                        ? [0.7, 1]
                        : breathPhase === 'hold'
                        ? 1
                        : [1, 0.7],
                  }}
                  transition={{
                    duration:
                      breathPhase === 'inhale' ? 4 : breathPhase === 'hold' ? 7 : 8,
                    ease: 'easeInOut',
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 capitalize">
                      {breathPhase}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Breath {breathCount + 1}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Activities */}
            <div className="space-y-2 mb-6">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Or try these activities:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {breakActivities.map((activity, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {activity.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              I'm Refreshed, Let's Continue
            </motion.button>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
              💡 Regular breaks improve focus and productivity
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
