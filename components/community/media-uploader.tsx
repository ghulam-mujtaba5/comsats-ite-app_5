"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { 
  Image, 
  Paperclip, 
  X, 
  Upload,
  FileText,
  Film,
  Music,
  Archive
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MediaFile {
  id: string
  file: File
  previewUrl?: string
  type: 'image' | 'document' | 'video' | 'audio' | 'archive' | 'other'
  progress: number
  uploaded: boolean
  error?: string
}

interface MediaUploaderProps {
  onMediaAdded: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  allowedTypes?: string[]
}

export function MediaUploader({ 
  onMediaAdded,
  maxFiles = 5,
  maxSize = 10,
  allowedTypes = ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
}: MediaUploaderProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileType = (file: File): MediaFile['type'] => {
    if (file.type.startsWith('image/')) return 'image'
    if (file.type === 'application/pdf' || 
        file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') 
      return 'document'
    if (file.type.startsWith('video/')) return 'video'
    if (file.type.startsWith('audio/')) return 'audio'
    if (file.type === 'application/zip' || 
        file.type === 'application/x-rar-compressed') 
      return 'archive'
    return 'other'
  }

  const getFileIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image': return <Image className="h-5 w-5" />
      case 'document': return <FileText className="h-5 w-5" />
      case 'video': return <Film className="h-5 w-5" />
      case 'audio': return <Music className="h-5 w-5" />
      case 'archive': return <Archive className="h-5 w-5" />
      default: return <Paperclip className="h-5 w-5" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB limit`
    }

    // Check file type
    const isValidType = allowedTypes.some(type => {
      if (type === '*') return true
      if (type.endsWith('/*')) {
        const prefix = type.slice(0, -1) // Remove the *
        return file.type.startsWith(prefix)
      }
      return file.type === type
    })

    if (!isValidType) {
      return 'File type not allowed'
    }

    return null
  }

  const handleFiles = (fileList: FileList) => {
    const newFiles: MediaFile[] = []
    const validFiles: File[] = []

    Array.from(fileList).forEach(file => {
      // Validate file
      const error = validateFile(file)
      
      if (error) {
        // Add file with error
        newFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          type: getFileType(file),
          progress: 0,
          uploaded: false,
          error
        })
      } else if (files.length + validFiles.length < maxFiles) {
        // Add valid file
        const mediaFile: MediaFile = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          type: getFileType(file),
          progress: 0,
          uploaded: false
        }

        // Create preview for images
        if (mediaFile.type === 'image') {
          mediaFile.previewUrl = URL.createObjectURL(file)
        }

        newFiles.push(mediaFile)
        validFiles.push(file)
      }
    })

    setFiles(prev => [...prev, ...newFiles])
    
    // Notify parent of valid files
    if (validFiles.length > 0) {
      onMediaAdded(validFiles)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id))
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div 
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={triggerFileSelect}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden"
          multiple
          accept={allowedTypes.join(',')}
        />
        
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="font-medium">Drop files here or click to upload</div>
          <div className="text-sm text-muted-foreground">
            Supports images, documents up to {maxSize}MB (max {maxFiles} files)
          </div>
          <Button variant="outline" size="sm" className="mt-2">
            <Paperclip className="h-4 w-4 mr-2" />
            Select Files
          </Button>
        </div>
      </div>
      
      {/* File previews */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">
            Selected files ({files.length}/{maxFiles})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {files.map((mediaFile) => (
              <div 
                key={mediaFile.id} 
                className="flex items-center gap-2 p-2 rounded-lg border bg-muted/50"
              >
                <div className="p-2 rounded-md bg-background">
                  {getFileIcon(mediaFile.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {mediaFile.file.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(mediaFile.file.size)}
                    {mediaFile.error && (
                      <span className="text-destructive ml-2">
                        {mediaFile.error}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(mediaFile.id)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}