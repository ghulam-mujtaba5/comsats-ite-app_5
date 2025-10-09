"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
  Image as ImageIcon, 
  Film, 
  FileText, 
  Music, 
  Archive,
  Paperclip,
  X
} from "lucide-react"

// Dynamically import components to avoid SSR issues
const ImageGallery = dynamic(() => import('react-image-gallery'), { ssr: false }) as any
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any

interface MediaItem {
  id: string
  url: string
  type: 'image' | 'video' | 'document' | 'audio' | 'archive' | 'other'
  name: string
  size?: number
}

interface PostMediaProps {
  media: MediaItem[]
}

interface ImageGalleryItem {
  original: string
  thumbnail: string
  originalAlt: string
  thumbnailAlt: string
}

export function PostMedia({ media }: PostMediaProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Initialize client-side rendering
  useState(() => {
    setIsClient(true)
  })

  if (!media || media.length === 0) {
    return null
  }

  // Get file icon based on type
  const getFileIcon = (type: MediaItem['type']) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-5 w-5" />
      case 'video': return <Film className="h-5 w-5" />
      case 'document': return <FileText className="h-5 w-5" />
      case 'audio': return <Music className="h-5 w-5" />
      case 'archive': return <Archive className="h-5 w-5" />
      default: return <Paperclip className="h-5 w-5" />
    }
  }

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Get images for gallery
  const images: ImageGalleryItem[] = media
    .filter(item => item.type === 'image')
    .map(item => ({
      original: item.url,
      thumbnail: item.url,
      originalAlt: item.name,
      thumbnailAlt: item.name
    }))

  // Get videos
  const videos = media.filter(item => item.type === 'video')

  // Get other files
  const otherFiles = media.filter(item => 
    item.type !== 'image' && item.type !== 'video'
  )

  return (
    <div className="space-y-3">
      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {images.slice(0, 6).map((image, index) => (
            <Dialog key={index} open={selectedMedia?.url === image.original} onOpenChange={(open) => {
              if (!open) setSelectedMedia(null)
            }}>
              <DialogTrigger asChild>
                <div 
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => setSelectedMedia(media.find(m => m.url === image.original) || null)}
                >
                  <img 
                    src={image.thumbnail} 
                    alt={image.thumbnailAlt} 
                    className="w-full h-full object-cover"
                  />
                  {images.length > 6 && index === 5 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-medium">+{images.length - 6}</span>
                    </div>
                  )}
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                {isClient && ImageGallery && (
                  <ImageGallery 
                    items={images} 
                    startIndex={images.findIndex(img => img.original === image.original)}
                    showPlayButton={false}
                    showFullscreenButton={true}
                    slideDuration={300}
                  />
                )}
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <div className="space-y-2">
          {videos.map((video) => (
            <div key={video.id} className="rounded-lg overflow-hidden border">
              {isClient && ReactPlayer && (
                <ReactPlayer
                  url={video.url}
                  width="100%"
                  height="auto"
                  controls={true}
                  light={true}
                  fallback={
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <Film className="h-12 w-12 text-muted-foreground" />
                    </div>
                  }
                />
              )}
              <div className="p-2 bg-muted flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Film className="h-4 w-4" />
                  <span className="text-sm truncate">{video.name}</span>
                </div>
                {video.size && (
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(video.size)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Other Files */}
      {otherFiles.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Attachments</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {otherFiles.map((file) => (
              <div 
                key={file.id} 
                className="flex items-center gap-2 p-2 rounded-lg border bg-muted/50"
              >
                <div className="p-2 rounded-md bg-background">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {file.name}
                  </div>
                  {file.size && (
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(file.url, '_blank')}
                  className="h-8 w-8"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}