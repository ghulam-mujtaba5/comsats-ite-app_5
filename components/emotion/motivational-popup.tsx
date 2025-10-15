"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useEmotion } from "@/contexts/emotion-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X as XIcon, Sparkles } from "lucide-react"

interface MotivationalMessage {
  id: string
  text: string
  mood: string[]
  trigger: string
  icon?: string
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
  // Track which messages have been shown to avoid repeated notifications
  const [shownMessages, setShownMessages] = useState<Set<string>>(new Set())

  // Select appropriate messages based on current mood
  useEffect(() => {
    const relevantMessages = MOTIVATIONAL_MESSAGES.filter(message => 
      message.mood.includes(emotionState.mood)
    )
    
    // Filter out messages that have already been shown or dismissed
    const newMessages = relevantMessages.filter(message => 
      !shownMessages.has(message.id) && !dismissedMessages.has(message.id)
    )
    
    // Randomly select 1 new message to show
    if (newMessages.length > 0 && visibleMessages.length === 0) {
      const selected = newMessages[Math.floor(Math.random() * newMessages.length)]
      setVisibleMessages([selected])
      // Add this message to the shown set
      setShownMessages(prev => new Set(prev).add(selected.id))
    }
  }, [emotionState.mood, visibleMessages.length, dismissedMessages, shownMessages])

  const dismissMessage = (id: string) => {
    setDismissedMessages(prev => new Set(prev).add(id))
    setVisibleMessages(prev => prev.filter(msg => msg.id !== id))
  }

  const dismissAll = () => {
    // Add all current visible messages to dismissed set
    visibleMessages.forEach(msg => setDismissedMessages(prev => new Set(prev).add(msg.id)))
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
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-200 shadow-lg max-w-[280px] glass-card">
                <CardContent className="p-3 pr-8">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <p className="text-indigo-800 text-xs font-medium leading-snug">
                      {message.text}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1.5 right-1.5 h-5 w-5 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-100"
                      onClick={() => dismissMessage(message.id)}
                    >
                      <XIcon className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        ))}
      </div>
    </AnimatePresence>
  )
}