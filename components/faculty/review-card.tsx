"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, ThumbsUp, Flag, Calendar, BookOpen } from "lucide-react"
import type { Review } from "@/lib/faculty-data"

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  const renderRatingBar = (label: string, rating: number) => (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-20 text-muted-foreground">{label}:</span>
      <div className="flex items-center gap-1">
        {renderStars(rating)}
        <span className="text-sm font-medium">{rating}</span>
      </div>
    </div>
  )

  return (
    <Card className="mb-4">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {review.isAnonymous
                  ? "A"
                  : review.studentName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{review.isAnonymous ? "Anonymous Student" : review.studentName}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-3 w-3" />
                {review.course} • {review.semester}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
            <span className="font-semibold">{review.rating}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {renderRatingBar("Teaching", review.teachingQuality)}
          {renderRatingBar("Access", review.accessibility)}
          {renderRatingBar("Material", review.courseMaterial)}
          {renderRatingBar("Grading", review.grading)}
        </div>

        <div className="space-y-3">
          <p className="text-foreground leading-relaxed">{review.comment}</p>

          {review.pros.length > 0 && (
            <div>
              <h4 className="font-medium text-green-600 mb-2">Pros:</h4>
              <div className="flex flex-wrap gap-1">
                {review.pros.map((pro, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    {pro}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {review.cons.length > 0 && (
            <div>
              <h4 className="font-medium text-red-600 mb-2">Cons:</h4>
              <div className="flex flex-wrap gap-1">
                {review.cons.map((con, index) => (
                  <Badge key={index} variant="secondary" className="bg-red-50 text-red-700 border-red-200">
                    {con}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <Badge variant={review.wouldRecommend ? "default" : "secondary"}>
              {review.wouldRecommend ? "Recommends" : "Doesn't Recommend"}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ThumbsUp className="h-4 w-4 mr-1" />
              Helpful ({review.helpful})
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Flag className="h-4 w-4 mr-1" />
              Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
