"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useCampus } from "@/contexts/campus-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MessageSquare,
  Users,
  TrendingUp,
  Plus,
  Search,
  Heart,
  MessageCircle,
  Share2,
  Filter,
  Calendar,
  MapPin,
  Bell,
  Pin,
  Award,
  Clock,
  Eye,
  Star,
  BookOpen,
  Zap,
  Activity,
  Sparkles,
  Hash,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  Send,
  Crown,
  Trophy,
  Target,
  Flame,
  Rocket,
  Grid3X3,
  List,
  SlidersHorizontal,
  ChevronDown,
  X,
  HelpCircle,
  Shield,
  UserPlus,
  Settings,
  Edit3,
  Trash2,
  BarChart3,
  ThumbsUp,
  ThumbsDown
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import { CenteredLoader } from "@/components/ui/loading-spinner"
import { cn } from "@/lib/utils"
import layout from "@/app/styles/common.module.css"
import "../community.light.module.css"
import "../community.dark.module.css"

interface PollOption {
  id: string
  text: string
  votes: number
}

interface CommunityPoll {
  id: string
  question: string
  description: string
  options: PollOption[]
  totalVotes: number
  userHasVoted: boolean
  userVote?: string
  createdAt: string
  expiresAt?: string
  createdBy: {
    name: string
    avatar: string
  }
  campusId: string
  departmentId: string
  batch: string
  tags: string[]
  category: string
  isAnonymous: boolean
}

