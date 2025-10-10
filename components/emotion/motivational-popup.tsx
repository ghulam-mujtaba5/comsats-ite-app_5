"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useEmotion } from "@/contexts/emotion-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface MotivationalMessage {
  id: string
  text: string
  mood: string[]
  trigger: string
}

const MOTIVATIONAL_MESSAGES: MotivationalMessage[] = [
  {
    id: "1",
    text: "You're doing great! Keep pushing forward!",
    mood: ["sad", "stressed"],
    trigger: "onLowActivity"
  },
  {
    id: "2",
    text: "Don't give up, progress takes time!",
    mood: ["sad", "stressed"],
    trigger: "onRepeatedError"
  },
  {
    id: "3",
    text: "Consistency is key! You're on the right track!",
    mood: ["neutral"],
    trigger: "onTaskCompletion"
  },
  {
    id: "4",
    text: "Every small step counts toward your big goals!",
    mood: ["neutral"],
    trigger: "onRepeatedEffort"
  },
  {
    id: "5",
    text: "You've come so far already - keep going!",
    mood: ["happy", "excited"],
    trigger: "onMilestoneReached"
  },
  {
    id: "6",
    text: "Your dedication is inspiring! Keep it up!",
    mood: ["happy", "excited"],
    trigger: "onStudyStreak"
  },
  {
    id: "7",
    text: "Believe in yourself - you've got this!",
    mood: ["sad", "stressed"],
    trigger: "onHighScore"
  }
]

export function MotivationalPopup() {
  const { emotionState } = useEmotion()
  const [visibleMessages, setVisibleMessages] = useState<MotivationalMessage[]>([])
  const [dismissedMessages, setDismissedMessages] = useState<Set<string>>(new Set())

  // Select appropriate messages based on current mood
  useEffect(() => {
    const relevantMessages = MOTIVATIONAL_MESSAGES.filter(message => 
      message.mood.includes(emotionState.mood)
    )
    
    // Randomly select 1-2 messages to show
    if (relevantMessages.length > 0 && visibleMessages.length === 0) {
      const shuffled = [...relevantMessages].sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, Math.min(2, shuffled.length))
      setVisibleMessages(selected)
    }
  }, [emotionState.mood, visibleMessages.length])

  const dismissMessage = (id: string) => {
    setDismissedMessages(prev => new Set(prev).add(id))
    setVisibleMessages(prev => prev.filter(msg => msg.id !== id))
  }

  const dismissAll = () => {
    setVisibleMessages([])
  }

  if (visibleMessages.length === 0) return null

  return (
    <AnimatePresence>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {visibleMessages.map((message) => (
          !dismissedMessages.has(message.id) && (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-200 shadow-lg max-w-xs">
                <CardContent className="p-4 pr-10">
                  <p className="text-indigo-800 font-medium">{message.text}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 text-indigo-500 hover:text-indigo-700"
                    onClick={() => dismissMessage(message.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        ))}
        
        {visibleMessages.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end"
          >
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={dismissAll}
            >
              Dismiss All
            </Button>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  )
}