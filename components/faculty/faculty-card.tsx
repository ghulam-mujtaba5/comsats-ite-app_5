"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Mail, BookOpen, Users, Trophy, Award } from "lucide-react"
import type { Faculty } from "@/lib/faculty-data"
import Link from "next/link"
import { useEmotion } from "@/contexts/emotion-context"
import { useCelebrationAnimations } from "@/hooks/use-celebration-animations"
import { useMotivationalFeedback } from "@/components/motivational/unified-feedback-system"
import { useState, useEffect } from "react"

interface FacultyCardProps {
  faculty: Faculty
  searchTerm?: string
}

export function FacultyCard({ faculty, searchTerm }: FacultyCardProps) {
  const { emotionState, updateEmotionState } = useEmotion()
  const { triggerConfetti, triggerBalloons } = useCelebrationAnimations()
  const { triggerFeedback } = useMotivationalFeedback()
  const [viewCount, setViewCount] = useState(0)

  const highlight = (text: string) => {
    const term = (searchTerm || '').trim()
    if (!term) return text
    try {
      const i = text.toLowerCase().indexOf(term.toLowerCase())
      if (i === -1) return text
      const before = text.slice(0, i)
      const match = text.slice(i, i + term.length)
      const after = text.slice(i + term.length)
      return (
        <>
          {before}
          <span className="bg-yellow-200/60 dark:bg-yellow-500/30 rounded px-0.5">{match}</span>
          {after}
        </>
      )
    } catch {
      return text
    }
  }
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  // Track faculty profile views
  const trackProfileView = () => {
    const newCount = viewCount + 1
    setViewCount(newCount)
    
    // Update emotion state
    updateEmotionState({
      motivationLevel: emotionState.motivationLevel === 'low' ? 'medium' : emotionState.motivationLevel,
      focusLevel: emotionState.focusLevel === 'low' ? 'medium' : emotionState.focusLevel
    })
    
    // Trigger achievements based on view count
    if (newCount === 1) {
      // First faculty profile viewed
      triggerFeedback({
        type: 'achievement_unlocked',
        message: "First Faculty Profile Viewed!"
      })
    } else if (newCount === 5) {
      // Multiple faculty profiles viewed
      triggerConfetti({
        message: "Academic Explorer! 🎓",
        duration: 5000,
        particleCount: 200
      })
      
      triggerFeedback({
        type: 'achievement_unlocked',
        message: "Viewed 5 Faculty Profiles!"
      })
    } else if (newCount === 10) {
      // Extensive faculty research
      triggerBalloons({
        message: "Research Master! 🎈",
        duration: 6000,
        balloonCount: 15
      })
      
      triggerFeedback({
        type: 'achievement_unlocked',
        message: "Viewed 10 Faculty Profiles!"
      })
    }
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden border-border">
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-500"></div>
      
      <Link 
        href={`/faculty/${faculty.id}`} 
        className="absolute inset-0 z-0" 
        aria-label={`View profile for ${faculty.name}`}
        onClick={trackProfileView}
      >
        <span className="sr-only">View profile for {faculty.name}</span>
      </Link>
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage 
              src={faculty.profileImage || "/placeholder-user.svg"} 
              alt={faculty.name} 
              className="object-cover"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <AvatarFallback className="text-lg font-medium bg-gradient-to-br from-primary/20 to-blue-500/20">
              {faculty.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl group-hover:text-primary transition-colors truncate">
              {highlight(faculty.name)}
            </CardTitle>
            <CardDescription className="text-base truncate">{faculty.title}</CardDescription>
            <Badge variant="secondary" className="mt-1">
              {faculty.department}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Rating Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {renderStars(faculty.averageRating)}
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">{faculty.averageRating.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">({faculty.totalReviews} reviews)</div>
          </div>
        </div>

        {/* Achievement badges for highly rated faculty */}
        {faculty.averageRating >= 4.5 && (
          <div className="flex items-center justify-center gap-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">Top Rated</span>
          </div>
        )}
        
        {faculty.totalReviews >= 50 && (
          <div className="flex items-center justify-center gap-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg p-2">
            <Award className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Popular Choice</span>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Office: {faculty.office}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{faculty.email}</span>
          </div>
        </div>

        {/* Specialization */}
        <div>
          <div className="flex items-center gap-2 text-sm font-medium mb-2">
            <BookOpen className="h-4 w-4" />
            Specialization
          </div>
          <div className="flex flex-wrap gap-1">
            {faculty.specialization.slice(0, 3).map((spec, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {highlight(spec) as any}
              </Badge>
            ))}
            {faculty.specialization.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{faculty.specialization.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Courses */}
        <div>
          <div className="flex items-center gap-2 text-sm font-medium mb-2">
            <Users className="h-4 w-4" />
            Courses ({faculty.courses.length})
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            {faculty.courses.slice(0, 2).map((course, index) => (
              <div key={index} className="truncate">{course}</div>
            ))}
            {faculty.courses.length > 2 && <div>+{faculty.courses.length - 2} more courses</div>}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button asChild className="w-full group/btn">
            <Link href={`/faculty/${faculty.id}`} onClick={(e) => e.stopPropagation()}>
              View Profile & Reviews
              <span className="ml-2 opacity-0 group-hover/btn:opacity-100 transition-opacity">→</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}