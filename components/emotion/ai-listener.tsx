"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff,
  Sparkles,
  Volume2,
  VolumeX
} from "lucide-react"

const EMPATHETIC_RESPONSES = [
  "I understand how you're feeling. It's completely normal to feel this way.",
  "Your feelings are valid, and it's okay to take time for yourself.",
  "You're not alone in this. Many people go through similar experiences.",
  "It takes courage to acknowledge your feelings. That's a strength.",
  "Remember that difficult times often lead to growth and resilience.",
  "Be kind to yourself. You're doing the best you can right now.",
  "It's okay to ask for help when you need it. That's a sign of wisdom.",
  "Your feelings will pass. This difficult moment will not last forever."
]

export function AIListener() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [userMessage, setUserMessage] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'ai', content: string}>>([])

  const toggleListening = () => {
    setIsListening(!isListening)
    if (!isListening) {
      // Simulate listening and generating response
      setTimeout(() => {
        const randomResponse = EMPATHETIC_RESPONSES[Math.floor(Math.random() * EMPATHETIC_RESPONSES.length)]
        setAiResponse(randomResponse)
        setConversation(prev => [
          ...prev,
          { role: 'user', content: "I'm feeling overwhelmed with my studies" },
          { role: 'ai', content: randomResponse }
        ])
        setIsListening(false)
      }, 2000)
    }
  }

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking)
  }

  const sendMessage = () => {
    if (userMessage.trim()) {
      const randomResponse = EMPATHETIC_RESPONSES[Math.floor(Math.random() * EMPATHETIC_RESPONSES.length)]
      
      setConversation(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'ai', content: randomResponse }
      ])
      
      setUserMessage("")
      setAiResponse(randomResponse)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          Empathetic Listener
        </CardTitle>
        <p className="text-sm text-indigo-700">
          Share your thoughts and feelings. I'm here to listen.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Conversation History */}
        <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
          {conversation.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-500 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none border border-indigo-200'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Input Area */}
        <div className="space-y-3">
          <Textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Type your thoughts here..."
            className="min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          
          <div className="flex gap-2">
            <Button
              onClick={toggleListening}
              variant={isListening ? "default" : "outline"}
              size="sm"
              className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Voice Input
                </>
              )}
            </Button>
            
            <Button
              onClick={toggleSpeaking}
              variant={isSpeaking ? "default" : "outline"}
              size="sm"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 mr-2" />
                  Mute
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Listen
                </>
              )}
            </Button>
            
            <Button
              onClick={sendMessage}
              className="ml-auto bg-indigo-500 hover:bg-indigo-600"
              size="sm"
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
        
        {/* Status Indicators */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            {isListening && (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span>Listening...</span>
              </>
            )}
            {isSpeaking && (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Speaking...</span>
              </>
            )}
          </div>
          <div>
            {conversation.length > 0 && (
              <span>{conversation.length} messages</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}