export default function CommunityPollsPage() {
  const [polls, setPolls] = useState<CommunityPoll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isCreatePollOpen, setIsCreatePollOpen] = useState(false)
  const [newPollQuestion, setNewPollQuestion] = useState("")
  const [newPollDescription, setNewPollDescription] = useState("")
  const [newPollOptions, setNewPollOptions] = useState(["", ""])
  const [newPollCategory, setNewPollCategory] = useState("general")
  const [newPollIsAnonymous, setNewPollIsAnonymous] = useState(false)
  const [newPollExpiresIn, setNewPollExpiresIn] = useState("7")
  const { user } = useAuth()
  const { selectedCampus, selectedDepartment } = useCampus()

  // Load polls
  useEffect(() => {
    const loadPolls = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (selectedCampus?.id) params.set('campus_id', selectedCampus.id)
        if (selectedDepartment?.id) params.set('department_id', selectedDepartment.id)
        
        const res = await fetch(`/api/community/polls?${params.toString()}`)
        if (!res.ok) throw new Error("Failed to load polls")
        const data = await res.json()
        setPolls(data)
      } catch (e: any) {
        setError(e?.message || "Failed to load polls")
      } finally {
        setLoading(false)
      }
    }
    
    loadPolls()
  }, [selectedCampus, selectedDepartment])

  const handleCreatePoll = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a poll.",
        variant: "destructive",
      })
      return
    }

    if (newPollQuestion.trim().length < 5) {
      toast({
        title: "Question too short",
        description: "Please enter a poll question with at least 5 characters.",
        variant: "destructive",
      })
      return
    }

    const validOptions = newPollOptions.filter(option => option.trim().length > 0)
    if (validOptions.length < 2) {
      toast({
        title: "Not enough options",
        description: "Please provide at least 2 valid options.",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch("/api/community/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: newPollQuestion.trim(),
          description: newPollDescription.trim(),
          options: validOptions,
          category: newPollCategory,
          isAnonymous: newPollIsAnonymous,
          expiresIn: parseInt(newPollExpiresIn),
          campusId: selectedCampus?.id,
          departmentId: selectedDepartment?.id,
        }),
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error?.error || "Failed to create poll")
      }
      
      const newPoll = await res.json()
      setPolls(prev => [newPoll, ...prev])
      setNewPollQuestion("")
      setNewPollDescription("")
      setNewPollOptions(["", ""])
      setIsCreatePollOpen(false)
      toast({ title: "Poll created successfully!", description: "Your poll has been created." })
    } catch (err: any) {
      toast({ title: "Failed to create poll", description: err.message ?? "Unknown error", variant: "destructive" })
    }
  }

  const handleVote = async (pollId: string, optionId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to vote.",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch(`/api/community/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId })
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error?.error || "Failed to vote")
      }
      
      const { updatedPoll } = await res.json()
      setPolls(prev => prev.map(poll => 
        poll.id === pollId ? updatedPoll : poll
      ))
      
      toast({ title: "Vote recorded!", description: "Thank you for participating." })
    } catch (err: any) {
      toast({ title: "Failed to vote", description: err.message ?? "Unknown error", variant: "destructive" })
    }
  }

  const addPollOption = () => {
    if (newPollOptions.length < 6) {
      setNewPollOptions([...newPollOptions, ""])
    }
  }

  const removePollOption = (index: number) => {
    if (newPollOptions.length > 2) {
      setNewPollOptions(newPollOptions.filter((_, i) => i !== index))
    }
  }

  const updatePollOption = (index: number, value: string) => {
    const updatedOptions = [...newPollOptions]
    updatedOptions[index] = value
    setNewPollOptions(updatedOptions)
  }

  const filteredPolls = polls.filter(poll => {
    const matchesSearch = 
      poll.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poll.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poll.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === "all" || poll.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(polls.map(poll => poll.category)))

  // Calculate vote percentage
  const calculatePercentage = (votes: number, total: number) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className={`${layout.section} py-6`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 to-blue-500/15 border border-primary/30 text-sm font-medium text-primary mb-4 backdrop-blur-sm">
            <BarChart3 className="h-4 w-4" />
            <span>Community Polls</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Voice Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Opinion</span>
          </h1>
          
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
            Participate in polls and surveys to share your thoughts on campus life, academics, and community matters.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Dialog open={isCreatePollOpen} onOpenChange={setIsCreatePollOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="px-6 py-4 text-base rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md hover:shadow-lg transition-all duration-300 group"
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                  Create Poll
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    Create New Poll
                  </DialogTitle>
                  <DialogDescription>
                    Gather opinions from your community.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Poll Question
                    </label>
                    <Input
                      placeholder="What do you think about...?"
                      value={newPollQuestion}
                      onChange={(e) => setNewPollQuestion(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Description (Optional)
                    </label>
                    <Textarea
                      placeholder="Provide additional context for your poll..."
                      value={newPollDescription}
                      onChange={(e) => setNewPollDescription(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Options
                    </label>
                    <div className="space-y-2">
                      {newPollOptions.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => updatePollOption(index, e.target.value)}
                            className="flex-1"
                          />
                          {newPollOptions.length > 2 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removePollOption(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    {newPollOptions.length < 6 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addPollOption}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Category
                      </label>
                      <Select value={newPollCategory} onValueChange={setNewPollCategory}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="campus">Campus Life</SelectItem>
                          <SelectItem value="facilities">Facilities</SelectItem>
                          <SelectItem value="events">Events</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Expires In
                      </label>
                      <Select value={newPollExpiresIn} onValueChange={setNewPollExpiresIn}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 day</SelectItem>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="7">1 week</SelectItem>
                          <SelectItem value="14">2 weeks</SelectItem>
                          <SelectItem value="30">1 month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isAnonymous"
                      checked={newPollIsAnonymous}
                      onChange={(e) => setNewPollIsAnonymous(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="isAnonymous" className="text-sm font-medium">
                      Make poll anonymous
                    </label>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreatePollOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreatePoll}
                      disabled={!newPollQuestion.trim() || newPollOptions.filter(opt => opt.trim().length > 0).length < 2}
                    >
                      Create Poll
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              size="lg" 
              variant="outline"
              className="px-6 py-4 text-base rounded-xl border-2 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Explore Polls
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 dark:border-slate-700/30 shadow-lg rounded-2xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search polls..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12 w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-12"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Polls List */}
        <div className="space-y-6">
          {loading ? (
            <CenteredLoader message="Loading polls..." />
          ) : error ? (
            <Card className="p-8 text-center text-destructive">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" />
              <h3 className="font-medium text-lg">Error Loading Polls</h3>
              <p className="mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </Card>
          ) : filteredPolls.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <BarChart3 className="h-12 w-12 text-gray-400" />
                <h3 className="font-medium text-gray-900 dark:text-white">No polls found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your filters or create a new poll
                </p>
                <Button 
                  onClick={() => setIsCreatePollOpen(true)}
                  className="mt-2"
                >
                  Create Poll
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredPolls.map((poll) => (
                <Card 
                  key={poll.id} 
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 dark:border-slate-700/30 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl line-clamp-1">
                          {poll.question}
                        </CardTitle>
                        {poll.description && (
                          <CardDescription className="line-clamp-2 mt-1">
                            {poll.description}
                          </CardDescription>
                        )}
                      </div>
                      <Badge 
                        className={cn(
                          "text-xs capitalize",
                          poll.category === "general" && "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
                          poll.category === "academic" && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                          poll.category === "campus" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                          poll.category === "facilities" && "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
                          poll.category === "events" && "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                        )}
                      >
                        {poll.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {poll.options.map((option) => {
                        const percentage = calculatePercentage(option.votes, poll.totalVotes)
                        return (
                          <div key={option.id} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {option.text}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {percentage}% ({option.votes})
                              </span>
                            </div>
                            <div 
                              className={cn(
                                "h-2 rounded-full bg-slate-100 dark:bg-slate-900",
                                poll.userHasVoted && poll.userVote === option.id && "bg-primary/20"
                              )}
                            >
                              <div 
                                className={cn(
                                  "h-full rounded-full transition-all duration-500",
                                  poll.userHasVoted && poll.userVote === option.id 
                                    ? "bg-primary" 
                                    : "bg-blue-500"
                                )}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            {!poll.userHasVoted && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-1"
                                onClick={() => handleVote(poll.id, option.id)}
                              >
                                Vote
                              </Button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-2">
                      <div className="flex items-center gap-4">
                        <span>{poll.totalVotes} votes</span>
                        <span>•</span>
                        <span>Created by {poll.createdBy.name}</span>
                      </div>
                      {poll.expiresAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Expires {new Date(poll.expiresAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                      {poll.tags.slice(0, 4).map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="text-xs py-0.5 px-2"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}