"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Smile, 
  Frown, 
  Meh, 
  Heart, 
  Zap, 
  Brain,
  Plus,
  Send,
  User,
  MessageCircle
} from "lucide-react"

interface MoodPost {
  id: string
  user: {
    name: string
    avatar?: string
  }
  mood: string
  message: string
  timestamp: Date
  likes: number
  hasLiked: boolean
  isPublic: boolean
}

const MOOD_OPTIONS = [
  { value: "happy", label: "Happy", icon: Smile, color: "text-yellow-500" },
  { value: "sad", label: "Sad", icon: Frown, color: "text-blue-500" },
  { value: "neutral", label: "Neutral", icon: Meh, color: "text-gray-500" },
  { value: "excited", label: "Excited", icon: Heart, color: "text-red-500" },
  { value: "stressed", label: "Stressed", icon: Frown, color: "text-orange-500" },
  { value: "calm", label: "Calm", icon: Smile, color: "text-green-500" },
  { value: "focused", label: "Focused", icon: Brain, color: "text-purple-500" },
  { value: "energized", label: "Energized", icon: Zap, color: "text-yellow-400" },
]

const SAMPLE_POSTS: MoodPost[] = [
  {
    id: "1",
    user: {
      name: "Sarah Johnson",
      avatar: ""
    },
    mood: "happy",
    message: "Just finished my project! Feeling accomplished 🎉",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    likes: 8,
    hasLiked: false,
    isPublic: true
  },
  {
    id: "2",
    user: {
      name: "Mike Chen",
      avatar: ""
    },
    mood: "stressed",
    message: "Exams week is tough, but I'm pushing through! 💪",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 12,
    hasLiked: true,
    isPublic: true
  },
  {
    id: "3",
    user: {
      name: "Emma Wilson",
      avatar: ""
    },
    mood: "focused",
    message: "Deep work session in the library. Making good progress!",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 5,
    hasLiked: false,
    isPublic: true
  }
]

export function MoodWall() {
  const [posts, setPosts] = useState<MoodPost[]>(SAMPLE_POSTS)
  const [newPost, setNewPost] = useState({
    mood: "neutral",
    message: "",
    isPublic: true
  })
  const [isCreating, setIsCreating] = useState(false)

  const createPost = () => {
    if (newPost.message.trim()) {
      const post: MoodPost = {
        id: Math.random().toString(36).substr(2, 9),
        user: {
          name: "You",
          avatar: ""
        },
        mood: newPost.mood,
        message: newPost.message,
        timestamp: new Date(),
        likes: 0,
        hasLiked: false,
        isPublic: newPost.isPublic
      }
      
      setPosts(prev => [post, ...prev])
      setNewPost({
        mood: "neutral",
        message: "",
        isPublic: true
      })
      setIsCreating(false)
    }
  }

  const toggleLike = (id: string) => {
    setPosts(prev => prev.map(post => 
      post.id === id 
        ? { 
            ...post, 
            likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
            hasLiked: !post.hasLiked
          } 
        : post
    ))
  }

  const getMoodIcon = (mood: string) => {
    const moodOption = MOOD_OPTIONS.find(m => m.value === mood)
    if (moodOption) {
      const Icon = moodOption.icon
      return <Icon className={`w-4 h-4 ${moodOption.color}`} />
    }
    return <Meh className="w-4 h-4 text-gray-500" />
  }

  return (
    <div className="space-y-4">
      {/* Create Mood Post */}
      {isCreating ? (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="p-4">
            <h3 className="font-medium text-indigo-800 mb-3">Share Your Mood</h3>
            
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                How are you feeling?
              </label>
              <div className="flex flex-wrap gap-2">
                {MOOD_OPTIONS.map((mood) => {
                  const Icon = mood.icon
                  return (
                    <Button
                      key={mood.value}
                      variant={newPost.mood === mood.value ? "default" : "outline"}
                      size="sm"
                      className={`${
                        newPost.mood === mood.value 
                          ? "bg-indigo-500 hover:bg-indigo-600" 
                          : ""
                      }`}
                      onClick={() => setNewPost(prev => ({ ...prev, mood: mood.value }))}
                    >
                      <Icon className={`w-4 h-4 mr-1 ${mood.color}`} />
                      {mood.label}
                    </Button>
                  )
                })}
              </div>
            </div>
            
            <Textarea
              value={newPost.message}
              onChange={(e) => setNewPost(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Share what's on your mind..."
              className="mb-3 min-h-[80px]"
            />
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={newPost.isPublic}
                  onChange={(e) => setNewPost(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="rounded"
                />
                Share publicly
              </label>
              
              <div className="flex gap-2">
                <Button 
                  onClick={createPost}
                  className="bg-indigo-500 hover:bg-indigo-600"
                  size="sm"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Post
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreating(false)}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button 
          onClick={() => setIsCreating(true)}
          variant="outline" 
          className="w-full border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Share Your Mood
        </Button>
      )}
      
      {/* Mood Posts */}
      <div className="space-y-3">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-lg bg-white"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  {post.user.avatar ? (
                    <img 
                      src={post.user.avatar} 
                      alt={post.user.name} 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4 text-indigo-600" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{post.user.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-xs">
                          {getMoodIcon(post.mood)}
                          <span className="capitalize">{post.mood}</span>
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500">
                          {post.timestamp.toLocaleDateString()}
                        </span>
                        {!post.isPublic && (
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded">
                            Private
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="mt-2 text-sm">{post.message}</p>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleLike(post.id)}
                      className={`h-8 px-2 ${
                        post.hasLiked 
                          ? "text-indigo-500 hover:text-indigo-600" 
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <Heart 
                        className={`w-4 h-4 mr-1 ${
                          post.hasLiked ? "fill-current" : ""
                        }`} 
                      />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-400 hover:text-gray-600">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </motion.div>
        ))}
      </div>
    </div>
  )
}