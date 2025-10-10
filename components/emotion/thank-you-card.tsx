"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Heart, 
  Sparkles, 
  Send, 
  User, 
  MessageCircle,
  ThumbsUp
} from "lucide-react"

interface ThankYouMessage {
  id: string
  from: {
    name: string
    avatar?: string
  }
  to: string
  message: string
  timestamp: Date
  likes: number
  hasLiked: boolean
}

const SAMPLE_MESSAGES: ThankYouMessage[] = [
  {
    id: "1",
    from: {
      name: "Ahmed Raza",
      avatar: ""
    },
    to: "You",
    message: "Thanks for sharing those past papers! They really helped me prepare for the exam.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 5,
    hasLiked: false
  },
  {
    id: "2",
    from: {
      name: "Fatima Khan",
      avatar: ""
    },
    to: "You",
    message: "Your study tips were a lifesaver during finals week. I scored 15% higher than last semester!",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    likes: 12,
    hasLiked: true
  },
  {
    id: "3",
    from: {
      name: "COMSATS Community",
      avatar: ""
    },
    to: "All Contributors",
    message: "Thank you for making our campus resources better for everyone!",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    likes: 42,
    hasLiked: false
  }
]

export function ThankYouCard() {
  const [messages, setMessages] = useState<ThankYouMessage[]>(SAMPLE_MESSAGES)
  const [newMessage, setNewMessage] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ThankYouMessage = {
        id: Math.random().toString(36).substr(2, 9),
        from: {
          name: "You",
          avatar: ""
        },
        to: "Community",
        message: newMessage,
        timestamp: new Date(),
        likes: 0,
        hasLiked: false
      }
      
      setMessages(prev => [message, ...prev])
      setNewMessage("")
      setIsCreating(false)
    }
  }

  const toggleLike = (id: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id 
        ? { 
            ...msg, 
            likes: msg.hasLiked ? msg.likes - 1 : msg.likes + 1,
            hasLiked: !msg.hasLiked
          } 
        : msg
    ))
  }

  return (
    <div className="space-y-4">
      {/* Create Thank You Message */}
      {isCreating ? (
        <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
          <CardContent className="p-4">
            <h3 className="font-medium text-pink-800 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Send Appreciation
            </h3>
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Write a thank you message..."
              className="mb-3 min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button 
                onClick={sendMessage}
                className="bg-pink-500 hover:bg-pink-600"
                size="sm"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsCreating(false)}
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button 
          onClick={() => setIsCreating(true)}
          variant="outline" 
          className="w-full border-dashed border-pink-300 text-pink-600 hover:bg-pink-50"
          size="sm"
        >
          <Heart className="w-4 h-4 mr-2" />
          Send Thank You Message
        </Button>
      )}
      
      {/* Messages */}
      <div className="space-y-3">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-lg bg-white"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                  {message.from.avatar ? (
                    <img 
                      src={message.from.avatar} 
                      alt={message.from.name} 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4 text-pink-600" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{message.from.name}</h4>
                      <p className="text-xs text-gray-500">
                        to {message.to} • {message.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => toggleLike(message.id)}
                      className={`h-8 w-8 ${
                        message.hasLiked 
                          ? "text-pink-500 hover:text-pink-600" 
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <Heart 
                        className={`w-4 h-4 ${
                          message.hasLiked ? "fill-current" : ""
                        }`} 
                      />
                    </Button>
                  </div>
                  
                  <p className="mt-2 text-sm">{message.message}</p>
                  
                  <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{message.likes} likes</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </motion.div>
        ))}
      </div>
      
      {/* Community Appreciation */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-4">
          <h3 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Community Appreciation
          </h3>
          <p className="text-sm text-amber-700">
            "Thanks for helping your campus community! Your contributions make a real difference."
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className="w-6 h-6 rounded-full bg-amber-200 border-2 border-white"
                />
              ))}
            </div>
            <span className="text-xs text-amber-700">+127 others appreciate your help</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}