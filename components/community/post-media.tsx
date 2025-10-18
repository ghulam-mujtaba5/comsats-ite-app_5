import { MediaItem } from "@/lib/community-data"
import { Card, CardContent } from "@/components/ui/card"
import { 
  FileImage, 
  FileVideo, 
  FileText, 
  PlayCircle,
  FileAudio,
  FileArchive
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface PostMediaProps {
  media: MediaItem[]
}

export function PostMedia({ media }: PostMediaProps) {
  if (!media || media.length === 0) return null

  // For single media item, display full width
  if (media.length === 1) {
    const item = media[0]
    return (
      <div className="rounded-lg overflow-hidden">
        {item.type === 'image' && (
          <div className="relative aspect-video sm:aspect-[16/9]">
            <Image
              src={item.url}
              alt={item.alt || "Post media"}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        {item.type === 'video' && (
          <div className="relative aspect-video sm:aspect-[16/9] bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center">
            {item.thumbnail ? (
              <div className="relative w-full h-full">
                <Image
                  src={item.thumbnail}
                  alt={item.alt || "Video thumbnail"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <PlayCircle className="h-12 w-12 text-white sm:h-16 sm:w-16" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <FileVideo className="h-12 w-12 text-slate-700 dark:text-slate-300 sm:h-16 sm:w-16" />
                <span className="text-sm text-muted-foreground">Video</span>
              </div>
            )}
          </div>
        )}
        
        {item.type === 'document' && (
          <Card className="border">
            <CardContent className="p-4 flex items-center gap-3 sm:p-6 sm:gap-4">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 sm:p-3">
                {item.url.endsWith('.pdf') ? (
                  <FileText className="h-6 w-6 text-red-500 sm:h-8 sm:w-8" />
                ) : item.url.endsWith('.mp3') || item.url.endsWith('.wav') ? (
                  <FileAudio className="h-6 w-6 text-purple-500 sm:h-8 sm:w-8" />
                ) : item.url.endsWith('.zip') || item.url.endsWith('.rar') ? (
                  <FileArchive className="h-6 w-6 text-yellow-500 sm:h-8 sm:w-8" />
                ) : (
                  <FileText className="h-6 w-6 text-blue-500 sm:h-8 sm:w-8" />
                )}
              </div>
              <div>
                <p className="font-medium text-sm line-clamp-1 sm:text-base">
                  {item.alt || "Document"}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 sm:text-sm">
                  {item.url.split('/').pop()}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // For multiple media items, display in a grid
  return (
    <div className={cn(
      "grid gap-2 rounded-lg overflow-hidden sm:gap-3",
      media.length === 2 && "grid-cols-2",
      media.length === 3 && "grid-cols-2",
      media.length >= 4 && "grid-cols-2"
    )}>
      {media.slice(0, 4).map((item, index) => (
        <div 
          key={item.id} 
          className={cn(
            "relative overflow-hidden rounded-lg",
            media.length === 3 && index === 0 && "row-span-2"
          )}
        >
          {item.type === 'image' && (
            <div className="relative aspect-square sm:aspect-video">
              <Image
                src={item.url}
                alt={item.alt || `Post media ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          {item.type === 'video' && (
            <div className="relative aspect-square bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center sm:aspect-video">
              {item.thumbnail ? (
                <div className="relative w-full h-full">
                  <Image
                    src={item.thumbnail}
                    alt={item.alt || `Video thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <PlayCircle className="h-8 w-8 text-white sm:h-10 sm:w-10" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 sm:gap-2">
                  <FileVideo className="h-8 w-8 text-slate-700 dark:text-slate-300 sm:h-10 sm:w-10" />
                  <span className="text-xs text-slate-700 dark:text-slate-300 sm:text-sm">Video</span>
                </div>
              )}
            </div>
          )}
          
          {item.type === 'document' && (
            <div className="aspect-square bg-slate-100 dark:bg-slate-900 rounded-lg flex flex-col items-center justify-center p-2 sm:p-3 sm:aspect-video">
              <div className="p-1 rounded-md bg-background sm:p-2">
                {item.url.endsWith('.pdf') ? (
                  <FileText className="h-6 w-6 text-red-500 sm:h-8 sm:w-8" />
                ) : item.url.endsWith('.mp3') || item.url.endsWith('.wav') ? (
                  <FileAudio className="h-6 w-6 text-purple-500 sm:h-8 sm:w-8" />
                ) : item.url.endsWith('.zip') || item.url.endsWith('.rar') ? (
                  <FileArchive className="h-6 w-6 text-yellow-500 sm:h-8 sm:w-8" />
                ) : (
                  <FileText className="h-6 w-6 text-blue-500 sm:h-8 sm:w-8" />
                )}
              </div>
              <span className="text-xs text-slate-700 dark:text-slate-300 text-center mt-1 line-clamp-2 sm:text-sm sm:mt-2">
                {item.alt || "Document"}
              </span>
            </div>
          )}
          
          {/* Overlay for additional items when more than 4 */}
          {index === 3 && media.length > 4 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium text-lg sm:text-xl">
                +{media.length - 4}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}