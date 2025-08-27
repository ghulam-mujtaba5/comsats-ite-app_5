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
  const hasDownloadUrl = paper.downloadUrl && paper.downloadUrl !== 'undefined';
  
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 text-slate-900 dark:text-white font-semibold">
              {paper.title || 'Untitled Paper'}
            </CardTitle>
            <CardDescription className="mt-1 text-slate-600 dark:text-slate-300 font-medium">
              {paper.courseCode} - {paper.course}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            {paper.examType}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
            <Calendar className="h-4 w-4" />
            {paper.semester} • {paper.year}
          </div>
          {paper.uploadedBy && (
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
              <User className="h-4 w-4" />
              {paper.uploadedBy}
            </div>
          )}
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
            <FileText className="h-4 w-4" />
            {paper.fileType} {paper.fileSize && `• ${paper.fileSize}`}
          </div>
        </div>

        {paper.tags && paper.tags.length > 0 && (
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
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
          <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {paper.downloadCount} downloads
          </span>
          <div className="flex gap-2">
            {hasDownloadUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(paper.id)}
                className="bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-blue-200 dark:border-blue-700"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            )}
            <Button 
              size="sm" 
              onClick={() => onDownload(paper.id)} 
              className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              disabled={!hasDownloadUrl}
            >
              <Download className="h-4 w-4 mr-1" />
              {hasDownloadUrl ? 'Download' : 'No File'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
