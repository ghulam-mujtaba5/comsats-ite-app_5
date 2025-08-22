"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, FileText, Download, Clock } from "lucide-react"
import type { CourseWithPapers } from "@/lib/past-papers-data"
import Link from "next/link"

interface CourseCardProps {
  course: CourseWithPapers
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/past-papers/${course.code}`} className="block h-full">
      <Card className="group h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
              {course.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {course.code} • {course.department}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {course.creditHours} CH
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4 text-blue-500" />
            <span>{course.assignments.length} Assignments</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-4 w-4 text-green-500" />
            <span>{course.quizzes.length} Quizzes</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 text-orange-500" />
            <span>{course.midterms.length} Midterms</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Download className="h-4 w-4 text-blue-500" />
            <span>{course.finals.length} Finals</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border">
          <Clock className="h-4 w-4" />
          <span>Updated {new Date(course.lastUpdated).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium text-primary">{course.totalPapers} Total Papers</span>
        </div>
      </CardContent>
    </Card>
    </Link>
  )
}
