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
}

export function FacultyCard({ faculty }: FacultyCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={faculty.profileImage || "/placeholder.svg"} alt={faculty.name} />
            <AvatarFallback className="text-lg">
              {faculty.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-xl group-hover:text-primary transition-colors">{faculty.name}</CardTitle>
            <CardDescription className="text-base">{faculty.title}</CardDescription>
            <Badge variant="secondary" className="mt-1">
              {faculty.department}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">{renderStars(faculty.averageRating)}</div>
          <span className="font-semibold">{faculty.averageRating}</span>
          <span className="text-muted-foreground">({faculty.totalReviews} reviews)</span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Office: {faculty.office}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            {faculty.email}
          </div>
          {faculty.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              {faculty.phone}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-medium mb-2">
            <BookOpen className="h-4 w-4" />
            Specialization
          </div>
          <div className="flex flex-wrap gap-1">
            {faculty.specialization.slice(0, 3).map((spec, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {spec}
              </Badge>
            ))}
            {faculty.specialization.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{faculty.specialization.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-medium mb-2">
            <Users className="h-4 w-4" />
            Courses ({faculty.courses.length})
          </div>
          <div className="text-sm text-muted-foreground">
            {faculty.courses.slice(0, 2).map((course, index) => (
              <div key={index}>{course}</div>
            ))}
            {faculty.courses.length > 2 && <div>+{faculty.courses.length - 2} more courses</div>}
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <Button asChild className="w-full">
            <Link href={`/faculty/${faculty.id}`}>View Profile & Reviews</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
