"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Download, Eye, Clock, FileText, Play, Book, Code, Target, BookOpen, Verified } from "lucide-react"
import type { LearningResource } from "@/lib/resources-data"

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
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

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
          <span className="text-sm text-muted-foreground">{resource.downloadCount} downloads</span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(resource.id)}
            className="flex-1 bg-transparent hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            onClick={() => onDownload(resource.id)}
            className="flex-1 hover:bg-blue-600 transition-colors"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
