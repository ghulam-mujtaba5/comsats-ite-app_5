"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Download, Eye, Clock, FileText, Play, Book, Code, Target, BookOpen, Verified, Heart, ThumbsUp } from "lucide-react"
import type { LearningResource } from "@/lib/resources-data"
import { useEmotion } from "@/contexts/emotion-context"
import { useAnimation } from "@/contexts/animation-context"
import { useMotivationalFeedback } from "@/components/motivational/unified-feedback-system"
import { useState, useEffect } from "react"

interface ResourceCardProps {
  resource: LearningResource
  onDownload: (resourceId: string) => void
  onView: (resourceId: string) => void
}

const typeIcons = {
  Notes: FileText,
  Video: Play,
  Book: Book,
  Tutorial: Code,
  Practice: Target,
  Reference: BookOpen,
}

export function ResourceCard({ resource, onDownload, onView }: ResourceCardProps) {
  const { emotionState, updateEmotionState } = useEmotion()
  const { triggerAnimation } = useAnimation()
  const { triggerFeedback } = useMotivationalFeedback()
  const [downloadCount, setDownloadCount] = useState(resource.downloadCount)
  const [viewCount, setViewCount] = useState(0)

  const TypeIcon = typeIcons[resource.type]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-200"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Advanced":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Track resource interactions and provide emotional responses
  const trackResourceInteraction = (interactionType: 'view' | 'download') => {
    if (interactionType === 'download') {
      const newCount = downloadCount + 1
      setDownloadCount(newCount)
      
      // Positive emotional response for downloading resources
      updateEmotionState({
        motivationLevel: emotionState.motivationLevel === 'low' ? 'medium' : emotionState.motivationLevel,
        focusLevel: emotionState.focusLevel === 'low' ? 'medium' : emotionState.focusLevel
      })
      
      // Trigger positive feedback
      triggerAnimation({
        type: 'sparkles',
        message: "Great choice! 📚",
        duration: 3000
      })
      
      triggerFeedback({
        type: 'study_session_completed',
        message: `Downloaded resource: ${resource.title}`
      })
      
      // Achievement for downloading multiple resources
      if (newCount % 5 === 0) {
        triggerAnimation({
          type: 'confetti',
          message: "Learning Champion! 🎉",
          duration: 4000
        })
        
        triggerFeedback({
          type: 'achievement_unlocked',
          message: `Downloaded ${newCount} resources!`
        })
      }
    } else {
      const newViewCount = viewCount + 1
      setViewCount(newViewCount)
      
      // Encourage exploration of resources
      if (newViewCount === 1) {
        triggerFeedback({
          type: 'challenge_completed',
          message: "Exploring new learning resources!"
        })
      }
    }
  }

  // Provide contextual responses based on resource type and rating
  useEffect(() => {
    // High-rated resources make users feel confident
    if (resource.rating >= 4.5) {
      triggerAnimation({
        type: 'successGlow',
        message: "Highly rated resource! ✨",
        duration: 2000
      })
    }
    
    // Verified resources provide trust and security
    if (resource.isVerified) {
      triggerAnimation({
        type: 'sparkles',
        message: "Verified and trusted! ✓",
        duration: 2000
      })
    }
  }, [resource.rating, resource.isVerified, triggerAnimation])

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TypeIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {resource.title}
                </CardTitle>
                {resource.isVerified && <Verified className="h-4 w-4 text-blue-500" />}
              </div>
              <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{resource.type}</Badge>
          <Badge className={getDifficultyColor(resource.difficulty)}>{resource.difficulty}</Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Course:</span>
            <span className="font-medium">{resource.course}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subject:</span>
            <span className="font-medium">{resource.subject}</span>
          </div>
          {resource.fileSize && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Size:</span>
              <span className="font-medium">{resource.fileSize}</span>
            </div>
          )}
          {resource.duration && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {resource.duration}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {resource.author
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{resource.author}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {resource.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {resource.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{resource.tags.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">{renderStars(resource.rating)}</div>
            <span className="text-sm font-medium">{resource.rating}</span>
            <span className="text-sm text-muted-foreground">({resource.totalRatings})</span>
          </div>
          <span className="text-sm text-muted-foreground">{downloadCount} downloads</span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onView(resource.id)
              trackResourceInteraction('view')
            }}
            className="flex-1 bg-transparent hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onDownload(resource.id)
              trackResourceInteraction('download')
            }}
            className="flex-1 hover:bg-blue-600 transition-colors"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
        
        {/* Emotional response indicators */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {resource.rating >= 4.5 && (
            <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
              <ThumbsUp className="h-3 w-3" />
              <span>Highly Rated</span>
            </div>
          )}
          {resource.isVerified && (
            <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
              <Heart className="h-3 w-3" />
              <span>Trusted</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}