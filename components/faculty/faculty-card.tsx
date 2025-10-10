"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Mail, Phone, BookOpen, Users } from "lucide-react"
import type { Faculty } from "@/lib/faculty-data"
import Link from "next/link"

interface FacultyCardProps {
  faculty: Faculty
  searchTerm?: string
}

export function FacultyCard({ faculty, searchTerm }: FacultyCardProps) {
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

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden border-border">
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-500"></div>
      
      <Link href={`/faculty/${faculty.id}`} className="absolute inset-0 z-0" aria-label={`View profile for ${faculty.name}`}>
        <span className="sr-only">View profile for {faculty.name}</span>
      </Link>
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage 
              src={faculty.profileImage || "/placeholder-user.jpg"} 
              alt={faculty.name} 
              width={64}
              height={64}
            />
            <AvatarFallback className="text-lg font-medium">
              {faculty.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
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
          {faculty.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{faculty.phone}</span>
            </div>
          )}
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
            <Link href={`/faculty/${faculty.id}`}>
              View Profile & Reviews
              <span className="ml-2 opacity-0 group-hover/btn:opacity-100 transition-opacity">→</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}