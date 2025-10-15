import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import { GlassCard } from "@/components/admin/glass-card"

interface ResourceCardProps {
  id: number
  title: string
  description: string
  type: string
  size: string
  url: string
  downloads: number
}

export function ResourceCard({
  id,
  title,
  description,
  type,
  size,
  url,
  downloads
}: ResourceCardProps) {
  return (
    <GlassCard hover={true}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <span className="text-xs px-2 py-1 bg-primary/10 rounded-full text-primary">
              {type}
            </span>
            <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
              {size}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {downloads} downloads
          </span>
        </div>
        
        <Button size="sm" variant="outline" className="w-full" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4 mr-2" />
            Access Resource
          </a>
        </Button>
      </CardContent>
    </GlassCard>
  )
}