"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, Bot, User, ThumbsUp, ThumbsDown, Copy } from "lucide-react"
import { GlassCard } from "@/components/admin/glass-card"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function QueryAnswering() {
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your admission guidance assistant. Ask me anything about COMSATS admissions, NTS preparation, merit calculation, or study resources.",
      timestamp: new Date()
    }
  ])
  const [loading, setLoading] = useState(false)

  const submitQuery = async () => {
    if (!query.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setQuery("")
    setLoading(true)

    try {
      // In a real implementation, this would call an AI API
      // For now, we'll simulate a response
      setTimeout(() => {
        const responses = [
          "Based on previous admission cycles, the merit for Computer Science typically ranges from 75-85%. Your intermediate percentage of 85% puts you in a good position. I recommend also focusing on NTS preparation to maximize your chances.",
          "For NTS preparation, I suggest starting with basic mathematics and English comprehension. Practice with past papers and focus on time management. The quantitative section usually has 20 questions with a 30-minute time limit.",
          "The merit calculation formula for most engineering programs is: Matric (10%) + Intermediate (40%) + NTS (50%). For business programs, it's typically: Matric (20%) + Intermediate (80%).",
          "Interview preparation is crucial for certain programs. Common questions include: 'Why do you want to join COMSATS?', 'What are your career goals?', and 'How will you contribute to the university community?'. Practice answering these confidently.",
          "Study resources are available in our resource section. I recommend checking the NTS preparation guide and subject-wise notes. Also, connect with senior students in your desired department for personalized advice."
        ]

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date()
        }

        setMessages(prev => [...prev, assistantMessage])
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error submitting query:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your query. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <GlassCard 
        title="Admission Guidance Assistant" 
        description="Ask questions about admissions, NTS preparation, merit calculation, and more"
        icon={MessageCircle}
      >
        <CardContent className="p-0">
          <div className="space-y-4">
            <div>
              <Label htmlFor="query">Your Question</Label>
              <Textarea
                id="query"
                placeholder="e.g., What's the merit requirement for Computer Science? How to prepare for NTS?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={3}
                className="mt-1"
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={submitQuery}
              disabled={loading || !query.trim()}
            >
              {loading ? "Processing..." : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Get Guidance
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </GlassCard>

      {messages.length > 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Conversation</h3>
          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.id} className={`p-4 ${message.role === 'user' ? 'bg-primary/5 border-primary/20' : 'bg-muted/50'}`}>
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {message.role === 'user' ? 'You' : 'Admission Assistant'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {message.role === 'assistant' && (
                        <>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Helpful
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <ThumbsDown className="h-3 w-3 mr-1" />
                            Not Helpful
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs"
                            onClick={() => copyToClipboard(message.content)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}