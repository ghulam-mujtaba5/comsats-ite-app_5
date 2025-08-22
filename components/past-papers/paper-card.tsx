"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar, User, FileText, Eye } from "lucide-react"
import type { PastPaper } from "@/lib/past-papers-data"

interface PaperCardProps {
  paper: PastPaper
  onDownload: (paperId: string) => void
  onView: (paperId: string) => void
}

export function PaperCard({ paper, onDownload, onView }: PaperCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
              {paper.title}
            </CardTitle>
            <CardDescription className="mt-1">
              {paper.courseCode} - {paper.course}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {paper.examType}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {paper.semester} • {paper.year}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            {paper.uploadedBy}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4" />
            {paper.fileType} • {paper.fileSize}
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {paper.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {paper.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{paper.tags.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">{paper.downloadCount} downloads</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(paper.id)}
              className="bg-transparent hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button size="sm" onClick={() => onDownload(paper.id)} className="hover:bg-blue-600 transition-colors">
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
