"use client"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Youtube,
  Code,
  Quote,
  Hash,
  Smile
} from "lucide-react"
import { MediaUploader } from "@/components/community/media-uploader"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

interface RichTextEditorEnhancedProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditorEnhanced({
  value,
  onChange,
  placeholder = "Write something...",
  className = ""
}: RichTextEditorEnhancedProps) {
  const [isClient, setIsClient] = useState(false)
  const [showMediaUploader, setShowMediaUploader] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Custom toolbar modules
  const modules = {
    toolbar: {
      container: "#toolbar",
      handlers: {
        image: () => setShowMediaUploader(true),
        // Add more custom handlers here
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }

  // Custom formats
  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet', 'ordered',
    'link', 'image',
    'blockquote', 'code-block',
    'clean'
  ]

  if (!isClient) {
    return (
      <div className={`min-h-[150px] p-3 border rounded-md bg-muted ${className}`}>
        <p className="text-muted-foreground">{placeholder}</p>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Custom Toolbar */}
      <div id="toolbar" className="flex flex-wrap gap-1 p-2 border rounded-t-md bg-muted">
        <Button variant="ghost" size="sm" type="button" className="p-1">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" type="button" className="p-1">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" type="button" className="p-1">
          <Underline className="h-4 w-4" />
        </Button>
        <div className="border-l mx-1 h-6 self-center"></div>
        <Button variant="ghost" size="sm" type="button" className="p-1">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" type="button" className="p-1">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="border-l mx-1 h-6 self-center"></div>
        <Button variant="ghost" size="sm" type="button" className="p-1">
          <Link className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" type="button" className="p-1">
          <Image className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" type="button" className="p-1">
          <Youtube className="h-4 w-4" />
        </Button>
        <div className="border-l mx-1 h-6 self-center"></div>
        <Button variant="ghost" size="sm" type="button" className="p-1">
          <Quote className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" type="button" className="p-1">
          <Code className="h-4 w-4" />
        </Button>
        <div className="border-l mx-1 h-6 self-center"></div>
        <Button variant="ghost" size="sm" type="button" className="p-1">
          <Hash className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" type="button" className="p-1">
          <Smile className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="min-h-[150px]"
      />

      {/* Media Uploader */}
      {showMediaUploader && (
        <MediaUploader
          onMediaAdded={(files) => {
            // In a real implementation, you would upload files and insert URLs
            // For now, we'll just close the uploader
            setShowMediaUploader(false)
          }}
          maxFiles={5}
          maxSize={10}
        />
      )}

      {/* Character count */}
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>{value.length}/5000 characters</span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-xs h-6">
            <Hash className="h-3 w-3 mr-1" />
            Add Tag
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-6">
            <Smile className="h-3 w-3 mr-1" />
            Emoji
          </Button>
        </div>
      </div>
    </div>
  )
}