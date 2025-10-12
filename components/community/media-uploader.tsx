"use client"

import { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/components/ui/button"
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { 
  FileImage,
  FileVideo,
  FileText,
  Upload,
  X,
  Loader2,
  FileAudio,
  FileArchive
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { MediaItem } from "@/lib/community-data"
import { cn } from "@/lib/utils"
import Image from "next/image"

export interface MediaUploaderRef {
  getMedia: () => MediaItem[]
  clearMedia: () => void
}

interface MediaUploaderProps {
  onMediaChange?: (media: MediaItem[]) => void
  maxFiles?: number
  accept?: string
}

export const MediaUploader = forwardRef<MediaUploaderRef, MediaUploaderProps>(({
  onMediaChange,
  maxFiles = 5,
  accept = "image/*,video/*,application/pdf"
}, ref) => {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    getMedia: () => media,
    clearMedia: () => setMedia([])
  }))

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    // Check if we exceed the max files limit
    if (media.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can only upload up to ${maxFiles} files.`,
        variant: "destructive",
      })
      return
    }

    // Convert FileList to Array
    const fileList = Array.from(files)
    
    // Validate file types
    const validFiles = fileList.filter(file => {
      const isValidType = accept.includes(file.type) || 
        accept.includes(file.type.split('/')[0] + '/*') ||
        accept === "*/*"
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type.`,
          variant: "destructive",
        })
      }
      
      return isValidType
    })

    if (validFiles.length > 0) {
      uploadFiles(validFiles)
    }
  }

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const uploadedMedia: MediaItem[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / files.length) * 100))
        
        // Create FormData
        const formData = new FormData()
        formData.append('file', file)
        
        // Upload file
        const response = await fetch('/api/community/media', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to upload file')
        }
        
        const result = await response.json()
        
        // Add to uploaded media
        uploadedMedia.push({
          id: `media_${Date.now()}_${i}`,
          type: result.type,
          url: result.url,
          thumbnail: result.thumbnailUrl,
          alt: file.name
        })
      }
      
      // Update state
      const newMedia = [...media, ...uploadedMedia]
      setMedia(newMedia)
      onMediaChange?.(newMedia)
      
      toast({
        title: "Upload successful",
        description: `${files.length} file(s) uploaded successfully.`
      })
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload files.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const removeMedia = (id: string) => {
    const newMedia = media.filter(item => item.id !== id)
    setMedia(newMedia)
    onMediaChange?.(newMedia)
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <FileImage className="h-6 w-6 text-blue-500" />
      case 'video':
        return <FileVideo className="h-6 w-6 text-red-500" />
      case 'audio':
        return <FileAudio className="h-6 w-6 text-purple-500" />
      case 'archive':
        return <FileArchive className="h-6 w-6 text-yellow-500" />
      default:
        return <FileText className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
           onClick={triggerFileSelect}>
        <CardContent className="p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={accept}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          
          {isUploading ? (
            <div className="space-y-2">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <CardTitle className="text-base">Upload Media</CardTitle>
              <CardDescription className="text-sm">
                Click to select files or drag and drop<br />
                <span className="text-xs">(Max {maxFiles} files, 10MB each)</span>
              </CardDescription>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Area */}
      {media.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {media.map((item) => (
            <div key={item.id} className="relative group">
              {item.type === 'image' ? (
                <div className="relative aspect-square rounded-md overflow-hidden">
                  <Image
                    src={item.url}
                    alt={item.alt || "Uploaded image"}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-md bg-muted flex flex-col items-center justify-center p-2">
                  {getFileIcon(item.type)}
                  <span className="text-xs text-center mt-1 line-clamp-2">
                    {item.alt?.split('.').slice(0, -1).join('.') || "File"}
                  </span>
                </div>
              )}
              
              <Button
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  removeMedia(item.id)
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* File Info */}
      {media.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {media.length} of {maxFiles} files uploaded
        </p>
      )}
    </div>
  )
})

MediaUploader.displayName = "MediaUploader"