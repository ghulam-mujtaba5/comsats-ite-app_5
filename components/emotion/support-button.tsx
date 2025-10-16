"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useEmotion } from "@/contexts/emotion-context"
import { useCalmMode } from "@/hooks/use-emotion-detection"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Heart, 
  Frown, 
  Phone, 
  MessageCircle,
  BookOpen,
  Music,
  Pause,
  Play
} from "lucide-react"

const SUPPORT_RESOURCES = [
  {
    id: "1",
    title: "Take a Break",
    description: "5-minute breathing exercise",
    icon: <Pause className="w-4 h-4" />,
    action: "breathing"
  },
  {
    id: "2",
    title: "Campus Counseling",
    description: "24/7 mental health support",
    icon: <Phone className="w-4 h-4" />,
    action: "call"
  },
  {
    id: "3",
    title: "Positive Affirmations",
    description: "Boost your confidence",
    icon: <Heart className="w-4 h-4" />,
    action: "affirmations"
  },
  {
    id: "4",
    title: "Relaxing Music",
    description: "Calm your mind",
    icon: <Music className="w-4 h-4" />,
    action: "music"
  }
]

export function SupportButton() {
  const { emotionState, updateEmotionState } = useEmotion()
  const { activateCalmMode } = useCalmMode()
  const [showResources, setShowResources] = useState(false)
  const [selectedResource, setSelectedResource] = useState<string | null>(null)

  const handleNotFeelingGreat = () => {
    updateEmotionState({
      mood: "sad",
      stressLevel: "high"
    })
    setShowResources(true)
  }

  const handleResourceSelect = (resourceId: string) => {
    setSelectedResource(resourceId)
    
    const resource = SUPPORT_RESOURCES.find(r => r.id === resourceId)
    if (resource) {
      if (resource.action === "breathing") {
        activateCalmMode()
      } else if (resource.action === "call") {
        // In a real app, this would open a contact dialog
        alert("Connecting you to campus counseling services...")
      }
    }
  }

  if (showResources) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-4">
            <h3 className="font-medium text-red-800 flex items-center gap-2">
              <Frown className="w-5 h-5" />
              We're here for you
            </h3>
            <p className="text-sm text-red-700 mt-1">
              It's okay to not feel okay sometimes. Here are some resources that might help:
            </p>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-2 gap-3">
          {SUPPORT_RESOURCES.map((resource) => (
            <motion.div
              key={resource.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer border-2 transition-all ${
                  selectedResource === resource.id 
                    ? "border-red-500 bg-red-50" 
                    : "hover:border-red-300"
                }`}
                onClick={() => handleResourceSelect(resource.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 bg-red-100 rounded-lg text-red-600">
                      {resource.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200">{resource.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{resource.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => setShowResources(false)}
          className="w-full"
        >
          Back
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Button
        variant="outline"
        className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={handleNotFeelingGreat}
      >
        <Frown className="w-4 h-4 mr-2" />
        I'm not feeling great
      </Button>
    </motion.div>
  )
}