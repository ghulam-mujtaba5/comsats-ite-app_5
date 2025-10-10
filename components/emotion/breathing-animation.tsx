"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useEmotion } from "@/contexts/emotion-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react"

interface BreathingPhase {
  name: string
  duration: number
  instruction: string
}

const BREATHING_CYCLE: BreathingPhase[] = [
  { name: "inhale", duration: 4000, instruction: "Breathe in..." },
  { name: "hold", duration: 2000, instruction: "Hold..." },
  { name: "exhale", duration: 6000, instruction: "Breathe out..." },
  { name: "hold", duration: 2000, instruction: "Hold..." }
]

export function BreathingAnimation() {
  const { deactivateCalmMode } = useEmotion()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(BREATHING_CYCLE[0].duration)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentPhase = BREATHING_CYCLE[currentPhaseIndex]

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 100) {
            // Move to next phase
            const nextIndex = (currentPhaseIndex + 1) % BREATHING_CYCLE.length
            setCurrentPhaseIndex(nextIndex)
            return BREATHING_CYCLE[nextIndex].duration
          }
          return prev - 100
        })
      }, 100)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, currentPhaseIndex])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const reset = () => {
    setIsPlaying(false)
    setCurrentPhaseIndex(0)
    setTimeLeft(BREATHING_CYCLE[0].duration)
  }

  const progress = 1 - (timeLeft / currentPhase.duration)
  const size = 150
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - progress * circumference

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-indigo-500" />
            Calm Breathing
          </span>
          <Button variant="ghost" size="sm" onClick={deactivateCalmMode}>
            Exit
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {/* Breathing Circle */}
        <div className="relative my-6">
          <motion.div
            className="rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center"
            animate={{
              scale: currentPhase.name === "inhale" ? [1, 1.2] : 
                     currentPhase.name === "exhale" ? [1.2, 1] : 1,
            }}
            transition={{
              duration: timeLeft / 1000,
              ease: "easeInOut"
            }}
            style={{
              width: size,
              height: size,
            }}
          >
            <div className="rounded-full bg-white/20 flex items-center justify-center"
              style={{
                width: size * 0.7,
                height: size * 0.7,
              }}
            >
              <motion.div
                className="rounded-full bg-white/30"
                animate={{
                  scale: currentPhase.name === "inhale" ? [1, 1.1] : 
                         currentPhase.name === "exhale" ? [1.1, 1] : 1,
                }}
                transition={{
                  duration: timeLeft / 1000,
                  ease: "easeInOut"
                }}
                style={{
                  width: size * 0.4,
                  height: size * 0.4,
                }}
              />
            </div>
          </motion.div>
          
          {/* Progress Ring */}
          <svg
            className="absolute top-0 left-0 -rotate-90"
            width={size}
            height={size}
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              className="text-indigo-200"
            />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-indigo-500"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </svg>
        </div>
        
        {/* Instruction */}
        <motion.div
          key={currentPhase.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <p className="text-xl font-medium text-indigo-800">
            {currentPhase.instruction}
          </p>
          <p className="text-sm text-indigo-600 mt-1">
            {Math.ceil(timeLeft / 1000)}s
          </p>
        </motion.div>
        
        {/* Controls */}
        <div className="flex gap-3">
          <Button
            onClick={togglePlay}
            className="bg-indigo-500 hover:bg-indigo-600"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start
              </>
            )}
          </Button>
          
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
        
        {/* Session Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Complete 5 cycles for maximum relaxation</p>
          <p className="mt-1">Cycle {Math.floor(currentPhaseIndex / BREATHING_CYCLE.length) + 1} of 5</p>
        </div>
      </CardContent>
    </Card>
  )
}