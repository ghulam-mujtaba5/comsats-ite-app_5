"use client"

import { useState, useRef } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Smile,
  Paperclip,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import "react-quill/dist/quill.snow.css"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Write your post content here...",
  className 
}: RichTextEditorProps) {
  const [isEditorFocused, setIsEditorFocused] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  }

  // Quill formats configuration
  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link', 'image'
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // Handle file upload logic here
      // This would typically involve uploading to a storage service
      // and inserting the URL into the editor
      console.log("Files selected:", files)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className={cn("border rounded-lg bg-background", className)}>
      {/* Simple toolbar for mobile and basic formatting */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowToolbar(!showToolbar)}
          className="h-8 px-2"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        {showToolbar && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => document.execCommand('bold', false)}
              className="h-8 px-2"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => document.execCommand('italic', false)}
              className="h-8 px-2"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => document.execCommand('underline', false)}
              className="h-8 px-2"
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => document.execCommand('insertUnorderedList', false)}
              className="h-8 px-2"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => document.execCommand('insertOrderedList', false)}
              className="h-8 px-2"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2"
            >
              <Link className="h-4 w-4" />
            </Button>
          </>
        )}
        
        <div className="flex-1"></div>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="h-8 px-2"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />
      </div>
      
      {/* Rich text editor */}
      <div className="min-h-[200px]">
        {typeof window !== "undefined" ? (
          <ReactQuill
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            className="h-full"
            onFocus={() => setIsEditorFocused(true)}
            onBlur={() => setIsEditorFocused(false)}
          />
        ) : (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[200px]"
          />
        )}
      </div>
      
      {/* Preview of uploaded files */}
      <div className="p-2 border-t border-border">
        <div className="text-xs text-muted-foreground mb-2">
          Attachments (0)
        </div>
        {/* File previews would go here */}
      </div>
    </div>
  )
}